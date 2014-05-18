// The MIT License (MIT)
// Copyright (c) 2014 command-mapper contributors

var expect = require("chai").expect,
    interpret = require("../lib/interpret.js");

suite("interpret", function() {

  test("interpret should be a function", function() {
    expect(interpret).to.be.a("function");
  });

  test("interpret should return an object with arguments array and an options object", function() {
    var output = interpret();
    expect(output).to.be.an("object");
    expect(output._).to.be.an("array");
    expect(output.options).to.be.an("object");
  });

  test("arguments should be put on the _ array", function() {
    expect(interpret([ "g", "p", "o", "m" ])._).to.deep.equal([ "g", "p", "o", "m"]);
  });

  test("'-' options should be added as a property", function() {
    var output = interpret([ "-o" ]);
    expect(output.options.o).to.exist;
    expect(output.options.o).to.deep.equal({
      value: true,
      original: "-o"
    });
  });

  test("multiple '-' options together should be added as a properties", function() {
    var output = interpret([ "-opm" ]);
    [ "o", "p", "m" ].forEach(function(value) {
      expect(output.options[value]).to.exist;
      expect(output.options[value]).to.deep.equal({
        value: true,
        original: "-" + value
      });
    });
  });

  test("'-' option with num arg should be added as a property", function() {
    var output = interpret([ "-h1" ]);
    expect(output.options.h).to.exist;
    expect(output.options.h).to.deep.equal({
      value: "1",
      original: "-h1"
    });
  });

  test("'--' option should be added as a property", function() {
    var output = interpret([ "--one" ]);
    expect(output.options.one).to.exist;
    expect(output.options.one).to.deep.equal({
      value: true,
      original: "--one"
    });
  });

  test("'--' option with value specified with '=' should be added as a property", function() {
    var output = interpret([ "--one=one" ]);
    expect(output.options.one).to.exist;
    expect(output.options.one).to.deep.equal({
      value: "one",
      original: "--one=one"
    });
  });

  test("'-' option with value specified should be added as a property", function() {
    var output = interpret([ "-b", "branch" ]);
    expect(output.options.b).to.exist;
    expect(output.options.b).to.deep.equal({
      value: "branch",
      original: "-b branch"
    });
  });

  test("'--' option with value specified should be added as a property", function() {
    var output = interpret([ "--b", "branch" ]);
    expect(output.options.b).to.exist;
    expect(output.options.b).to.deep.equal({
      value: "branch",
      original: "--b branch"
    });
  });

  test("'-' option with no arg or value should be added as a property", function() {
    var output = interpret([ "-" ]);
    expect(output.options["-"]).to.exist;
    expect(output.options["-"]).to.deep.equal({
      value: true,
      original: "-"
    });
  });

});
