
var config = require('../models/config');

exports.getConfig = function(sliderName, res){
	
	config.getConfig(sliderName, function(sliderCfg) {
		res.json(sliderCfg);
	}, function(error){
		if (error.code === 'notfound')
			res.send("Configurations for Slider '" + sliderName + "' NOT FOUND", 404);
		else res.send(error.toString(), 500);
	});
};

exports.saveConfig = function(sliderName, data, res){
	
	config.saveConfig(sliderName, data, function(sliderCfg) {
		res.json(data);
	}, function(error){
		if (error.code === 'notfound')
			res.send("Configurations for Slider '" + sliderName + "' NOT FOUND", 404);
		else res.send(error.toString(), 500);
	});
};

