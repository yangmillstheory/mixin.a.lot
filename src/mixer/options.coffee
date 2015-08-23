UTILS = require './utils'
errors = require '../errors'
_ = require 'underscore'


parse_omits = (mixin, omits) ->
  if omits isnt undefined
    unless Array.isArray(omits) && omits.length
      throw new errors.ValueError "Expected omits option to be a nonempty Array"
    diff = _.difference(omits, mixin.mixin_keys)
    if diff.length
      throw new errors.ValueError "Some omit keys aren't in mixin: #{diff}"
  (omits?.length && omits) || []

first_alias_pair = (aliases, options) ->
  alias = _.find(aliases, (alias) -> _.has(options, alias))
  if alias?
    [alias, options[alias]]
  else
    [null, null]

parse_methodhook = (mixin, options, {aliases}) ->
  [hook_key, methods] = first_alias_pair(aliases, options)
  if hook_key?
    unless Array.isArray(methods) && _.all(methods, UTILS.is_nonempty_string)
      throw new errors.ValueError "#{hook_key}: expected an Array of mixin method names"
    for methodname in methods
      unless _.isFunction mixin[methodname]
        throw new errors.ValueError "#{methodname} isn't a method on #{mixin}"
  else
    methods = []
  methods

parse_mixinghook = (mixin, options, {aliases}) ->
  [hook_key, hook] = first_alias_pair(aliases, options)
  if hook?
    if !_.isFunction hook
      throw new TypeError "Expected a function for #{hook_key}"
  else
    hook = null
  hook


module.exports =

  parse: (mixin, options) ->
    {
      omits: parse_omits(mixin, options.omits)
      methodhooks:
        before: parse_methodhook(mixin, options, aliases: [
          'before_hook'
          'hook_before'
        ])
        after: parse_methodhook(mixin, options, aliases: [
          'after_hook'
          'hook_after'
        ])
      mixinghooks:
        before: parse_mixinghook(mixin, options, aliases: [
          'premixing_hook'
          'premixing'
          'premix'
        ])
        after: parse_mixinghook(mixin, options, aliases: [
          'postmixing_hook'
          'postmixing'
          'postmix'
        ])
    }