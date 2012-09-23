var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , fs = require('fs')
  , optimist = require('optimist')
  , argv = optimist
           .usage('Graphviz REPL.\nUsage: $0 [--dot /path/to/dot] [--addr LISTEN_ADDR] [--port PORT]')
           .argv;

if(argv.h || argv.help){
  optimist.showHelp()
  process.exit(-1)
}
var app = express();

app.configure(function(){
  app.set('port', argv.port || 3000)
  app.set('addr', argv.addr || 'localhost')
  app.set('views', __dirname + '/views')
  app.set('view engine', 'jade')
  app.use(express.favicon())
  app.use(express.logger('dev'))
  app.use(express.bodyParser())
  app.use(express.methodOverride())
  app.use(app.router)
  app.use(express.static(path.join(__dirname, 'public')))
});

app.configure('development', function(){
  app.use(express.errorHandler())
});

function findDotPath(){
  var cands = ['/bin/dot', '/usr/bin/dot', '/usr/local/bin/dot']
  if(argv.dot){
    cands.unshift(argv.dot)
  }
  for(var i in cands){
    if(fs.existsSync(cands[i])){
      console.warn('using ' + cands[i])
      return cands[i]
    }
  }
  throw new Error('dot executable not found')
}

routes.setDotPath(findDotPath())
app.get('/', routes.index)
app.post('/compile.b64', routes.compile_to_base64)

http.createServer(app).listen(
  app.get('port'),
  argv.addr || 'localhost',
  function(){
    console.log(['server listening on', app.get('addr'), app.get('port')].join(' '));
  });
