describe 'proto_mix', ->

  mixin_a_lot = require '../index'
  mixer = require '../mixer'
  {MIXINS} = require '../spec-utils'
  _ = require 'underscore'

  describe 'enabling proto_mix', ->

    it 'should return true when proto_mix is first enabled', ->
      expect(mixin_a_lot.enable_protomixing()).toBe true

    it 'should return false if proto_mix is already enabled', ->
      expect(mixin_a_lot.enable_protomixing()).toBe false

  it 'should attach a non-enumerable, immutable .proto_mix to Function.prototype', ->
    expect(_.isFunction Function::proto_mix).toBe true
    expect(Object.keys Function::).not.toContain 'proto_mix'

    delete Function::proto_mix
    expect(_.isFunction Function::proto_mix).toBe true

    Function::proto_mix = 'bar'
    expect(_.isFunction Function::proto_mix).toBe true

  it 'should mix into the prototype', ->
    mixin = MIXINS.default_mixin()
    spyOn(mixer, 'mix').and.callThrough()

    mix_options = {}
    class Example
      @proto_mix mixin, mix_options

    expect(mixer.mix).toHaveBeenCalledWith(Example::, mixin, mix_options)