fdescribe 'mix.it.protomixin', ->

  {enable_protomixing, Mixin, errors} = require './index'
  {beforeOnce, _, MIXINS} = require './util/spec'

  beforeOnce ->
    enable_protomixing()

  it 'should attach a non-enumerable, immutable .mixinto_proto to Function.prototype', ->
    expect(_.isFunction Function::mixinto_proto).toBe true
    expect(Object.keys Function::).not.toContain 'mixinto_proto'

    delete Function::mixinto_proto
    expect(_.isFunction Function::mixinto_proto).toBe true

    Function::mixinto_proto = 'bar'
    expect(_.isFunction Function::mixinto_proto).toBe true

  it 'should throw an error when mixing non-Mixins', ->
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

    it 'should throw an error when mixing in Mixins with non-function hooks', ->
      @mixin.premixing_hook = 1

      expect(=>
        class Example
        Example.mixinto_proto @mixin
      ).toThrow(new TypeError('Expected a function for premixing_hook'))

      @mixin = MIXINS.schematized_protomixin()
      @mixin.postmixing_hook = []

      expect(=>
        class Example
        Example.mixinto_proto @mixin
      ).toThrow(new TypeError('Expected a function for postmixing_hook'))

    ###
      This is also a good example of pre-mixin hook usage;
      to validate that the mixing class satisfies a certain schema.
    ###
    it 'should invoke a pre-mixin hook with the prototype context', ->
      spyOn(@mixin, 'premixing_hook').and.callThrough()

      expect(=>
        class Example
          # special_key is not on the prototype
          @special_key = 1

        Example.mixinto_proto @mixin, null, ['arg1', 'arg2']
      ).toThrow new errors.NotImplemented('Wanted schema key special_key')

      class Example
        # special_key is on the prototype
        special_key: 1
      Example.mixinto_proto @mixin, null, ['arg1', 'arg2']

      expect(@mixin.premixing_hook).toHaveBeenCalledWith(['arg1', 'arg2'])
      expect(@mixin.premixing_hook.calls.count()).toBe 2
      expect(Example::modified_proto).toBe true

    it 'should invoke the pre-mixin hook before mixing in properties', ->
      error = new Error
      threw = false

      spyOn(@mixin, 'premixing_hook').and.throwError(error)
      expect(@mixin.foo).toBeDefined()

      class Example

      try
        Example.mixinto_proto @mixin, null, ['arg1', 'arg2']
      catch error
        threw = true
      finally
        expect(threw).toBe true
        expect(Example::modified_proto).toBeUndefined()
        expect(@mixin.premixing_hook).toHaveBeenCalledWith(['arg1', 'arg2'])

  describe 'postmixin hooks', ->

    beforeEach ->
      @mixin = MIXINS.default_protomixin()

    it 'should invoke a post-mixin hook with the prototype context', ->
      spyOn(@mixin, 'postmixing_hook').and.callThrough()

      class Example
      Example.mixinto_proto @mixin, null, ['arg1', 'arg2']

      expect(Example::modified_proto).toBe true
      expect(@mixin.postmixing_hook).toHaveBeenCalledWith(['arg1', 'arg2'])

    it 'should invoke the post-mixin hook after mixing in properties', ->
      error = new Error

      spyOn(@mixin, 'postmixing_hook').and.throwError(error)
      expect(@mixin.bar).toBe 1

      class Example

      try
        Example.mixinto_proto @mixin, null, ['arg1', 'arg2']
      catch error
        expect(Example::bar).toBe 1 # was mixed in!
        expect(Example::modified_proto).toBeUndefined()
        expect(@mixin.postmixing_hook).toHaveBeenCalledWith(['arg1', 'arg2'])

  describe 'protomixing options', ->

    beforeEach ->
      @mixin = MIXINS.default_protomixin()

    it 'should omit mixin keys', ->
        class Example
        Example.mixinto_proto @mixin, omits: ['bar']

        e = new Example

        expect(e.bar).toBeUndefined()
        expect(e.baz).toBeDefined()

    it 'should throw an error when omitting a non-existing mixin key', ->
      expect(=>
        class Example
        Example.mixinto_proto @mixin, omits: ['non_mixin_key']
      ).toThrow new errors.BadArgument "Some omit keys aren't in mixin: non_mixin_key"

    it 'should throw an error when omitting a non-Array or empty Array', ->
      bad_omits_values = [
        []
        {}
        null
        1
        'String'
      ]

      for bad_omits_value in bad_omits_values
        expect(=>
          class Example
          Example.mixinto_proto @mixin, omits: bad_omits_value
        ).toThrow new errors.BadArgument "Expected omits option to be a nonempty Array"

    it 'should not mangle the class hierarchy when omitting keys', ->
      class Super
        bar: ->
          'bar'

      class Example extends Super
      Example.mixinto_proto @mixin, omits: ['bar']

      e = new Example

      expect(e.bar).toBeDefined()
      expect(e.bar()).toBe('bar')

    it 'should not omit all mixin keys', ->
      expect(=>
        class Example
        Example.mixinto_proto @mixin, omits: ['bar', 'baz', 'foo']
      ).toThrow new errors.BadArgument "Found nothing to mix in!"

    it 'should throw an error when the hook configuration is not an Array of Strings', ->
      bad_hook_values = [
        'String'
        1
        null
        {}
        true
      ]

      for bad_hook_value in bad_hook_values
        expect(=>
          class Example
          Example.mixinto_proto @mixin, hook_before: bad_hook_value
        ).toThrow new TypeError "hook_before: expected an Array of mixin method names"

    it 'should throw an error when hooking into a non-string or empty string', ->
      bad_hook_requests = [
        [
          'mixinmethod_1'
          false
        ]
        [
          null
          'mixinmethod_1'
          'mixinmethod_2'
        ]
        [
          {}
          'mixinmethod_1'
        ]
        [
          'mixinmethod_1'
          1
        ]
        [
          'mixinmethod_1'
          ''
        ]
      ]

      for bad_hook_request in bad_hook_requests
        expect(=>
          class Example
          Example.mixinto_proto @mixin, hook_before: bad_hook_request
        ).toThrow new TypeError "hook_before: expected an Array of mixin method names"

    it 'should throw an error when hooking into a non-existent mixin method', ->
      bad_hook_requests = [
        hook_before: [
          'baz'                   # valid method
          'non_existent_method_1' # invalid
          'non_existent_method_2' # invalid
        ], bad_method: 'non_existent_method_1'
        hook_before: [
          'baz' # valid method
          'foo' # non-method property
        ], bad_method: 'foo'
      ]

      for {hook_before, bad_method} in bad_hook_requests
        expect(=>
          class Example
          Example.mixinto_proto @mixin,
            hook_before: hook_before
        ).toThrow new errors.BadArgument "#{bad_method} isn't a method on #{@mixin}"

    it 'should provide a hook meant to be implemented before a mixin method', ->
      class Example
      Example.mixinto_proto @mixin, hook_before: ['baz']

      expect(true).toBe true

    xit 'should provide a hook meant to be implemented after a mixin method', ->
      expect(true).toBe true