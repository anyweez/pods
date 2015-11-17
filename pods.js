var fs = require('fs');
var marked = require('marked');
var moment = require('moment');

module.exports = {
    /**
     * This function reads in the specified pods config and generates a
     * rich object that can be used for custom applications or pods CLI
     * plugins.
     */
    read: function (path) {
        var podcast = JSON.parse(fs.readFileSync(path, 'utf-8'));

        podcast.episodes.forEach(function (episode) {
            var md = fs.readFileSync(episode.content.notes.source, 'utf-8');
            episode.content.text = marked(md);

            // Dates should be momentjs objects.
            episode.info.pubDate = moment(episode.info.pubDate);
        });

        // TODO: this should be based off of pubDate, not ordering. Should find
        // the podcast with the most recent pubDate in the past (NOT in the future).
        podcast.latest = podcast.episodes[podcast.episodes.length - 1];

        return podcast;
    }
}