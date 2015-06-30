Mixin = require './mixinfactory'
MixinUtils = require './util'
_ = require 'underscore'


mixinto_proto = (mixin, options = {}) ->
  Mixin.validate_mixin(mixin)
  MixinUtils.validate_mixin_opts(mixin, options)

  {premixin_hook, postmixin_hook} = mixin
  [__, __, mixinhook_args] = arguments

  premixin_hook?.call(@::, mixinhook_args)

  to_omit = (options.omit?.length && options.omit) || []
  to_mixin = _.object ([k, v] for k, v of mixin when k not in to_omit)
  to_mixin = _.object ([k, v] for k, v of to_mixin when k in mixin.mixin_keys)

  if _.isEmpty to_mixin
    throw new MixinUtils.ArgumentError "Found nothing to mix in!"

  for key, value of to_mixin
    @::[key] = value

  postmixin_hook?.call(@::, mixinhook_args)
  @

enable_protomixin = ->

  Object.defineProperty Function::, 'mixinto_proto',
    enumerable: false
    value: mixinto_proto

module.exports = enable_protomixin