Path = require('path')
FS = require('fs')
traceur = require 'traceur'

module.exports = (config)->
  config.application or= 'application.js'

  config.vendors.prefix or= []
  config.vendors.prefix.unshift Path.resolve __dirname, '../node_modules'
  config.vendors.js or= []
  config.vendors.js.push 'traceur/bin/traceur-runtime.js'

  config.esnext or= {}
  config.esnext.modules or= 'commonjs'
  config.esnext.options or=
    asyncFunctions: yes
    arrayComprehension: yes
    generatorComprehension: yes
    exopnentiation: yes
    symbols: yes
    types: yes
    typeAssertions: yes
    atcript: yes
  config.esnext.options.modules = config.esnext.modules

  compiler = new traceur.NodeCompiler config.esnext.options

  ScriptWatcher = require('rupert/node_modules/stassets/lib/Watchers/Script')

  ScriptWatcher::getFilenames = ->
    Path.resolve __dirname, Path.join config.root[0], config.application

  ScriptWatcher::compile = ->
    file = @getFilenames()
    try
      contents = FS.readFileSync file, 'utf-8'
      @content = compiler.compile(
        contents, Path.relative(__dirname, file), Path.dirname(file)
      )
      @hasMap = yes
      @map = compiler.getSourceMap()
    catch err
      @printError err.stack

  return config
