Mixin = require './mixinfactory'
_ = require 'underscore'


mixinto_proto = (mixin, options = {}) ->
  Mixin.validate_mixin(mixin)
  Mixin.check_mix_opts(mixin, options)

  {premixing_hook, postmixing_hook} = mixin
  [__, __, mixinhook_args] = arguments

  premixing_hook?.call(@::, mixinhook_args)

  omitting = (options.omits?.length && options.omits) || []
  mixing = _.object ([k, v] for k, v of mixin when k not in omitting)
  mixing = _.object ([k, v] for k, v of mixing when k in mixin.mixin_keys)

  if _.isEmpty mixing
    throw new Mixin.ArgumentError "Found nothing to mix in!"

  for key, value of mixing
    @::[key] = value

  postmixing_hook?.call(@::, mixinhook_args)
  @

enable_protomixing = ->
  Object.defineProperty Function::, 'mixinto_proto',
    enumerable: false
    value: mixinto_proto

module.exports = enable_protomixing