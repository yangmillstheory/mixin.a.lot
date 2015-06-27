_ = require 'underscore'


beforeOnce = (fn) ->
  _.once(beforeEach fn)


module.exports = {beforeOnce, _}