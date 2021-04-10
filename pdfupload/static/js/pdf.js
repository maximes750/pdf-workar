// Loaded via <script> tag, create shortcut to access PDF.js exports.
var pdfjsLib = window['pdfjs-dist/build/pdf'];
// The workerSrc property shall be specified.
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://mozilla.github.io/pdf.js/build/pdf.worker.js';
var totalFiles = [];
//var idNum;
$(document).ready(function(){
	$("#file-upload-input").on("change", function(e){
		var currFile = $(this).get(0).files;
		var original = totalFiles.length;
		totalFiles.push.apply(totalFiles,currFile);
		console.log(totalFiles,currFile,original,totalFiles.length);
		for (var i = original; i < totalFiles.length; ++i)
		{ 
			performAction(i);
		}
	});

	$("#merge-btn").click(function(){
		var formData = new FormData();
		for(var i=0;i<totalFiles.length;i++){
			formData.append("files",totalFiles[i]);
		}
		formData.append("type",$("#chng-span").text());
		$('.pdf-file').each(function (index) { 
			formData.append("values",$("canvas",this).attr("id")); 
		});
		$.ajax({
			type: 'POST',
			url: window.location.pathname,
			data: formData,
			cache: false,
			processData: false,
			contentType: false,
			enctype: 'multipart/form-data',
			success: function (data){
				//alert('The post has been created!')
				$("#download-btn").prop('disabled',false);
				$("#download-btn").find("a").attr("href",window.location.pathname+data);
			},
			error: function(xhr, errmsg, err) {
				console.log(xhr.status + ":" + xhr.responseText)
			}
		})
	});
	$("#download-btn a").click(function(){
		$("#download-btn").prop("disabled",true);
	});
});
function createElement(id,name){
	$("#dragndrop-ui").append("<div class='pdf-file' alt='"+name+"'><span class='cancel-btn' onclick='deleteEle(this)'>X</span><canvas id='"+id+"'class='file-canvas'></canvas><div class='title-span'><span class='title'>"+name+"</span></div></div>");
}

function performAction(i){
	var file = totalFiles[i];
	if(file.type == "application/pdf"){
		var fileReader = new FileReader();
		fileReader.readAsArrayBuffer(file);  
		fileReader.onload = function() {	
			var pdfData = new Uint8Array(this.result);
			// Using DocumentInitParameters object to load binary data.
			var loadingTask = pdfjsLib.getDocument({data: pdfData});
			loadingTask.promise.then(function(pdf) {
			
			// Fetch the first page
			var pageNumber = 1;
			pdf.getPage(pageNumber).then(function(page) {
				console.log('Page loaded');
				
				var scale = 1.5;
				var viewport = page.getViewport({scale: scale});
				createElement(i,file.name);
				var canvas = document.getElementById(i.toString());
				var context = canvas.getContext('2d');
				canvas.height = viewport.height;
				canvas.width = viewport.width;

				// Render PDF page into canvas context
				var renderContext = {
				canvasContext: context,
				viewport: viewport
				};
				var renderTask = page.render(renderContext);
				renderTask.promise.then(function () {
				console.log('Page rendered');
				});
			});
			}, function (reason) {
			// PDF loading error
			console.error(reason);
			});
		};
	}
}