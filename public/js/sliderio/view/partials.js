
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
		
		importStyles: function(done) {
			$.get('/partialViews/_style.html', function(templates) {
			  injectToBody(templates);
			  done();
			});
		},
		
		importEditor: function(done) {
			$.get('/partialViews/_editor.html', function(templates) {
			  injectToBody(templates);
			  done();
			});
		},
		
		importToolbox: function(done) {
			$.get('/partialViews/_toolbox.html', function(templates) {
			  injectToBody(templates);
			  done();
			});
		},
		
		importResources: function(done) {
			$.get('/partialViews/_resources.html', function(templates) {
			  injectToBody(templates);
			  done();
			});
		}
	};
})(jQuery); 
