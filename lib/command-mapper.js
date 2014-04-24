// The MIT License (MIT)
// Copyright (c) 2014 command-mapper contributors

var Mapping = require("./mapping"),
    minimist = require("minimist"),
    _ = require("lodash");

function CommandMapper(mapping) {
  if (_.isArray(mapping)) {
    throw new Error("Incorrectly formatted mapping. Expected object and got " +
                    " an array.");
  }
  this.mappings = _.map(mapping, function(val, key) {
    return new Mapping(key, val);
  });
}

CommandMapper.prototype.map = function(input) {
  input = minimist(input.split(" "));
  var alias = input._.shift(),
      mapping = _.find(this.mappings, { alias: alias });
  return mapping && mapping.map(input) || "";
};

CommandMapper.map = function(mapping, input) {
  // If mapping is a string, instead of a mapping options object, then assume
  // it is the name of a mapping.json file and try to require it.
  if (_.isString(mapping)) {
    mapping = require(mapping);
  }
  return new CommandMapper(mapping).map(input);
};

CommandMapper.fromMappingJSONFile = function(file) {
  return new CommandMapper(require(file));
};

module.exports = CommandMapper;
