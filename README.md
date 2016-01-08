# mixin.a.lot

[![Build Status](https://travis-ci.org/yangmillstheory/mixin.a.lot.svg?branch=master)](https://travis-ci.org/yangmillstheory/mixin.a.lot)

[![Join the chat at https://gitter.im/yangmillstheory/mixin.a.lot](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/yangmillstheory/mixin.a.lot?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## What is it?

An [aspect-oriented](https://en.wikipedia.org/wiki/Aspect-oriented_programming) JavaScript mixin library implemented in [TypeScript](http://www.typescriptlang.org/) with no runtime dependencies.

You can run it in [node](https://nodejs.org/), or in the [browser](http://browserify.org/), and install it via [NPM](https://www.npmjs.com/package/mixin-a-lot).

## Why use it?

1. It has no dependencies
2. You can use it without your protoype chain being mangled
3. You can opt-out of some mixin functionality
4. You can [advise](https://en.wikipedia.org/wiki/Advice_(programming)) the mixing process
3. You can advise individual mixin methods

## Install

    $ npm install mixin-a-lot
    
## Usage & Examples

Import the module:

```javascript
var mixin_a_lot = require('mixin-a-lot');
```

A mixin is just a plain old JavaScript object. 

```javascript
var logger = {
    logname: "Default Logname",
    log: function(log_object) {
        ...
    },
};

```
(You don't actually need to hold onto it; it's just useful for the exposition here.)

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

A subset of mixin methods/properties can be omitted (but not all):

```javascript
var mixee = {...};
mixin_a_lot.mix(mixee, mixin, {
    omits: ['logname']
});
mixee.logname // undefined
```

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

mixin_a_lot.mix(MyLogger, logger, {
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

You can advise the mixing process.

```javascript
mixin_a_lot.mix(MyLogger.prototype, logger, {
    post_mixing_advice: function(arg1, arg2) {
        // `this` points to Thing.prototype; additional
        // arguments can be specified variadically
        if (!this.hasOwnProperty('logfilePath')) {
          this.logfilePath = './logs/nodeserver.log';
        }
    };
}, 'arg1', 'arg2');
```

Optional arguments to the mixing advice are passed starting with the third parameter.

## API

Given the following setup:

```javascript
var m = require('mixin-a-lot');
```

### <a name="mix"></a> m.mix({Object|Function} target, Object mixin, [Object options], [...mixing_arguments])

Mix own properties from `mixin` into `target`, which should be a non-null `Object` or `Function`. `options` can be an object literal with:

* `omits`: `Array` of `Strings` which are properties of `mixin` to exclude from mixing
* `pre_method_advice`, `post_method_advice`: object literal mapping mixin method names to callbacks, which are invoked before or after the mixin method on `target`
* `pre_mixing_advice`, `post_mixing_advice`: callbacks that fire before and after the mixing process. `mixing_arguments` can be passed variadically to these

## Development

**Development is in `snake_case` TypeScript.**

Get the source:

    $ git clone git@github.com:yangmillstheory/mixin.a.lot.git

Install dependencies:

    $ cd mixin.a.lot && sudo npm install
    $ node_modules/.bin/tsd install

Develop (watch for changes and execute tests):

    $ ./node_modules/.bin/gulp dev

To see all the available tasks:

    $ ./node_modules/.bin/gulp -T

## License

MIT © 2016, Victor Alvarez
