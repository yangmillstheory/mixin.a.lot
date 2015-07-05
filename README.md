# mixin.a.lot

[![Build Status](https://travis-ci.org/yangmillstheory/mixin.a.lot.svg?branch=master)](https://travis-ci.org/yangmillstheory/mixin.a.lot)

**mixin.a.lot** is a JavaScript mixin library implemented in [CoffeeScript](http://www.coffeescript.org). 

Its only dependency is [underscore.js](http://underscorejs.org/). You can run it in [node](https://nodejs.org/), or in the browser (a ["browserified"](http://browserify.org/) version is provided in the distribution).

Goals for `Mixins`: 

1. should be lightweight and immutable without a complex class hierarchy
2. [should be customizable with message hooks - not calls to `super`](https://en.wikipedia.org/wiki/Composition_over_inheritance)
3. should not assume anything about the classes/objects they're being mixed into
4. should allow the mixed-into class to preserve the existing class hierarchy and MRO (method resolution order) 

Goals for mixing classes:

1. should be able to opt-out of some mixin functionality
2. should be able to attach hooks to the mixing process
3. should be able to attach hooks to individual mixin methods
4. [should know if they're misusing the API as early as possible](http://stackoverflow.com/a/2807375/2419669)

## Usage & Examples

### Install

First, turn it on:

    var Mixin = require('mixin-a-lot');
    
    Mixin.enable_protomixing();
    Mixin.enable_classmixing();

### Make a mixin

Make a mixin. The only required property is `name`, and the only way to do this is through the factory.

    var logger = Mixin.make({
        name: "Logger",
        logname: "Default Logname",
        log_info: function(error) {...},
        log_debug: function(error) {...},
        log_error: function(error) {...},
        log_warning: function(error) {...},
    });

### Mix

Mix a mixin. Mixins must be `Mixin` instances.

    var Thing = function() {};
    
    Thing.mixinto_class(mixin); // mix into the class (the Thing Function instance)
    Thing.mixinto_class(mixin); // mix into the prototype: Thing.prototype

### Mix options & mixin method hooks <a name="mixin-method-hooks"></a>

A subset of mixin methods/properties can be omitted (but not all):
    
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

### Mixing hooks <a name="mixing-hooks"></a>
    
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

## API

Given:

    var mixin_a_lot = require('mixin-a-lot');
    
    mixin_a_lot.enable_classmixing();
    mixin_a_lot.enable_protomixing();
    
    var Thing = function () {};

### enable_classmixing(), enable_protomixing()

Attach `mixinto_class`, `mixinto_proto` methods on `Function.prototype`. These properties are [non-enumerable, non-configurable, non-writable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty).

### make(Object mixin_properties, [Boolean freeze])

Make a `Mixin` from an object literal with at least a `String name` property. 

If `freeze` is not false,`NotMutable` is thrown whenever a mixin property is mutated.

If `freeze` is false, the returned `Mixin` will still throw `NotMutable` for the supplied properties, but new properties can now be added and deleted.

`premixing_hook` and `postmixing_hook` can optionally be [supplied as above.](#mixing-hooks)

`mixin_keys` is an `Array` of property names that will mix into a mixing class; of course, these names don't include `name`.

### Function.prototype.mixinto_proto(Mixin mixin, [options], [mixinghook_args]) <a name="mixinto-proto"></a>

Mix properties from the Mixin into the prototype of your class. Optional `options` should be an object literal with allowed keys:
 
* `omits`: `Array` of `Strings` which are properties of the mixin to exclude from mixing
* `hook_before`, `hook_after`: `Array` of `Strings` which are properties of the mixin to hook before or after. Make sure to have methods `before_mixin_method`, `after_mixin_method` defined before invocation, [as above](#mixin-method-hooks).
* `postmixing_hook`, `premixing_hook`: `Functions` that fire before and after the mixing process, [as above](#mixing-hooks). These take precedence over mixing hooks defined in the mixin. 

`mixinghook_args` are passed to supplied mixing hooks, if any.

### Function.prototype.mixinto_class(Mixin mixin, [options], [mixinghook_args])

Same as [`mixinto_proto`](#mixinto-proto), except mixing applies to the calling `Function`.

## Development

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
   
## License

MIT © Victor Alvarez