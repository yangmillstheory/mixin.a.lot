Jasmine = require 'jasmine'
SpecReporter = require 'jasmine-spec-reporter'

j = new Jasmine
j.loadConfig
  spec_dir: "spec"
  spec_files: [
    "**/*.spec.js"
  ]
  helpers: [
    "helpers/**/*.js"
  ]


j.onComplete (passed) ->
  if passed
    console.info  '\nAll good.'
  else
    console.error '\nTrouble and strife.'

j.addReporter new SpecReporter
j.execute()