module.exports = {
    cmd: 'content',
    exec: function (podcast) {
        var content = [];

        podcast.episodes.forEach(function (episode) {
            content.push({
                id: episode.info.id,
                title: episode.info.title,
                number: episode.info.number,
                timestamp: episode.info.pubDate,
                content: episode.content.text,
                latest: episode.info.id == podcast.latest.info.id,
            });
        });

        return JSON.stringify(content);
    },
}