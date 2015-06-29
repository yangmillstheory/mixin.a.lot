Mixin = require './mixinfactory'


enable_protomixin = ->
  Function::mixinto_proto = (mixin, options) ->
    Mixin.validate_mixin(mixin)

    for key, value of mixin when key not in HELPERS.postmixin_hooks
      @::[key] = value
    if typeof mixin.post_protomixin == 'function'
      mixin.post_protomixin.call(@::, (HELPERS.rest_of.apply @, arguments)...)
    @


module.exports = enable_protomixin