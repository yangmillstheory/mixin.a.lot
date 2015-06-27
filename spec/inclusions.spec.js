describe('mixit.inclusions', (function(_this) {
  return function() {
    var _, mixit;
    mixit = require('../src/mixit');
    _ = require('underscore');
    return it('should support inclusions', function() {
      return expect(_.isFunction(mixit.inclusions)).toBe(true);
    });
  };
})(this));
