// TODO: this is moving to anyweez/pods. Need to upload to npm.
var PodRSS = require('./podrss/podrss');

/**
 * Generates an RSS file from an episodes.json file. 
 */
var pc = new PodRSS('episodes.json', {
    ttl: 5,
});
console.log(pc.render());