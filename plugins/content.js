/* jslint node: true */

module.exports = (function () {
    return {
        cmd: 'content',
        description: 'generate a JSON file containing all page content from episodes.json',
        exec: function (podcast) {
            var content = [];

            podcast.episodes.forEach(function (episode) {
                content.push({
                    id: episode.info.id,
                    title: episode.info.title,
                    number: episode.info.number,
                    timestamp: episode.info.pubDate,
                    audio: episode.content.audio.public,
                    content: episode.content.text,
                    latest: episode.info.id == podcast.latest.info.id,
                });
            });

            return JSON.stringify(content);
        },
    };
}());