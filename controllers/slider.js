
var mustache = require("mustache"),
	slider = require('../models/slider'),
	config = require('../models/config');

exports.renderSlider =function(res, _slider, _userType){

	config.getConfig(_slider.toLowerCase(), function(sliderCfg){
		
		res.render('slider/slider.mu', { 
	  	layout: false, 
	  	locals: { 
	  		title: sliderCfg.title || "Untitled",
	  		fontURL: sliderCfg.fontURL,
	  		speaker: (_userType && _userType === 'speaker')? true : false,
	  		solo: (_userType && _userType === 'solo')? true : false,
	  		editor: (_userType && _userType === 'editor')? true : false,
	  		scripts: "var sliderName = '" + _slider + "';"
	  	} 
	  });	
	}, function(error){
		if (error.code === 'notfound')
			res.send("Config Slider '" + _slider + "' NOT FOUND", 404);
		else res.send(error.toString(), 500);
	});
};

exports.renderSliderCSS = function(sliderName, res){
	
	config.getConfig(sliderName.toLowerCase(), function(sliderCfg){
		
		slider.getSlidesCSSTemplate(sliderName, function(templateCSS, partialCSSBG){
			
			res.writeHead(200, {'content-type': 'text/css'});
			var css = mustache.to_html(templateCSS, sliderCfg, {'background': partialCSSBG});
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

exports.newSlider = function(newSlider, res){
	
	var onError = function(error){
		if (error.code === 'notfound')
			res.send("NotFound", 404);
		else res.send(error.toString(), 500);
	};
	
	config.defaultConfig(function(defaultCfg){
		
		var sliderName = newSlider.name;
		defaultCfg.passcode = newSlider.passcode;
		defaultCfg.title = newSlider.title;

		var defSlide = [{"fields":[]}];
		
		config.saveConfig(sliderName, defaultCfg, function(){
			
			slider.saveSlider(sliderName, defSlide, function(){
				
				res.redirect('slider/' + sliderName + '/editor');
				
			}, onError);
		}, onError);
	}, onError);
};

exports.getSlides = function(sliderName, res){
	
	slider.getSlides(sliderName.toLowerCase(), function(slides){
		res.json(slides);
	}, function(error){
		if (error.code === 'notfound')
			res.send("Slides for Slider '" + sliderName + "' NOT FOUND", 404);
		else res.send(error.toString(), 500);
	});
};


exports.saveSlides = function(sliderName, data, res){
	
	slider.saveSlider(sliderName.toLowerCase(), data, function(slides){
  	res.json(data);
	}, function(error){
		if (error.code === 'notfound')
			res.send("Slides for Slider '" + sliderName + "' NOT FOUND", 404);
		else res.send(error.toString(), 500);
	});
};

exports.renderSliderList = function(res){
	
	slider.getSliderList(function(_sliders){
		res.render('slider/list.mu', { 
	  	layout: false, 
	  	locals: { 
	  		title: "Presentaciones",
	  		sliders: _sliders
	  	} 
	  });	
	}, function(error){
		res.send(error.toString(), 500);
	});
};

