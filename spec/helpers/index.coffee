_ = require 'underscore'


beforeOnce = (fn) ->
  _.once(beforeEach fn)


mixins =
  default: ->
    foo: 'bar'
    bar: 1
    baz: ->
      [@foo]

  schematized: ->
    schema: [
      'expected_key_1'
      'expected_key_2'
    ]

  postextend: ->
    unless _.isNumber @expected_key_1
      throw new TypeError 'Expected @expected_key_1 to be a number'
    unless _.isString @expected_key_2
      throw new TypeError 'Expected @expected_key_2 to be a String'

  postinclude: ->
    unless Array.isArray @expected_key_1
      throw new TypeError 'Expected @expected_key_1 to be an Array'

module.exports = {beforeOnce, _, mixins}