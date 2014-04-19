// The MIT License (MIT)
// Copyright (c) 2014 map contributors

var Mapping = require("./mapping");

function CommandMapper(mapping) {
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

CommandMapper.prototype.map = function(input) {
  if (!input) {
    return "";
  }
  // TODO: CommandMapper the input to the proper output.
};

CommandMapper.map = function(mapping, input) {
  return new CommandMapper(mapping).map(input);
};

module.exports = CommandMapper;
