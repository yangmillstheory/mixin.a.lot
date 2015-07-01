_ = require 'underscore'
{Mixin, errors} = require '../mixin'


UTILS =

  is_nonempty_string: (thing) ->
    _.isString(thing) && (thing.length > 0)

  is_obj_literal: (thing) ->
    # This might be wrong in some cases -
    # the implementation is guided by http://underscorejs.org/#isObject
    _.isObject(thing) && !Array.isArray(thing) && !_.isFunction(thing)


PARSE =

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

  mix: (mixin, options) ->
    {omits} = options
    {hook_before, hook_after} = options
    {premixing_hook, postmixing_hook} = options

    omits = @_parse_omits(mixin, omits)
    {before, after} = @_parse_methodhooks(mixin, {hook_before, hook_after})
    {premix, postmix} = @_parse_mixinghooks(mixin, {premixing_hook, postmixing_hook})

    {omits, methodhooks: {before, after}, mixinghooks: {premix, postmix}}


MIX =

  with_hook: ({context, mixinprop, mixinvalue}, before = false) ->
    hookname = (before && "before_#{mixinprop}") || "after_#{mixinprop}"

    unless _.isFunction(context[hookname])
      throw errors.NotImplemented "Unimplemented hook: #{hookname}"
    if before
      hooked_mixinfunc = _.compose mixinvalue, context[hookname]
    else
      hooked_mixinfunc = _.compose context[hookname], mixinvalue
    context[mixinprop] = hooked_mixinfunc

  without_hook: ({context, mixinprop, mixinvalue}) ->
    context[mixinprop] = mixinvalue


module.exports = {UTILS, MIX, PARSE}