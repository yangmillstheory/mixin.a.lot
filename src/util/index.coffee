UTIL =

  rest_of: ->
    if arguments.length > 1
      return Array::slice.call arguments, 1
    return []


module.exports = UTIL