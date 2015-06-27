describe 'mixit.inclusions', =>

  mixit = require '../src/mixit'
  {beforeOnce, _, default_mixin} = require './helpers'

  it 'should support inclusions', =>
    expect(_.isFunction mixit.inclusions).toBe true

  describe 'including', ->

    beforeOnce ->
      mixit.inclusions()

    it 'should allow instance-level mixing', =>
      class Foo
        @include default_mixin()

      expect(Foo::foo).toBe 'bar'
      expect(Foo::bar).toBe 1
      expect(Foo::baz()).toEqual ['bar']

      expect(Foo.foo).toBeUndefined()
      expect(Foo.bar).toBeUndefined()
      expect(Foo.baz).toBeUndefined()

    it 'should throw an error when including bogus mixins', ->
      expect(->
        class Foo
          @include 'String'
      ).toThrow new TypeError('Expected object, got something else')

      expect(->
        class Foo
          @include []
      ).toThrow new TypeError('Expected object, got Array')

      expect(->
        class Foo
          @include undefined
      ).toThrow new TypeError('Expected object, got null-equivalent')

    it 'should invoke a postinclude hook with the prototype context', ->
      inclusion = _.extend(
        default_mixin(),
        postinclude: (key, value) ->
          @["__#{key}__"] = value
      )

      class Foo
        @include inclusion, 'secret', 100

      expect(Foo::__secret__).toBe 100
