# mixin.a.lot

[![Build Status](https://travis-ci.org/yangmillstheory/mixin.a.lot.svg?branch=master)](https://travis-ci.org/yangmillstheory/mixin.a.lot)

**mixin.a.lot** is a JavaScript mixin library implemented in [CoffeeScript](http://www.coffeescript.org).

Its only dependency is [underscore.js](http://underscorejs.org/). You can run it in [node](https://nodejs.org/), or in the [browser](http://browserify.org/), and install it via [NPM](https://www.npmjs.com/package/mixin-a-lot).

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

Get the latest build:

    $ npm install mixin-a-lot
    
Turn it on:

    var mixin_a_lot = require('mixin-a-lot');
    
    mixin_a_lot.enable_protomixing();
    mixin_a_lot.enable_staticmixing();

### Make a mixin

Make a mixin; `name` and at least one other property is required. The only way to make new instances is through the factory.

    var logger = mixin_a_lot.make_mixin({
        name: "Logger",
        logname: "Default Logname",
        log: function(log_object) {
            ...
        },
    });

### Mix a mixin

Mix a mixin into your class or class's prototype. Mixins must be `Mixin` instances.

    var Thing = function() {};
    
    Thing.static_mix(mixin); // mix into Thing
    Thing.proto_mix(mixin); //  mix into Thing.prototype

### <a name="mixin-method-hooks"></a> Mix options & mixin method hooks

A subset of mixin methods/properties can be omitted (but not all):
    
    Thing.proto_mix(mixin, {
        omits: ['logname']
    });
    
You can request before and after hooks into mixin methods; make sure to implement a requested hook before mixing. 

Return values are propagated [accordingly](http://www.catb.org/~esr/writings/taoup/html/ch01s06.html#id2878339) - it's best to use an object or container class argument (as below) when propagating multiple return values.
    
    // the return value from this hook is passed to log_error
    Thing.before_log = function(error) {
        var level, serialized;
    
        if (error instanceof Critical) {
            level = 'critical';
        } else if (error instanceof SyntaxError) {
            level = 'error';
        } ...
        
        serialized = this._serialize_error(error); 
        
        return {level: level, serialized_error: serialized}; 
    };
    Thing.static_mix(mixin, {
        before_hook: ['log']
    });
    
    
    // return value from log_error is passed to this hook
    Thing.prototype.after_log = function(log_object) {
        // do something with log_object.level and log_object.serialized error (assuming log_error returns it)
    };
    Thing.proto_mix(mixin, {
        after_hook: ['log']
    });

### <a name="mixing-hooks"></a> Mixing hooks
    
`Mixins` can have pre-mixing and post-mixing hooks that fire before and after mixing (resp.) with the class or prototype context.

There are two not mutually exclusive ways to specify them. They can be attached to the mixin 

    var mixin = mixin_a_lot.make_mixin({
        name: "Logger",
           
        // various methods that operate on this.logname    
        
        premix: function() {
            if (!this.logname) {
                throw new Error("Can't log without a logname!");
            }
        }
    });
   
or specified on a per-mixing basis via the options hash.  
    
    Thing.proto_mix(mixin, {
        postmix: function(arg1, arg2) {
            // do something useful; finalize the mixing.
            // `this` points to Thing.prototype;
            // arguments are optionally specified via an optional array as below
        };
    }, ['arg1', 'arg2']);
    
If specified in both places, the hooks from the options hash run before the ones from the mixin. 

`this` in mixing hooks always points to the prototype or the class (the `Function`), depending on whether `proto_mix` or `static_mix` was invoked.

Optional arguments to the mixing hooks are passed via the third parameter.  

## API

Given the following setup:

    var m = require('mixin-a-lot');
    
    m.enable_staticmixing();
    m.enable_protomixing();


### m.enable_staticmixing(), m.enable_protomixing()

Attach `static_mix`, `proto_mix` methods on `Function.prototype`. These properties are [non-enumerable, non-configurable, non-writable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty).

**Aliases:** `enable_staticmixing`: `enable_classmixing`. Deprecated in `1.1.1`.

### m.make_mixin(Object mixin_properties, [Boolean freeze])

Make a `Mixin` from an object literal with at least a `String name` property. 

If `freeze` is not false, `NotMutable` is thrown whenever there's an attempt to mutate a mixin property.

If `freeze` is false, the returned `Mixin` will still throw `NotMutable` for the supplied properties, but new properties can now be added and deleted.

`premix` and `postmix` can optionally be [supplied as above](#mixing-hooks), with aliases `premixing`, `premixing_hook`, and `postmixing`, `postmixing_hook`, resp.

The returned `Mixin` has a property `mixin_keys`, which is an `Array` of property names that will mix into a mixing class; of course, these names don't include `name`.

### <a name="mixinto-proto"></a> Function.prototype.proto_mix(Mixin mixin, [options], [hook_args])

Mix properties from the Mixin into the prototype of the mixing class. Optional `options` should be an object literal conforming to the following schema:
 
* `omits`: `Array` of `Strings` which are properties of the mixin to exclude from mixing
* `before_hook`, `after_hook`: `Array` of `Strings` which are mixin methods to hook before or after. Make sure to have the method hooks defined before invocation, [as above](#mixin-method-hooks).
    * **aliases:** `hook_before`, `hook_after`, resp. 
* `postmix`, `premix`: `Functions` that fire before and after the mixing process, [as above](#mixing-hooks).
    * **aliases:** `postmixing`, `postmixing_hook`, and `premixing`, `premixing_hook`, resp.

Mixing hooks defined via `options` are invoked before those mixing hooks defined in the mixin. `hook_args` are passed to supplied mixing hooks, if any.

**Aliases:** `mixinto_proto`

### Function.prototype.static_mix(Mixin mixin, [options], [hook_args])

Same as [proto_mix](#mixinto-proto), except mixing applies to the calling `Function`.

For more detail, browse through the `*.spec.coffee` unit tests in `src`. 

**Aliases:** `mixinto_class`. Deprecated in `1.1.1`.

## Development

**Development is in `snake_case` CoffeeScript.**

Get the source.

    $ git clone git@github.com:yangmillstheory/mixin.a.lot.git

Install dependencies.
    
    $ cd mixin.a.lot && sudo npm install
    
Compile CoffeeScripts into `dist/`.

    $ ./node_modules/.bin/gulp coffee

Build - remove `dist/` and re-compile CoffeeScript.

    $ ./node_modules/.bin/gulp build
   
Run unit tests.

    $ .node_modules/.bin/jasmine jasmine.coffee

Re-build and test.

    $ npm test 
   
## License

MIT © 2015, Victor Alvarez
