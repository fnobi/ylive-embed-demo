import EventEmitter from 'events';

const REGEXP = /^https?:\/\/(www\.)?youtube\.com\/watch\?v=([0-9a-zA-Z_\-]+)/;

export default class EmbedTube extends EventEmitter {
    constructor (opts = {}) {
        super();
        
        if (opts.videoUrl) {
            opts.videoId = this.parseUrl(opts.videoUrl);
        }

        this.elementId = opts.elementId;
        this.width = opts.width || null;
        this.height = opts.height || null;
        this.playerVars = opts.playerVars || {};
        this.videoId = opts.videoId;

        if (!window.YT || !window.YT.Player) {
            throw new Error('Youtube iframe api is not found.');
        }
        if (!this.elementId) {
            throw new Error('Give id for player alt element.');
        }
        if (!this.videoId) {
            throw new Error('There are no youtube video id.');
        }

        this.createPlayer();
    }

    createPlayer () {
        this.player = new YT.Player(this.elementId, {
            width: this.width,
            height: this.height,
            videoId: this.videoId,
            playerVars: this.playerVars,
            events: {
                onReady: (e) => {
                    this.emit('ready', e);
                },
                onStateChange: (e) => {
                    this.emit('stateChange', e);

                    switch (e.data) {
                    case YT.PlayerState.ENDED:
                        this.emit('ended', e);
                        break;
                    case YT.PlayerState.PLAYING:
                        this.emit('playing', e);
                        break;
                    case YT.PlayerState.PAUSED:
                        this.emit('paused', e);
                        break;
                    case YT.PlayerState.BUFFERING:
                        this.emit('buffering', e);
                        break;
                    case YT.PlayerState.CUED:
                        this.emit('cued', e);
                        break;
                    }
                },
                onPlaybackQualityChange: (e) => {
                    this.emit('playbackQualityChange', e);
                },
                onPlaybackRateChange: (e) => {
                    this.emit('playbackRateChange', e);
                },
                onError: (e) => {
                    this.emit('error', e);
                },
                onApiChange: (e) => {
                    this.emit('apiChange', e);
                }
            }
        });
    }
    
    parseUrl (url) {
        if (!url || !url.match) {
            return null;
        }

        const matchData = url.match(REGEXP);

        if (!matchData) {
            return null;
        }

        return matchData[2];
    }

    play () {
        this.player.playVideo();
    }

    pause () {
        this.player.pauseVideo();
    };

    currentTime () {
        if (!this.player) {
            return null;
        }
        return this.player.getCurrentTime();
    }

    duration () {
        if (!this.player) {
            return null;
        }
        return this.player.getDuration();
    }

    seekTo (seconds, allowSeekAhead) {
        if (!this.player) {
            return null;
        }
        return this.player.seekTo(seconds, allowSeekAhead);
    }

    setLoop (bool) {
        if (!this.player) {
            return null;
        }
        return this.player.setLoop(bool);
    }

    setVolume (v) {
        if (!this.player) {
            return null;
        }
        return this.player.setVolume(Math.floor(v));
    }

    getVolume () {
        if (!this.player) {
            return null;
        }
        return this.player.getVolume();
    }

    mute () {
        if (!this.player) {
            return null;
        }
        return this.player.mute();
    }

    unMute () {
        if (!this.player) {
            return null;
        }
        return this.player.unMute();
    }

    setPlaybackQuality (q) {
        if (!this.player) {
            return null;
        }
        return this.player.setPlaybackQuality(q);
    }
}
