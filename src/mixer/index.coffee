MIXER = require './mixer'


get_protomixer = ->
  ->
    MIXER.mix(@::, arguments...)


get_staticmixer = ->
  ->
    MIXER.mix(@, arguments...)


module.exports = {get_protomixer, get_staticmixer}