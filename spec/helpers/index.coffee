_ = require 'underscore'


beforeOnce = (fn) ->
  _.once(beforeEach fn)

default_mixin = ->
  foo: 'bar'
  bar: 1
  baz: ->
    [@foo]


module.exports = {beforeOnce, _, default_mixin}