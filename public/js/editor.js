
var sliderio = sliderio || {};

function buildEditor(){
	var dSlides = $.Deferred(),
		dConfig = $.Deferred(),
		dToolbox = $.Deferred(),
		dResources = $.Deferred();
	
	$.when(dSlides, dConfig, dToolbox, dResources).done(init);
	
	sliderio.view.editor.slider.build(function(){
		dSlides.resolve();
	});
	
	sliderio.view.editor.config.build(function(){
		dConfig.resolve();
	});
	
	sliderio.view.toolbox.build(function(){
		dToolbox.resolve();
	});
	
	sliderio.view.resources.build(function(){
		dResources.resolve();
	});
}

function init() {
	
	function resizeCtns(){
		var wHeight = $(window).height()
		$('.sliderCtn').height(wHeight);
		$('#mainConfigs').height(wHeight - 55);	
		Slider.resizeSlider();
	}
	
	$(window).bind('resize', resizeCtns);
	
	sliderio.view.toolbox.init({
		sliderIndex: 0,
		slides: sliderio.view.editor.slider.getSlides(),
		onMove: function(){
			sliderio.view.editor.slider.refresh();			
		},
		onInsertSlide: function(){
			sliderio.view.editor.slider.save();
			sliderio.view.editor.slider.init();
		},
		onRemoveSlide: function(){
			sliderio.view.editor.slider.save();
			sliderio.view.editor.slider.init();
		}
	});
		
	sliderio.view.editor.slider.init();
	resizeCtns();
}

$(document).ready(function(){
	hljs.tabReplace = '  ';
	
	var times = 0;
	var authenticate = function(){
		times++;
		if (times < 3){
			sliderio.passcode = prompt("Passcode", "");
			sliderio.service.slider.authenticate(sliderio.passcode, buildEditor, authenticate);
		}
		else window.location.href = '/slider';
	};
	
	authenticate();
	
});

