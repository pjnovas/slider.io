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
	var stylesReady = $.Deferred();
	
	$.when(jsonReady, templatesReady, stylesReady).done(initSlider);
	
	sliderio.view.partials.importSlides(function(){
		templatesReady.resolve();
	});
	
	sliderio.view.partials.importStyles(function(){
		stylesReady.resolve();
	});
	
	sliderio.service.slider.getSlides(function(data){
		jsonReady.resolve(data);
	});
});

