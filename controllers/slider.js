
var configs = require('../config.json'),
	fs = require('fs'),
	mustache = require("mustache");

exports.renderSlider =function(response, _slider, _userType){
	var sliderCfg = configs.sliders[_slider];
	
	if (!sliderCfg)
		response.send('what???', 404);
	else {
		response.render('slider', { 
	  	layout: false, 
	  	locals: { 
	  		title: sliderCfg.title || "Untitled",
	  		fontURL: sliderCfg.fontURL,
	  		speaker: (_userType && _userType === 'speaker')? true : false,
	  		solo: (_userType && _userType === 'solo')? true : false
	  	} 
	  });
	}
}

exports.renderSliderCSS = function(sliderName, res){
	var slider = configs.sliders[sliderName];
	fs.readFile(__dirname + '/sliderCSS.css', 'ascii', function (err, data) {
	  if (err) {
	    console.log(err);
	    res.send(err.toString(), 500);
	  }
		
		res.writeHead(200, {'content-type': 'text/css'});
		var css = mustache.to_html(data, slider);
		res.end(css);  
	});
};
