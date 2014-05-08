// The MIT License (MIT)
// Copyright (c) 2014 command-mapper contributors

var expect = require("chai").expect,
    CommandMapper = require("../lib/command-mapper"),
    path = require("path"),
    mappingJSONFile = path.resolve(__dirname, "./mapping.json");
    mapping = {
      command: "git",
      alias: "g",
      "default": "help"
    };

suite("CommandMapper", function() {

  test("CommandMapper constructor should accept array or object", function() {
    expect(function() { new CommandMapper([ mapping ]); }).to.not.throw(Error);
    expect(function() { new CommandMapper(mapping); }).to.not.throw(Error);
  });

  test("should look like a CommandMapper object", function(){
    expect(CommandMapper).itself.to.respondTo("map");
    expect(CommandMapper).itself.to.respondTo("fromMappingJSONFile");
    expect(new CommandMapper(mapping)).to.respondTo("map");
  });

  test("should have two mappings", function() {
    var commandMapper = new CommandMapper(mapping);
    expect(commandMapper.mappings).to.be.an("array");
    expect(commandMapper.mappings).to.have.length(1);
  });

  suite("#map", function() {

    test("map should be able to load a file", function() {
      expect(CommandMapper.map(mappingJSONFile, "g")).to.equal("git");
    });

    test("should accept an empty string", function() {
      expect(CommandMapper.map(mapping, "")).to.equal("");
    });

    test("should accept an array", function() {
      expect(CommandMapper.map(mapping, [])).to.equal("");
    });

    test("should throw on not array or string", function() {
      expect(function() { CommandMapper.map(mapping, 1); }).to.throw();
      expect(function() { CommandMapper.map(mapping, {}); }).to.throw();
      expect(function() { CommandMapper.map(mapping, function() {}); }).to.throw();
    });

    test("use the default command if no alias has been passed", function() {
      expect(CommandMapper.map(mapping, "g")).to.equal("git help");
    });

    test("stringing basic aliases together should work", function() {
      mapping.mappings = [ { command: "diff", alias: "d" } ];
      expect(CommandMapper.map(mapping, "g d")).to.equal("git diff");
    });

    test("the always option should be appended if it has been set", function() {
      mapping.mappings[0]["default"] = "HEAD";
      mapping.mappings[0].always = "--color";
      expect(CommandMapper.map(mapping, "g d")).to.equal("git diff HEAD --color");
    });

    test("options should be translated", function() {
      mapping.mappings.push({
        command: "commit",
        alias: "c",
        options: { "m": "-am" }
      });
      expect(CommandMapper.map(mapping, "g c -m")).to.equal("git commit -am");
    });

    test("single options with no translation should just be appended", function() {
      expect(CommandMapper.map(mapping, "g c -mt")).to.equal("git commit -am -t");
    });

    test("non-boolean options with no translation should be appended", function() {
      expect(CommandMapper.map(mapping, "g c -mt --rand=8")).to.equal("git commit -am -t --rand=8");
    });

    test("args that are not an alias should just be appended", function() {
      expect(CommandMapper.map(mapping, "g push origin master -f")).to.equal("git push origin master -f");
    });

    test("passing the 'asArray' option should return an empty array when there is no mapping found", function() {
      expect(CommandMapper.map(mapping, "y", { asArray: true })).to.deep.equal([]);
    });

    test("passing the 'asArray' option should have map return an array", function() {
      expect(CommandMapper.map(mapping, "g c -mt --rand=8", { asArray: true })).to.deep.equal([
        "git", "commit", "-am", "-t", "--rand=8"
      ]);
    });

    test("formula should alter command output correctly", function() {
      mapping.mappings[1].formula = "%mapping% %command% %always% %options% %args%";
      mapping.mappings[1].always = "--always";
      expect(CommandMapper.map(mapping, "g c -opm --rand=8 argOne")).to.equal(
        "git commit --always -o -p -am --rand=8 argOne"
      );
    });

    test("options with arguments should be mapped correctly", function() {
      mapping.mappings[0].options = { "h": "--hard HEAD~%argument%" };
      expect(CommandMapper.map(mapping, "g d -h3")).to.equal("git diff --color --hard HEAD~3");
      expect(CommandMapper.map(mapping, "g d -h hey")).to.equal("git diff --color --hard HEAD~hey");
    });

    test("default should not be added if arguments have been passed", function() {
      expect(CommandMapper.map(mapping, "g clone")).to.equal("git clone");
    });

  });

  suite("#fromMappingJSONFile", function() {

    test("should load command mapper object correctly", function() {
      var commandMapper = CommandMapper.fromMappingJSONFile(mappingJSONFile);
      expect(commandMapper).to.be.an.instanceOf(CommandMapper);
      expect(commandMapper.mappings).to.be.an("array");
      expect(commandMapper.mappings).to.have.length(1);
    });

  });

});
