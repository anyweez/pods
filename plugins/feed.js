var rss = require('rss');
var moment = require('moment');

function render(podcast, options) {
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
                    }
                })
            }, {
                'itunes:explicit': podcast.series.explicit ? "yes" : "no",
            }
        ],
    });

    // Generate episode-specific RSS content.
    podcast.episodes.forEach(function (episode) {
        feed.item({
            title: episode.info.title || "Example title",
            description: episode.info.description || "A simple episode description.",
            enclosure: {
                url: episode.content.audio.public,
                // TODO: make audio type dynamic
                type: "audio/mp4",
                // TODO: make audo file size dynamic
                size: 58630668
            },
            custom_elements: [{
                'itunes:summary': episode.info.description,
            }],
        });
    });

    return feed.xml({
        indent: true
    });
}

module.exports = {
    cmd: 'feed',
    exec: render,
};