// The MIT License (MIT)
// Copyright (c) 2014 map contributors

var expect = require("chai").expect,
    CommandMapper = require("../lib/command-mapper"),
    mapping = require("./mapping.json"),
    commandMap = new CommandMapper(mapping);

suite("CommandMapper", function() {

  test("should look like a CommandMapper object", function(){
    expect(CommandMapper).to.have.property("map");
    expect(commandMap).to.have.property("map");
  });

  test("should accept an empty string", function() {
    expect(commandMap.map("")).to.equal("");
  });


  test("CommandMapper constructor should not accept an array", function() {
    expect(function() { new CommandMapper([]) }).to.throw(Error);
  });


  test("should have two mappings", function() {
    expect(commandMap.mappings).to.have.length(2);
  });

});
