var Browser = require('zombie'),
	newSlider = require('../mocks/newSlider.js').slider;

exports.createSliderMock = function(done){
	var browser = new Browser();
	
	console.log("\ncreating slider mock ..");
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

var deleteTestTrash = function(sliderName, done){
	console.log("\ndeleting slider trash..");
	var fs = require('fs');
	
	function cleanCache(){
		fs.realpath('../', function(err, localPath){
			var dirPath = localPath + '/sliders/cache';
      try { var files = fs.readdirSync(dirPath); }
      catch(e) { return; }
      if (files.length > 0) {
        for (var i = 0; i < files.length; i++) {
          var filePath = dirPath + '/' + files[i];
          if (fs.statSync(filePath).isFile())
            fs.unlinkSync(filePath);
          else rmDir(filePath);
        }
      }
      //fs.rmdirSync(dirPath);
    			
			done();
		});
	}
		
	fs.realpath('../', function(err, localPath){
		fs.unlink(localPath + '/sliders/' + sliderName + '.json', function(err){
			if(err && err.code != "ENOENT") done(err);
			else fs.rmdir(localPath + '/public/slider/' + sliderName + '/images', function(err){
					if(err && err.code != "ENOENT") done(err);
					else fs.rmdir(localPath + '/public/slider/' + sliderName, function(err){
						if(err && err.code != "ENOENT") done(err);
						else cleanCache();
					});
				});
		});
	});
	
};

exports.cleanSliderTrash = deleteTestTrash;
exports.deleteSliderFiles = function(done){
	// Removes files & foldes created for the new slider
	deleteTestTrash(newSlider.name, done);
};

exports.simulateKeyUp = function(keyCode){
	return "var press=jQuery.Event('keyup');press.ctrlKey=false;press.keyCode=" + keyCode + ";$('body').trigger(press);";
};
	