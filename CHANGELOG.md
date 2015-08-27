# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [2.0.0] - 2015-08-26
### BREAKING CHANGESl
Mixin method hooks are now requested via key-value pairs of mixin methods mapping to callbacks.

This is more natural and flexible than the previous API, which requested a before/after hook for a mixin method 
via a string (the mixin method name) and required the mix target to implement a specially named method based on 
the requested method name (before_[method_name]/after_[method_name]).

Now, the mix target doesn't necessarily have to implement methods - unbound functions can be used, and the hook
will still be invoked with the right context (instance or static).

## [1.2.1] - 2015-08-23
### Changed
Nothing; bump for publish due to mistakes in versioning. 

## [1.2.0] - 2015-08-23
### Changed
Provide aliases for mixing process:
  
  * `enable_classmixing`: `enable_staticmixing`
  * `mixinto_class`: `static_mix`
  * `mixinto_proto`: `proto_mix`

This variable naming is compatible with the new [`static`](http://es6-features.org/#StaticMembers) keyword/concept in ES6.

## [1.1.0] - 2015-08-22
### Changed
Provide aliases for mixing options:
  
  * `hook_before`: `before_hook`
  * `hook_after`: `after_hook`
  * `postmixing_hook`: `postmixing`, `postmix`
  * `premixing_hook`: `premixing`, `premix`

Provide aliases for special `Mixin` properties:

  * `postmixing_hook`: `postmixing`, `postmix`
  * `premixing_hook`: `premixing`, `premix`
  
Refactored `mixer` module into three separate modules: `mixer`, `options`, `utils`. 
No tests were added, but old aliases were swapped out for new ones.