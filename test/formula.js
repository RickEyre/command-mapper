// The MIT License (MIT)
// Copyright (c) 2014 command-mapper contributors

var expect = require("chai").expect,
    Formula = require("../lib/formula.js");

suite("formula", function() {

  test("should look like a formula object", function() {
    var formula = new Formula();
    expect(formula).to.have.property("ingredients");
    expect(formula).to.respondTo("formulate");
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
    expect(formula.ingredients).to.deep.equal([
      "%command%", "%default%", "%args%", "%always%", "%mappings%", "%options%"
    ]);
  });

  test("formula should load a formula correctly", function() {
    var formula = new Formula("%command% %1% %2% %options%");
    expect(formula.ingredients).to.deep.equal([
      "%command%", "%1%", "%2%", "%options%"
    ]);
  });

});
