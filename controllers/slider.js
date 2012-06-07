
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
		
		slider.getSlidesCSSTemplate(sliderName, function(templateCSS){
			
			//TODO: This is ugly as shit ... 
			try {
				sliderCfg.background.color = hex2rgb(sliderCfg.background.color, sliderCfg.background.alpha);
			}catch(e){
				sliderCfg.background.color = "#FFF";
			}
			
			try {
				sliderCfg.slide.all.background.color = hex2rgb(sliderCfg.slide.all.background.color, sliderCfg.slide.all.background.alpha);
			}catch(e){
				sliderCfg.slide.all.background.color = "#FFF";
			}
			
			try {
				sliderCfg.slide.title.background.color = hex2rgb(sliderCfg.slide.title.background.color, sliderCfg.slide.title.background.alpha);
			}catch(e){
				sliderCfg.slide.title.background.color = "#FFF";
			}
			
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

exports.renderEditSlider = function(_slider, res){
	
	res.render('slider/editor.mu', { 
  	layout: false, 
  	locals: { 
  		title: "Editando Slider",
  		scripts: "var sliderName = '" + _slider + "';"
  	} 
  });	

};

var hex2rgb = function (hex, opacity) {
  var rgb = hex.replace('#', '').match(/(.{2})/g);
  var i = 3;
  while (i--) {
    rgb[i] = parseInt(rgb[i], 16);
  }
  if (typeof opacity == 'undefined') {
    return 'rgb(' + rgb.join(', ') + ')';
  }
  return 'rgba(' + rgb.join(', ') + ', ' + opacity + ')';
};
