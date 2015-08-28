{enable_protomixing} = require './protomixing'
{enable_staticmixing} = require './staticmixing'
{make} = require './mixin'
{mix} = require './mixer'


module.exports = {
  # core API
  make_mixin: make
  mix

  # deprecated API
  enable_staticmixing
  enable_protomixing

  # keep backwards-compatibility with
  # deprecated terminology. 1.1.1 change; see CHANGELOG
  enable_classmixing: enable_staticmixing
}