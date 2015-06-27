describe 'mixit.classmixin', ->

  mixit = require '../src/mixit'
  {beforeOnce, _, mixins} = require './helpers'

  it 'should allow classmixins', ->
    expect(_.isFunction mixit.enable_classmixin).toBe true

  describe 'classmixin', ->

    beforeOnce ->
      mixit.enable_classmixin()

    it 'should mix into the class', ->
      class Foo
        @mixinto_class mixins.default()

      expect(Foo.foo).toBe 'bar'
      expect(Foo.bar).toBe 1
      expect(Foo.baz()).toEqual ['bar']

      expect(Foo::foo).toBeUndefined()
      expect(Foo::bar).toBeUndefined()
      expect(Foo::baz).toBeUndefined()

    it 'should be order-dependent', ->
      class Foo
        @mixinto_class foo: 'bar', baz: 'qux'
        @mixinto_class foo: 'baz', qux: 'baz'

      expect(Foo.foo).toBe 'baz'
      expect(Foo.baz).toBe 'qux'
      expect(Foo.qux).toBe 'baz'

    it 'should throw an error when mixing bogus mixins', ->
      expect(->
        class Foo
          @mixinto_class 'String'
      ).toThrow new TypeError('Expected object, got something else')

      expect(->
        class Foo
          @mixinto_class []
      ).toThrow new TypeError('Expected object, got Array')

      expect(->
        class Foo
          @mixinto_class undefined
      ).toThrow new TypeError('Expected object, got null-equivalent')

    it 'should invoke a post-mixin hook with the class context', ->
      inclusion = _.extend(
        mixins.default(),

        # ...
        # mixin methods that act on @num_foos
        # ..

        post_classmixin: (schema) ->
          for key in schema
            unless @[key]?
              throw new TypeError("Wanted schema key #{key}")
      )

      expect(->
        class Foo
          @mixinto_class inclusion, ['num_foos']
      ).toThrow new TypeError('Wanted schema key num_foos')

      expect(->
        class Foo
          @num_foos: 1

          @mixinto_class inclusion, ['num_foos']
      ).not.toThrow()