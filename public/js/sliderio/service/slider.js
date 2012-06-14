
var sliderio = sliderio || {};
sliderio.service = sliderio.service || {};

sliderio.service.slider = (function($){
	var onError = function(data, status, xhr){
		console.dir({
  		"data": data,
  		"status": status,
  		"xhr": xhr
		});
	};
	
	return {
		getSlides: function(done) {
			$.getJSON('slides.json', function(data){
				done(data);
		  }).error(onError);
		},
		
		getConfig: function(done) {
			$.getJSON('config.json', function(data){
				done(data);
		  }).error(onError);
		},
		
		getToolbox: function(done){
			$.getJSON('/js/sliderio/data/toolbox.json', function(data){
				done(data);			
		  }).error(onError);
		},
		
		saveSlides: function(slides, done){
			$.ajax({
		    url: "slides.json",
		    type: "POST",
		    dataType: "json",
		    data: JSON.stringify({passcode: sliderio.passcode, slider: slides}),
		    contentType: "application/json",
		    cache: false,
		    timeout: 5000,
		    success: done,
		    error: onError,
		  }); 
		},
		
		saveConfig: function(cfg, done){
			$.ajax({
		    url: "config.json",
		    type: "POST",
		    dataType: "json",
		    data: JSON.stringify({passcode: sliderio.passcode, config: cfg}),
		    contentType: "application/json",
		    cache: false,
		    timeout: 5000,
		    success: done,
		    error: onError,
		  }); 
		},
		
		getResources: function(done) {
			$.getJSON('resources', function(data){
				done(data);
		  }).error(onError);
		},
		
		removeResource: function(res, done) {
			$.ajax({
		    url: "resources/del",
		    type: "POST",
		    dataType: "json",
		    data: JSON.stringify({passcode: sliderio.passcode, resource: res}),
		    contentType: "application/json",
		    cache: false,
		    timeout: 5000,
		    success: done,
		    error: onError,
		  }); 
		}
	};
})(jQuery); 
