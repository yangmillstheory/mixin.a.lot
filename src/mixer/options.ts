// UTILS = require './utils'
// errors = require '../errors'
// _ = require 'lodash'


// parse_omits = (mixin, omits) ->
//   if omits isnt undefined
//     unless Array.isArray(omits) && omits.length
//       throw new errors.ValueError "Expected omits option to be a nonempty Array"
//     diff = _.difference(omits, mixin.mixin_keys)
//     if diff.length
//       throw new errors.ValueError "Some omit keys aren't in mixin: #{diff}"
//   (omits?.length && omits) || []

// first_alias_pair = (aliases, options) ->
//   alias = _.find(aliases, (alias) -> _.has(options, alias))
//   if alias?
//     [alias, options[alias]]
//   else
//     [null, null]

// parse_methodhook = (mixin, options, {aliases}) ->
//   [hook_key, methodmap] = first_alias_pair(aliases, options)
//   if hook_key?
//     unless UTILS.is_obj_literal(methodmap)
//       throw new errors.ValueError "#{hook_key}: expected dict of mixin methods to callbacks"
//     for own methodname, hook of methodmap
//       unless _.isFunction hook
//         throw new errors.ValueError "hook for #{methodname} isn't a function"
//       unless _.isFunction mixin[methodname]
//         throw new errors.ValueError "#{methodname} isn't a method on #{mixin}"
//   else
//     methodmap = {}
//   methodmap

// parse_mixinghook = (mixin, options, {aliases}) ->
//   [hook_key, hook] = first_alias_pair(aliases, options)
//   if hook?
//     if !_.isFunction hook
//       throw new TypeError "Expected a function for #{hook_key}"
//   else
//     hook = null
//   hook


// module.exports =

//   parse: (mixin, options) ->
//     {
//       omits: parse_omits(mixin, options.omits)
//       methodhooks:
//         before: parse_methodhook(mixin, options, aliases: [
//           'before_hook'
//           'hook_before'
//         ])
//         after: parse_methodhook(mixin, options, aliases: [
//           'after_hook'
//           'hook_after'
//         ])
//       mixinghooks:
//         before: parse_mixinghook(mixin, options, aliases: [
//           'premixing_hook'
//           'premixing'
//           'premix'
//         ])
//         after: parse_mixinghook(mixin, options, aliases: [
//           'postmixing_hook'
//           'postmixing'
//           'postmix'
//         ])
//     }