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

  # attach this to either pre_protomixin or pre_classmixin
  _premixin_hook: (schema) ->
    schema = ['special_key']

    for key in schema
      unless @[key]?
        throw new TypeError("Wanted schema key #{key}")

  schematized_protomixin: (schema = ['special_key']) ->
    mixin = @_schematized(schema)
    mixin.premixin_hook = @_premixin_hook
    mixin

  default_protomixin: ->
    @_default()

module.exports = {beforeOnce, _, MIXINS}
