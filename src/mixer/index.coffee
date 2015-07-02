_ = require 'underscore'
{Mixin, errors} = require '../mixin'


UTILS =

  is_nonempty_string: (thing) ->
    _.isString(thing) && (thing.length > 0)

  is_obj_literal: (thing) ->
    # This might be wrong in some cases -
    # the implementation is guided by http://underscorejs.org/#isObject
    _.isObject(thing) && !Array.isArray(thing) && !_.isFunction(thing)


PARSER =

  _parse_methodhooks: (mixin, hooks) ->
    for own hook_key, methods of hooks
      if methods != undefined
        unless Array.isArray(methods) && _.all(methods, UTILS.is_nonempty_string)
          throw new errors.ValueError "#{hook_key}: expected an Array of mixin method names"
        for methodname in methods
          unless _.isFunction mixin[methodname]
            throw new errors.ValueError "#{methodname} isn't a method on #{mixin}"
      else
        hooks[hook_key] = []

    {before: hooks.hook_before, after: hooks.hook_after}

  _parse_mixinghooks: (mixin, methodhooks) ->
    for own mixinghook_key, hook of methodhooks
      supplied_hook = mixin[mixinghook_key]
      if supplied_hook? && !_.isFunction supplied_hook
        throw new TypeError "Expected a function for #{mixinghook_key}"

    {premix: methodhooks.premixing_hook, postmix: methodhooks.postmixing_hook}

  _parse_omits: (mixin, omits) ->
    if omits != undefined
      unless Array.isArray(omits) && omits.length
        throw new errors.ValueError "Expected omits option to be a nonempty Array"
      diff = _.difference(omits, mixin.mixin_keys)
      if diff.length
        throw new errors.ValueError "Some omit keys aren't in mixin: #{diff}"
    (omits?.length && omits) || []

  parse_mix: (mixin, options) ->
    {omits} = options
    {hook_before, hook_after} = options
    {premixing_hook, postmixing_hook} = options

    omits = @_parse_omits(mixin, omits)
    {before, after} = @_parse_methodhooks(mixin, {hook_before, hook_after})
    {premix, postmix} = @_parse_mixinghooks(mixin, {premixing_hook, postmixing_hook})

    {omits, methodhooks: {before, after}, mixinghooks: {premix, postmix}}


MIXER =

  _with_hook: ({mixtarget, mixinprop, mixinvalue}, before = false) ->
    hookname = (before && "before_#{mixinprop}") || "after_#{mixinprop}"

    unless _.isFunction(mixtarget[hookname])
      throw errors.NotImplemented "Unimplemented hook: #{hookname}"
    if before
      hooked_mixinfunc = _.compose mixinvalue, mixtarget[hookname]
    else
      hooked_mixinfunc = _.compose mixtarget[hookname], mixinvalue
    mixtarget[mixinprop] = hooked_mixinfunc

  _without_hook: ({mixtarget, mixinprop, mixinvalue}) ->
    mixtarget[mixinprop] = mixinvalue

  mix: (mixtarget, mixin, options = {}) ->
    Mixin.validate(mixin)
    {omits, methodhooks, mixinghooks} = PARSER.parse_mix(mixin, options)
    [__, __, __, mixinhook_args] = arguments

    mixinghooks.premix?.call(mixtarget, mixinhook_args)

    mixing_in = _.object(
      [k, v] for k, v of mixin when k in mixin.mixin_keys and k not in omits)

    if _.isEmpty mixing_in
      throw new errors.ValueError "Found nothing to mix in!"
    for mixinprop, mixinvalue of mixing_in
      mixcontent = {mixtarget, mixinprop, mixinvalue}

      if not (mixinprop in _.union(methodhooks.before, methodhooks.after))
        @_without_hook mixcontent
      else
        @_with_hook mixcontent, (mixinprop in methodhooks.before)

    mixinghooks.postmix?.call(mixtarget, mixinhook_args)
    mixtarget


get_protomixer = ->
  ->
    MIXER.mix(@::, arguments...)


get_classmixer = ->
  ->
    MIXER.mix(@, arguments...)


module.exports = {get_protomixer, get_classmixer}