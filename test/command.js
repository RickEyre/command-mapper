// The MIT License (MIT)
// Copyright (c) 2014 map contributors

var expect = require("chai").expect,
    Command = require("../lib/command"),
    mapping = require("./mapping.json");

suite("command", function() {

  test("command constructor should not accept an array", function() {
    expect(function(){ new Command("key", [])}).to.throw(Error);
  });

  test("command mapping should at least have a shortcut property", function() {
    expect(function(){ new Command("key", {})}).to.throw(Error);
  });

  test("command should have correct default values", function() {
    var command = new Command("git", { "shortcut": "g" });
    expect(command.command).to.equal("git");
    expect(command.shortcut).to.equal("g");
    expect(command.deflt).to.be.empty;
    expect(command.always).to.be.empty;
    expect(command.options).to.be.empty;
    expect(command.mappings).to.have.length(0);
  });

  test("command should load correctly", function() {
    var command = new Command("diff", mapping.git.mappings.diff);
    expect(command.command).to.equal("diff");
    expect(command.shortcut).to.equal("d");
    expect(command.deflt).to.equal("HEAD");
    expect(command.always).to.equal("--color");
    expect(command.options).to.deep.equal({ "h": "--histogram" })
    expect(command.mappings).to.be.empty;
  });

});