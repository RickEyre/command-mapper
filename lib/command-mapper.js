// The MIT License (MIT)
// Copyright (c) 2014 command-mapper contributors

var Mapping = require("./mapping"),
    minimist = require("minimist"),
    _ = require("lodash");

function CommandMapper(mapping) {
  if (!_.isArray(mapping)) {
    mapping = [ mapping ];
  }
  this.mappings = _.map(mapping, function(val) {
    return new Mapping(val);
  });
}

CommandMapper.prototype.map = function(input) {
  if (_.isString(input)) {
    input = input.split(" ");
  }
  if (!_.isArray(input)) {
    throw new Error("Map function only accepts an array or a string.");
  }
  input = minimist(input);
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
