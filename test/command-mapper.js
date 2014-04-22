// The MIT License (MIT)
// Copyright (c) 2014 command-mapper contributors

var expect = require("chai").expect,
    CommandMapper = require("../lib/command-mapper"),
    mapping = {
      git: {
        shortcut: "g",
        "default": "help"
      }
    };

suite("CommandMapper", function() {

  test("should look like a CommandMapper object", function(){
    expect(CommandMapper).itself.to.respondTo("map");
    expect(new CommandMapper(mapping)).to.respondTo("map");
  });

  test("CommandMapper constructor should not accept an array", function() {
    expect(function() { new CommandMapper([]) }).to.throw(Error);
  });


  test("should have two mappings", function() {
    var commandMapper = new CommandMapper(mapping);
    expect(commandMapper.mappings).to.be.an("array");
    expect(commandMapper.mappings).to.have.length(1);
  });

  suite("#map", function() {

    test("should accept an empty string", function() {
      expect(CommandMapper.map(mapping, "")).to.equal("");
    });

    test("use the default command if no shortcut has been passed", function() {
      expect(CommandMapper.map(mapping, "g")).to.equal("git help");
    });

    test("stringing basic shortcuts together should work", function() {
      mapping.git.mappings = { diff: { shortcut: "d" } };
      expect(CommandMapper.map(mapping, "g d")).to.equal("git diff");
    });

    test("the always option should be appended if it has been set", function() {
      mapping.git.mappings.diff["default"] = "HEAD";
      mapping.git.mappings.diff.always = "--color";
      expect(CommandMapper.map(mapping, "g d")).to.equal("git diff HEAD --color");
    });

    test("options should be translated", function() {
      mapping.git.mappings.commit = { shortcut: "c", options: { "m": "-am" } };
      expect(CommandMapper.map(mapping, "g c -m")).to.equal("git commit -am");
    });

    test("single options with no translation should just be appended", function() {
      expect(CommandMapper.map(mapping, "g c -mt")).to.equal("git commit -am -t");
    });

    test("non-boolean options with no translation should be appended", function() {
      expect(CommandMapper.map(mapping, "g c -mt --rand=8")).to.equal("git commit -am -t --rand=8");
    });

  });

});
