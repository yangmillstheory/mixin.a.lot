describe 'mixinfactory', ->

  Mixin = require './mixinfactory'


  describe 'factory', ->

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
      ).toThrow new Mixin.ArgumentError "Expected String name in options argument"

    it 'should return a Mixin', ->
      mixin = Mixin.make_mixin
        speak: ->
          'Hello, World!'
        name: 'Speaker'

      expect(mixin instanceof Mixin).toBe true

  describe 'Mixin', ->

    beforeEach ->
      @mixin = Mixin.make_mixin
        speak: ->
          "Hello, my name is #{@name}!"
        shout: ->
          "HELLO, MY NAME IS #{@name}!"
        whisper: ->
          "Shh, my name is #{@name}!"
        name: 'Speaker'

    it 'should have a sorted mixin_keys property', ->
      expect(@mixin.mixin_keys).toEqual ['name', 'shout', 'speak', 'whisper']

    it 'should be immutable with loud failures on change attempts', ->
      for key in @mixin.mixin_keys
        expect(=>
          @mixin[key] = null
        ).toThrow new Mixin.MutabilityError "Cannot change #{key} on Mixin(Speaker)"

    it 'should have a frozen prototype with silent failures on change attempts', ->
      old_keys = Object.keys Mixin::

      Mixin::foo = 'bar'
      Mixin::baz = ->
        'qux'

      expect(Object.keys(Mixin::)).toEqual old_keys

