Mixin = require './mixinfactory'
UTIL = require './util'
_ = require 'underscore'


enable_protomixin = ->
  Function::mixinto_proto = (mixin, options = {}) ->
    Mixin.validate_mixin(mixin)
    UTIL.validate_mixin_opts(mixin, options)

    mixing_in = _.object ([k, v] for k, v of mixin when k not in (options.omit || []))
    mixing_in = _.object ([k, v] for k, v of mixing_in when k in mixin.mixin_keys)

    postmixin_hook = mixin.post_protomixin

    for key, value of mixing_in
      @::[key] = value
    if _.isFunction postmixin_hook
      postmixin_hook.call(@::, (UTIL.rest_of.apply @, arguments)...)
    @


module.exports = enable_protomixin