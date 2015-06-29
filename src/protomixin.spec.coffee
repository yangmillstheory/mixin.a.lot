fdescribe 'mix.it.protomixin', ->

  mixit = require './index'
  {beforeOnce, _, MIXINS} = require './util/spec'

  it 'should allow protomixins', ->
    expect(_.isFunction mixit.enable_protomixin).toBe true

  describe 'protomixing', ->

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
        @mixinto_proto MIXINS.default()

        constructor: (@foo) ->

      expect(Foo::foo).toBe 'bar'
      expect(Foo::bar).toBe 1
      expect(Foo::baz()).toEqual ['bar']

      expect(new Foo('instance_foo').baz()).toEqual ['instance_foo']

#
#    it 'should be order-dependent', ->
#      class Foo
#        @mixinto_proto foo: 'bar', baz: 'qux'
#        @mixinto_proto foo: 'baz', qux: 'baz'
#
#      expect(Foo::foo).toBe 'baz'
#      expect(Foo::baz).toBe 'qux'
#      expect(Foo::qux).toBe 'baz'
#
#    it 'should throw an error when mixing bogus mixins', ->
#      expect(->
#        class Foo
#          @mixinto_proto 'String'
#      ).toThrow new TypeError('Expected object, got something else')
#
#      expect(->
#        class Foo
#          @mixinto_proto []
#      ).toThrow new TypeError('Expected object, got Array')
#
#      expect(->
#        class Foo
#          @mixinto_proto undefined
#      ).toThrow new TypeError('Expected object, got null-equivalent')
#
#    it 'should invoke a post-mixin hook with the prototype context', ->
#      mixin = MIXINS.schematized()
#      mixin.post_protomixin = mixin.postmixin_hook
#
#      spyOn(mixin, 'post_protomixin').and.callThrough()
#
#      expect(->
#        class Foo
#          @mixinto_proto mixin, ['arg1', 'arg2']
#      ).toThrow new TypeError('Wanted schema key special_key')
#
#
#      class Foo
#        special_key: 1
#
#        @mixinto_proto mixin, ['arg1', 'arg2']
#
#      expect(mixin.post_protomixin).toHaveBeenCalledWith(['arg1', 'arg2'])