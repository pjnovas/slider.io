
var config = require('../models/config');

var getConfig = function(sliderName, res){
	
	config.getConfig(sliderName.toLowerCase(), function(sliderCfg) {
		delete sliderCfg.passcode;
		res.json(sliderCfg);
	}, function(error){
		if (error.code === 'notfound')
			res.send("Configurations for Slider '" + sliderName + "' NOT FOUND", 404);
		else res.send(error.toString(), 500);
	});
};

var saveConfig = function(sliderName, passcode, data, res){
	
	config.saveConfig(sliderName.toLowerCase(), data, function(sliderCfg) {
		res.json(data);
	}, function(error){
		if (error.code === 'notfound')
			res.send("Configurations for Slider '" + sliderName + "' NOT FOUND", 404);
		else res.send(error.toString(), 500);
	});
		
};

exports.actions = {
	get: function(req, res){
		getConfig(req.params.slider, res);
	},
	save: function(req, res){
		saveConfig(req.params.slider, req.body.config, res);
	}
};

