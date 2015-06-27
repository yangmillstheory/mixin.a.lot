describe 'mixit.extensions', =>

  mixit = require '../src/mixit'
  _ = require 'underscore'

  it 'should support extensions', =>
    expect(_.isFunction mixit.extensions).toBe true