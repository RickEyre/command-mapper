// The MIT License (MIT)
// Copyright (c) 2014 command-mapper contributors

var Mapping = require("./mapping"),
    interpret = require("./interpret"),
    _ = require("lodash");

function CommandMapper(mapping) {
  if (!_.isArray(mapping)) {
    mapping = [ mapping ];
  }
  this.mappings = _.map(mapping, function(val) {
    return new Mapping(val);
  });
}

CommandMapper.prototype.map = function(input, options) {
  options = options || {};
  if (_.isString(input)) {
    input = input.split(" ");
  }
  if (!_.isArray(input)) {
    throw new Error("Map function only accepts an array or a string.");
  }
  input = interpret(input);
  var alias = input._.shift(),
      mapping = _.find(this.mappings, { alias: alias }),
      output = mapping && mapping.map(input) || "";
  if (options.asArray) {
    return output && output.split(" ") || [];
  }
  return output;
};

CommandMapper.map = function(mapping, input, options) {
  // If mapping is a string, instead of a mapping options object, then assume
  // it is the name of a mapping.json file and try to require it.
  if (_.isString(mapping)) {
    mapping = require(mapping);
  }
  return new CommandMapper(mapping).map(input, options);
};

CommandMapper.fromMappingJSONFile = function(file) {
  return new CommandMapper(require(file));
};

module.exports = CommandMapper;
