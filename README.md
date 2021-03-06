# mixin.a.lot

[![Build Status](https://travis-ci.org/yangmillstheory/mixin.a.lot.svg?branch=master)](https://travis-ci.org/yangmillstheory/mixin.a.lot)

[![Join the chat at https://gitter.im/yangmillstheory/mixin.a.lot](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/yangmillstheory/mixin.a.lot?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)


## What is it?

A small composable JavaScript mixin API.

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

Any mixed-in functions will always be called on the target context.

```javascript
class Person {
  constructor(name) {
    this.name = name;
  }
};

let named = {
  sayName() {
    console.log(this.name);
  }
};

// mix into a Function
mix(Person, named);
Person.sayName(); // 'Person'

// or mix into its prototype
mix(Person.prototype, named);
new Person('Victor').sayName(); // 'Victor' 

// or mix into a random object
let object = {name: 'object'};
mix(object, named);
object.sayName(); // 'object'
```

#### Adapters

Take

```javascript
let loggerMixin = {
  errLog: '/logs/app.err',
  infLog: '/logs/app.log',
  
  log: function(logEvent) {
    let {didError, message} = logEvent;
    if (didError) {
      fs.writeFile(this.errLog, `${this.logname}:${message}`); 
    } else {
      fs.writeFile(this.infLog, `${this.logname}:${message}`);
    }
  },
};
```

as a starting point.

You can write adapters to and from mixin methods.

```javascript
let logger = {
  logname: 'prefix_logger'
};

let prefixMessage = function(error, message) {
  let prefix;
  if (!error) {
    prefix = 'INFO';
  } else {
    prefix = 'ERROR';
    if (!message) {
      message = error.message;
    }
  }
  return {didError: !!error, message: `${prefix}:${message}`};
};

mix(logger, loggerMixin, {
  adapterTo: {
    log: prefixMessage,
  },
});

// writes 'prefix_logger:ERROR:error connecting to DB' to /logs/app.err
myLogger.log(new IOError('error connecting to DB'));
 
// writes 'prefix_logger:INFO:request @ /user/:id from yangmillstheory' to /logs/app.log
myLogger.log(null, `request @ /user/:id from ${user}`); 
```

Adapters are called on the target context before or after the mixin method.
 
An example of an post-adapter can be seen in the tests. It logs all messages written to disk to the `console` as well.
 
Adapters can be chained, to give an execution flow like

```
pre adapter -> mixin method -> post adapter
```

#### Pre and post mixing routines

Each mixin can specify pre and post mix routines. Each routine is invoked on the context with the mixin as a target.

This is a good place to run validation, finalization, or set default properties.

```javascript
// shared/mixins/logger.js
let loggers = new WeakSet(); // ES6 only

let loggerMixin = {
  // ...
  // properties as before
  // ...
  
  // new
  premix(target) {
    if (typeof target.logname !== 'string') {
      throw new TypeError(`Expected string logname; got ${target.logname}`);
    }
  },
  
  // new
  postmix(target) {
    loggers.add(target);
  },
};
```

`premix` and `postmix` won't be mixed into the target.

#### Opting out or overriding

You want some shared data or behavior, but not all of it.

```javascript
mix(mixee, {
  method1() {
    // ...
  },
  
  method2() {
    // ...
  },
  
  foo: true,
}, {
  omit: ['method1']
});
mixee.method1 // undefined
mixee.method2 // function() { ... }
mixee.foo     // true
```

Or, you want to override some data or behavior.

```javascript
let named = {
  name: 'mixin',
  sayName() {
    console.log(this.name);
  },
};
let mixee = {
  name: 'mixee'
};

mix(mixee, named, {omit: ['name']});
mixee.sayName() // 'mixee'

// probably not what you want
mix(mixee, named);
mixee.sayName() // 'mixin'
```

**[Tests for all these examples can be found here.](https://github.com/yangmillstheory/mixin.a.lot/blob/master/src/index.spec.ts)**


## API

#### <a name="mix"></a>mix(target: Object, mixin: IMixin, options?: Object)

Mix own properties from `mixin` into `target`. `options` can be an object literal with

* `omit`: array of strings which are property names of `mixin` to exclude from mixing
* `adapterTo`: object literal mapping mixin method names to adapters *to* them
* `adapterFrom`: object literal mapping mixin method names to adapters *from* them

`mixin` can have two special properties

* `premix`: function called on `mixin` before mixing (but after `mix` is called) with `target` as the argument
* `postmix`: function called on `mixin` after mixing (but before `mix` returns) with `target` as the argument

These properties will not be copied into `target`.


## Development

**Development is in TypeScript.**

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
