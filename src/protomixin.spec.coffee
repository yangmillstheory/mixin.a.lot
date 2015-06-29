fdescribe 'mix.it.protomixin', ->

  mixit = require './index'
  Mixin = require './mixinfactory'
  {beforeOnce, _, MIXINS} = require './util/spec'

  beforeOnce ->
    mixit.enable_protomixin()

  it 'should raise an error when mixing non-Mixins', ->
    for non_Mixin in [1, 'String', [], {}]
      expect(->
        class Foo
          @mixinto_proto non_Mixin
      ).toThrow new TypeError 'Expected a Mixin instance'

  it 'should mix into the prototype', ->
    class Foo
      @mixinto_proto MIXINS.default_protomixin()

      constructor: (@foo) ->

    foo = new Foo 'foo'

    expect(foo.name).toBe 'Default Test Mixin'
    expect(foo.bar).toBe 1
    expect(foo.baz()).toEqual ['foo']

  it 'should be order-dependent', ->
    mixin_1 = Mixin.from_obj name: 'mixin_1', foo: 'bar1', baz: 'qux'
    mixin_2 = Mixin.from_obj name: 'mixin_2', foo: 'bar2', qux: 'baz'

    class Foo
      @mixinto_proto mixin_1
      @mixinto_proto mixin_2

    expect(Foo::foo).toBe 'bar2'
    expect(Foo::baz).toBe 'qux'
    expect(Foo::qux).toBe 'baz'

  ###
    This is also a good example of post-mixin hook usage;
    to validate that the caller satisfies a certain schema.
  ###
  it 'should invoke a post-mixin hook with the prototype context', ->
    mixin = MIXINS.schematized_protomixin()

    spyOn(mixin, 'post_protomixin').and.callThrough()

    expect(->
      class Foo
        @mixinto_proto mixin, ['arg1', 'arg2']
    ).toThrow new TypeError('Wanted schema key special_key')

    class Foo
      special_key: 1

      @mixinto_proto mixin, ['arg1', 'arg2']

    expect(mixin.post_protomixin).toHaveBeenCalledWith(['arg1', 'arg2'])
    expect(mixin.post_protomixin.calls.count()).toBe 2

    it 'should omit mixin keys', ->
      mixin = def
