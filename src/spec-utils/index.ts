_ = require 'lodash'
{make} = require '../mixin'


beforeOnce = (fn) ->
  beforeEach _.once(fn)


###
  Mixin factory for tests.

  Instances aren't frozen, so we can attach spyable (mutable) methods for testing.

  A bit implementation-aware; it knows how to add a spyable method (see
  @_make_spyable_method) that's not a pre/post-mixing hook.
###
MIXINS =

  FREEZE: false

  _make_spyable_method: ({mixin, methodname}) ->
    mixin.mixin_keys.push methodname
    mixin[methodname] = ->
    mixin

  default_mixin: ->
    mixin = make
      name: 'Default Example Mixin'
      foo: 'foo'
      bar: 1
      , @FREEZE
    mixin = @_make_spyable_method({mixin, methodname: 'baz'})
    mixin

module.exports = {beforeOnce, MIXINS}
