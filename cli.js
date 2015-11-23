#! /usr/bin/env node

var argparse = require('command-line-args');
var process = require('process');
var pods = require('./pods');
var plugin = require('./plugins');

var args = argparse([
    {
        name: 'action',
        type: String
    }
]);

// Load all plugins and store them in the plugins[] object. Plugins provide a
// `cmd` that is the term used to invoke them.
var plugins = plugin.loadAll(__dirname + '/plugins');

if (process.argv.length < 3) {
    console.log("You must specify a command. Available commands:");
    plugins.pprint();
    return 1;
}

var options = args.parse();
options.operation = process.argv[2]; // unnamed, so not handled by argparse

// Read in episode.json and returns a podcast object with all sorts
// of fanciness.
pods.read('episodes.json', function (podcast) {
    try {
        console.log(plugins.load(options.operation)(podcast));
    } catch (e) {
        if (e instanceof TypeError) {
            console.log("Unsupported command: " + options.operation);
            console.log("Supported commands include:");
            plugins.pprint();
            console.log(e.stack);
            return 2;
        } else {
            console.log(e.message);
            console.log("Supported commands include:");
            plugins.pprint();
            return 3;
        }
    }
});