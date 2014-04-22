// The MIT License (MIT)
// Copyright (c) 2014 command-mapper contributors

var expect = require("chai").expect,
    Mapping = require("../lib/mapping.js")

suite("mapping", function() {

  test("should look like a Mapping object", function(){
    expect(new Mapping("git", { shortcut: "g" })).to.respondTo("map");
  });

  test("mapping constructor should not accept an array", function() {
    expect(function(){ new Mapping("key", [])}).to.throw(Error);
  });

  test("mapping should at least have a shortcut property", function() {
    expect(function(){ new Mapping("key", {})}).to.throw(Error);
  });

  test("mapping should have correct default values", function() {
    var mapping = new Mapping("git", { shortcut: "g" });
    expect(mapping.command).to.equal("git");
    expect(mapping.shortcut).to.equal("g");
    expect(mapping["default"]).to.equal("");
    expect(mapping.always).to.equal("");
    expect(mapping.options).to.be.empty;
    expect(mapping.options).to.be.an("object");
    expect(mapping.mappings).to.be.an("array");
    expect(mapping.mappings).to.have.length(0);
  });

  test("mapping should load correctly", function() {
    var opts = {
      shortcut: "d",
      "default": "HEAD",
      always: "--color",
      options: {
        h: "--histogram"
      },
    };
    var mapping = new Mapping("diff", opts);
    expect(mapping.command).to.equal("diff");
    expect(mapping.shortcut).to.equal("d");
    expect(mapping["default"]).to.equal("HEAD");
    expect(mapping.always).to.equal("--color");
    expect(mapping.options).to.deep.equal({ "h": "--histogram" })
    expect(mapping.mappings).to.be.an("array");
    expect(mapping.mappings).to.have.length(0);
  });

});
