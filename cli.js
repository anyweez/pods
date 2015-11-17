#! /usr/bin/env node

var argparse = require('command-line-args');
var process = require('process');
var pods = require('./pods');
var fs = require('fs');

var args = argparse([
    {
        name: 'action',
        type: String
    }
]);

var options = args.parse();
options.operation = process.argv[2]; // unnamed, so not handled by argparse

// Load all plugins.
var plugins = {};
fs.readdirSync(__dirname + '/plugins').forEach(function (filename) {
    if (filename.slice(filename.length - 3, filename.length) == ".js") {
        var plugin = require("./plugins/" + filename)
        plugins[plugin.cmd] = plugin.exec;
    }
});

// Read in episode.json and returns a podcast object with all sorts
// of fanciness.
var podcast = pods.read('episodes.json')

// TODO: convert to plugins
try {
    console.log(plugins[options.operation](podcast));
} catch (e) {
    if (e instanceof TypeError) {
        console.log("Unsupported command: " + options.operation);
        console.log(e.stack);
    } else {
        console.log("Error with " + options.operation + ":");
        console.log(e.stack);
    }
}