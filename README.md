# mix.it

CoffeeScript/JavaScript mix-in utilities. Patches `Function.prototype` with methods:

* `mixinto_proto(mixin)`
* `mixinto_class(mixin)`
* `mixin_blended(classmixin: classmixin, protomixin: protomixin)`

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