describe 'mixit.protomixin', ->

  mixit = require '../src/mixit'
  {beforeOnce, _, mixins} = require './helpers'

  it 'should allow protomixins', ->
    expect(_.isFunction mixit.enable_protomixin).toBe true

  describe 'protomixin', ->

    beforeOnce ->
      mixit.enable_protomixin()

    it 'should mix into the prototype', ->
      class Foo
        @mixinto_proto mixins.default()

      expect(Foo::foo).toBe 'bar'
      expect(Foo::bar).toBe 1
      expect(Foo::baz()).toEqual ['bar']

      expect(Foo.foo).toBeUndefined()
      expect(Foo.bar).toBeUndefined()
      expect(Foo.baz).toBeUndefined()

    it 'should be order-dependent', ->
      class Foo
        @mixinto_proto foo: 'bar', baz: 'qux'
        @mixinto_proto foo: 'baz', qux: 'baz'

      expect(Foo::foo).toBe 'baz'
      expect(Foo::baz).toBe 'qux'
      expect(Foo::qux).toBe 'baz'

    it 'should throw an error when mixing bogus mixins', ->
      expect(->
        class Foo
          @mixinto_proto 'String'
      ).toThrow new TypeError('Expected object, got something else')

      expect(->
        class Foo
          @mixinto_proto []
      ).toThrow new TypeError('Expected object, got Array')

      expect(->
        class Foo
          @mixinto_proto undefined
      ).toThrow new TypeError('Expected object, got null-equivalent')

    it 'should invoke a post-mixin hook with the prototype context', ->
      mixin = _.extend(
        mixins.default(),

        schema: ['special_key']

        # ...
        # mixin methods that act on @special_key
        # ..

        post_protomixin: ->
          for key in @schema
            unless @[key]?
              throw new TypeError("Wanted schema key #{key}")
      )

      spyOn(mixin, 'post_protomixin').and.callThrough()

      expect(->
        class Foo
          @mixinto_proto mixin, ['arg1', 'arg2']
      ).toThrow new TypeError('Wanted schema key special_key')


      class Foo
        special_key: 1

        @mixinto_proto mixin, ['arg1', 'arg2']

      expect(mixin.post_protomixin).toHaveBeenCalledWith(['arg1', 'arg2'])