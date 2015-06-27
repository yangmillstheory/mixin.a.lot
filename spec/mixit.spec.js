describe('mixit', (function(_this) {
  return function() {
    var _, mixit;
    mixit = require('../src/mixit');
    _ = require('underscore');
    it('should support extensions', function() {
      return expect(_.isFunction(mixit.extensions)).toBe(true);
    });
    return it('should support inclusions', function() {
      return expect(_.isFunction(mixit.inclusions)).toBe(true);
    });
  };
})(this));
