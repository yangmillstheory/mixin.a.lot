{MIXER, enable_mixing} = require '../mixer'


PROTOMIXING_KEY = 'proto_mix'
PROTOMIXING_ALIASES = [
  'mixinto_proto'
]


enable_protomixing = ->
  enable_mixing(
    Function::,
    -> MIXER.mix(@::, arguments...),
    PROTOMIXING_KEY,
    PROTOMIXING_ALIASES)

module.exports = {enable_protomixing}