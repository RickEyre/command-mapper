// The MIT License (MIT)
// Copyright (c) 2014 command-mapper contributors

var Formula = require("./formula"),
    _ = require("lodash"),
    simpleOptions = [ "command", "alias", "default", "always" ],
    requiredOptions = [ "command", "alias" ];

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
  // The ingredients that we will provide to this Mapping's Formula.
  var ingredients = _.pick(this, [ "command", "always" ]);

  // If we have another alias then go deeper into the command mappings; do
  // not process options yet.
  if (input._.length > 0) {
    var mapping =  _.find(this.mappings, { alias: input._[0] });
    if (mapping) {
      mapping && input._.shift();
      ingredients.mapping = mapping.map(input);
      return this.formula.cook(ingredients);
    }
  }

  // Whatever passed arguments that have been found to not be aliases are
  // assumed to be arguments to the mapped command.
  ingredients.args = input._ ;

  // If we have only been passed the alias and no options then use the
  // default value if there is one.
  if (_.keys(input).length === 1) {
    ingredients["default"] = this["default"];
    return this.formula.cook(ingredients);
  }

  // Concatenate the options onto the end of the command.
  ingredients.options = _.map(_.omit(input, "_"), function(val, key) {
    if (_.has(this.options, key)) {
      return this.options[key].replace("%argument%", val);
    }
    return _.isBoolean(val) && "-" + key || "--" + key + "=" + val;
  }, this);

  return this.formula.cook(ingredients);
};

module.exports = Mapping;
