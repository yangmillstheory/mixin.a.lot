_ = require 'underscore'


module.exports =

  is_nonempty_string: (thing) ->
    _.isString(thing) && (thing.length > 0)

  is_obj_literal: (thing) ->
    # This might be wrong in some cases -
    # the implementation is guided by http://underscorejs.org/#isObject
    _.isObject(thing) && !Array.isArray(thing) && !_.isFunction(thing)