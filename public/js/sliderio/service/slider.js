
var sliderio = sliderio || {};
sliderio.service = sliderio.service || {};

sliderio.service.slider = (function($){
	return {
		getSlides: function(done, error) {
			$.getJSON('slides.json', function(data){
				done(data);
		  }).error(function(data,status,xhr) { 
		  	if (error) error({
		  		"data": data,
		  		"status": status,
		  		"xhr": xhr
	  		}); 
		  });
		},
		getConfig: function(done, error) {
			
		}
	};
})(jQuery); 
