// The MIT License (MIT)
// Copyright (c) 2014 map contributors

var expect = require("chai").expect,
    Map = require("../lib/map"),
    mapping = require("./mapping.json"),
    map = new Map(mapping);

suite("map", function() {

  test("should look like a map object", function(){
    expect(Map).to.have.property("triangulate");
    expect(map).to.have.property("triangulate");
  });

  test("should accept an empty string", function() {
    expect(map.triangulate("")).to.equal("");
  });

});