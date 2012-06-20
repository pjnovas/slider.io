
var fsAccess = require('../utils/fsWrapper');

exports.saveResource = function(name, resource, done, error){

	//TODO: If slider resources folder doesn't exist -> Create it!	
	//TODO: Validate mime, type & size
	
	function sendFile(){
		//TODO: remove temp file: fs.unlink(resource.path);
		
		done({
 			url: 'images/' + resource.name,
 			file: resource.name
 		});
	}
	
	function copy(err, localPath){
		if (err) error(err);
		else {
			var newFile = '/public/slider/' + name + '/images/' + resource.name;
			fsAccess.copyNoRoot(error, resource.path, localPath + newFile, sendFile);
		}
	}
	
	fsAccess.getRoot(copy);
};

exports.getResources = function(slider, done, error){
	
	function sendFiles(files){
		for(var i=0; i< files.length; i++) {
	 		files[i] = {
	 			url: 'images/' + files[i],
	 			file: files[i]
	 		};
	 	}
	 	
	 	done(files);
	}
	
	fsAccess.getDirectoryFiles(error, '/public/slider/' + slider + '/images', sendFiles);
};

exports.removeResource = function(sliderName, resourceName, done, error){
	fsAccess.removeFile(error, '/public/slider/' + sliderName + '/images/' + resourceName, done);
};

exports.createSliderFolder = function(sliderName, done, error){
	fsAccess.createDirectory(error, '/public/slider/' + sliderName, function(){
		fsAccess.createDirectory(error, '/public/slider/' + sliderName + '/images', done);
	});
};





