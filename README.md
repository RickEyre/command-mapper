command-mapper
==============

[![Build Status](https://travis-ci.org/RickEyre/command-mapper.svg?branch=master)](https://travis-ci.org/RickEyre/command-mapper) [![npm-version](http://img.shields.io/npm/v/command-mapper.svg)](https://www.npmjs.org/package/command-mapper) [![Dependency Status](https://david-dm.org/RickEyre/command-mapper.svg?theme=shields.io)](https://david-dm.org/RickEyre/command-mapper) [![devDependency Status](https://david-dm.org/RickEyre/command-mapper/dev-status.svg?theme=shields.io)](https://david-dm.org/RickEyre/command-mapper#info=devDependencies)

Maps command aliases to real commands based on a `mapping` options object or JSON file.

##Table of Contents##

- [Install](#install)
- [API](#api)
  - [CommandMapper](#commandmapper)
    - [CommandMapper(mapping)](#commandmappermapping)
    - [CommandMapper.map(mapping, input, [options])](#commandmappermapmapping-input-options)
    - [CommandMapper.fromMappingJSONFile(file)](#commandmapperfrommappingjsonfilefile)
    - [map(input, [options])](#mapinput-options)
- [Mapping Object](#mapping-object)
  - [command](#command)
  - [alias](#alias)
  - [default](#default)
  - [always](#always)
  - [options](#options)
  - [mappings](#mappings)
  - [formula](#formula)
- [Mapping Givens](#mapping-givens)

Install
=======

```js
npm install command-mapper
```

API
===

####CommandMapper###

`CommandMapper` has a simple API:

```js
var CommandMapper = require("command-mapper"),
    mappingOptions = [{
      command: "git",
      alias: "g",
      mappings: [{
        command: "commit",
        alias: "c",
        options: {
          "m": "-am"
        }
      }]
    }];

console.log(CommandMapper.map(mappingOptions, "g c"));
// --> "git commit"

console.log(new CommandMapper(mappingOptions).map("g c -m"));
// --> "git commit -am"
```

####CommandMapper(mapping)####

Constructs a new `CommandMapper` object with the passed [mapping](#mapping-object)
options object or mapping options array i.e. it will accept a single mapping
options object or an array of them.

```js
var mapper = new CommandMapper({ command: "git", alias: "g" });
```

####CommandMapper.map(mapping, input, [options])####

Maps the input to a real command based on the [mapping](#mapping-object) passed.
If `asArray` is specified as an option then an array of command line arguments
will be returned. By default it returns the command as a string.

```js
console.log(CommandMapper.map({ command: "git", alias: "g", "default": "help" }, "g"));
// --> "git help"
```

```js
console.log(CommandMapper.map({ command: "git", alias: "g", "default": "help" }, "g",
                              { asArray: true }));
// --> [ "git", "help" ]
```

####CommandMapper.fromMappingJSONFile(file)####

Creates a new `CommandMapper` object from a [mapping][mapping-object] JSON file.

```js
var commandMapper = CommandMapper.fromMappingJSONFile(mappingJSONFile);
```

####map(input, [options])####

Maps the input (which is an aliased command) to the real command.
If `asArray` is specified as an option then an array of command line arguments
will be returned. By default it returns the command as a string.

```js
var mapper = new CommandMapper({ command: "git", alias: "g", "default": "help" });
console.log(mapper.map("g"));
// --> "git help"
```

```js
var mapper = new CommandMapper({ command: "git", alias: "g", "default": "help" });
console.log(mapper.map("g", { asArray: true }));
// --> [ "git", "help" ]
```

Mapping Object
==============

A mapping object can consist of the follow properties:

####command####

The real command that the mapping object maps too. This is a **required** property.

```json
{
  "command": "git"
}
```

####alias####

The alias that represents the real command. This is a **required** property. 

```json
{
  "command": "git",
  "alias": "g"
}
```

`g` will map to `git`.

####default####

A string that will be appended to the command if no other args/options/aliases
are available.

```json
{
  "command": "git",
  "alias": "g",
  "default": "help"
}
```

`g` will map to `git help`, however, `g -o` will map to `git -o` since an
argument has been passed to the `g` alias.

####always####

A string that will always be appended to the command.

```json
{
  "command": "git diff",
  "alias": "gd",
  "always": "--color"
}
```

`gd` will map to `git diff --color`.

####options###

An options object which represents aliases for the command.

```json
{
  "command": "git diff",
  "alias": "gd",
  "always": "--color",
  "options": {
    "p": "--unified=8 -k -p"
  }
}
```

`gd -p` will map to `git diff --color --unified=8 -k -p`.

Options can have a single argument that can be plugged into the mapping with
the special string `%argument%`.

```json
{
  "command": "git diff",
  "alias": "gd",
  "options": {
    "h": "--hard HEAD~%argument%"
  }
}
```

`gd -h3` or `gd -h 3` would map to `git diff --hard HEAD~3`.

If you'd like to have multi-character keys for the options object like:

```json
{
  "command": "git diff",
  "alias": "gd",
  "options": {
    "hard": "--hard HEAD~%argument%"
  }
}
```

Then make sure to write your alias option with a `--` like so, `gd --hard=3`,
which would output, `git diff --hard HEAD~3`.


####mappings####

A nested mapping object which represents an alias to a sub command of the parent
command.

```json
{
  "command": "git",
  "alias": "g",
  "mappings": [{
    "command": "commit",
    "alias": "c",
    "default:" "-a"
  }, {
    "command": "diff",
    "alias": "d",
    "always": "--color"
  }]
}
```

`g c` will map to `git commit -a` and `g d` will map to `git diff --color`.

####formula####

A string which represents the way in which the mapped command should *look*.

```json
{
  "command": "git",
  "alias": "g",
  "mappings": [{
    "command": "push",
    "alias": "p",
    "formula": "%command% %1% %2% %options%",
    "always": "--tag",
    "default": "origin master"
  }]
}
```

`g p origin master` will map to `git push origin master --tag`.

`g p` will map to `git push origin master --tag` as well.

Formulas provide a few built in values:

- `%command%` the mapped value of the command.
- `%always%` the mapped value of the always property.
- `%default%` the mapped value of the default property.
- `%options%` the mapped value of all the alias' options.
- `%args%` the mapped value of all the arguments in the alias.
- `%1%` .. `%n%` any % escape with a number mapps to the argument at index %n%.

Mapping Givens
==============

Any option/switch/argument that is passed to the mapping function which does
not have a corresponding entry in the mapping option object will be automatically
appended to the given command i.e. given:

```json
{
  "command": "git",
  "alias": "g",
  "default": "help"
}
```

`g push origin master` will map to `git push origin master`.

`g commit -am` will map to `git commit -a -m`.

`g diff --unified=8` will map to `git diff --unified=8`.

`g diff -U8` will map to `git diff -U8`.

`g checkout -b branch` will map to `git checkout -b branch`.

And so on.
