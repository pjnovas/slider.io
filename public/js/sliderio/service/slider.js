
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
		    error: function(data, status, xhr){
		    	done({}, status);
		    	onError(data, status, xhr);
		    }
		  }); 
		},
		
		revert: function(done){
			$.ajax({
		    url: "revert/previous",
		    type: "POST",
		    dataType: "json",
		    data: JSON.stringify({passcode: sliderio.passcode}),
		    contentType: "application/json",
		    cache: false,
		    timeout: 5000,
		    success: done,
		    error: onError
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
		    url: "resources/" + res.file,
		    type: "DELETE",
		    dataType: "json",
		    data: JSON.stringify({passcode: sliderio.passcode}),
		    contentType: "application/json",
		    cache: false,
		    timeout: 5000,
		    success: done,
		    error: onError,
		  }); 
		},
		
		authenticate: function(_passcode, done, error, sliderName) {
			var _url = "authenticate"; 
			if (sliderName){
				_url = "/slider/" + sliderName + "/" + _url;
			}
			
			$.ajax({
		    url: _url,
		    type: "POST",
		    dataType: "json",
		    data: JSON.stringify({passcode: _passcode}),
		    contentType: "application/json",
		    cache: false,
		    timeout: 5000,
		    cache: false,
		    success: done,
		    error: error,
		  }); 
		},
		
	};
})(jQuery); 




/* TEMP Authentication 
 **********************/

function authenticate(callback, sliderName){
	var popup = $('<div>').addClass('popup-auth');
	
	$('<label>').text('Passcode').appendTo(popup);
	var pass = $("<input name='passcode' type='password'>").appendTo(popup);
	var okBtn = $("<input type='button' value='OK'>").appendTo(popup);
	
	$("<div>").addClass('bg-popup-auth')
		.css("height", $(window).height())
		.appendTo('body');
	
	$('body').append(popup);
	
	function resizeBGPopup(){
		$('div.bg-popup-auth').css("height", $(window).height());
	}
	
	$(window).bind('resize', resizeBGPopup);
	
	pass.focus();
	
	var times = 0;
	
	function auth(){

		function fail(){
			times++;
			pass.val('').css('border-color', 'red');
			if (times === 3) window.location.href = '/slider';
			pass.focus();
		}
		
		sliderio.passcode = pass.val(); 
		pass.css('border-color', 'silver');
		
		sliderio.service.slider.authenticate(sliderio.passcode, function(){
			$('div.bg-popup-auth').remove();
			$('div.popup-auth').remove();
			callback();
		}, fail, sliderName);
	}
	
	okBtn.bind('click', auth);
	pass.bind('keyup', function(e){
		if (e.keyCode  === 13 || e.which === 13) auth();
	});
}

