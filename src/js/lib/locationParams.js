import qs from 'querystring';
module.exports = qs.parse((location.search || '').replace(/^\?/, ''));
