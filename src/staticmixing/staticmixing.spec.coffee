describe 'static_mix', ->

  mixin_a_lot = require '../index'
  mixer = require '../mixer'
  {MIXINS} = require '../spec-utils'
  _ = require 'underscore'

  describe 'enabling static_mix', ->

    it 'should return true when static_mix is first enabled', ->
      expect(mixin_a_lot.enable_staticmixing()).toBe true

    it 'should return false if static_mix is already enabled', ->
      expect(mixin_a_lot.enable_staticmixing()).toBe false

  it 'should attach a non-enumerable, immutable .static_mix to Function.prototype', ->
    expect(_.isFunction Function::static_mix).toBe true
    expect(Object.keys Function::).not.toContain 'static_mix'

    delete Function::static_mix
    expect(_.isFunction Function::static_mix).toBe true

    Function::static_mix = 'bar'
    expect(_.isFunction Function::static_mix).toBe true

  it 'should mix into the prototype', ->
    mixin = MIXINS.default_mixin()
    spyOn(mixer, 'mix').and.callThrough()

    mix_options = {}
    class Example
      @static_mix mixin, mix_options

    expect(mixer.mix).toHaveBeenCalledWith(Example, mixin, mix_options)