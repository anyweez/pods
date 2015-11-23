/* jslint node: true */
var fs = require('fs');

module.exports = (function () {
    /**
     * Registry objects are a thin wrapper around an empty object that keeps track of all
     * loaded plugins by `cmd` name. There are also a convenience method or two related to
     * the group of plugins included on the structure as well.
     */
    function Registry() {
        this.plugins = {};
        // Return a function.
        this.load = function (name) {
            try {
                return this.plugins[name].exec;
            } catch (e) {
                throw Error("Plugin '" + name + "' doesn't exist.");
            }
        };

        this.pprint = function () {
            Object.keys(this.plugins).forEach(function (key) {
                console.log('   ' + key + ': ' + this.plugins[key].description);
            }.bind(this));
        };
    }

    return {
        /**
         * Load all Javascript files in the provided directory as plugins and return the
         * plugin registry.
         */
        loadAll: function (directory) {
            var registry = new Registry();

            fs.readdirSync(directory).forEach(function (filename) {
                if (filename.slice(filename.length - 3, filename.length) == ".js") {
                    var plugin = require(directory + '/' + filename);
                    // The plugin should actually be invoked with plugin.exec() but that's
                    // masked through the use of the registry.load() method.
                    registry.plugins[plugin.cmd] = plugin;
                }
            });

            return registry;
        },
    };
}());