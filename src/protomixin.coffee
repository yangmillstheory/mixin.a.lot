Mixin = require './mixinfactory'
UTIL = require './util'
_ = require 'underscore'


enable_protomixin = ->
  Function::mixinto_proto = (mixin, options = {}) ->
    Mixin.validate_mixin(mixin)
    UTIL.validate_mixin_opts(mixin, options)

    {premixin_hook, postmixin_hook} = mixin
    mixin_hook_args = UTIL.rest_of.apply @, arguments

    UTIL.maybe_call_mixin_hook(premixin_hook, @, mixin_hook_args)

    to_omit = (options.omit?.length && options.omit) || []
    to_mixin = _.object ([k, v] for k, v of mixin when k not in to_omit)
    to_mixin = _.object ([k, v] for k, v of to_mixin when k in mixin.mixin_keys)

    if _.isEmpty to_mixin
      throw new UTIL.ArgumentError "Found nothing to mix in!"

    for key, value of to_mixin
      @::[key] = value
    UTIL.maybe_call_mixin_hook(postmixin_hook, @, mixin_hook_args)


module.exports = enable_protomixin