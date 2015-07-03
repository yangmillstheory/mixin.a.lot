Jasmine = require 'jasmine'
SpecReporter = require 'jasmine-spec-reporter'

j = new Jasmine
j.loadConfig
  spec_dir: "build"
  spec_files: [
    "**/*.spec.js"
  ]

j.addReporter new SpecReporter
j.execute()