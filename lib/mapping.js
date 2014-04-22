// The MIT License (MIT)
// Copyright (c) 2014 command-mapper contributors

var Formula = require("./formula"),
    _ = require("underscore"),
    simpleOptions = [ "shortcut", "default", "always" ];

// Concatenate string(s) to the end of the 'base' string.
function concat(base, strings) {
  if (!_.isArray(strings)) {
    strings = [ strings ];
  }
  strings.forEach(function(str) {
    str && (base += " " + str);
  });
  return base;
}

function Mapping(command, options) {
  if (_.isArray(options)) {
    throw new Error("Incorrectly formatted mapping. Expected object and got " +
                    " an array.");
  }
  if (!options.shortcut) {
    throw new Error("A mapping must at least have a shortcut property.");
  }

  this.command = command;
  this.formula = new Formula(options.formula);
  this.options = options.options || {};
  simpleOptions.forEach(function(key) {
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
  var out = this.command,
      shortcut = input._.shift();

  // If we have another shortcut then go deeper into the command mappings; do
  // not process options yet.
  if (shortcut) {
    var mapping = _.find(this.mappings, function(mapping) {
      return mapping.shortcut === shortcut;
    });
    return mapping ? concat(out, mapping.map(input)) : out;
  }

  // If we have only been passed the shortcut and no options then use the
  // default value of there is one.
  var keys = Object.getOwnPropertyNames(input);
  if (keys.length === 1) {
    return concat(out, [ this["default"], this.always ]);
  }

  // Concatenate the options onto the end of the command.
  var opts = [];
  keys.forEach(function(key) {
    if (_.isArray(input[key])) {
      return;
    }
    if (this.options[key]) {
      return opts.push(this.options[key]);
    }
    if (_.isBoolean(input[key])) {
      return opts.push("-" + key);
    }
    opts.push("--" + key + "=" + input[key]);
  }, this);
  return concat(out, opts);
};

module.exports = Mapping;
