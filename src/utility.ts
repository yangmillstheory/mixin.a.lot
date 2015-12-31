// module.exports =

//   is_nonempty_string: (thing) ->
//     _.isString(thing) && (thing.length > 0)

//   is_obj_literal: (thing) ->

//   enable_mixing: (thing, mixer, mixing_prop, mixing_aliases = null) ->
//     if thing[mixing_prop]?
//       false
//     else
//       Object.defineProperty thing, mixing_prop,
//         enumerable: false
//         value: mixer
//       if mixing_aliases?
//         for alias in mixing_aliases
//           Object.defineProperty thing, alias,
//             enumerable: false,
//             value: (args...) ->
//               @[mixing_prop](args...)
//       true