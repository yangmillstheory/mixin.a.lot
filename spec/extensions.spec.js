describe('mixit.extensions', (function(_this) {
  return function() {
    var _, mixit;
    mixit = require('../src/mixit');
    _ = require('underscore');
    return it('should support extensions', function() {
      return expect(_.isFunction(mixit.extensions)).toBe(true);
    });
  };
})(this));
