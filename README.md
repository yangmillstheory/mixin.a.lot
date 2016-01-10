# mixin.a.lot

[![Build Status](https://travis-ci.org/yangmillstheory/mixin.a.lot.svg?branch=master)](https://travis-ci.org/yangmillstheory/mixin.a.lot)

[![Join the chat at https://gitter.im/yangmillstheory/mixin.a.lot](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/yangmillstheory/mixin.a.lot?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## What is it?

A small composable JavaScript mixin API.

You can run it in [node](https://nodejs.org/), or in the [browser](http://browserify.org/), and install it via [NPM](https://www.npmjs.com/package/mixin-a-lot).

## Why use it?

1. It has no dependencies.
2. You can compose mixin methods with your own functions.
3. You can advise the mixing process.
4. You can use it without your protoype chain being mangled. 
5. You can opt-out of some mixin functionality.

## Install

```shell
$ npm i mixin-a-lot
```
    
## Usage & Examples

Import the module:

```javascript
import {mix} from 'mixin-a-lot';
```

A mixin is just a plain old JavaScript object. 

```javascript
let acts_as_logger = {
    logname: null,
    log: function(log_object) {
        ...
    },
};

```

Mix it into your object, function or prototype.
```javascript
class MyLogger {};

// mix into the Function
mixin_a_lot.mix(MyLogger, acts_as_logger);
MyLogger.log(...);

// or mix into the prototype
mixin_a_lot.mix(MyLogger.prototype, acts_as_logger);
let myLogger = new MyLogger
myLogger.log(...);

// or mix into a random object
let thing = {...};
mixin_a_lot.mix(thing, acts_as_logger);
thing.log(...);
```

A subset of mixin methods/properties can be omitted (but not all):

```javascript
let mixee = {
  ...,
  some_method: function() {
    console.log('own implementation');
  },
  ...
};

mixin_a_lot.mix(mixee, mixin, {
  omit: ['some_method']
});
mixee.some_method // 'own implementation'
```

You can compose against mixin methods; the context will always be the target.

Return values are propagated when advising.

```javascript
// the return value from this hook is passed to logger.log
// 'this' is the MyLogger function.
let pre_log = function(message, error) {
  let level;
  if (error instanceof CriticalError) {
    level = 'critical';
  } else if (error instanceof SyntaxError) {
    level = 'error';
  } ...
  return {level: level, message: message, error: error};
};

mixin_a_lot.mix(MyLogger, acts_as_logger, {
    pre_method_advice: {log: pre_log, ...}
});

// return value from acts_as_logger.log is passed;
// 'this' is a MyLogger instance now
let post_log = function(log_return_value) {
  // do something with the return value of .log()
};

mixin_a_lot.mix(MyLogger.prototype, acts_as_logger, {
  pre_method_advice: {log: pre_log},
  post_method_advice: {log: post_log},
});
```

You can also advise the mixing process via the mixin. It's a good chance to run validations or set default properties.


```javascript
let myLogger = {};
 
acts_as_logger.pre_mixing_hook = function() {
  if (!this.logname) {
    this.logname = 'Default Logger';
  }
};

acts_as_logger.post_mixing_hook = function() {
  if (!this.logfile_path) {
    this.logfile_path = './logs/nodeserver.log';
  }
};

mixin_a_lot.mix(myLogger, acts_as_logger);

myLogger.log('Hello, World!'); // logs 'Default Logger: Hello, World!' to ./logs/nodeserver.log
```

## API

Given

```javascript
import {mix} from 'mixin-a-lot';
```

### <a name="mix"></a> mix({Object|Function} target, Mixin mixin, [Object options], [...mixing_arguments])

Mix own properties from `mixin` into `target`, which should be a non-null `Object` or `Function`. `options` can be an object literal with

* `omit`: `Array` of `Strings` which are properties of `mixin` to exclude from mixing
* `pre_method_advice`, `post_method_advice`: object literal mapping mixin method names to callbacks, which are invoked before or after the mixin method on `target`

`mixin` can have special properties

* `pre_mixing_hook`, `post_mixing_hook`: callbacks that fire before and after the mixing process

These properties will not be copied into `target`.


## Development

**Development is in `snake_case` TypeScript.**

Get the source:

    $ git clone git@github.com:username/mixin.a.lot.git

Install dependencies:

    $ cd mixin.a.lot && sudo npm install
    $ node_modules/.bin/tsd install

Develop (watch for changes and execute tests):

    $ ./node_modules/.bin/gulp dev

To see all the available tasks:

    $ ./node_modules/.bin/gulp -T


## License

MIT © 2016, Victor Alvarez
