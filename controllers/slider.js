
var mustache = require("mustache"),
	slider = require('../models/slider');

var newSlider = function(newSlider, res){
	
	var onError = function(error){
		if (error.code === 'notfound')
			res.send("NotFound", 404);
		else res.send(error.toString(), 500);
	};
	
	slider.defaultSlider(function(defaultSlider){
		
		var sliderName = newSlider.name;
		
		defaultSlider.name = sliderName;
		defaultSlider.config.passcode = newSlider.passcode;
		defaultSlider.config.title = newSlider.title;
		defaultSlider.config.description = newSlider.description;
		
		slider.saveSlider(sliderName, defaultSlider, function(){
			
			res.redirect('/slider/' + sliderName + '/editor');
			
		}, onError);
	}, onError);
};

var saveSlider = function(_slider, res){
	
	slider.saveSlider(_slider.name, _slider, function(slides){
  	res.json(_slider);
	}, function(error){
		res.send(error.toString(), 500);
	});
};

var getStyleCSS = function(_slider, res){
		
	slider.getSlidesCSSTemplate(_slider.name, function(templateCSS, partialCSSBG){
		
		var css = mustache.to_html(templateCSS, _slider.config, {'background': partialCSSBG});
		res.writeHead(200, {'content-type': 'text/css'});
		res.end(css);
		
	}, function(error){
		if (error.code === 'notfound')
			res.send("Styles Template NOT FOUND (sliderCSS.css)", 404);
		else res.send(error.toString(), 500);
	});
};

var renderSliderList = function(res){
	
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

var renderSlider =function(res, _slider, _userType){
	
	var soloScript = "";
	if (_userType && _userType === 'solo') 
		soloScript = "var soloSliderStartInit = " + _slider.config.initIndex + ";"; 
		
	res.render('slider/slider.mu', { 
  	layout: false, 
  	locals: { 
  		title: _slider.config.title || "Untitled",
  		fontURL: _slider.config.fontURL,
  		speaker: (_userType && _userType === 'speaker')? true : false,
  		solo: (_userType && _userType === 'solo')? true : false,
  		editor: (_userType && _userType === 'editor')? true : false,
  		scripts: "var sliderName = '" + _slider.name + "';" + soloScript
  	} 
  });	
};

exports.next = {
	get: function(req, res, next){
		slider.getSlider(req.params.slider, function(slider){
			req.slider = slider;
			next();
			
		}, function(error){
			if (error.code === 'notfound')
				res.send("Slider '" + sliderName + "' NOT FOUND", 404);
			else res.send(error.toString(), 500);
		});
	}
};

exports.views = {
	listener: function(req, res){
		renderSlider(res, req.slider);
	},
	solo: function(req, res){
		renderSlider(res, req.slider, 'solo');
	},
	speaker: function(req, res){
		renderSlider(res, req.slider, 'speaker');
	},
	editor: function(req, res){
		renderSlider(res, req.slider, 'editor');
	},
	list: function(req, res){
		renderSliderList(res);
	}
};

exports.actions = {
	get: function(req, res){
		res.json(req.slider.slides);
	},
	save: function(req, res){
		req.slider.slides = req.body.slider; 
		saveSlider(req.slider, res);
	},
	create: function(req, res){
		newSlider({
			name: req.body.name,
			title: req.body.title,
			passcode: req.body.passcode,
			description: req.body.description
		}, res);
	},
	getCSS: function(req, res){
		getStyleCSS(req.slider, res);
	},
	getConfig: function(req, res){
		delete req.slider.config.passcode;
		res.json(req.slider.config);
	},
	saveConfig: function(req, res){
		var code = req.slider.config.passcode;
		req.slider.config = req.body.config; 
		req.slider.config.passcode = code;
		saveSlider(req.slider, res);
	},
};






