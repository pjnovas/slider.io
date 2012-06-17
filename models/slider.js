
var fs = require('fs'),
	util = require('util'),
	fsExtra = require('fs.extra'),
	helper = require('../models/helper'),
	resource = require('../models/resource');

exports.getSlider = function(_name, done, error){
	helper.getJSONFile(_name, done, error);
};

exports.getSlidesCSSTemplate = function(_name, done, error){	
	fs.realpath('./views/templates', function(err, path){
		if (err){
	 		helper.callError(err, error);
	 	}
		 	
		fs.readFile(path + '/sliderCSS.css', 'ascii', function (err, sliderCSS) {
		 	if (err){
		 		helper.callError(err, error);
		 	}
		 	
		 	fs.readFile(path + '/sliderCSSBg.css', 'ascii', function (err, sliderCSSBg) {
			 	if (err){
			 		helper.callError(err, error);
			 	}
			 	
			 	done(sliderCSS, sliderCSSBg);
		 	});
		});
	});
};

exports.getSliderList = function(done, error){
	
	fs.realpath('./sliders', function(err, path){
		
		if (err){
			 helper.callError(err, error);
		}

		fs.readdir(path, function (err, files) {
		 	
		 	for(var i=0; i< files.length; i++){
		 		if (files[i].indexOf('.config.json') > -1 
		 			|| files[i].indexOf('cache') > -1
		 			|| files[i].indexOf('base') > -1){
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
	
	var writeFile = function(fileName){
		
		fs.writeFile(fileName, JSON.stringify(data), function (err) {
			if (err){
				 helper.callError(err, error);
			}
			
			done();
		});
	};
	
	var versionate = function(fileName, newFileName){
		fsExtra.copy(fileName, newFileName, function (err) {
			if (err) {
  			helper.callError(err, error);
		  }
			
			writeFile(fileName);
		});
	};
	
	fs.realpath('./sliders', function(err, path){
		if (err){
			 helper.callError(err, error);
		}

		fs.readdir(path, function (err, files) {
			var fileName = path + '/' + name + '.json', 
				now = new Date().getTime(),
				newFileName = path + '/cache/' + name  + '.json' + '-' + now;
	
			fs.stat(fileName, function(err, stat) {
		    if(err == null) {
					versionate(fileName, newFileName);     
		    } else if(err.code == 'ENOENT') {
	        resource.createSliderFolder(name, function(){
						writeFile(fileName);
					}, error);
		    } else {
		      helper.callError(err, error);
		    }
			});
		});
	});
};

exports.defaultSlider = function(done, error){
	
	fs.realpath('./sliders', function(err, path){
		if (err){
			 helper.callError(err, error);
		}
	
		fs.readdir(path, function (err, files) {
		 	if (err) {
		    helper.callError(err, error);
		  }
	
			var sliderFile = path + '/base/slider.json';
	
			fs.readFile(sliderFile, 'utf8', function (err, data) {
			  if (err) {
			    helper.callError(err, error);
			  }
	
				try {
					var parsed = JSON.parse(data); 
					done(parsed);	
				}
				catch(err){
					helper.callError('Error parsing file ' + sliderFile + ' - Stack:' + err, error);
				}
	
			});	
		});
	});
};


