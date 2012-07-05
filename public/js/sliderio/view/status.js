
var sliderio = sliderio || {};
sliderio.view = sliderio.view || {};

sliderio.view.status = (function($){
	var saveStatus,
		span;
	
	return {
		show: function(msg){
			saveStatus = $('#save-msg');
		
			if(saveStatus.length === 0)
				saveStatus = $("<div id='save-msg'><span></span></div>").appendTo('body');
				 
			saveStatus.show().css('opacity', 1);
			span = $('span', saveStatus).text(msg);
		},
		success: function(msg){
			span.text(msg);
			saveStatus.addClass('success').stop(true).animate({opacity: 0}, 2000, function(){
				saveStatus.hide();
			});
		},
		error: function(){
			$('a', saveStatus).remove();
			var lnk = $("<a href='#'>Reload</a>")
				.bind('click', function(){
					sliderio.service.slider.revert(function(){
						window.location.href = '/';
					});
				});

			span.text('Error: ');
			saveStatus.addClass('error').append(lnk);
		}
	};

})(jQuery);
