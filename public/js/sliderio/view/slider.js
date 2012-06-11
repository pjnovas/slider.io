
var sliderio = sliderio || {};
sliderio.view = sliderio.view || {};

sliderio.view.slider = (function($){
	return {
		importSlides: function(done) {
			$.get('/partialViews/_slides.html', function(templates) {
			  $('body').append(templates);
			  done();
			});
		}
	};
})(jQuery); 
