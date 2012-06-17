
exports.authorizePassCode = function(req, res, next){
	var passcode = req.body.passcode;
	
	if (!req.slider.config.passcode || passcode === req.slider.config.passcode) {
		req.passcode = req.slider.passcode;
		next(); 
	}
	else res.send("Unauthorized", 401);
};
