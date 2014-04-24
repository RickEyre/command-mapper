// The MIT License (MIT)
// Copyright (c) 2014 command-mapper contributors

var _ = require("lodash");

// A formula represents the way in which a translated mapping should look i.e.
// what order the arguments, options, and further mappings should appear
// in. It also does the work of plugging options into their appropriate place
// in the translated mapping. Every mapping has a default formula if one isn't
// specified.
var defaultRecipe = "%command% %default% %args% %always% %mapping% %options%";
function Formula(recipe) {
  recipe = recipe || defaultRecipe;
  if (recipe && !_.isString(recipe)) {
    throw new Error("Recipe must be a string.");
  }
  this.recipe = recipe;
}

Formula.prototype.cook = function(ingredients) {
  var recipe = this.recipe;

  _.forEach(ingredients, function(val, key) {
    _.isArray(val) && (val = val.join(" "));
    recipe = recipe.replace("%" + key + "%", val);
  });

  if (ingredients.args) {
    _.forEach(ingredients.args, function(val, index) {
      recipe = recipe.replace("%" + (index + 1) + "%", val);
    });
  }

  return recipe.replace(/%[^%]*%/g, "").replace(/\s+/g, " ").trim();
};

module.exports = Formula;
