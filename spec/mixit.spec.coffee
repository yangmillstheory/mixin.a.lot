describe 'mixit', =>

  mixit = require '../src/mixit'
  _ = require 'underscore'

  it 'should support extensions', =>
    expect(_.isFunction mixit.extensions).toBe true

  it 'should support inclusions', =>
    expect(_.isFunction mixit.inclusions).toBe true


