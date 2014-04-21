// The MIT License (MIT)
// Copyright (c) 2014 command-mapper contributors

var Mapping = require("./mapping"),
    minimist = require("minimist"),
    _ = require("underscore");

function CommandMapper(mapping) {
  if (_.isArray(mapping)) {
    throw new Error("Incorrectly formatted mapping. Expected object and got " +
                    " an array.");
  }
  this.mappings = [];
  Object.getOwnPropertyNames(mapping).forEach(function(key) {
    this.mappings.push(new Mapping(key, mapping[key]));
  }, this);
}

CommandMapper.prototype.map = function(input) {
  input = minimist(input.split(" "));
  var shortcut = input._.shift();
  var mapping = _.find(this.mappings, function(mapping) {
    return mapping.shortcut === shortcut;
  });
  return mapping ? mapping.map(input) : "";
};

CommandMapper.map = function(mapping, input) {
  return new CommandMapper(mapping).map(input);
};

module.exports = CommandMapper;
