
var fs = require('fs'),
	fsExtra = require('fs.extra'),
	helper = require('../models/helper');
	
exports.saveResource = function(name, resource, done, error){

	//TODO: If slider resources folder doesn't exist -> Create it!	
	//TODO: Validate mime, type & size
	
	fs.realpath('./public/slider/' + name + '/images', function(err, path){
		if (err){
			helper.callError(err, error);
		}
		
		fsExtra.copy(resource.path, path + '/' + resource.name, function (err) {
  		if (err){
				helper.callError(err, error);
			}
			//fs.unlink(resource.path);
			
			done({
	 			url: 'images/' + resource.name,
	 			file: resource.name
	 		});
		});
	});
};

exports.getResources = function(slider, done, error){
	
	fs.realpath('./public/slider/' + slider + '/images', function(err, path){		
		if (err){
			 helper.callError(err, error);
		}

		fs.readdir(path, function (err, files) {
		 	
		 	for(var i=0; i< files.length; i++) {
		 		files[i] = {
		 			url: 'images/' + files[i],
		 			file: files[i]
		 		};
		 	}
		 	
		 	done(files);
		});
		
	});
};

exports.removeResource = function(name, resource, done, error){

	fs.realpath('./public/slider/' + name + '/images', function(err, path){
		if (err){
			helper.callError(err, error);
		}
		
		fs.unlink(path + '/' + resource.file, function (err) {
		  if (err){
				helper.callError(err, error);
			}
		  
		  done();
		});
	});
};
