require('coffee-script/register')

config =
  name: 'rupert-config-esnext.test'
  root: __dirname
  stassets:
    verbose: yes
    root: '../fixtures'
    scripts:
      types: ['*']
    vendors:
      config:
        dependencies: {}

config.stassets.vendors.config.dependencies[__dirname + '/../src/config'] = yes

if describe?
  describe 'Rupert Config ESNext', ->
    app = null
    rupert = require('rupert')(config)
    before (done)->
      rupert.start ->
        app = rupert.app
        done()

    it 'defines new script types', ->
      ScriptWatcher = require 'rupert/node_modules/stassets/lib/Watchers/Script'
      types = Object.keys(ScriptWatcher.renderers)
      types.length.should.equal 5

    it 'renders esnext files into a bundle', (done)->
      request = require('supertest')(app)
      request.get('/application.js')
      .set('Accept', 'application/javascript')
      .expect(200)
      .expect('Content-Type', /javascript/)
      .expect (res)->
        console.log res.text
      .end(done)
else
  rupert = require('rupert')(config)
  rupert.start()
