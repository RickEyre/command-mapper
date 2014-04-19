// The MIT License (MIT)
// Copyright (c) 2014 map contributors

function Mapping(command, options) {
  var self = this;

  if (Array.isArray(options)) {
    throw new Error("Incorrectly formatted mapping. Expected object and got " +
                    " an array.");
  }
  if (!options.shortcut) {
    throw new Error("A mapping must at least have a shortcut property.");
  }

  self.command = command;
  ( "shortcut default always options" ).split(" ").forEach(function(key) {
    self[key] = options[key];
  });

  self.mappings = [];
  if (options.mappings) {
    var mappings = options.mappings;
    Object.getOwnPropertyNames(mappings).forEach(function(key) {
      self.mappings.push(new Mapping(key, mappings[key]));
    });
  }
}

module.exports = Mapping;
