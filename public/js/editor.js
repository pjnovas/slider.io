
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
	//var detailsEditor;
	window.detailsEditor = null;
	
	$('#mainConfigs').show();
	function resizeCtns(){
		var wHeight = $(window).height();
		var dtlHeight = 0;
		
		if ($('#detailsEditorCtn').is(':visible')) {
			dtlHeight = $('#detailsEditorCtn').height();
		}
		
		$('.left-sideCtn').height(wHeight);
		$('.sliderCtn').height(wHeight - dtlHeight-1);
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
	
	$('#editDetails').live('click', function(){
		var dtlCtn = $('#detailsEditorCtn');

		if (dtlCtn.is(':visible')) {
			dtlCtn.height(200).show().stop(true).animate({ height: 1 }, {
				duration: 500,
				step: resizeCtns,
				complete: function() {
					$(this).hide();
					resizeCtns();
				}
			});
		}
		else {
			dtlCtn.height(1).show().stop(true).animate({ height: 200 }, {
				duration: 500,
				step: resizeCtns,
				complete: resizeCtns
			});
		}
	});
	
	
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

