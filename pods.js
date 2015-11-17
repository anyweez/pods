var fs = require('fs');
var marked = require('marked');

module.exports = {
    read: function (path) {
        var podcast = JSON.parse(fs.readFileSync(path, 'utf-8'));

        podcast.episodes.forEach(function (episode) {
            var md = fs.readFileSync(episode.content.notes.source, 'utf-8');
            episode.content.text = marked(md);
        });

        return podcast;
    }
}