$(document).ready(function(){
    var doch=$(document).height();
    var headh=$('header').height();
    $('#file-upload').height(doch-headh-20);
    $('#add-file').click(function(){
        $('#file-upload-input').click();
    });
    $("#type-frame div span").click(function(){
        //var wid=$("#type-btn").width();
        $("#chng-span").text($(this).text());
        //$("#type-btn").css({"min-width":wid+"px"});
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
    /*var values = []; 
    $('.listitemClass').each(function (index) { 
        values.push($(this).attr("id") 
                .replace("imageNo", "")); 
    }); 
    console.log(values);*/
    //$('#outputvalues').val(values); 
}
function deleteEle(elem){
    $(elem).parent().remove();
}

