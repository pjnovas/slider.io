
var fs = require('fs');

var getJSONFile = function(name, done, error){
	
	callError = function(err){
		console.log(err);
		
		if (err.code === 'ENOENT')
			error({code: "notfound"});
		else error({code: "unknown"});
	}
	
	fs.realpath('./sliders', function(err, path){
		
		if (err){
			 callError(err);
		}

		fs.readFile(path + '/' + name + '.json', 'utf8', function (err, data) {
		  if (err) {
		    callError(err);
		  }
			
			done(JSON.parse(data));
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
	fs.readFile(__dirname + '/sliderCSS.css', 'ascii', function (err, data) {
	 	if (err){
	 		console.log(err);
	 		
			if (err.code === 'ENOENT')
				error({code: "notfound"});
			else error({code: "unknown"});
	 	}
	 	
	 	done(data);
	});
};

exports.getSliderList = function(done, error){
	
	fs.realpath('./sliders', function(err, path){
		
		if (err){
			 callError(err);
		}

		fs.readdir(path, function (err, files) {
		 	
		 	for(var i=0; i< files.length; i++){
		 		if (files[i].indexOf('.config.json') > -1){
		 			files.splice(i, 1);
		 			continue;
		 		}
		 	}
		 	
		 	for(var i=0; i< files.length; i++){
		 		files[i] = files[i].replace('.json', '');
		 	}
		 	
		 	done(files);
		});
		
	});
};




