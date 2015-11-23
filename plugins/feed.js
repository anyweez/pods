/* jslint node: true */
var rss = require('rss');
var moment = require('moment');

module.exports = (function () {
    return {
        cmd: 'feed',
        description: 'generate an RSS feed from episodes.json',
        exec: function (podcast, options) {
            var options = options || {};
            var opts = {
                ttl: options.ttl || 10
            };

            // Build a feed using data about the series.
            var feed = new rss({
                title: podcast.series.title,
                description: podcast.series.description,
                site_url: podcast.series.links.site,
                feed_url: podcast.series.links.feed,
                image_url: podcast.series.links.art,
                language: podcast.series.language,
                pubDate: moment(),
                categories: podcast.series.categories.map(function (item) {
                    return item.category;
                }),

                managingEditor: podcast.people.author.email + "(" + podcast.people.author.name + ")",
                copyright: moment().year(),
                custom_namespaces: {
                    "itunes": "http://www.itunes.com/dtds/podcast-1.0.dtd",
                },
                custom_elements: [
                    {
                        'itunes:subtitle': podcast.series.subtitle,
            }, {
                        'itunes:author': podcast.people.author.name,
            }, {
                        "itunes:summary": podcast.series.description,
            }, {
                        "itunes:owner": [
                            {
                                "itunes:name": podcast.people.owner.name,
                    },
                            {
                                "itunes:email": podcast.people.owner.email,
                    }
                ]
            }, {
                        'itunes:image': {
                            _attr: {
                                href: podcast.series.links.art,
                            }
                        }
            }, {
                        'itunes:category': podcast.series.categories.map(function (item) {
                            return {
                                _attr: {
                                    text: item.category,
                                }
                            };
                        })
            }, {
                        'itunes:explicit': podcast.series.explicit ? "yes" : "no",
            }
        ],
            });

            // Generate episode-specific RSS content.
            podcast.episodes.forEach(function (episode) {
                var duration = episode.content.audio.duration;
                feed.item({
                    title: episode.info.title || "Example title",
                    description: episode.info.description || "A simple episode description.",
                    url: episode.content.notes.public,
                    enclosure: {
                        url: episode.content.audio.public,
                        // TODO: make audio type dynamic
                        type: "audio/mp4",
                        size: episode.content.audio.size
                    },
                    date: episode.info.pubDate,
                    custom_elements: [{
                        'itunes:summary': episode.info.description,
            }, {
                        // TODO: make duration dynamic
                        'itunes:duration': duration.hours + ":" + duration.minutes + ":" + duration.seconds,
            }],
                });
            });

            return feed.xml({
                indent: true,
            });
        },
    };
}());