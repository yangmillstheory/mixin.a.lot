# mixin.a.lot

[![Build Status](https://travis-ci.org/yangmillstheory/mixin.a.lot.svg?branch=master)](https://travis-ci.org/yangmillstheory/mixin.a.lot)

A CoffeeScript-developed JavaScript mixin framework.

## Introduction ##

![mixin.a.lot logo](images/icon.jpg)

I like big closures and I cannot lie.

**mixin.a.lot** is a lightweight JavaScript mixin library implemented in [CoffeeScript](http://www.coffeescript.org).

### Guiding Principles ###

Mixins should

* be lightweight, immutable objects without a complex class hierarchy
* assume nothing about the classes/objects they're being mixed into
* not interfere with existing class hierarchies
* [be customizable by using message hooks, not calls to `super`](https://en.wikipedia.org/wiki/Composition_over_inheritance)

Mixing classes should

* be able to opt-out of some mixin functionality
* be able to attach hooks to the mixing process
* [know if they're consuming the API incorrectly as early as possible](http://stackoverflow.com/a/2807375/2419669) 

## Usage & Examples ##

...

## Development ##

Get the source code.

    $ git clone git@github.com:yangmillstheory/mixin.a.lot.git

Install dependencies:
    
    $ cd mixin.a.lot && sudo npm install
    
Compile CoffeeScripts into `build/`:

    $ ./node_modules/.bin/gulp coffee
   
Run unit tests:

    $ .node_modules/.bin/jasmine jasmine.coffee

To clean the build, compile, and test, use:

    $ npm test
    
TODO: deployment and release instructions
   
## License ##

MIT © Victor Alvarez