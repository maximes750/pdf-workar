$(document).ready(function(){
    //for mobile user drage and drop
    var doch=$(document).height();
    var headh=$('header').height();
    $('#file-upload').height(doch-headh-20);
    $('#add-file').click(function(){
        $('#file-upload-input').click();
    });
    $("#type-frame div span").click(function(){
        $("#chng-span").text($(this).text());
    });
});
$(function() { 
    $( "#dragndrop-ui" ).sortable({ 
    update: function(event, ui) { 
        updateFunc(); 
    }          
    }); 
}); 
function updateFunc() { 
}
function deleteEle(elem){
    $(elem).parent().remove();
}

$.ajaxSetup({
    headers: { "X-CSRFToken": '{{csrf_token}}' }
});
