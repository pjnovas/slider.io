
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



