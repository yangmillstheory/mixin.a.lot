Mixin = require './mixinfactory'
UTIL = require './util'
_ = require 'underscore'


enable_protomixin = ->
  Function::mixinto_proto = (mixin, options = {}) ->
    Mixin.validate_mixin(mixin)
    UTIL.validate_mixin_opts(mixin, options)

    to_omit = (options.omit?.length && options.omit) || []
    to_mixin = _.object ([k, v] for k, v of mixin when k not in to_omit)
    to_mixin = _.object ([k, v] for k, v of to_mixin when k in mixin.mixin_keys)

    if _.isEmpty to_mixin
      throw new UTIL.ArgumentError "Found nothing to mix in!"

    postmixin_hook = mixin.post_protomixin

    for key, value of to_mixin
      @::[key] = value
    if _.isFunction postmixin_hook
      postmixin_hook.call(@::, (UTIL.rest_of.apply @, arguments)...)
    @


module.exports = enable_protomixin