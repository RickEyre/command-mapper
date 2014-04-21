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
      shortcut = input._.shift();

  // If we have another shortcut then go deeper into the command mappings; do
  // not process options yet.
  if (shortcut) {
    var mapping = _.find(this.mappings, function(mapping) {
      return mapping.shortcut === shortcut;
    });
    return mapping ? out + " " + mapping.map(input) : out;
  }

  // If we have only been passed the shortcut and no options then use the
  // default value of there is one.
  var keys = Object.getOwnPropertyNames(input);
  if (keys.length === 1) {
    return out + " " + this["default"];
  }

  // Concatenate the options onto the end of the command.
  keys.forEach(function(key) {
    if (_.isArray(input[key])) {
      return;
    }
    if (this.options[key]) {
      out += " " + this.options[key];
    } else {
      out += " -" + key;
    }
  }, this);
  return out;
};

module.exports = Mapping;
