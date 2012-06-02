
var socketIOReady = $.Deferred();
var jsonReady = $.Deferred();
var templatesReady = $.Deferred();
$.when(socketIOReady, jsonReady, templatesReady).done(initSlider);

var socket = io.connect(); 

socket.on('connect', function() {
	socket.emit('joinSlider', sliderName);
});

function updateClients(current){
	$('#clients-holder').text(current);
}

socket.on('clientOnline', function (data) {
  updateClients(data.current);
});

socket.on('clientOffline', function (data) {
  updateClients(data.current);
});

socket.on('initSlider', function (data) {
  updateClients(data.current);
  socketIOReady.resolve(data);
});

socket.on('moveSlider', function (data) {
	if (Slider) {
		Slider.moveTo(data.index);
	}
});

socket.on('updatedItemList', function (data) {
	if (Slider) {
		Slider.updateList(data.itemIndex);
	}
});

socket.on('toggleSlider', function (data) {
  if (Slider)
  	Slider.toggle(data.visible);
});

function injectTemplates(){
	$.get('/partialViews/_slides.html', function(templates) {
	  $('body').append(templates);
	  templatesReady.resolve();
	});
}

function getSlides(){
	$.getJSON('slides.json', function(data){
		jsonReady.resolve(data);
		
  }).error(function(data,status,xhr) { 
  	console.dir({
	  		"data": data,
	  		"status": status,
	  		"xhr": xhr
  		}); 
  });
}

function initSlider(sliderInfo, jsonData){
	Slider.init(jsonData, sliderInfo.index);
	Slider.toggle(sliderInfo.visible);
	Slider.updateList(sliderInfo.itemIndex);
}

$(document).ready(function(){
	hljs.tabReplace = '  ';
	
	injectTemplates();
	getSlides();
});






