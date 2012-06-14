
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
}

$(document).ready(function(){
	hljs.tabReplace = '  ';
	
	sliderio.passcode = prompt("PassCode?", "");
	
	$.ajax({
    url: "authenticate",
    type: "POST",
    dataType: "json",
    data: JSON.stringify({passcode: sliderio.passcode}),
    contentType: "application/json",
    cache: false,
    timeout: 5000,
    error: function(data, status, xhr){
    	if (data.status === 401) {
    		window.location.href = "?";
    	}
    },
  }); 
	
	
	buildEditor();
});

