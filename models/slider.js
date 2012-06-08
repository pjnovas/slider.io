
var fs = require('fs'),
	util = require('util'),
	fsExtra = require('fs.extra');

var callError = function(error, callbackFunction){
	console.log(error);
	
	if (error.code === 'ENOENT')
		callbackFunction({code: "notfound"});
	else callbackFunction({code: "unknown"});
}

var getJSONFile = function(name, done, error){
	
	fs.realpath('./sliders', function(err, path){
		
		if (err){
			 callError(err, error);
		}

		fs.readFile(path + '/' + name + '.json', 'utf8', function (err, data) {
		  if (err) {
		    callError(err, error);
		  }
			
			try {
				var parsed = JSON.parse(data); 
				done(parsed);	
			}
			catch(err){
				callError('Error parsing file ' + name + '.json - Stack:' + err, error);
			}
			
		});
		
	});
};

exports.getSlides = function(_name, done, error){
	getJSONFile(_name, done, error);
};

exports.getConfig = function(_name, done, error){	
	getJSONFile(_name + '.config', done, error);
};

exports.getSlidesCSSTemplate = function(_name, done, error){	
	fs.realpath('./views/templates', function(err, path){
		if (err){
	 		callError(err, error);
	 	}
		 	
		fs.readFile(path + '/sliderCSS.css', 'ascii', function (err, sliderCSS) {
		 	if (err){
		 		callError(err, error);
		 	}
		 	
		 	fs.readFile(path + '/sliderCSSBg.css', 'ascii', function (err, sliderCSSBg) {
			 	if (err){
			 		callError(err, error);
			 	}
			 	
			 	done(sliderCSS, sliderCSSBg);
		 	});
		});
	});
};

exports.getSliderList = function(done, error){
	
	fs.realpath('./sliders', function(err, path){
		
		if (err){
			 callError(err, error);
		}

		fs.readdir(path, function (err, files) {
		 	
		 	for(var i=0; i< files.length; i++){
		 		if (files[i].indexOf('.config.json') > -1 || files[i].indexOf('cache') > -1){
		 			files.splice(i, 1);
		 			i--;
		 		}
		 	}
		 	
		 	for(var i=0; i< files.length; i++){
		 		files[i] = files[i].replace('.json', '');
		 	}
		 	
		 	done(files);
		});
		
	});
};

exports.saveSlider = function(name, data, done, error){
	
	fs.realpath('./sliders', function(err, path){
		if (err){
			 callError(err, error);
		}

		fs.readdir(path, function (err, files) {
			var fileName = path + '/' + name + '.json', 
				now = new Date().getTime(),
				newFileName = path + '/cache/' + name  + '.json' + '-' + now;
	
			fsExtra.copy(fileName, newFileName, function (err) {
				if (err) {
			    callError(err, error);
			  }
				
				fs.writeFile(fileName, JSON.stringify(data), function (err) {
					if (err){
						 callError(err, error);
					}
					
					done();
				});
				
			});		
		});
	});
};

exports.saveConfig = function(name, data, done, error){
	
	fs.realpath('./sliders', function(err, path){
		if (err){
			 callError(err, error);
		}

		fs.readdir(path, function (err, files) {
			var fileName = path + '/' + name + '.config.json', 
				now = new Date().getTime(),
				newFileName = path + '/cache/' + name  + '.config.json' + '-' + now;
	
			fsExtra.copy(fileName, newFileName, function (err) {
				if (err) {
			    callError(err, error);
			  }
				
				fs.writeFile(fileName, JSON.stringify(data), function (err) {
					if (err){
						 callError(err, error);
					}
					
					done();
				});
				
			});		
		});
	});
};









