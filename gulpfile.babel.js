'use strict';

// import
import gulp from 'gulp';
import source from 'vinyl-source-stream';
import sass from 'gulp-sass';
import pleeease from 'gulp-pleeease';
import browserify from 'browserify';
import babelify from 'babelify';
import pug from 'gulp-pug';
import browserSync from 'browser-sync';
import readConfig from 'read-config';
import mocha from 'gulp-instant-mocha';
import watch from 'gulp-watch';
import validate from 'gulp-html-validator';
import { gulp as imageEven } from 'image-even';
import RevLogger from 'rev-logger';


// const
const SRC = './src';
const CONFIG = './src/config';
const HTDOCS = './public';
const BASE_PATH = '/';
const DEST = `${HTDOCS}${BASE_PATH}`;
const TEST = '.';

const revLogger = new RevLogger({
    'style.css': `${DEST}/css/style.css`,
    'script.js': `${DEST}/js/script.js`
});


// css
gulp.task('sass', () => {
    const config = readConfig(`${CONFIG}/pleeease.json`);
    return gulp.src(`${SRC}/scss/style.scss`)
        .pipe(sass())
        .pipe(pleeease(config))
        .pipe(gulp.dest(`${DEST}/css`));
});

gulp.task('css', gulp.series('sass'));

// js
gulp.task('browserify', () => {
    return browserify(`${SRC}/js/script.js`)
        .transform(babelify)
        .bundle()
        .pipe(source('script.js'))
        .pipe(gulp.dest(`${DEST}/js`));
});

gulp.task('browserify-test', () => {
    return browserify(`${SRC}/js/test.js`)
        .transform(babelify)
        .transform(debowerify)
        .bundle()
        .pipe(source('tmp-test.js'))
        .pipe(gulp.dest(TEST));
});

gulp.task('js', gulp.parallel('browserify'));

// html
gulp.task('pug', () => {
    const locals = readConfig(`${CONFIG}/meta.yml`);
    locals.versions = revLogger.versions();
    
    return gulp.src(`${SRC}/pug/**/[!_]*.pug`)
        .pipe(pug({
            locals: locals,
            pretty: true
        }))
        .pipe(gulp.dest(`${DEST}`));
});

gulp.task('html', gulp.series('pug'));


// image
gulp.task('image-even', () => {
    return gulp.src(`${DEST}/img/*@2x.png`)
        .pipe(imageEven());
});

gulp.task('image', gulp.series('image-even'));


// serve
gulp.task('browser-sync', () => {
    browserSync({
        server: {
            baseDir: HTDOCS
        },
        startPath: BASE_PATH,
        ghostMode: false
    });

    watch([`${SRC}/scss/**/*.scss`], gulp.series('sass', browserSync.reload));
    watch([`${SRC}/js/**/*.js`], gulp.series('browserify', browserSync.reload));
    watch([
        `${SRC}/pug/**/*.pug`,
        `${SRC}/config/meta.yml`
    ], gulp.series('pug', browserSync.reload));

    revLogger.watch((changed) => {
        gulp.series('pug', browserSync.reload)();
    });
});

gulp.task('serve', gulp.series('browser-sync'));


// validate
gulp.task('validate', () => {
    return gulp.src(`${DEST}/*.html`)
        .pipe(validate({ format: 'json' }))
        .pipe(gulp.dest('validation'));
});


// test
gulp.task('mocha', () => {
    return gulp.src(`${TEST}/tmp-test.js`)
        .pipe(mocha({
            dest: `${TEST}/tmp-test.html`,
            assertPath: 'node_modules/chai/chai.js'
        }));
});

gulp.task('test', gulp.series('browserify-test', 'mocha'));


// default
gulp.task('build', gulp.parallel('css', 'js', 'html'));
gulp.task('default', gulp.series('build', 'serve'));
