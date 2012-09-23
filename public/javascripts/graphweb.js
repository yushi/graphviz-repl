var compiling = false
var needCompile = true
var type = 'dot'
function dotData(){
  return $('#dot').val()
}

function error(text){
  var errArea = $('#msg');
  if(text){
    errArea.text(text)
    errArea.fadeIn()
  }else{
    errArea.fadeOut()
  }
}

function setType(selected){
  type = $(selected).attr('type')
  var items = $(selected).parent().parent().children()
  items.each(function(e){
    $($($(items[e]).children()[0]).children()[0]).text('　')
  });
  $($(selected).children()[0]).text('✓')
  needCompile = true
}

function getType(){
  return type
}

function compile(dotData, cb){
  if(compiling){
    return;
  }
  compiling = true
  $.ajax({
    type: 'POST',
    url: '/compile.b64',
    data: {dot: dotData
          ,type: getType()},
    success: function(data, textStatus, jqXHR){
      compiling = false
      $('#graph').attr('src',data)
      error()
      if(cb){
        cb()
      }
    },
    error: function(jqXHR, textStatus, errorThrown){
      compiling = false
      if(jqXHR.status == 400){
        error(jqXHR.responseText)
        $('#graph').attr('src','/no_such_path')
      }
      if(cb){
        cb()
      }
    }
  })
}

var _dotData = ''
function autoCompileDo(){
  if(_dotData != $('#dot').val()){
    needCompile = true;
    _dotData = $('#dot').val()
  }

  if(!needCompile){
    return
  }
  compile(dotData(),
          function(){
            needCompile = false;
          })
}

$(document).ready(function(){
  $('#dot').focus()
  setInterval(autoCompileDo, 1000)
})
