// The MIT License (MIT)
// Copyright (c) 2014 command-mapper contributors

var _ = require("lodash");

function ParsedArguments() {
  this._ = [];
  this.options = {};
}

ParsedArguments.prototype.addOption = function(option, value, original) {
  this.options[option] = {
    value: value,
    original: original
  };
};

function lookAhead(array, index, arg) {
  if (index >= array.length || /^-/.test(array[index])) {
    return {
      value: true,
      original: arg
    };
  }
  var nextArg = array.splice(index, 1)[0];
  return {
    value: nextArg,
    original: arg + " " + nextArg
  };
}

module.exports = function(argumentList) {
  var output = new ParsedArguments();

  _.forEach(argumentList, function(arg, index) {
    // If it's a straight argument and not an option add it to the arguments
    // array.
    if (!/^-/.test(arg)) {
      return output._.push(arg);
    }
    var lh;
    // One flag set with a possible value i.e. -b or -b branch
    var m = arg.match(/^-([a-zA-Z])$/);
    if (m && m[1]) {
      lh = lookAhead(argumentList, index + 1, arg);
      return output.addOption(m[1], lh.value, lh.original);
    }
    // '-' set with no value or arg.
    m = arg.match(/^(-)$/);
    if (m && m[0]) {
      return output.addOption(m[0], true, arg);
    }
    // Multiple flags set at once i.e. -bar
    m = arg.match(/^-([a-zA-Z]+)$/);
    if (m && m[1]) {
      return _.forEach(m[1].split(""), function(option) {
        output.addOption(option, true, "-" + option);
      });
    }
    // One option set with a numeric value i.e. -b1
    m = arg.match(/^-([a-zA-Z])([0-9])$/);
    if (m && m[2]) {
      return output.addOption(m[1], m[2], arg);
    }
    // One multi-character flag i.e. --bar
    m = arg.match(/^--([a-zA-Z]+)$/);
    if (m && m[1]) {
      lh = lookAhead(argumentList, index + 1, arg);
      return output.addOption(m[1], lh.value, lh.original);
    }
    // One multi-character option with a value i.e. --bar=baz
    m = arg.match(/^--([a-zA-Z]+)=(.*)$/);
    if (m && m[2]) {
      return output.addOption(m[1], m[2], arg);
    }
  });

  return output;
};