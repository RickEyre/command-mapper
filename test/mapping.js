// The MIT License (MIT)
// Copyright (c) 2014 map contributors

var expect = require("chai").expect,
    Mapping = require("../lib/mapping"),
    mappingjson = require("./mapping.json");

suite("mapping", function() {

  test("mapping constructor should not accept an array", function() {
    expect(function(){ new Mapping("key", [])}).to.throw(Error);
  });

  test("mapping should at least have a shortcut property", function() {
    expect(function(){ new Mapping("key", {})}).to.throw(Error);
  });

  test("mapping should have correct default values", function() {
    var mapping = new Mapping("git", { "shortcut": "g" });
    expect(mapping.command).to.equal("git");
    expect(mapping.shortcut).to.equal("g");
    expect(mapping["default"]).to.be.empty;
    expect(mapping.always).to.be.empty;
    expect(mapping.options).to.be.empty;
    expect(mapping.mappings).to.have.length(0);
  });

  test("mapping should load correctly", function() {
    var mapping = new Mapping("diff", mappingjson.git.mappings.diff);
    expect(mapping.command).to.equal("diff");
    expect(mapping.shortcut).to.equal("d");
    expect(mapping["default"]).to.equal("HEAD");
    expect(mapping.always).to.equal("--color");
    expect(mapping.options).to.deep.equal({ "h": "--histogram" })
    expect(mapping.mappings).to.be.empty;
  });

});
