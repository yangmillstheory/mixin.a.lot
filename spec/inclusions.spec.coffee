describe 'mixit.inclusions', =>

  mixit = require '../src/mixit'
  _ = require 'underscore'

  it 'should support inclusions', =>
    expect(_.isFunction mixit.inclusions).toBe true



