gulp = require 'gulp'

SRC = 'src'
DEST = 'dist'
SPEC = 'spec'

#config =
#
#  SRC: SRC
#  DST: DST
#
#  karma:
#    config_file: "#{__dirname}/../karma.conf.coffee"


gulp.task 'coffee', ->
  gulp
    .src("#{SRC}/**/*.coffee")
    .pipe(coffee(bare: true))
    .pipe(gulp.dest(DEST))