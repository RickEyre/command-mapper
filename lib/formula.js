// The MIT License (MIT)
// Copyright (c) 2014 command-mapper contributors

var _ = require("lodash");

// A formula represents the way in which a translated mapping should look i.e.
// what order the arguments, options, and further mappings should appear
// in. It also does the work of plugging options into their appropriate place
// in the translated mapping. Every mapping has a default formula if one isn't
// specified.
var defaultFormula = "%command% %default% %args% %always% %mappings% %options%";
function Formula(formula) {
  formula = formula || defaultFormula;
  if (formula && !_.isString(formula)) {
    throw new Error("Formula must be a string.");
  }
  this.ingredients = formula.split(" ");
}

Formula.prototype.formulate = function() {
  // TODO: Map a formula via some options.
};

module.exports = Formula;
