fdescribe 'mix.it.mixinfactory', ->

  Mixin = require './mixinfactory'


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
          Mixin.from_obj invalid_mixin
        ).toThrow new TypeError "Expected non-empty object"

    it 'should reject objects with no name property', ->
      expect(->
        Mixin.from_obj quack: -> console.log 'Quack!'
      ).toThrow new Mixin.ArgumentError "Expected String name in options argument"

    it 'should reject objects with only a name property', ->
      expect(->
        Mixin.from_obj name: 'Example Mixin'
      ).toThrow new Mixin.ArgumentError "Found nothing to mix in!"

    it 'should validate a proposed Mixin', ->
      for invalid_mixin in @invalid_mixin_types
        expect(->
          Mixin.validate_mixin(invalid_mixin)
        ).toThrow new TypeError "Expected a Mixin instance"

    it 'should return a Mixin', ->
      mixin = Mixin.from_obj
        speak: ->
          'Hello, World!'
        name: 'Speaker'

      expect(mixin instanceof Mixin).toBe true


  describe 'Mixin', ->

    beforeEach ->
      @mixin = Mixin.from_obj
        name: 'Speaker'
        speak: ->
          "Hello, my name is #{@name}!"
        shout: ->
          @speak().toUpperCase()
        whisper: ->
          "...#{@speak().toLowerCase().replace('!', '')}...!"


    it 'should have a sorted mixin_keys and the mixin attributes', ->
      expect(@mixin.mixin_keys).toEqual ['shout', 'speak', 'whisper']

      expect(@mixin.name).toBe('Speaker')
      expect(@mixin.speak()).toBe('Hello, my name is Speaker!')
      expect(@mixin.shout()).toBe('HELLO, MY NAME IS SPEAKER!')
      expect(@mixin.whisper()).toBe('...hello, my name is speaker...!')

    it 'should not allow adding or modifying properties', ->
      @mixin.foo = 'bar'
      delete @mixin.name
      delete @mixin.speak
      delete @mixin.shout
      delete @mixin.whisper

      expect(@mixin.foo).toBeUndefined()
      expect(@mixin.name).toBe('Speaker')
      expect(@mixin.speak()).toBe('Hello, my name is Speaker!')
      expect(@mixin.shout()).toBe('HELLO, MY NAME IS SPEAKER!')
      expect(@mixin.whisper()).toBe('...hello, my name is speaker...!')

    it 'should have enumerate properties in toString()', ->
      expect(@mixin.toString()).toEqual 'Mixin(Speaker: shout, speak, whisper)'

    it 'should be immutable with loud failures on change attempts', ->
      for key in @mixin.mixin_keys
        expect(=>
          @mixin[key] = null
        ).toThrow new Mixin.MutabilityError "Cannot change #{key} on #{@mixin}"

    it 'should have a frozen prototype with silent failures on change attempts', ->
      old_keys = Object.keys Mixin::

      Mixin::foo = 'bar'
      Mixin::baz = ->
        'qux'

      expect(Object.keys(Mixin::)).toEqual old_keys

