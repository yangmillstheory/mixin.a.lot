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

  _make_spieable_method: ({mixin, methodname}) ->
    mixin.mixin_keys.push methodname
    mixin[methodname] = ->
    mixin

  schematized_protomixin: (schema = ['special_key']) ->
    mixin = Mixin.from_obj
      name: 'Schematized Example Mixin'
      foo: 'foo'
      , @FREEZE
    mixin.premixing_hook = ->
      for key in schema || ['special_key';]
        unless @[key]?
          throw new errors.NotImplemented "Wanted schema key #{key}"
    mixin

  default_protomixin: ->
    mixin = Mixin.from_obj
      name: 'Default Example Mixin'
      foo: 'foo'
      bar: 1
      , @FREEZE
    mixin = @_make_spieable_method({mixin, methodname: 'baz'})
    mixin.postmixing_hook = ->
      @modified_proto = true
    mixin

module.exports = {beforeOnce, _, MIXINS}
