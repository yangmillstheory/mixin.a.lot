{MIXER, enable_mixing} = require '../mixer'


STATICMIXING_KEY = 'static_mix'
STATICMIXING_ALIASES = [
  'mixinto_class'
]


enable_staticmixing = ->
  enable_mixing(
    Function::,
    -> MIXER.mix(@, arguments...),
    STATICMIXING_KEY,
    STATICMIXING_ALIASES)

module.exports = {enable_staticmixing}