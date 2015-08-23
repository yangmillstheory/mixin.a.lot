MIXER = require './mixer'


get_protomixer = ->
  ->
    MIXER.mix(@::, arguments...)


get_classmixer = ->
  ->
    MIXER.mix(@, arguments...)


module.exports = {get_protomixer, get_classmixer}