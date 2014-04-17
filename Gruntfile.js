// The MIT License (MIT)
// Copyright (c) map contributors.

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),

    jshint: {
      options: {
        esnext: true,
        indent: 2,
        expr: true,
        camelcase: true,
        curly: true,
        eqeqeq: true,
        newcap: true,
        unused: true,
        trailing: true,
        browser: true,
        node: true
      },
      files: [ "lib/*" ]
    },

    bump: {
      options: {
        files: [ "package.json" ],
        updateConfigs: [],
        commit: true,
        commitMessage: "Release v%VERSION%",
        commitFiles: [ "package.json" ],
        createTag: true,
        tagName: "v%VERSION%",
        tagMessage: "Version %VERSION%",
        push: true,
        pushTo: "git@github.com:RickEyre/map.git",
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: "list",
          ui: "tdd"
        },
        src: [ "test/**/*.js" ]
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-bump");
  grunt.loadNpmTasks("grunt-mocha-test");

  grunt.registerTask("default", [ "jshint", "mochaTest" ]);
};
