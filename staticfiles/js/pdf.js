// Loaded via <script> tag, create shortcut to access PDF.js exports.
var pdfjsLib = window['pdfjs-dist/build/pdf'];
// The workerSrc property shall be specified.
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://mozilla.github.io/pdf.js/build/pdf.worker.js';
var totalFiles = [];
var outputPdf = null;
//var idNum;
$(document).ready(function(){
	$("#file-upload-input").on("change", function(e){
		let currFile = $(this).get(0).files;
		let original = totalFiles.length;
		totalFiles.push.apply(totalFiles,currFile);
		for(let i=original;i<totalFiles.length;i++){
			let file = totalFiles[i];
			createElement(i,file.name);
		}
		performAction(original);
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
		downloadFile(window.location.pathname,formData);
	});
	$("#download-btn a").click(function(){
		let fileName = "output.pdf"
		let link = document.createElement("a");
		let blobObj=window.URL.createObjectURL(outputPdf);
		link.href = blobObj;
		$('body').append(link);
		link.download=fileName;
		link.click();
		link.remove();
		$("#download-btn").prop("disabled",true);
	});
});
function createElement(id,name){
	$("#dragndrop-ui").append("<div class='pdf-file' alt='"+name+"'><span class='cancel-btn' onclick='deleteEle(this)'>X</span><canvas id='"+id+"'class='file-canvas'></canvas><div class='title-span'><span class='title'>"+name+"</span></div></div>");
}

function performAction(i){
	let file = false;
	if(i<totalFiles.length)
		file = totalFiles[i];
	if(file && file.type == "application/pdf"){
		let fileReader = new FileReader();
		fileReader.readAsArrayBuffer(file);  
		fileReader.onload = function() {	
			let pdfData = new Uint8Array(this.result);
			// Using DocumentInitParameters object to load binary data.
			let loadingTask = pdfjsLib.getDocument({data: pdfData});
			loadingTask.promise.then(function(pdf) {
			
			// Fetch the first page
			let pageNumber = 1;
			pdf.getPage(pageNumber).then(function(page) {
				console.log('Page loaded');
				
				let scale = 1.5;
				let viewport = page.getViewport({scale: scale});
				let canvas = document.getElementById(i.toString());
				let context = canvas.getContext('2d');
				canvas.height = viewport.height;
				canvas.width = viewport.width;

				// Render PDF page into canvas context
				let renderContext = {
				canvasContext: context,
				viewport: viewport
				};
				let renderTask = page.render(renderContext);
				renderTask.promise.then(function () {
				console.log('Page rendered');
				});
			});
			}, function (reason) {
			// PDF loading error
			console.error(reason);
			});
		};
		fileReader.onloadend = function(){
			performAction(i+1);
		}
	}
}

function downloadFile(urlToSend,formData) {
	var req = new XMLHttpRequest();
	req.open("POST", urlToSend, true);
	req.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
	req.responseType = "blob";
	req.onload = function (event) {
		outputPdf = req.response;
		$("#download-btn").prop("disabled",false);
	};
	req.send(formData);
}