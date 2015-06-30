HELPERS = require './helpers'


enable_classmixing = ->
  Function::mixinto_class = (mixin, options) ->
    HELPERS.validate_mixin(mixin)

    for key, value of mixin when key not in HELPERS.postmixing_hooks
      @[key] = value

    if typeof mixin.post_classmixin == 'function'
      mixin.post_classmixin.call(@, (HELPERS.rest_of.apply @, arguments)...)
    @


module.exports = enable_classmixing