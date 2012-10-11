
var GraphvizREPL = process.env.TEST_COV ?
  require('../lib-cov/graphviz_repl') :
  require('../lib/graphviz_repl')
var should = require('should')
describe('GraphvizREPL', function(){
  var graphvizREPL

  beforeEach(function(){
    graphvizREPL = new GraphvizREPL('./test/dummy_cmds/dot')
  })
  describe('#compile', function(){
    it('compile success', function(done){
      graphvizREPL.on('compiled', function(err, stdout, stderr){
        should.not.exist(null)
        JSON.parse(stdout).should.eql({
          'argv': '-Tpng'
        , 'stdin': 'data'
        })
        stderr.should.eql('')
        done()
      })
      graphvizREPL.compile('data', 'dot')

    })
    it('invalid type', function(){
      (function(){
        graphvizREPL.compile('data', 'none')
      }).should.throw('none not allowed');
    })
  })
})