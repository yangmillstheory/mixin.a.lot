describe 'mixit.extensions', =>

  mixit = require '../src/mixit'
  {beforeOnce, _} = require './helpers'

  it 'should support extensions', =>
    expect(_.isFunction mixit.extensions).toBe true


  describe 'extending', ->

    beforeOnce ->
      mixit.extensions()

    it 'should allow class-level mixing', =>
      mixin = foo: 'bar', bar: 1, baz: -> [@foo]

      class Foo
        @extend mixin

      expect(Foo.foo).toBe 'bar'
      expect(Foo.bar).toBe 1
      expect(Foo.baz()).toEqual ['bar']

      expect(Foo::foo).toBeUndefined()
      expect(Foo::bar).toBeUndefined()
      expect(Foo::baz).toBeUndefined()

