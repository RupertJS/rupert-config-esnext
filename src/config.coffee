Path = require('path')
traceur = require 'traceur'

module.exports = (config)->
  unless config.assert?
    config.assert = {}
  config.assert.module or= '../node_modules/assert.js/lib/assert.js'

  config.vendors.prefix or= []
  config.vendors.prefix.unshift Path.resolve __dirname, '../node_modules'
  config.vendors.js or= []
  config.vendors.js.push 'traceur/bin/traceur-runtime.js'
  # config.vendors.js.push config.assert.module

  ScriptWatcher = require('rupert/node_modules/stassets/lib/Watchers/Script')
  ScriptWatcher::modulename = (path)->
    types = Object.keys(ScriptWatcher.renderers).join('|')
    path = @pathpart path
    path = path.replace(///
      \.(#{types})$
    ///, '')
    path = path.substr(1) if path.charAt(0) is '/'

  ScriptWatcher::formatRenderError = (err)->
    name = err.constructor.name
    if name is 'Array'
      err.join('\n')
    else
      type = err.arguments[0]
      list = err.arguments[1]
      "#{name}<#{type}>\n#{list.join('\n')}"

  ScriptWatcher.renderers.es6 = (code, path, flags = {})->
    options =
      modules: 'register'
      sourceName: @pathpart path
      moduleName: @modulename path
      filename: @pathpart path
      sourceMaps: 'memory'
      # ES7
      asyncFunctions: yes
      arrayComprehension: yes
      generatorComprehension: yes
      exopnentiation: yes
      symbols: yes
    options[flag] = val for own flag, val of flags

    compiler = new traceur.NodeCompiler(options, Path.dirname(path))
    content = compiler.compile(code, options.sourceName, options.fileName)

    # GrumbleGrumble
    sourceRE = new RegExp('\n//# source.*')
    content = content.replace(sourceRE, '').replace(sourceRE, '')

    sourceMap = compiler.getSourceMap()
    sourceMap.file = options.filename
    sourceMap.sources = [ options.filename ]
    sourceMap.sourcesContent = [ code ]

    {content, sourceMap, path}

  ScriptWatcher.renderers.ts = (code, path, flags = {})->
    options =
      types: yes
      typeAssertions: no #if config.assert then yes else no
      # typeAssertionModule: Path.join __dirname, config.assert.module
    options[flag] = val for own flag, val of flags
    ScriptWatcher.renderers.es6.call this, code, path, options

  ScriptWatcher.renderers.ats = (code, path)->
    options =
      atscript: yes
      annotations: yes
    ScriptWatcher.renderers.ts.call this, code, path, options

  return config
