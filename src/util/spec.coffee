_ = require 'underscore'
Mixin = require '../mixinfactory'


beforeOnce = (fn) ->
  beforeEach _.once(fn)


MIXINS =

  _default: ->
    Mixin.from_obj
      name: 'Default Example Mixin'
      bar: 1
      baz: ->
        [@foo]

  _schematized: ->
    Mixin.from_obj
      name: 'Schematized Example Mixin'
      foo: 'bar'

  # attach this to either post_protomixin or post_classmixin
  _postmixin_hook: (schema = ['special_key']) ->
    schema = ['special_key']

    for key in schema
      unless @[key]?
        throw new TypeError("Wanted schema key #{key}")

  schematized_protomixin: ->
    mixin = @_schematized()
    mixin.post_protomixin = @_postmixin_hook
    mixin

  default_protomixin: ->
    @_default()

module.exports = {beforeOnce, _, MIXINS}
