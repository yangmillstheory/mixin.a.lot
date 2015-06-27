"use strict"


module_kw = [
  'postExtend'
  'postInclude'
]


###
  Allow class-level mixins; i.e., mix into a Function.
###
allowExtend = ->
  Function::extend = (mixin, postExtendArgs...) ->
    for key, value of mixin when key not in module_kw
      @[key] = value
    if typeof mixin.postExtend == 'function'
      mixin.postExtend.call(@, postExtendArgs...)
    @


###
  Allow instance-level mixins; i.e., mix into the prototype.
###
allowInclude = ->
  Function::include = (mixin, postIncludeArgs...) ->
    for key, value of mixin when key not in module_kw
      @::[key] = value
    if typeof mixin.postInclude == 'function'
      mixin.postInclude.call(@, postIncludeArgs...)
    @


exports = commix: {
  allowExtend
  allowInclude
}
