
var config = require('../models/config');

exports.authorizePassCode = function(req, res, next){
	var sliderName = req.params.slider;
	var passcode = req.body.passcode;
	req.passcode = passcode;

	config.getConfig(sliderName, function(sliderCfg) {

		if (!sliderCfg.passcode || passcode === sliderCfg.passcode) next();
		else res.send("Unauthorized", 401);
		
	}, function(error){
		if (error.code === 'notfound')
			res.send("Configurations for Slider '" + sliderName + "' NOT FOUND", 404);
		else res.send(error.toString(), 500);
	});
};
