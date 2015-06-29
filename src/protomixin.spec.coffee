fdescribe 'mix.it.protomixin', ->

  mixit = require './index'
  Mixin = require './mixinfactory'
  UTIL = require './util'
  {beforeOnce, _, MIXINS} = require './util/spec'

  beforeOnce ->
    mixit.enable_protomixin()

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

  ###
    This is also a good example of post-mixin hook usage;
    to validate that the caller satisfies a certain schema.
  ###
  it 'should invoke a post-mixin hook with the prototype context', ->
    mixin = MIXINS.schematized_protomixin()

    spyOn(mixin, 'post_protomixin').and.callThrough()

    expect(->
      class Example
        @mixinto_proto mixin, null, ['arg1', 'arg2']
    ).toThrow new TypeError('Wanted schema key special_key')

    class Example
      special_key: 1

      @mixinto_proto mixin, null, ['arg1', 'arg2']

    expect(mixin.post_protomixin).toHaveBeenCalledWith(['arg1', 'arg2'])
    expect(mixin.post_protomixin.calls.count()).toBe 2

  it 'should omit mixin keys', ->
      mixin = MIXINS.default_protomixin()

      class Example
        @mixinto_proto mixin, omit: ['bar']

      e = new Example

      expect(e.bar).toBeUndefined()
      expect(e.baz).toBeDefined()

  it 'should not mangle the hierarchy when omitting keys', ->
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
      ).toThrow new UTIL.ArgumentError "Found nothing to mix in!"