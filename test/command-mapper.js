// The MIT License (MIT)
// Copyright (c) 2014 command-mapper contributors

var expect = require("chai").expect,
    CommandMapper = require("../lib/command-mapper"),
    mapping = require("./mapping.json"),
    commandMap = new CommandMapper(mapping);

suite("CommandMapper", function() {

  test("should look like a CommandMapper object", function(){
    expect(CommandMapper).to.respondTo("map");
    expect(commandMap).to.respondTo("map");
  });

  test("CommandMapper constructor should not accept an array", function() {
    expect(function() { new CommandMapper([]) }).to.throw(Error);
  });


  test("should have two mappings", function() {
    expect(commandMap.mappings).to.be.an("array");
    expect(commandMap.mappings).to.have.length(2);
  });

  suite("#map", function() {
    test("should accept an empty string", function() {
      expect(commandMap.map("")).to.equal("");
    });

    test("stringing basic shortcuts together should work", function() {
      expect(commandMap.map("g c")).to.equal("git commit -a");
    });

    test("use the default command if no shortcut has been passed", function() {
      expect(commandMap.map("g")).to.equal("git help");
    });

    // TODO: Formula needs to be implemented for this to work correctly.
    test.skip("the always option should be appended if it has been set", function() {
      expect(commandMap.map("g d")).to.equal("git diff HEAD --color");
    });

    test("options should be translated", function() {
      expect(commandMap.map("g c -m")).to.equal("git commit -am");
    });

    test("single options with no translation should just be appended", function() {
      expect(commandMap.map("g c -mt")).to.equal("git commit -am -t");
    });

  });

});
