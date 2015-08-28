mixer = require '../mixer'


PROTOMIXING_KEY = 'proto_mix'
PROTOMIXING_ALIASES = [
  'mixinto_proto'
]


enable_protomixing = ->
  mixer.enable_mixing(
    Function::,
    -> mixer.mix(@::, arguments...),
    PROTOMIXING_KEY,
    PROTOMIXING_ALIASES)

module.exports = {enable_protomixing}