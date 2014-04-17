// The MIT License (MIT)
// Copyright (c) 2014 map contributors

function Mapping(command, mapping) {
  var self = this;

  if (Array.isArray(mapping)) {
    throw new Error("Incorrectly formatted mapping. Expected object and got " +
                    " an array.");
  }
  if (!mapping || !mapping.shortcut) {
    throw new Error("A mapping must at least have a shortcut property.");
  }

  this.command = command;
  this.shortcut = mapping.shortcut;
  this.deflt = mapping["default"] || ""; 
  this.always = mapping.always || "";
  this.options = mapping.options || {};

  this.mappings = [];
  if (mapping.mappings) {
    var mappings = mapping.mappings;
    Object.getOwnPropertyNames(mappings).forEach(function(key) {
      self.mappings.push(new Mapping(key, mappings[key]));
    });
  }
}

module.exports = Mapping;
