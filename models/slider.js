
var fs = require('fs'),
	util = require('util'),
	fsExtra = require('fs.extra'),
	helper = require('../models/helper'),
	resource = require('../models/resource'),
	mustache = require("mustache"),
	zip = require("node-native-zip");

exports.getSlider = function(_name, done, error){
	helper.getJSONFile(_name, done, error);
};

var getSlidesCSS = function(_slider, done, error){
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
			 	
			 	var css = mustache.to_html(sliderCSS, _slider.config, {'background': sliderCSSBg});
			 	done(css);
		 	});
		});
	});
};

exports.getSlidesCSSTemplate = function(_slider, done, error){	
	getSlidesCSS(_slider, done, error);
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

var getOfflineFiles = function(_slider, done, error){
	
	fs.realpath('./', function(err, _path) {
		
		var files = [
			{ name: "js/offline.js", path: _path + "/offline/offline.js" },
			
			{ name: "css/slider.css", path: _path + "/public/css/slider.css" },
			{ name: "css/highlight/solarized_dark.min.css", path: _path + "/public/css/highlight/solarized_dark.min.css" },
			
			{ name: "js/libs/highlight.min.js", path: _path + "/public/js/libs/highlight.min.js" },
			{ name: "js/libs/jquery.slider.js", path: _path + "/public/js/libs/jquery.slider.js" },
			{ name: "js/libs/jquery-1.7.1.min.js", path: _path + "/public/js/libs/jquery-1.7.1.min.js" },
			{ name: "js/libs/mustache.js", path: _path + "/public/js/libs/mustache.js" }	
		];
		
		resource.getResources(_slider.name, function(resources){
			
			for(var i=0; i<resources.length; i++){
				files.push({
					name: "images/" + resources[i].file,
					path: _path + "/public/slider/" + _slider.name + "/images/" + resources[i].file
				});
			}
		
			done(files);
				
		}, error);
	});
};

var buildOffLineHTML = function(_slider, done, error){
	
	fs.realpath('./', function(err, path) {
		
		fs.readFile(path + '/offline/index.html', 'ascii', function (err, indexHtml) {
		 	if (err){
		 		helper.callError(err, error);
		 	}
		 	
		 	fs.readFile(path + '/public/partialViews/_slides.html', 'ascii', function (err, slidesView) {
			 	if (err){
			 		helper.callError(err, error);
			 	}
		 	
			 	var html = mustache.to_html(indexHtml, { title: _slider.config.title, partialView: slidesView});
			 	done(html);
	 		});
		});
	});
};

exports.getSliderZIP = function(_slider, done, error){
	
  var archive = new zip();
	
	buildOffLineHTML(_slider, function(html){
		
		console.log(html);
		archive.add("index.html", new Buffer(html), "utf8");
		
		var slides = "var jsonData = " + JSON.stringify(_slider.slides) + ";";
		archive.add("js/slides.js", new Buffer(slides), "utf8");
	
	  getSlidesCSS(_slider, function(css){
	
	    archive.add("css/styles.css", new Buffer(css, "utf8"));
		
			getOfflineFiles(_slider, function(files){
	
		    archive.addFiles(files, function (err) {
			    if (err) { 
						helper.callError('Error generating zip file: ' + err, error);
					}
					
			    done(archive.toBuffer());
				});
	    }, error);
		});
	}, error);
};









