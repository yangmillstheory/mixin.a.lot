gulp = require 'gulp'

coffee = require 'gulp-coffee'
del = require 'del'


SRC =
  base: 'src'
  files: ->
    ["#{@base}/**/*.coffee"]

BUILD =
  base: 'build'

DIST =
  base: '.'
  file: ->
    "#{@.base}/mixin-a-lot.js"
  excludes: [
    "!#{BUILD.base}/util/spec.coffee"
    "!#{BUILD.base}/**/*.spec.coffee"
  ]


gulp.task 'clean', (postDelete) ->
  del([DIST.file(), BUILD.base], force: true, postDelete?())


gulp.task 'coffee', ->
  gulp
    .src(SRC.files())
    .pipe(coffee(bare: true))
    .pipe(gulp.dest(BUILD.base))


gulp.task 'concat', ->


gulp.task 'build', gulp.series('clean', 'coffee', 'concat')