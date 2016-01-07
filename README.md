# mixin.a.lot

[![Build Status](https://travis-ci.org/yangmillstheory/mixin.a.lot.svg?branch=master)](https://travis-ci.org/yangmillstheory/mixin.a.lot)

[![Join the chat at https://gitter.im/yangmillstheory/mixin.a.lot](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/yangmillstheory/mixin.a.lot?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)


**mixin.a.lot** is an [aspect-oriented](https://en.wikipedia.org/wiki/Aspect-oriented_programming) JavaScript mixin library implemented in [TypeScript](http://www.typescriptlang.org/) with no runtime dependencies.

You can run it in [node](https://nodejs.org/), or in the [browser](http://browserify.org/), and install it via [NPM](https://www.npmjs.com/package/mixin-a-lot).

Goals for library:

1. no dependencies
2. mixin clients should be able to customize mixin methods without calls to `super`
3. mixin clients should have their prototype chain modified

Goals for users:

1. should be able to opt-out of some mixin functionality
2. should be able to advise the mixing process
3. should be able to advise individual mixin methods

## Usage & Examples

### Install

Get the latest build:

    $ npm install mixin-a-lot


A mixin is just a plain old JavaScript object. 

```javascript
var logger = {
    logname: "Default Logname",
    log: function(log_object) {
        ...
    },
};

```
You don't actually need to hold onto it; it's just useful for the exposition here.

Import the module:

```javascript
var mixin_a_lot = require('mixin-a-lot');
```


### Mixing

Mix it into your object, function or function prototype.
```javascript
var MyLogger = function() {};

// mix into the Function
mixin_a_lot.mix(MyLogger, logger);
MyLogger.log(...);

// or mix into the prototype
mixin_a_lot.mix(MyLogger.prototype, logger);
var myLogger = new MyLogger
myLogger.log(...);

// or mix into a random object
var thing = {...};
mixin_a_lot.mix(thing, logger);
thing.log(...);
```

### <a name="mix-options"></a> Mix options

A subset of mixin methods/properties can be omitted (but not all):

```javascript
var mixee = {...};
mixin_a_lot.mix(mixee, mixin, {
    omits: ['logname']
});
mixee.logname // undefined
```

### <a name="mixin-method-advice"></a> Mixin Method Advice

You can [advise](https://en.wikipedia.org/wiki/Advice_(programming)) any mixin method. It'll always be called on the target context.

Return values are propagated accordingly when advising:

```javascript
// the return value from this hook is passed to logger.log
// 'this' is the MyLogger function.
var pre_log = function(error) {
    var level, serialized;
    if (error instanceof Critical) {
        level = 'critical';
    } else if (error instanceof SyntaxError) {
        level = 'error';
    } ...
    serialized = this._serialize_error(error);
    return {level: level, serialized_error: serialized};
};
mixin_a_lot.mix(MyLogger, mixin, {
    pre_method_advice: {log: pre_log, ...}
});

// return value from log is passed here;
// 'this' is a MyLogger instance now
var post_log = function(log_return_value) {
    // do something with the return value of .log()
};
mixin_a_lot.mix(MyLogger.prototype, logger, {
    post_method_advice: {log: post_log}
});
```

### <a name="mixing-advice"></a> Mixing Advice

Users can specify pre- and post- mixing callbacks called before and after mixing (resp.) with the target context.

```javascript
mixin_a_lot.mix(MyLogger.prototype, mixin, {
    post_mixing_advice: function(arg1, arg2) {
        // do something useful; finalize the mixing.
        // `this` points to Thing.prototype; additional
        // arguments can be specified variadically
    };
}, 'arg1', 'arg2');
```

Like [above](#mixin-method-advice), `this` in mixing callbacks always points to the mix target.

Optional arguments to the mixing callbacks are passed starting with the third parameter.

## API

Given the following setup:

```javascript
var m = require('mixin-a-lot');
```

### <a name="mix"></a> m.mix({Object|Function} target, Object mixin, [Object options], [...mixing_arguments])

Mix properties from `mixin` into `target`, which should be a non-null `Object` or `Function`. Optional `options` can be an object literal conforming to the following schema:

* `omits`: `Array` of `Strings` which are properties of `mixin` to exclude from mixing
* `pre_method_advice`, `post_method_advice`: object literal mapping mixin method names to callbacks, which are invoked on before or after the mixin method on `target`, [as above](#mixin-method-advice).
* `pre_mixing_advice`, `post_mixing_advice`: callbacks that fire before and after the mixing process. `mixing_arguments` can be passed variadically to these.

## Development

**Development is in `snake_case` TypeScript.**

Get the source:

    $ git clone git@github.com:yangmillstheory/mixin.a.lot.git

Install dependencies:

    $ cd mixin.a.lot && sudo npm install
    $ node_modules/.bin/tsd install # optional - install type definitions

Develop (watch for changes and execute tests):

    $ ./node_modules/.bin/gulp dev

To see all the available tasks:

    $ ./node_modules/.bin/gulp -T

## License

MIT © 2015, Victor Alvarez
