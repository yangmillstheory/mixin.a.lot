MIXER = require './mixer'
{enable_mixing} = require './utils'


module.exports = {
  enable_mixing

  mix: (target, rest...) ->
    usage = ->
      throw new Error "Expected non-null object or function, got #{target}"
    if target?
      type = typeof target
      if type isnt 'object' && type isnt 'function'
        throw new Error usage()
    else
      throw new Error usage()
    MIXER.mix(target, rest...)
}