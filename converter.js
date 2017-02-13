
var sha = require('crypto').createHash('sha1');
sha.update(require('fs').readFileSync('ssfn'));
var sentry = new Buffer(sha.digest(), 'binary');
require('fs').writeFileSync('sentry', sentry);