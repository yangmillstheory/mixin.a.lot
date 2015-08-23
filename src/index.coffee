{enable_protomixing} = require './protomixing'
{enable_staticmixing} = require './staticmixing'
{make} = require './mixin'


module.exports = {
  enable_staticmixing
  enable_protomixing
  make_mixin: make

  # keep backwards-compatibility with
  # deprecated terminology. 1.1.1 change; see CHANGELOG
  enable_classmixing: enable_staticmixing
}