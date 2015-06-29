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

  it 'should return an immutable Mixin', ->
    mixin = Mixin.make_mixin
      speak: ->
        'Hello, World!'
      name: 'Speaker'

    expect(mixin instanceof Mixin).toBe true
    expect(mixin.mixin_keys).toEqual ['name', 'speak']

    for key in mixin.mixin_keys
      expect(->
        mixin[key] = null
      ).toThrow new Error "Cannot change #{key} on Mixin(Speaker); Mixins are immutable"