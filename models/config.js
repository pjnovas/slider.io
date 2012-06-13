
var fs = require('fs'),
	util = require('util'),
	fsExtra = require('fs.extra'),
	helper = require('../models/helper');

exports.getConfig = function(_name, done, error){	
	helper.getJSONFile(_name + '.config', done, error);
};

exports.saveConfig = function(name, data, done, error){
	
	fs.realpath('./sliders', function(err, path){
		if (err){
			 helper.callError(err, error);
		}

		fs.readdir(path, function (err, files) {
			var fileName = path + '/' + name + '.config.json', 
				now = new Date().getTime(),
				newFileName = path + '/cache/' + name  + '.config.json' + '-' + now;
	
			fsExtra.copy(fileName, newFileName, function (err) {
				if (err) {
			    helper.callError(err, error);
			  }
				
				fs.writeFile(fileName, JSON.stringify(data), function (err) {
					if (err){
						 helper.callError(err, error);
					}
					
					done();
				});
				
			});		
		});
	});
};

