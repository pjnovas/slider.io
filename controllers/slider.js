
var mustache = require("mustache"),
	slider = require('../models/slider');

exports.renderSlider =function(res, _slider, _userType){

	slider.getConfig(_slider, function(sliderCfg){
		
		res.render('slider/slider.mu', { 
	  	layout: false, 
	  	locals: { 
	  		title: sliderCfg.title || "Untitled",
	  		fontURL: sliderCfg.fontURL,
	  		speaker: (_userType && _userType === 'speaker')? true : false,
	  		solo: (_userType && _userType === 'solo')? true : false
	  	} 
	  });	
	}, function(error){
		if (error.code === 'notfound')
			res.send("Config Slider '" + _slider + "' NOT FOUND", 404);
		else res.send(error.toString(), 500);
	});
};

exports.renderSliderCSS = function(sliderName, res){
	
	slider.getConfig(sliderName, function(sliderCfg){
		
		slider.getSlidesCSSTemplate(sliderName, function(templateCSS){
			
			res.writeHead(200, {'content-type': 'text/css'});
			var css = mustache.to_html(templateCSS, sliderCfg);
			res.end(css);
			
		}, function(error){
			if (error.code === 'notfound')
				res.send("Styles Template NOT FOUND (sliderCSS.css)", 404);
			else res.send(error.toString(), 500);
		});
		
	}, function(error){
		if (error.code === 'notfound')
			res.send("Config Slider '" + sliderName + "' NOT FOUND", 404);
		else res.send(error.toString(), 500);
	});
};

exports.getSlides = function(sliderName, res){
	
	slider.getSlides(sliderName, function(slides){
		res.json(slides);
	}, function(error){
		if (error.code === 'notfound')
			res.send("Slides for Slider '" + sliderName + "' NOT FOUND", 404);
		else res.send(error.toString(), 500);
	});
};

