HELPERS = require './helpers'


enable_classmixin = ->
  Function::mixinto_class = (mixin, options) ->
    HELPERS.validate_mixin(mixin)

    for key, value of mixin when key not in HELPERS.postmixin_hooks
      @[key] = value

    if typeof mixin.post_classmixin == 'function'
      mixin.post_classmixin.call(@, (HELPERS.rest_of.apply @, arguments)...)
    @


module.exports = enable_classmixin