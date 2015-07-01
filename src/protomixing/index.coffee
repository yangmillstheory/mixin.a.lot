{Mixin, errors} = require '../mixin'
{__, MIX, PARSE} = require '../util'
_ = require 'underscore'


mixinto_proto = (mixin, options = {}) ->
  Mixin.validate(mixin)
  {omits, methodhooks, mixinghooks} = PARSE.mix(mixin, options)

  [__, __, mixinhook_args] = arguments

  mixinghooks.premix?.call(@::, mixinhook_args)

  mixing_in = _.object(
    [k, v] for k, v of mixin when k in mixin.mixin_keys and k not in omits)

  if _.isEmpty mixing_in
    throw new errors.ValueError "Found nothing to mix in!"
  for mixinprop, mixinvalue of mixing_in
    mixcontent = {context: @::, mixinprop, mixinvalue}

    if not (mixinprop in _.union(methodhooks.before, methodhooks.after))
      MIX.without_hook mixcontent
    else
      MIX.with_hook mixcontent, (mixinprop in methodhooks.before)

  mixinghooks.postmix?.call(@::, mixinhook_args)
  @

enable_protomixing = ->
  Object.defineProperty Function::, 'mixinto_proto',
    enumerable: false
    value: mixinto_proto

module.exports = enable_protomixing