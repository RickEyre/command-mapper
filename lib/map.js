// The MIT License (MIT)
// Copyright (c) 2014 map contributors

var Mapping = require("./mapping");

function Map(mapping) {
  if (Array.isArray(mapping)) {
    throw new Error("Incorrectly formatted mapping. Expected object and got " +
                    " an array.");
  }
  var self = this;
  this.mappings = [];
  Object.getOwnPropertyNames(mapping).forEach(function(key) {
    self.mappings.push(new Mapping(key, mapping[key]));
  });
}

Map.prototype.triangulate = function(input) {
  if (!input) {
    return "";
  }
  // TODO: Map the input to the proper output.
};

Map.triangulate = function(mapping, input) {
  return new Map(mapping).triangulate(input);
};

module.exports = Map;
