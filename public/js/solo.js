var socket = undefined;

function initSlider(jsonData){
	Slider.init(jsonData, (soloSliderStartInit || 0));
	Slider.toggle(true);
	Slider.updateList(10);
}

$(document).ready(function(){
	hljs.tabReplace = '  ';

	var jsonReady = $.Deferred();
	var templatesReady = $.Deferred();
	$.when(jsonReady, templatesReady).done(initSlider);
	
	sliderio.view.partials.importSlides(function(){
		templatesReady.resolve();
	});
	
	sliderio.service.slider.getSlides(function(data){
		jsonReady.resolve(data);
	});
});

