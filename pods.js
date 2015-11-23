/* jslint node: true */
var async = require('async');
var fs = require('fs');
var marked = require('marked');
var moment = require('moment');
var mm = require('musicmetadata');

module.exports = {
    /**
     * This function reads in the specified pods config and generates a
     * rich object that can be used for custom applications or pods CLI
     * plugins.
     */
    read: function (path, done) {
        var podcast = JSON.parse(fs.readFileSync(path, 'utf-8'));

        async.parallel(podcast.episodes.map(function (episode) {
                // Create a bunch of functions that each process an individual episode. This is
                // done in parallel for larger files.
                return function (callback) {
                    // Convert markdown to HTML.
                    var md = fs.readFileSync(episode.content.notes.source, 'utf-8');
                    episode.content.text = marked(md);

                    // Dates should be momentjs objects.
                    episode.info.pubDate = moment(episode.info.pubDate);

                    mm(fs.createReadStream(episode.content.audio.local), {
                        duration: true
                    }, function (error, metadata) {
                        if (error) throw Error("Couldn't find " + episode.content.audio.local + ": " + error);

                        var stats = fs.statSync(episode.content.audio.local);
                        episode.content.audio.size = stats.size;

                        episode.content.audio.duration = {
                            hours: Math.floor(metadata.duration / 3600),
                            minutes: Math.round((metadata.duration % 3600) / 60),
                            seconds: Math.round(metadata.duration % 60),
                        };
                        callback(null, episode);
                    });
                };
            }),

            // Once each individual episode has been handled, make any remaining modifications
            // to the overall podcast object before invoking the callback.
            function () {
                // TODO: this should be based off of pubDate, not ordering. Should find
                // the podcast with the most recent pubDate in the past (NOT in the future).
                podcast.latest = podcast.episodes[podcast.episodes.length - 1];
                done(podcast);
            });
    }
};