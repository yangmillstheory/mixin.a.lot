{Mixin, errors} = require './mixinfactory'
Util = require './util'
_ = require 'underscore'


mixinto_proto = (mixin, options = {}) ->
  Mixin.validate_mixin(mixin)
  {omits, hooks} = Mixin.parse_mix_opts(mixin, options)

  {premixing_hook, postmixing_hook} = mixin
  [__, __, mixinhook_args] = arguments

  premixing_hook?.call(@::, mixinhook_args)

  mixing_in = _.object(
    [k, v] for k, v of mixin when k in mixin.mixin_keys and k not in omits)

  if _.isEmpty mixing_in
    throw new errors.ArgumentError "Found nothing to mix in!"

  for mixinprop, mixinvalue of mixing_in
    if mixinprop in hooks.hook_before
      before_hook = "before_#{mixinprop}"
      @::[before_hook] = ->
        throw errors.NotImplemented "Unimplemented before_hook: #{before_hook}"
    @::[mixinprop] = mixinvalue

  postmixing_hook?.call(@::, mixinhook_args)
  @

enable_protomixing = ->
  Object.defineProperty Function::, 'mixinto_proto',
    enumerable: false
    value: mixinto_proto

module.exports = enable_protomixing