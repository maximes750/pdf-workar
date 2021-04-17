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
    });
  
    $('#download-btn').click(function(){
      let out = $('#out-rslt').text();
      let bl = new Blob([out],{type:'text/plain; charset = utf-8'});
      let a = document.createElement("a");
      $('body').append(a);
      a.href = window.URL.createObjectURL(bl);
      a.download = "output.txt"
      a.click();
      a.remove();
    })
  
    $('#ocr-btn').click(function(){
      let formData = new FormData();
      let file = $('#file-upload-input')[0].files[0];
      formData.append("files",file);
      let req = new XMLHttpRequest();
      req.open("POST", window.location.pathname, true);
      req.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
      req.onload = function (event) {
          $('#out-rslt').text(req.response);
          $("#download-btn").prop("disabled",false);
      };
      req.send(formData);
    });
  
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