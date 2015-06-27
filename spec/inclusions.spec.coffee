describe 'mixit.inclusions', =>

  mixit = require '../src/mixit'
  {beforeOnce, _} = require './helpers'

  it 'should support inclusions', =>
    expect(_.isFunction mixit.inclusions).toBe true

  describe 'including', ->

    beforeOnce ->
      mixit.inclusions()

    it 'should allow instance-level mixing', =>
      mixin = foo: 'bar', bar: 1, baz: -> [@foo]

      class Foo
        @include mixin

      expect(Foo::foo).toBe 'bar'
      expect(Foo::bar).toBe 1
      expect(Foo::baz()).toEqual ['bar']

      expect(Foo.foo).toBeUndefined()
      expect(Foo.bar).toBeUndefined()
      expect(Foo.baz).toBeUndefined()