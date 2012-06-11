
var sliderio = sliderio || {};
sliderio.view = sliderio.view || {};

sliderio.view.partials = (function($){
	var injectToBody = function(templates){
		$('body').append(templates);
	};
	
	return {
		importSlides: function(done) {
			$.get('/partialViews/_slides.html', function(templates) {
			  injectToBody(templates);
			  done();
			});
		},
		
		importConfig: function(done) {
			$.get('/partialViews/_config.html', function(templates) {
			  injectToBody(templates);
			  done();
			});
		},
		
		importEditor: function(done) {
			$.get('/partialViews/_editor.html', function(templates) {
			  injectToBody(templates);
			  done();
			});
		}
	};
})(jQuery); 
