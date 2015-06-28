fdescribe 'mixinfactory', ->

  make_mixin = require './mixinfactory'
  util = require './util'

  it 'should reject bad mixin types', ->
    invalid_mixins = [
      []
      'string'
      1
      null
      undefined
    ]

    for invalid_mixin in invalid_mixins
      expect(->
        make_mixin invalid_mixin
      ).toThrow(new TypeError "Expected non-empty mixin object")


  it 'should reject objects with no name property', ->
