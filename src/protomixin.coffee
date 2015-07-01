{Mixin, errors} = require './mixinfactory'
Util = require './util'
_ = require 'underscore'


mix_with_hook = ({context, mixinprop, mixinfunc}, before = false) ->
  hookname = (before && "before_#{mixinprop}") || "after_#{mixinprop}"

  unless _.isFunction(context[hookname])
    throw errors.NotImplemented "Unimplemented hook: #{hookname}"
  if before
    hooked_mixinfunc = _.compose mixinfunc, context[hookname]
  else
    hooked_mixinfunc = _.compose context[hookname], mixinfunc
  context[mixinprop] = hooked_mixinfunc


mixinto_proto = (mixin, options = {}) ->
  Mixin.validate_mixin(mixin)
  {omits, hooks} = Mixin.parse_mix_opts(mixin, options)

  {premixing_hook, postmixing_hook} = mixin
  [__, __, mixinhook_args] = arguments

  premixing_hook?.call(@::, mixinhook_args)

  mixing_in = _.object(
    [k, v] for k, v of mixin when k in mixin.mixin_keys and k not in omits)

  if _.isEmpty mixing_in
    throw new errors.BadArgument "Found nothing to mix in!"
  for mixinprop, mixinvalue of mixing_in
    if mixinprop in hooks.hook_before
      mix_with_hook {context: @::, mixinprop, mixinfunc: mixinvalue}, true
    else if mixinprop in hooks.hook_after
      mix_with_hook {context: @::, mixinprop, mixinfunc: mixinvalue}
    else
      @::[mixinprop] = mixinvalue

  postmixing_hook?.call(@::, mixinhook_args)
  @

enable_protomixing = ->
  Object.defineProperty Function::, 'mixinto_proto',
    enumerable: false
    value: mixinto_proto

module.exports = enable_protomixing