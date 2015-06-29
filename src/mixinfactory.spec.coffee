fdescribe 'mixinfactory', ->

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
        name: 'Speaker'
        speak: ->
          "Hello, my name is #{@name}!"
        shout: ->
          @speak().toUpperCase()
        whisper: ->
          "...#{@speak().toLowerCase().replace('!', '')}...!"

    it 'should have a sorted mixin_keys and the mixin attributes', ->
      expect(@mixin.mixin_keys).toEqual ['name', 'shout', 'speak', 'whisper']

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

