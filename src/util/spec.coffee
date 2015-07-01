_ = require 'underscore'
{Mixin, errors} = require '../mixinfactory'


beforeOnce = (fn) ->
  beforeEach _.once(fn)


###
  Mixin factory for tests. Instances aren't frozen, so that jasmine can
  spy on methods and properties.

  A bit implementation-aware; it knows how to add a spyable method (see
  @_make_spyable_method) that's not a pre/post-mixing hook.
###
MIXINS =

  FREEZE: false

  _make_spyable_method: ({mixin, methodname}) ->
    mixin.mixin_keys.push methodname
    mixin[methodname] = ->
    mixin

  ###
    Returns a Mixin with a premixing hook that validates the
    existence of certain keys on the prototype, specified by schema.

    .premixing_hook is spyable.
  ###
  schematized_protomixin: (schema = ['special_key']) ->
    mixin = Mixin.from_obj
      name: 'Schematized Example Mixin'
      foo: 'foo'
      , @FREEZE
    mixin.premixing_hook = ->
      for key in schema
        unless @[key]?
          throw new errors.NotImplemented "Wanted schema key #{key}"
    mixin

  ###
    Returns a Mixin with a premixing hook that validates the
    existence of certain keys on the prototype, specified by schema.

    .premixing_hook is spyable.
  ###
  default_protomixin: ->
    mixin = Mixin.from_obj
      name: 'Default Example Mixin'
      foo: 'foo'
      bar: 1
      , @FREEZE
    mixin = @_make_spyable_method({mixin, methodname: 'baz'})
    mixin.postmixing_hook = ->
    mixin

module.exports = {beforeOnce, _, MIXINS}
