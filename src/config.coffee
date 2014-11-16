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
      modules: 'instantiate'
      moduleName: @modulename path
      filename: @pathpart path
      sourceMaps: 'inline'
      asyncFunctions: yes
      arrayComprehension: yes
      generatorComprehension: yes
      exopnentiation: yes
      symbols: yes

    options[flag] = val for own flag, val of flags

    content = traceur.compile(code, options)

    # Pull out the sourcemapcomment
    [comment, b64] = new RegExp(
      '\n//# sourceMappingURL=data:application/json;base64,(.+)'
    ).exec(content)
    content = content.replace(comment, '')

    sourceMap = JSON.parse(Buffer(b64, 'base64').toString())
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
      annotations: yes
      classProperties: yes
    ScriptWatcher.renderers.ts.call this, code, path, options

  return config
