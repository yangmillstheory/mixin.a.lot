_ = require 'underscore'


beforeOnce = (fn) ->
  beforeEach _.once(fn)


MIXINS =

  default: ->
    foo: 'bar'
    bar: 1
    baz: ->
      [@foo]

  schematized: ->
    schema: ['special_key']

  # ...
  # mixin methods that act on @special_key
  # ..

  # attach this to either post_protomixin or post_classmixin
  postmixin_hook: ->
    for key in @schema
      unless @[key]?
        throw new TypeError("Wanted schema key #{key}")


module.exports = {beforeOnce, _, MIXINS}