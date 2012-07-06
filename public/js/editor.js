
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

function revertPrevius(){
	sliderio.service.slider.revert(function(){
		var dSlides = $.Deferred(),
			dConfig = $.Deferred();
		
		$.when(dSlides, dConfig).done(function(){
			init(sliderio.view.toolbox.currentIndex());
		});
		
		sliderio.view.editor.slider.build(function(){
			dSlides.resolve();
		});
		
		sliderio.view.editor.config.build(function(){
			dConfig.resolve();
		});
	});
}

function init(idx) {
	
	$('#mainConfigs').show();
	function resizeCtns(){
		var wHeight = $(window).height()
		$('.sliderCtn').height(wHeight);
		$('#mainConfigs').height(wHeight-2);	
		Slider.resizeSlider();
	}
	
	$(window).bind('resize', resizeCtns);
	
	sliderio.view.toolbox.init({
		sliderIndex: idx || 0,
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
	
	/*
	 * Revert Event
	 */
	
	var isCtrl = false;
	$("body").live('keydown', function(e){
		switch(e.keyCode || e.which){
			case 17: // Ctrl
				isCtrl = true;
			break;
		}
	});
	
	$("body").live('keyup', function(e){
		
		switch(e.keyCode || e.which){
			case 17: // Ctrl
				isCtrl = false;
			break;
			case 90: // Z
				if (isCtrl){
					revertPrevius();
				}
			break;
		}
		
	});
}

$(document).ready(function(){
	hljs.tabReplace = '  ';
	authenticate(buildEditor);
});

