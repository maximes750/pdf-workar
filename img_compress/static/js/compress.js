var default_quality = 80;
var blob = null;
$(document).ready(function(){
  var doch=$(document).height();
  var headh=$('header').height();
  $('#file-upload').height(doch-headh-20);

  // to make add button action
  $('#add-file').click(function(){
    $('#file-upload-input').click();
  });

  $('#file-upload-input').change(function(){
    display(this);
    $('#quality-value').text(default_quality);
    $('#out-rslt-cnt').css({"display":"block"});
    uploadFile();
  });

  $('#inc-btn').click(function(){
    let curr_val = $('#quality-value').val();
    curr_val = parseInt(curr_val) + 1;
    if(curr_val>=0 && curr_val <101)
      $('#quality-value').val(curr_val);
    uploadFile();
  })

  $('#dec-btn').click(function(){
    let curr_val = $('#quality-value').val();
    curr_val = parseInt(curr_val) - 1;
    if(curr_val>=0 && curr_val <101)
      $('#quality-value').val(curr_val);
    uploadFile();
  })

  $('#quality-value').change(function(){
    if($(this).val()<0 || $(this).val()>100){
      $(this).val(default_quality);
    }
    uploadFile();
  })

  $('#download-btn').click(function(){
    if(blob==null)
      return 0;
    let a = document.createElement("a");
    $('body').append(a);
    a.href = window.URL.createObjectURL(blob);
    a.download = $('#file-upload-input')[0].files[0].name;
    a.click();
    a.remove();
  })

});

function display(input) {
  if (input.files && input.files[0]) {
     var reader = new FileReader();
     reader.onload = function(event) {
        $('#img-source').attr('src', event.target.result);
     }
     reader.readAsDataURL(input.files[0]);
  }
}


function getCookie(name) {
  var cookieValue = null;
  if (document.cookie && document.cookie != '') {
      var cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
          var cookie = jQuery.trim(cookies[i]);
          // Does this cookie string begin with the name we want?
          if (cookie.substring(0, name.length + 1) == (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
  }
  return cookieValue;
}

function display_preview(){
  let imageCnt = document.getElementById('out-img');
  imageCnt.children[0].src = window.URL.createObjectURL(blob);
}

function uploadFile(){
  let formData = new FormData();
  let file = $('#file-upload-input')[0].files[0];
  formData.append("files",file);
  formData.append("quality",$('#quality-value').val())
  let req = new XMLHttpRequest();
  req.responseType = 'blob'
  req.open("POST", window.location.pathname, true);
  req.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
  req.onload = function (event) {
      blob = req.response;
      display_preview();
      $('#out-img-size span').text(blob.size.toString() + " Kb");
      $('#download-btn').prop('disabled',false);
  };
  req.send(formData);
}
