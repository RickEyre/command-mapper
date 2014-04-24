// The MIT License (MIT)
// Copyright (c) 2014 command-mapper contributors

var Formula = require("./formula"),
    _ = require("lodash"),
    simpleOptions = [ "command", "alias", "default", "always" ],
    requiredOptions = [ "command", "alias" ];

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

function Mapping(options) {
  if (_.isArray(options)) {
    throw new Error("Incorrectly formatted mapping. Expected object and got" +
                    " an array.");
  }
  _.forEach(requiredOptions, function(val) {
    if (!_.has(options, val)) {
      throw new Error("A mapping must at least have an " + val + " property.");
    }
  });

  _.forEach(simpleOptions, function(key) {
    this[key] = options[key] || "";
  }, this);
  this.formula = new Formula(options.formula);
  this.options = options.options || {};
  this.mappings = _.map(options.mappings, function(val) {
    return new Mapping(val);
  });
}

Mapping.prototype.map = function(input) {
  var out = this.command,
      alias = input._.shift();

  // If we have another alias then go deeper into the command mappings; do
  // not process options yet.
  if (alias) {
    var mapping = _.find(this.mappings, { alias: alias });
    return mapping && concat(out, mapping.map(input)) || out;
  }

  // If we have only been passed the alias and no options then use the
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
