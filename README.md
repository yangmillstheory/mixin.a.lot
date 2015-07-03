# mixin.a.lot

[![Build Status](https://travis-ci.org/yangmillstheory/mixin.a.lot.svg?branch=master)](https://travis-ci.org/yangmillstheory/mixin.a.lot)

A CoffeeScript-developed JavaScript mixin framework.

### Introduction ###

![mixin.a.lot logo](images/icon.jpg)

I like big closures and I cannot lie.

*mixin.a.lot* is a lightweight JavaScript mixin library implemented in [CoffeeScript](http://www.coffeescript.org) that tries to "get it right'.

It's guided by the following ideas:

Mixins should:

* be lightweight, immutable objects without a complex class hierarchy
* assume nothing about the classes/objects they're being mixed into
* not interfere with existing class hierarchies
* [be customizable by using message hooks, not calls to `super`](https://en.wikipedia.org/wiki/Composition_over_inheritance)

Callers should:

* be able to opt-out of some mixin functionality
* be able to attach hooks to the mixing process
* [know if they're consuming the API incorrectly as early as possible](http://blog.codinghorror.com/fail-early-fail-often/) 

### Usage & Examples ###

...
   
