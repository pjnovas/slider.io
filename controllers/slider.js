
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
	
	slider.getConfig(sliderName, function(sliderCfg){
		
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

exports.getSlides = function(sliderName, res){
	
	slider.getSlides(sliderName, function(slides){
		res.json(slides);
	}, function(error){
		if (error.code === 'notfound')
			res.send("Slides for Slider '" + sliderName + "' NOT FOUND", 404);
		else res.send(error.toString(), 500);
	});
};

exports.getConfig = function(sliderName, res){
	
	slider.getConfig(sliderName, function(sliderCfg) {
		res.json(sliderCfg);
	}, function(error){
		if (error.code === 'notfound')
			res.send("Configurations for Slider '" + sliderName + "' NOT FOUND", 404);
		else res.send(error.toString(), 500);
	});
};

exports.saveSlides = function(sliderName, data, res){
	
	slider.saveSlider(sliderName, data, function(slides){
  	res.json(data);
	}, function(error){
		if (error.code === 'notfound')
			res.send("Slides for Slider '" + sliderName + "' NOT FOUND", 404);
		else res.send(error.toString(), 500);
	});
};

exports.saveConfig = function(sliderName, data, res){
	
	slider.saveConfig(sliderName, data, function(sliderCfg) {
		res.json(data);
	}, function(error){
		if (error.code === 'notfound')
			res.send("Configurations for Slider '" + sliderName + "' NOT FOUND", 404);
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

exports.addResource = function(name, resource, res){

	slider.saveResource(name, resource, function(savedResource){
		res.send(savedResource);
	}, function(error){
		res.send(error.toString(), 500);
	});
};

exports.getResources = function(sliderName, res){

	slider.getResources(sliderName, function(resources){
		res.send(resources);
	}, function(error){
		res.send(error.toString(), 500);
	});
};


