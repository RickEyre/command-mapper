// The MIT License (MIT)
// Copyright (c) 2014 command-mapper contributors

var _ = require("underscore"),
    validProperties = [ "shortcut", "default", "always" ];

function Mapping(command, options) {
  if (_.isArray(options)) {
    throw new Error("Incorrectly formatted mapping. Expected object and got " +
                    " an array.");
  }
  if (!options.shortcut) {
    throw new Error("A mapping must at least have a shortcut property.");
  }

  this.command = command;
  this.options = options.options || {};
  validProperties.forEach(function(key) {
    this[key] = options[key] || "";
  }, this);

  this.mappings = [];
  if (!options.mappings) {
    return;
  }
  var mappings = options.mappings;
  Object.getOwnPropertyNames(mappings).forEach(function(key) {
    this.mappings.push(new Mapping(key, mappings[key]));
  }, this);
}

Mapping.prototype.map = function(input) {
  var out = this.command + (this.always ? " " + this.always : ""),
      shortcut = input && input._[0] && input._.shift();
  if (!shortcut) {
    var keys = Object.getOwnPropertyNames(input);
    if (keys.length === 1 && keys[0] === "_") {
      return out + " " + this["default"];
    }
    var self = this;
    Object.getOwnPropertyNames(input).forEach(function(key) {
      if (Array.isArray(input[key])) {
        return;
      }
      if (self.options[key]) {
        out += " " + self.options[key];
      } else {
        out += " -" + key;
      }
    });
    return out;
  }
  for (var i = 0, l = this.mappings.length; i < l; i++) {
    if (this.mappings[i].shortcut === shortcut) {
      return out + " " + this.mappings[i].map(input);
    }
  }
  return out;
};

module.exports = Mapping;
