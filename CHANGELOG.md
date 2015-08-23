# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

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