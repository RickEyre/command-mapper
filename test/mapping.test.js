// The MIT License (MIT)
// Copyright (c) 2014 command-mapper contributors

var expect = require("chai").expect,
    Mapping = require("../lib/mapping.js"),
    Formula = require("../lib/formula.js");

suite("mapping", function() {

  test("should look like a Mapping object", function(){
    expect(new Mapping({ command: "git", alias: "g" })).to.respondTo("map");
  });

  test("mapping constructor should not accept an array", function() {
    expect(function(){ new Mapping([]); }).to.throw(Error);
  });

  test("mapping should at least have an alias property", function() {
    expect(function(){ new Mapping({ command: "git" }); }).to.throw(Error);
  });

  test("mapping should at least have an command property", function() {
    expect(function(){ new Mapping({ alias: "g"}); }).to.throw(Error);
  });

  test("mapping should have correct default values", function() {
    var mapping = new Mapping({ command: "git", alias: "g" });
    expect(mapping.command).to.equal("git");
    expect(mapping.alias).to.equal("g");
    expect(mapping["default"]).to.equal("");
    expect(mapping.always).to.equal("");
    expect(mapping.options).to.be.empty;
    expect(mapping.options).to.be.an("object");
    expect(mapping.mappings).to.be.an("array");
    expect(mapping.mappings).to.have.length(0);
    expect(mapping.formula).to.not.be.empty;
    expect(mapping.formula).to.be.an.instanceof(Formula);
  });

  test("mapping should load correctly", function() {
    var mapping = new Mapping({
      command: "diff",
      alias: "d",
      "default": "HEAD",
      always: "--color",
      options: {
        h: "--histogram"
      }
    });
    expect(mapping.command).to.equal("diff");
    expect(mapping.alias).to.equal("d");
    expect(mapping["default"]).to.equal("HEAD");
    expect(mapping.always).to.equal("--color");
    expect(mapping.options).to.deep.equal({ "h": "--histogram" });
    expect(mapping.mappings).to.be.an("array");
    expect(mapping.mappings).to.have.length(0);
    expect(mapping.formula).to.not.be.empty;
    expect(mapping.formula).to.be.an.instanceof(Formula);
  });

});
