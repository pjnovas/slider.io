
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
			$.getJSON('/js/editor/json/toolbox.json', function(data){
				done(data);			
		  }).error(onError);
		}
	};
})(jQuery); 
