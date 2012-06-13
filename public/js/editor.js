
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
	
	var onToolboxChange = function(){
		sliderio.view.editor.slider.refresh();
	};
	
	sliderio.view.toolbox.init({
		sliderIndex: 0,
		slides: sliderio.view.editor.slider.getSlides(),
		onMove: onToolboxChange,
		onInsertSlide: onToolboxChange,
		onRemoveSlide: onToolboxChange
	});
		
	sliderio.view.editor.slider.init();
}

$(document).ready(function(){
	hljs.tabReplace = '  ';
	
	buildEditor();
});

