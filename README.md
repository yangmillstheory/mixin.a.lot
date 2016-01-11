# mixin.a.lot

[![Build Status](https://travis-ci.org/yangmillstheory/mixin.a.lot.svg?branch=master)](https://travis-ci.org/yangmillstheory/mixin.a.lot)

[![Join the chat at https://gitter.im/yangmillstheory/mixin.a.lot](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/yangmillstheory/mixin.a.lot?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## What is it?

A small [aspect-oriented](https://en.wikipedia.org/wiki/Aspect-oriented_programming) JavaScript mixin API.

You can run it in [node](https://nodejs.org/), or in the [browser](http://browserify.org/), and install it via [NPM](https://www.npmjs.com/package/mixin-a-lot).

## Why use it?

- You can advise mixin behavior with your own functions.
- You can advise the mixing process with your own functions.
- You can opt-out of mixin data and behavior.
- It has no dependencies.

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

#### Mixing

A mixin is just a plain old JavaScript object. Mix it into your object, function or prototype.

```javascript
class Thing {};

let mixin = {
  shared() {
    // ...
  }
};

// mix into a Function
mixin_a_lot.mix(Thing, mixin);
Thing.shared(...);

// or mix into its prototype
mixin_a_lot.mix(Thing.prototype, mixin);
new Thing().shared();

// or mix into a random object
let object = {...};
mixin_a_lot.mix(object, mixin);
object.shared();
```

Any mixed-in functions will always be called on the target context.

#### Adapters

Take

```javascript
let logger_mixin = {
  err_log: '/logs/app.err',
  inf_log: '/logs/app.log',
  
  log: function(log_event) {
    let {error, message} = log_event;
    if (error) {
      fs.writeFile(this.err_log, this.logname + ':' + level + ':' + message); 
    } else {
      fs.writeFile(this.inf_log, this.logname + ':' + level + ':' + message);
    }
  },
};
```

as a starting point.

You can write adapters to mixin methods.

```javascript
let logger = {
  logname: 'prefix_logger'
}

let prefix_message = function(error, message) {
  let prefix;
  if (!error) {
    prefix = 'INFO';
  } else {
    prefix = 'ERROR';
    if (!message) {
      message = error.message;
    }
  }
  return {error: !!error, message: `${prefix}:${message}`};
};

mixin_a_lot.mix(logger, logger_mixin, {
  pre_method_advice: {
    log: prefix_message,
  },
});

// writes 'prefix_logger:ERROR:error connecting to DB' to /logs/app.err
myLogger.log(new IOError('error connecting to DB'));
 
// writes 'prefix_logger:INFO:request @ /user/:id from yangmillstheory' to /logs/app.log
myLogger.log(null, 'request @ /user/:id from ${user}'); 
```

Adapters will be called on the target context or after the mixin method.
 
An example of an post-mixin-method adapter can be seen [here](https://github.com/yangmillstheory/mixin.a.lot/blob/master/src/index.spec.ts#L363). It logs messages written to disk to `console` too. 

#### Pre/post Mixing Hooks

Each mixin can specify pre/post-mixing procedures. 

This is a good place to run validations, set some default properties, or run finalizing routines.

```javascript
// mixins/logger.js
let loggers = new WeakSet(); // ES6 only

let logger_mixin = {
  // as before
};

logger.pre_mixing_hook = function() {
  if (typeof this.logname !== 'string') {
    throw new TypeError(`Expected string logname; got ${this.logname}`);
  }
};

logger.post_mixing_hook = function(target) {
  // track all loggers, for example
  loggers.add(target);
};
```

#### Opting out

You want some shared data or behavior, but not all of it.

```javascript
mixin_a_lot.mix(mixee, {
  method1() {
    // ...
  },
  
  method2() {
    // ...
  },
  
  foo: true,
}, {
  omit: ['method1', 'method2']
});
mixee.method1 // undefined
mixee.method2 // undefined
mixee.foo     // true
```

Or, you want to override some data or behavior.

```javascript
let mixin = {
  name: 'mixin'
  say() {
    console.log(this.name);
  },
};
let target = {
  name: 'target'
};

mixin_a_lot.mix(target, mixin, {omit: ['name']});
target.say() // 'target'

// probably not what you want
mixin_a_lot.mix(target, mixin);
target.say() // 'mixin'
```


**[Tests for all these examples can be found here.](https://github.com/yangmillstheory/mixin.a.lot/blob/master/src/index.spec.ts)**

## API

#### <a name="mix"></a>mix(target: Object, mixin: IMixin, [options: Object], [...mixing_arguments: any[]])

Mix own properties from `mixin` into `target`. `options` can be an object literal with

* `omit`: array of strings which are property names of `mixin` to exclude from mixing
* `pre_method_advice`: object literal mapping mixin method names to adapters to them
* `post_method_advice`: object literal mapping mixin method names to adapters from them

`mixin` can have two special properties

* `pre_mixing_hook`: function invoked on `mixin` immediately before mixing (but after `mix` is called) with `target` as the argument
* `post_mixing_hook`: function invoked on `mixin` immediately after mixing (but before `mix` returns) with `target` as the argument

These properties will not be copied into `target`.


## Development

**Development is in `snake_case` TypeScript.**

Get the source:

    $ git clone git@github.com:username/mixin.a.lot.git

Install dependencies:

    $ cd mixin.a.lot && sudo npm i

Develop (watch for changes and execute tests):

    $ ./node_modules/.bin/gulp dev

To see all the available tasks:

    $ ./node_modules/.bin/gulp -T


## License

MIT © 2016, Victor Alvarez
