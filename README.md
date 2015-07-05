# mixin.a.lot

[![Build Status](https://travis-ci.org/yangmillstheory/mixin.a.lot.svg?branch=master)](https://travis-ci.org/yangmillstheory/mixin.a.lot)

A CoffeeScript-developed JavaScript mixin framework.

## Introduction ##

**mixin.a.lot** is a JavaScript mixin library implemented in [CoffeeScript](http://www.coffeescript.org). 

Its only dependency is [underscore.js](http://underscorejs.org/). You can run it in [node](https://nodejs.org/), or in the browser (a ["browserified"](http://browserify.org/) version is provided in the distribution).

Goals for `Mixins`: 

1. should be lightweight and immutable without a complex class hierarchy
2. [should be customizable with message hooks - not calls to `super`](https://en.wikipedia.org/wiki/Composition_over_inheritance)
3. should not assume anything about the classes/objects they're being mixed into
4. should allow the mixed-into class to preserve the existing class hierarchy and MRO (method resolution order) (see 2.) 

Goals for mixing classes:

1. should be able to opt-out of some mixin functionality
2. should be able to attach hooks to the mixing process
3. [should know if they're misusing the API as early as possible](http://stackoverflow.com/a/2807375/2419669)

## Usage & Examples ##

First, turn it on:

    var Mixin = require('mixin-a-lot');
    
    Mixin.enable_protomixing();
    Mixin.enable_classmixing();
       
Make a mixin. The only required property is `name`, and the only way to do this is through the factory.

    var logger = Mixin.make({
        name: "Logger",
        logname: "Default Logname",
        log_info: function(error) {...},
        log_debug: function(error) {...},
        log_error: function(error) {...},
        log_warning: function(error) {...},
    });

To mix:

    var Thing = function() {};
    
    Thing.mixinto_class(mixin); // mix into the class (the Thing Function instance)
    Thing.mixinto_class(mixin); // mix into the prototype: Thing.prototype
    
A subset of mixin methods/properties can be omitted (but not all!):
    
    Thing.mixinto_proto(mixin, {
        omits: ['log_error', 'log_warning']
    });
    
You can request before and after hooks into mixin methods; make sure to implement a requested hook before mixing. 

Return values are propagated [accordingly](http://www.catb.org/~esr/writings/taoup/html/ch01s06.html#id2878339).
    
    // the return value from this hook is passed to log_error
    Thing.before_log_error = function(error) {
        return this._serialize_error(error || this._trapped_error); 
    };
    Thing.mixinto_class(mixin, {
        hook_before: ['log_error']
    });
    
    
    // return value from log_error is passed to this hook
    Thing.prototype.after_log_error = function(serialized_error) {
        // do something with logged serialized error (assuming log_error returns it)
    };
    Thing.mixinto_proto(mixin, {
        hook_after: ['log_error']
    });
    
Mixins can have pre-mixing and post-mixing hooks that fire before and after mixing (resp.) with the class or prototype context.

There are two (not mutually exclusive ways to specify them) They can be attached to the mixin 

    var mixin = Mixin.make({
        name: "Logger",
           
        // various methods that operate on this.logname    
        
        premixing_hook: function() {
            if (!this.logname) {
                throw new Error("Can't log without a logname!");
            }
        }
    });
   
or specified on a per-mixing basis via the options hash. (If both are specified, the hooks from the options hash take precedence.) 

`this` in mixing hooks always point to the prototype or the class, depending on whether `mixinto_proto` or `mixinto_class` was invoked. 
    
    Thing.mixinto_proto(mixin, {
        postmixing_hook: function(arg1, arg2) {
            // do something useful; finalize the mixing.
            // `this` points to Thing.prototype;
            // arguments are optionally specified via an optional array as below
        };
    }, ['arg1', 'arg2']);
    
Optional arguments to the mixing hooks are passed via the third parameter. 

## API ##



## Development ##

Get the source code.

    $ git clone git@github.com:yangmillstheory/mixin.a.lot.git

Install dependencies:
    
    $ cd mixin.a.lot && sudo npm install
    
Compile CoffeeScripts into `dist/`:

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