_ = require 'underscore'


beforeOnce = (fn) ->
  beforeEach _.once(fn)


mixins =
  default: ->
    foo: 'bar'
    bar: 1
    baz: ->
      [@foo]


module.exports = {beforeOnce, _, mixins}