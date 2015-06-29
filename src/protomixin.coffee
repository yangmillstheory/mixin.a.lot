Mixin = require './mixinfactory'
UTIL = require './util'


enable_protomixin = ->
  Function::mixinto_proto = (mixin, options) ->
    Mixin.validate_mixin(mixin)

    for key, value of mixin when key not in Mixin.postmixin_hooks
      @::[key] = value
    if typeof mixin.post_protomixin == 'function'
      mixin.post_protomixin.call(@::, (UTIL.rest_of.apply @, arguments)...)
    @


module.exports = enable_protomixin