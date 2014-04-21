// The MIT License (MIT)
// Copyright (c) 2014 command-mapper contributors

var Mapping = require("./mapping"),
    minimist = require("minimist");

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
  input = minimist(input.split(" "));
  var shortcut = input._ && input._[0] && input._.shift();
  if (!shortcut) {
    return "";
  }
  for (var i = 0, l = this.mappings.length; i < l; i++) {
    if (this.mappings[i].shortcut === shortcut) {
      return this.mappings[i].map(input);
    }
  }
};

CommandMapper.map = function(mapping, input) {
  return new CommandMapper(mapping).map(input);
};

module.exports = CommandMapper;
