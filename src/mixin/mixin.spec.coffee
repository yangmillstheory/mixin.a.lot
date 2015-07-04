describe 'mix.it.mixinfactory', ->

  Mixin = require './index'
  errors = require '../errors'
  _ = require 'underscore'


  describe 'factory', ->

    beforeEach ->
      @invalid_mixin_types = [
        []
        'string'
        1
        null
        undefined
      ]

    it 'should reject bad mixin types', ->
      for invalid_mixin in @invalid_mixin_types
        expect(->
          Mixin.make invalid_mixin
        ).toThrow new TypeError "Expected non-empty object"

    it 'should reject objects with no name property', ->
      expect(->
        Mixin.make quack: -> console.log 'Quack!'
      ).toThrow new errors.ValueError "Expected String name in options argument"

    it 'should reject objects with only a name property', ->
      expect(->
        Mixin.make name: 'Example Mixin'
      ).toThrow new errors.ValueError "Found nothing to mix in!"

    it 'should validate a proposed Mixin', ->
      for invalid_mixin in @invalid_mixin_types
        expect(->
          Mixin.validate invalid_mixin
        ).toThrow new TypeError "Expected a Mixin instance"

    it 'should return an immutable Mixin', ->
      mixin = Mixin.make
        speak: ->
          'Hello, World!'
        name: 'Example Mixin'

      mixin.foo = 'bar'
      delete mixin.name
      delete mixin.speak

      expect(mixin.foo).toBeUndefined()
      expect(mixin.name).toBe('Example Mixin')
      expect(mixin.speak()).toBe('Hello, World!')

    it 'should allow adding but not modifying existing properties if freeze = false', ->
      mixin = Mixin.make({name: 'Example Mixin', foo: ->}, false)
      delete mixin.name
      delete mixin.foo

      mixin.bar = ->

      expect(mixin.name).toBe('Example Mixin')
      expect(_.isFunction mixin.foo).toBe true
      expect(_.isFunction mixin.bar).toBe true

  describe 'Mixin', ->

    beforeEach ->
      @mixin = Mixin.make
        name: 'Example Mixin'
        speak: ->
          "Hello, my name is #{@name}!"
        shout: ->
          @speak().toUpperCase()
        whisper: ->
          "...#{@speak().toLowerCase().replace('!', '')}...!"


    it 'should have a sorted mixin_keys property and the mixin attributes', ->
      expect(@mixin.mixin_keys).toEqual ['shout', 'speak', 'whisper']

      expect(@mixin.name).toBe('Example Mixin')
      expect(@mixin.speak()).toBe('Hello, my name is Example Mixin!')
      expect(@mixin.shout()).toBe('HELLO, MY NAME IS EXAMPLE MIXIN!')
      expect(@mixin.whisper()).toBe('...hello, my name is example mixin...!')

    it 'should enumerate properties in toString()', ->
      expect(@mixin.toString()).toEqual 'Mixin(Example Mixin: shout, speak, whisper)'

    it 'should be immutable with loud failures on change attempts', ->
      for key in @mixin.mixin_keys
        expect(=>
          @mixin[key] = null
        ).toThrow new errors.NotMutable "Cannot change #{key} on #{@mixin}"

    it 'should have a frozen prototype with silent failures on change attempts', ->
      proto = Object.getPrototypeOf @mixin
      old_keys = Object.keys proto

      proto.foo = 'bar'
      proto.baz = ->
        'qux'

      expect(Object.keys proto ).toEqual old_keys

