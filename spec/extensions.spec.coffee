describe 'mixit.extensions', ->

  mixit = require '../src/mixit'
  {beforeOnce, _, mixins} = require './helpers'

  it 'should support extensions', ->
    expect(_.isFunction mixit.extensions).toBe true

  describe 'extending', ->

    beforeOnce ->
      mixit.extensions()

    it 'should allow class-level mixing', ->
      class Foo
        @extend mixins.default()

      expect(Foo.foo).toBe 'bar'
      expect(Foo.bar).toBe 1
      expect(Foo.baz()).toEqual ['bar']

      expect(Foo::foo).toBeUndefined()
      expect(Foo::bar).toBeUndefined()
      expect(Foo::baz).toBeUndefined()

    it 'should throw an error when extending bogus mixins', ->
      expect(->
        class Foo
          @extend 'String'
      ).toThrow new TypeError('Expected object, got something else')

      expect(->
        class Foo
          @extend []
      ).toThrow new TypeError('Expected object, got Array')

      expect(->
        class Foo
          @extend undefined
      ).toThrow new TypeError('Expected object, got null-equivalent')

    it 'should invoke a postextend hook with the class context', ->
      inclusion = _.extend(
        mixins.default(),

        # ...
        # mixin methods that act on @num_foos
        # ..

        postextend: (schema) ->
          for key in schema
            unless @[key]?
              throw new TypeError("Wanted schema key #{key}")
      )

      expect(->
        class Foo
          @extend inclusion, ['num_foos']
      ).toThrow new TypeError('Wanted schema key num_foos')

      expect(->
        class Foo
          @num_foos: 1

          @extend inclusion, ['num_foos']
      ).not.toThrow()