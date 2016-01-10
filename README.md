# mixin.a.lot

[![Build Status](https://travis-ci.org/yangmillstheory/mixin.a.lot.svg?branch=master)](https://travis-ci.org/yangmillstheory/mixin.a.lot)

[![Join the chat at https://gitter.im/yangmillstheory/mixin.a.lot](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/yangmillstheory/mixin.a.lot?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## What is it?

A small aspect-oriented JavaScript mixin API.

You can run it in [node](https://nodejs.org/), or in the [browser](http://browserify.org/), and install it via [NPM](https://www.npmjs.com/package/mixin-a-lot).

## Why use it?

1. It has no dependencies.
2. You can advise mixin methods with your own functions.
3. You can advise the mixing process.
4. You can opt-out of some mixin functionality.

## Install

```shell
$ npm i mixin-a-lot
```

If you want type definitions

```shell
$ tsd link
```
    
## Examples

Import the module:

```javascript
import {mix} from 'mixin-a-lot';
```

### Mixing

A mixin is just a plain old JavaScript object. 

```javascript
let logger = {
  logname: null,
  err_log: '/logs/app.err',
  inf_log: '/logs/app.log',
  log: function(log_event) {
    let {level, message} = log_event;
    if (level === 'info') {
      fs.writeFile(this.inf_log, this.logname + ':' + level + ':' + message);
    } else if (level === 'error') {
      fs.writeFile(this.err_log, this.logname + ':' + level + ':' + message); 
    } else {
      throw new Error('Expected info or error level, got ' + level);
    }
  },
};
```

Mix it into your object, function or prototype.
```javascript
class MyLogger {};

// mix into a Function
mixin_a_lot.mix(MyLogger, logger);
MyLogger.log(...);

// or mix into its prototype
mixin_a_lot.mix(MyLogger.prototype, logger);
let myLogger = new MyLogger
myLogger.log(...);

// or mix into a random object
let thing = {...};
mixin_a_lot.mix(thing, logger);
thing.log(...);
```

### Advising Mixin Behavior

You can pre/post-compose against mixin methods; the context will always be the target.

Return values are propagated when composing. Use it as an adapter:

```javascript
let myLogger = {};

// the return value is passed to logger.log
// 'this' is the MyLogger function.
let pre_log = function(error, message) {
  let level;
  if (!error) {
    level = 'info';
  } else if (error instanceof IOError) {
    level = 'error';
    message = message || error.message;
  }
  return {level, message};
};

mixin_a_lot.mix(MyLogger.prototype, logger, {
  pre_method_advice: {
    log: pre_log,
  },
});

myLogger.log(new IOError('error connecting to DB'));    // 'Default Logger: error: error connecting to DB' 
myLogger.log(null, 'request @ /user/:id from ${user}'); // 'Default Logger: info: request @ /user/:id from yangmillstheory'
```

### Advising Mixing

You can also advise the mixing process via the mixin. It's a good chance to run validations or set default properties.

```javascript
let myLogger = {};

logger.pre_mixing_hook = function() {
  if (typeof this.logname !== 'string') {
    throw new TypeError('Expected string logname; got ' + this.logname);
  }
};

logger.post_mixing_hook = function(target) {
  this.loggers.push(target);
};

mixin_a_lot.mix(myLogger, logger);
```

### Opting out

You want some shared data or behavior, but not all of it.

```javascript
mixin_a_lot.mix(mixee, mixin, {
  omit: ['method1', 'method2']
});
mixee.method1 // undefined
mixee.method2 // undefined
```

## API

Given

```javascript
import {mix} from 'mixin-a-lot';
```

### <a name="mix"></a> mix({Object|Function} target, Mixin mixin, [Object options], [...mixing_arguments])

Mix own properties from `mixin` into `target`, which should be a non-null `Object` or `Function`. `options` can be an object literal with

* `omit`: `Array` of `Strings` which are properties of `mixin` to exclude from mixing
* `pre_method_advice`, `post_method_advice`: a map of mixin method names to callbacks, invoked before or after the mixin method on `target`

`mixin` can have special properties

* `pre_mixing_hook`, `post_mixing_hook`: callbacks invoked before or after the mixing process with `target` as the argument

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
