Path = require('path')
traceur = require 'traceur'

module.exports = (config)->
  config.vendors.prefix or= []
  config.vendors.prefix.unshift Path.resolve __dirname, '../node_modules'
  config.vendors.js or= []
  config.vendors.js.push 'traceur/bin/traceur-runtime.js'

  ScriptWatcher = require('rupert/node_modules/stassets/lib/Watchers/Script')
  ScriptWatcher::modulename = (path)->
    types = Object.keys(ScriptWatcher.renderers).join('|')
    path = @pathpart path
    path = path.replace(///
      \.(#{types})$
    ///, '')
    path = path.substr(1) if path.charAt(0) is '/'

  ScriptWatcher.renderers.es6 = (code, path, flags = {})->
    options =
      modules: 'register'
      sourceName: @pathpart path
      moduleName: @pathpart path
      filename: @pathpart path
      sourceMaps: 'memory'
      asyncFunctions: yes
      arrayComprehension: yes
      generatorComprehension: yes
      exopnentiation: yes
      symbols: yes

    console.log options.filename

    options[flag] = val for own flag, val of flags

    compiler = new traceur.NodeCompiler(options)
    content = compiler.compile(code, options.sourceName)
    content = content.replace(new RegExp('^//# source.*$'), '')

    sourceMap = compiler.getSourceMap()
    sourceMap.file = options.filename
    sourceMap.sources = [ options.filename ]
    sourceMap.sourcesContent = [ code ]

    {content, sourceMap, path}

  ScriptWatcher.renderers.ts = (code, path, flags = {})->
    options =
      types: yes
      typeAssertions: yes
    options[flag] = val for own flag, val of flags
    ScriptWatcher.renderers.es6.call this, code, path, options

  ScriptWatcher.renderers.ats = (code, path)->
    options =
      atscript: yes
    ScriptWatcher.renderers.ts.call this, code, path, options

  return config
