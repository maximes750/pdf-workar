$(document).ready(function(){
    var doch=$(document).height();
    var headh=$('header').height();
    $('#file-upload').height(doch-headh-42);
});    