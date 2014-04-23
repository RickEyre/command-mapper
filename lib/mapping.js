// The MIT License (MIT)
// Copyright (c) 2014 command-mapper contributors

var Formula = require("./formula"),
    _ = require("lodash"),
    simpleOptions = [ "shortcut", "default", "always" ];

// Concatenate string(s) to the end of the 'base' string.
function concat(base, strings) {
  if (!_.isArray(strings)) {
    strings = [ strings ];
  }
  _.forEach(strings, function(str) {
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
  _.forEach(simpleOptions, function(key) {
    this[key] = options[key] || "";
  }, this);

  this.mappings = _.map(options.mappings, function(val, key) {
    return new Mapping(key, val);
  });
}

Mapping.prototype.map = function(input) {
  var out = this.command,
      shortcut = input._.shift();

  // If we have another shortcut then go deeper into the command mappings; do
  // not process options yet.
  if (shortcut) {
    var mapping = _.find(this.mappings, { shortcut: shortcut });
    return mapping && concat(out, mapping.map(input)) || out;
  }

  // If we have only been passed the shortcut and no options then use the
  // default value of there is one.
  if (_.keys(input).length === 1) {
    return concat(out, [ this["default"], this.always ]);
  }

  // Concatenate the options onto the end of the command.
  var opts = _.map(_.omit(input, "_"), function(val, key) {
    if (this.options[key]) {
      return this.options[key];
    }
    return _.isBoolean(val) && "-" + key || "--" + key + "=" + val;
  }, this);
  return concat(out, opts);
};

module.exports = Mapping;
