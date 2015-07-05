# mixin.a.lot

[![Build Status](https://travis-ci.org/yangmillstheory/mixin.a.lot.svg?branch=master)](https://travis-ci.org/yangmillstheory/mixin.a.lot)

A CoffeeScript-developed JavaScript mixin framework.

## Introduction ##

**mixin.a.lot** is a JavaScript mixin library implemented in [CoffeeScript](http://www.coffeescript.org). 

Its only dependency is [underscore.js](http://underscorejs.org/). You can run it in [node](https://nodejs.org/), or in the browser (a ["browserified"](http://browserify.org/) version is provided in the distribution).

Goals for `Mixins`: 

* should be lightweight immutable without a complex class hierarchy
* [should be customizable with message hooks, not calls to `super`](https://en.wikipedia.org/wiki/Composition_over_inheritance)
* should not assume anything about the classes/objects they're being mixed into
* should not interfere with existing class hierarchies

Goals for mixing classes:

* should be able to opt-out of some mixin functionality
* should be able to attach hooks to the mixing process
* [should know if they're misusing the API as early as possible](http://stackoverflow.com/a/2807375/2419669)
 
[NB: I write in snake-case, and I'm not planning on changing this.](http://www.cs.kent.edu/~jmaletic/papers/ICPC2010-CamelCaseUnderScoreClouds.pdf).

## Usage & Examples ##

Turn it on:

    var Mixin = require('mixin-a-lot');
    
    Mixin.enable_protomixing();
    Mixin.enable_classmixing();
       
Make a mixin (should have a `name` property). The only way to do this is through the factory.

    var mixin = Mixin.make({
        name: "Victor", 
        prop1: "foo", 
        prop2: 1, 
        doSomething: function() {...}
    });

To mix:

    var Thing = function() {};
    
    Thing.mixinto_class(mixin); // mix into the class (the Thing Function instance)
    Thing.mixinto_class(mixin); // mix into the prototype: Thing.prototype
    
A subset of mixin methods/properties can be omitted (but not all!):
    
    Thing.mixinto_proto(mixin, {
        omits: ['prop1', 'doSomething']
    });
    
You can request before and after hooks into mixin methods; make sure to implement the hook before mixing. 

Return values are propagated [accordingly](http://www.catb.org/~esr/writings/taoup/html/ch01s06.html#id2878339).
    
    // the return value from this hook is passed to doSomething
    Thing.hook_before_doSomething = function() {
        ...
    };
    Thing.mixinto_class(mixin, {
        hook_before: ['doSomething']
    });
    
    
    // return value from doSomething is passed to this hook
    Thing.prototype.hook_after_doSomething = function(doSomethingValue) {
        ...
    };
    Thing.mixinto_proto(mixin, {
        hook_after: ['doSomething']
    });
    
Mixins can have pre-mixing and post-mixing hooks that fire before and after mixing (resp.) with the class or prototype context.

They can be attached to the mixin, or specified via the options hash. If both, the hooks from the options hash take precedence. 

    var mixin = Mixin.make({
        name: "Victor", 
        prop1: "foo", 
        prop2: 1, 
        doSomething: function() {...}
        premixing_hook: 
    });
    
    

## API ##



## Development ##

Get the source code.

    $ git clone git@github.com:yangmillstheory/mixin.a.lot.git

Install dependencies:
    
    $ cd mixin.a.lot && sudo npm install
    
Compile CoffeeScripts into `build/`:

    $ ./node_modules/.bin/gulp coffee

To rebuild:

    $ ./node_modules/.bin/gulp build
   
Run unit tests:

    $ .node_modules/.bin/jasmine jasmine.coffee

To clean the build, compile, and test, use:

    $ npm test
    
TODO: deployment and release instructions
   
## License ##

MIT © Victor Alvarez