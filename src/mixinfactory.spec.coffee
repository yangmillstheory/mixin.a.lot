fdescribe 'mixinfactory', ->

  Mixin = require './mixinfactory'
  UTIL = require './util'

  it 'should reject bad mixin types', ->
    invalid_mixin_args = [
      []
      'string'
      1
      null
      undefined
    ]

    for invalid_mixin_arg in invalid_mixin_args
      expect(->
        Mixin.make_mixin invalid_mixin_arg
      ).toThrow new TypeError "Expected non-empty mixin object"

  it 'should reject objects with no name property', ->
    expect(->
      Mixin.make_mixin quack: -> console.log 'Quack!'
    ).toThrow new UTIL.ArgumentError "Expected String name in options argument"
