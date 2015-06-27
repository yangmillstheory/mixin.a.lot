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
      inclusion = _.extend(
        mixins.default(),

        # ...
        # mixin methods that act on @num_foos
        # ..

        post_protomixin: (schema) ->
          for key in schema
            unless @[key]?
              throw new TypeError("Wanted schema key #{key}")
      )

      expect(->
        class Foo
          @mixinto_proto inclusion, ['num_foos']
      ).toThrow new TypeError('Wanted schema key num_foos')

      expect(->
        class Foo
          num_foos: 1

          @mixinto_proto inclusion, ['num_foos']
      ).not.toThrow()