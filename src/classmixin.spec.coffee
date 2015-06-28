#describe 'mix.it.classmixin', ->
#
#  mixit = require '../src/mix.it'
#  {beforeOnce, _, MIXINS} = require './helpers'
#
#  it 'should allow classmixins', ->
#    expect(_.isFunction mixit.enable_classmixin).toBe true
#
#  beforeOnce ->
#    mixit.enable_classmixin()
#
#  it 'should mix into the class', ->
#    class Foo
#      @mixinto_class MIXINS.default()
#
#    expect(Foo.foo).toBe 'bar'
#    expect(Foo.bar).toBe 1
#    expect(Foo.baz()).toEqual ['bar']
#
#    expect(Foo::foo).toBeUndefined()
#    expect(Foo::bar).toBeUndefined()
#    expect(Foo::baz).toBeUndefined()
#
#  it 'should be order-dependent', ->
#    class Foo
#      @mixinto_class foo: 'bar', baz: 'qux'
#      @mixinto_class foo: 'baz', qux: 'baz'
#
#    expect(Foo.foo).toBe 'baz'
#    expect(Foo.baz).toBe 'qux'
#    expect(Foo.qux).toBe 'baz'
#
#  it 'should throw an error when mixing bogus mixins', ->
#    expect(->
#      class Foo
#        @mixinto_class 'String'
#    ).toThrow new TypeError('Expected object, got something else')
#
#    expect(->
#      class Foo
#        @mixinto_class []
#    ).toThrow new TypeError('Expected object, got Array')
#
#    expect(->
#      class Foo
#        @mixinto_class undefined
#    ).toThrow new TypeError('Expected object, got null-equivalent')
#
#
#  describe 'mixin method customisation', ->
#
#    it 'should allow mixin method customization', ->
#      mixin = MIXINS.schematized()
#      mixin.post_classmixin = mixin.postmixin_hook
#
#      spyOn(mixin, 'post_classmixin').and.callThrough()
#
#      expect(->
#        class Foo
#          @mixinto_class mixin, ['arg1', 'arg2']
#      ).toThrow new TypeError('Wanted schema key special_key')
#
#
#      class Foo
#        @special_key: 1
#
#        @mixinto_class mixin, ['arg1', 'arg2']
#
#      expect(mixin.post_classmixin).toHaveBeenCalledWith(['arg1', 'arg2'])
#
#    it 'should allow overriding mixin properties and methods', ->
#      class Foo
#
#        @mixinto_class MIXINS.default()
#
#        @foo = 1
#        @baz = ->
#          @foo + 100
#
#      expect(Foo.baz()).toBe(101)
#
#    it 'should have hooks', ->
#      class Foo
#
#        @mixinto_class MIXINS.default()
#
#        @foo = 1
#
#        @prebaz_hook = ->
#          @foo++
#        @postbaz_hook = (baz_value) ->
#          [baz_value].concat [100]