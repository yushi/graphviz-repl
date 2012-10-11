'use strict';

var exec = require('child_process').exec
var fs = require('fs')
var path = require('path')
var util = require('util')
var events = require('events')

var GraphvizREPL = module.exports =function GraphvizREPL(dotPath){
  this.dotPath = dotPath
  this.running = 0
  this.maxrun = 1
  this.queue = []
  events.EventEmitter.call(this)
}
util.inherits(GraphvizREPL, events.EventEmitter)

GraphvizREPL.prototype.binPath = function(){
  return path.dirname(this.dotPath)
}

GraphvizREPL.prototype._compilerPath = function(type){
  var types = ['dot'
              ,'neato'
              ,'twopi'
              ,'circo'
              ,'fdp'
              ,'sfdp']
  if(types.indexOf(type) < 0){
    throw new Error(type + ' not allowed')
  }
  return [this.binPath(), type].join('/')
}

GraphvizREPL.prototype.compile = function(dot, type){
  this.queue.push([dot, type])
  this._compile()
}

GraphvizREPL.prototype._compiledCb = function(){
  var _this = this;
  return function(err, stdout, stderr){
    _this.running -= 1
    _this._compile()
    _this.emit('compiled', err, stdout, stderr)
  }
}

GraphvizREPL.prototype._compile = function(){
  if(this.queue.length == 0){
    return
  }

  if(this.running > this.maxrun){
    return
  }

  var q = this.queue.shift()
  var dot = q[0],
      type = q[1]

  this.running += 1
  var child = exec(this._compilerPath(type) + ' -Tpng',
                   this._compiledCb())
  child.stdout.setEncoding('binary')
  child.stdin.write(dot)
  child.stdin.end()
}
