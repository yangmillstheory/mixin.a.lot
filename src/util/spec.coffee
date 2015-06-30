_ = require 'underscore'
Mixin = require '../mixinfactory'


beforeOnce = (fn) ->
  beforeEach _.once(fn)


###
  Mixin factory for tests. Note that anything spied on should be added
  after the Mixin.from_obj, since they need to be modified by jasmine.
###
MIXINS =

  DEFAULT_FREEZE: false

  schematized_protomixin: (schema = ['special_key']) ->
    mixin = Mixin.from_obj
      name: 'Schematized Example Mixin'
      foo: 'bar'
      , @DEFAULT_FREEZE
    mixin.premixin_hook = ->
      for key in schema || ['special_key';]
        unless @[key]?
          throw new TypeError("Wanted schema key #{key}")
      @modified_proto = true
    mixin

  default_protomixin: ->
    mixin = Mixin.from_obj
      name: 'Default Example Mixin'
      bar: 1
      baz: ->
        [@foo]
      , @DEFAULT_FREEZE
    mixin.postmixin_hook = ->
      @modified_proto = true
    mixin

module.exports = {beforeOnce, _, MIXINS}
