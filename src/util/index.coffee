UTIL =

  rest_of: ->
    if arguments.length > 1
      return Array::slice.call arguments, 1
    return []

  ArgumentError: class ArgumentError extends Error

  postmixin_hooks: [
    'post_classmixin'
    'post_protomixin'
  ]


module.exports = UTIL