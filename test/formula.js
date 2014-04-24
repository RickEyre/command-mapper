// The MIT License (MIT)
// Copyright (c) 2014 command-mapper contributors

var expect = require("chai").expect,
    Formula = require("../lib/formula.js");

suite("formula", function() {

  test("should look like a formula object", function() {
    var formula = new Formula();
    expect(formula).to.have.property("recipe");
    expect(formula).to.respondTo("cook");
  });

  test("formula must only accept a string or nothing", function() {
    expect(function() { new Formula({}); }).to.throw();
    expect(function() { new Formula([]); }).to.throw();
    expect(function() { new Formula(1); }).to.throw();
    expect(function() { new Formula(true); }).to.throw();
    expect(function() { new Formula(); }).to.not.throw();
    expect(function() { new Formula("string!"); }).to.not.throw();
  });

  test("formula should have correct default ingredients", function() {
    var formula = new Formula();
    expect(formula.recipe).to.equal("%command% %default% %args% %always% %mapping% %options%");
  });

  test("formula should load a formula correctly", function() {
    var formula = new Formula("%command% %1% %2% %options%");
    expect(formula.recipe).to.deep.equal("%command% %1% %2% %options%");
  });

  test("formula should cook ingredients correctly", function() {
    var formula = new Formula("%command% %mappings% %1% %2% %options%");
    expect(formula.cook({
      command: "git",
      mappings: "push",
      args: [ "origin", "master" ],
      options: [ "-f", "--tags" ]
    })).to.equal("git push origin master -f --tags");
  });

  test("default formula should have cook ingredients correctly", function() {
    var formula = new Formula();
    expect(formula.cook({
      command: "cmd",
      "default": "woah-there",
      args: [ "one", "two" ],
      mapping: "this-sub-mapping",
      options: [ "--woah=9", "-t", "-vwb" ]
    })).to.equal("cmd woah-there one two this-sub-mapping --woah=9 -t -vwb");
  });

});
