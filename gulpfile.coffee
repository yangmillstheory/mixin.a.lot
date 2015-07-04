gulp = require 'gulp'

coffee = require 'gulp-coffee'
concat = require 'gulp-concat'
del = require 'del'


SRC =
  base: 'src'
  files: ->
    ["#{@base}/**/*.coffee"]

BUILD =
  base: 'build'
  files: ->
    [
      "#{@base}/**/*.js"
      "!#{@base}/**/*.spec.js"
      "!#{@base}/spec-utils/*"
    ]

DIST =
  base: '.'
  file: ->
    "#{@base}/index.js"
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
  gulp
    .src(BUILD.files())
    .pipe(concat(DIST.file()))
    .pipe(gulp.dest DIST.base)


gulp.task 'build', gulp.series('clean', 'coffee', 'concat')