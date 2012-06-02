
var jsonReady = $.Deferred();
var templatesReady = $.Deferred();
$.when(jsonReady, templatesReady).done(initSlider);

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

function initSlider(jsonData){
	Slider.init(jsonData, 0);
	Slider.toggle(true);
	Slider.updateList(10);
}

$(document).ready(function(){
	hljs.tabReplace = '  ';
	
	injectTemplates();
	getSlides();
});

var socket = undefined;





