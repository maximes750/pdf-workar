$(document).ready(function(){
    //for mobile user drage and drop
    init();
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

function touchHandler(event) {
    var touch = event.changedTouches[0];

    var simulatedEvent = document.createEvent("MouseEvent");
        simulatedEvent.initMouseEvent({
        touchstart: "mousedown",
        touchmove: "mousemove",
        touchend: "mouseup"
    }[event.type], true, true, window, 1,
        touch.screenX, touch.screenY,
        touch.clientX, touch.clientY, false,
        false, false, false, 0, null);

    touch.target.dispatchEvent(simulatedEvent);
    event.preventDefault();
}

function init() {
    document.addEventListener("touchstart", touchHandler, true);
    document.addEventListener("touchmove", touchHandler, true);
    document.addEventListener("touchend", touchHandler, true);
    document.addEventListener("touchcancel", touchHandler, true);
}