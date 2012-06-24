var Browser = require('zombie'),
	newSlider = require('../mocks/newSlider.js').slider;

exports.createSliderMock = function(done){
	var browser = new Browser();
	
	//Fills the form and post it for a new slider
	browser.visit("http://localhost:3000/slider", function () {
		
		browser
			.fill("name", newSlider.name)
			.fill("passcode", newSlider.passcode)
			.fill("title", newSlider.title)
			.fill("description", newSlider.description)
			.pressButton("Create!", done);
			
	});
};

exports.deleteSliderFiles = function(done){
	// Removes files & foldes created for the new slider
	var fs = require('fs');
	fs.realpath('./', function(err, localPath){
		fs.unlink(localPath + '/sliders/' + newSlider.name + '.json', function(err){
			if(err) done(err);
			else {
				fs.rmdir(localPath + '/public/slider/' + newSlider.name + '/images', function(err){
					if(err) done(err);
					else {
						fs.rmdir(localPath + '/public/slider/' + newSlider.name, function(err){
							if(err) done(err);
							else done();
						});
					}
				});
			}
		});
	});
	
};

exports.simulateKeyUp = function(keyCode){
	return "var press=jQuery.Event('keyup');press.ctrlKey=false;press.keyCode=" + keyCode + ";$('body').trigger(press);";
};
	