# mix.it

CoffeeScript/JavaScript mix-in.

* `mixinto_proto(mixin, options)`
* `mixinto_class(mixin, options)`
* `mixin_blended(blend, options)`

## Getting Started ##

Install the package.

    $ sudo npm install mix.it
    
Usage examples, edge cases.
    
## Development ##

    $ cd mix.it

To compile CoffeeScripts:

    $ ./node_modules/.bin/gulp coffee
    
To run tests:
    
    $ ./node_modules/.bin/coffee jasmine.coffee
    
Pull requests are welcome; pull requests with tests are even more welcome.


### TODO ###

* pre/post hooks for mixin methods
* option to omit certain methods entirely (more useful when mixin in classes, and not object literals)
* blended mixins
* mixin classes (or should they just be object literals)
* mixins should be immutable
* don't mess with existing class hierarchies (see [1](https://github.com/dentafrice/coffeescript-mixins/issues/1), [2](https://github.com/dentafrice/coffeescript-mixins/issues/2))
* [ensure bindings are always correct](https://github.com/dentafrice/coffeescript-mixins/issues/3)
