fdescribe 'mix.it.protomixin', ->

  {enable_protomixin, Mixin} = require './index'
  {beforeOnce, _, MIXINS} = require './util/spec'

  MixinUtils = require './util'

  beforeOnce ->
    enable_protomixin()

  it 'should attach a non-enumerable, immutable .mixinto_proto to Function.prototype', ->
    expect(_.isFunction Function::mixinto_proto).toBe true
    expect(Object.keys Function::).not.toContain 'mixinto_proto'

    delete Function::mixinto_proto
    expect(_.isFunction Function::mixinto_proto).toBe true

    Function::mixinto_proto = 'bar'
    expect(_.isFunction Function::mixinto_proto).toBe true

  it 'should raise an error when mixing non-Mixins', ->
    for non_Mixin in [1, 'String', [], {}]
      expect(->
        class Example
          @mixinto_proto non_Mixin
      ).toThrow new TypeError 'Expected a Mixin instance'

  it 'should mix into the prototype', ->
    class Example
      @mixinto_proto MIXINS.default_protomixin()

      constructor: (@foo) ->

    e = new Example 'example'

    expect(e.bar).toBe 1
    expect(e.baz()).toEqual ['example']

  it 'should be order-dependent', ->
    mixin_1 = Mixin.from_obj name: 'mixin_1', foo: 'bar1', baz: 'qux'
    mixin_2 = Mixin.from_obj name: 'mixin_2', foo: 'bar2', qux: 'baz'

    class Example
      @mixinto_proto mixin_1
      @mixinto_proto mixin_2

    expect(Example::foo).toBe 'bar2'
    expect(Example::baz).toBe 'qux'
    expect(Example::qux).toBe 'baz'

  describe 'premixin hooks', ->

    beforeEach ->
      @mixin = MIXINS.schematized_protomixin()

    it 'should raise an error when mixing in Mixins with non-function hooks', ->
      @mixin.premixin_hook = 1

      expect(=>
        class Example
        Example.mixinto_proto @mixin
      ).toThrow(new Error('Expected a function for premixin_hook'))

      @mixin = MIXINS.schematized_protomixin()
      @mixin.postmixin_hook = []

      expect(=>
        class Example
        Example.mixinto_proto @mixin
      ).toThrow(new Error('Expected a function for postmixin_hook'))

    ###
      This is also a good example of pre-mixin hook usage;
      to validate that the mixing class satisfies a certain schema.
    ###
    it 'should invoke a pre-mixin hook with the prototype context', ->
      spyOn(@mixin, 'premixin_hook').and.callThrough()

      expect(=>
        class Example
          # special_key is not on the prototype
          @special_key = 1

        Example.mixinto_proto @mixin, null, ['arg1', 'arg2']
      ).toThrow new TypeError('Wanted schema key special_key')

      class Example
        # special_key is on the prototype
        special_key: 1
      Example.mixinto_proto @mixin, null, ['arg1', 'arg2']

      expect(@mixin.premixin_hook).toHaveBeenCalledWith(['arg1', 'arg2'])
      expect(@mixin.premixin_hook.calls.count()).toBe 2
      expect(Example::modified_proto).toBe true

    it 'should invoke the pre-mixin hook before mixing in properties', ->
      error = new Error

      spyOn(@mixin, 'premixin_hook').and.throwError(error)
      expect(@mixin.foo).toBeDefined()

      class Example

      try
          Example.mixinto_proto @mixin, null, ['arg1', 'arg2']
      catch error
        expect(Example::modified_proto).toBeUndefined()
        expect(@mixin.premixin_hook).toHaveBeenCalledWith(['arg1', 'arg2'])

  describe 'postmixin hooks', ->

    beforeEach ->
      @mixin = MIXINS.default_protomixin()

    it 'should invoke a post-mixin hook with the prototype context', ->
      spyOn(@mixin, 'postmixin_hook').and.callThrough()

      class Example
      Example.mixinto_proto @mixin, null, ['arg1', 'arg2']

      expect(Example::modified_proto).toBe true
      expect(@mixin.postmixin_hook).toHaveBeenCalledWith(['arg1', 'arg2'])

    it 'should invoke the post-mixin hook after mixing in properties', ->
      error = new Error

      spyOn(@mixin, 'postmixin_hook').and.throwError(error)
      expect(@mixin.bar).toBe 1

      class Example

      try
        Example.mixinto_proto @mixin, null, ['arg1', 'arg2']
      catch error
        expect(Example::bar).toBe 1 # was mixed in!
        expect(Example::modified_proto).toBeUndefined()
        expect(@mixin.postmixin_hook).toHaveBeenCalledWith(['arg1', 'arg2'])

  describe 'protomixing options', ->

    it 'should omit mixin keys', ->
        mixin = MIXINS.default_protomixin()

        class Example
          @mixinto_proto mixin, omit: ['bar']

        e = new Example

        expect(e.bar).toBeUndefined()
        expect(e.baz).toBeDefined()

    it 'should not mangle the class hierarchy when omitting keys', ->
      mixin = MIXINS.default_protomixin()

      class Super

        bar: ->
          'bar'

      class Example extends Super
        @mixinto_proto mixin, omit: ['bar']

      e = new Example

      expect(e.bar).toBeDefined()
      expect(e.bar()).toBe('bar')

    it 'should not omit all mixin keys', ->
        mixin = MIXINS.default_protomixin()

        expect(->
          class Example
            @mixinto_proto mixin, omit: ['bar', 'baz']
        ).toThrow new MixinUtils.ArgumentError "Found nothing to mix in!"

    it 'should support pre-mixin hooks', ->
      throw new Error 'Write me!'

    it 'should support post-mixin hooks', ->
      throw new Error 'Write me!'
