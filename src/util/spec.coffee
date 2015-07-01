_ = require 'underscore'
{Mixin, errors} = require '../mixinfactory'


beforeOnce = (fn) ->
  beforeEach _.once(fn)


###
  Mixin factory for tests. Note that anything spied on should be added
  after the Mixin.from_obj, since they need to be modified by jasmine.
###
MIXINS =

  FREEZE: false

  schematized_protomixin: (schema = ['special_key']) ->
    mixin = Mixin.from_obj
      name: 'Schematized Example Mixin'
      foo: 'bar'
      , @FREEZE
    mixin.premixing_hook = ->
      for key in schema || ['special_key';]
        unless @[key]?
          throw new errors.NotImplemented "Wanted schema key #{key}"
      @modified_proto = true
    mixin

  default_protomixin: ->
    mixin = Mixin.from_obj
      name: 'Default Example Mixin'
      foo: 'foo'
      bar: 1
      baz: ->
        [@foo]
      , @FREEZE
    mixin.postmixing_hook = ->
      @modified_proto = true
    mixin

module.exports = {beforeOnce, _, MIXINS}
