mixer = require '../mixer'


STATICMIXING_KEY = 'static_mix'
STATICMIXING_ALIASES = [
  'mixinto_class'
]


enable_staticmixing = ->
  mixer.enable_mixing(
    Function::,
    -> mixer.mix(@, arguments...),
    STATICMIXING_KEY,
    STATICMIXING_ALIASES)

module.exports = {enable_staticmixing}