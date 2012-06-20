
var fs = require('fs'),
	fsExtra = require('fs.extra');

function getRoot(done){
	fs.realpath('./', done);
}

function getFile(error, path, type, done){
	
	function sendFile(err, file){
		if (err) error(err);
		else done(file);
	}
	
	function readFile(err, localPath){
		if (err) error(err);
	 	else fs.readFile(localPath + path, type, sendFile);
	}
	
	getRoot(readFile);
};

function getFiles(error, paths, type, done){
	var files = [],
		i = 0;
	
	if (!Array.isArray(paths)) {
		error(new Error("Parameter paths must be type of Array"));
		return;
	}
	else if (paths.length === 0) {
		error(new Error("Empty list of files"));
		return;
	}
	
	function pushFile(file){
		files.push(file);
		if (i < paths.length-1) {
			i++;
			getFile(error, paths[i], type, pushFile);
		}
		else done.apply(null, files);
	}
	
	getFile(error, paths[i], type, pushFile);
}

function getDirectoryFiles(error, dir, done){
	
	function sendFiles(err, files){
		if (err) error(err);
		else done(files);
	}
	
	function readDirectory(err, localPath){
		if (err) error(err);
	 	else fs.readdir(localPath + dir, sendFiles);
	}
	
	getRoot(readDirectory);
}

function saveFile(error, path, data, done){
	
	function callDone(err){
		if (err) error(err);
		else done();
	}
	
	function writeFile(err, localPath){
		if (err) error(err);
		else fs.writeFile(localPath + path, data, callDone);
	}
	
	getRoot(writeFile);
}

function removeFile(error, file, done){
	
	function unlinkFile(err, localPath){
		if (err) error(err);
		else fs.unlink(localPath + file, function (err) {
		  if (err) error(err);
		  else done();
		});
	}
	
	getRoot(unlinkFile);
}

function createDirectory(error, path, done){
	function create(err, localPath){
		if (err) error(err);
		else fs.mkdir(localPath + path, function(err){
			if (err) error(err);
		  else done();
		});
	}
	
	getRoot(create);
}

exports.getRoot = getRoot;
exports.getFile = getFile;
exports.getFiles = getFiles;
exports.getDirectoryFiles = getDirectoryFiles;
exports.saveFile = saveFile;
exports.removeFile = removeFile;
exports.createDirectory = createDirectory;

exports.getJSONFile = function(error, path, done){
	
	function parseJSON(data){
		try {
			done(JSON.parse(data));
		} catch(e){
			error(new Error("Error parsing to JSON file: " + path));
		}
	}
	
	getFile(error, path, 'utf8', parseJSON);
};

exports.saveJSONFile = function(error, path, data, done){
	
	var jsonStr = "";
	
	try {
		jsonStr = JSON.stringify(data);
	} catch(e){
		error(new Error("Error stringify on JSON file: " + path));
	}
	
	saveFile(error, path, jsonStr, done);
};


exports.fileExist = function(error, fileName, exist, doesnot){
	
	function validateStatus(err, stat) {
    if(err == null) exist();     
    else if(err.code == 'ENOENT') doesnot();
    else error(err);
	}
	
	function getFileStatus(err, localPath){
		if (err) error(err);
		else fs.stat(localPath + fileName, validateStatus);
	}
	
	getRoot(getFileStatus);
};

exports.copy = function(error, fileName, newFileName, done) {
	
	function ready(err){
		if (err) error(err);
		else done();
	}
	
	function copyFiles(err, localPath){
		if (err) error(err);
		else fsExtra.copy(localPath + fileName, localPath + newFileName, ready);	
	}
	
	getRoot(copyFiles);
};

exports.copyNoRoot = function(error, fileName, newFileName, done) {
	
	function ready(err){
		if (err) error(err);
		else done();
	}
	
	fsExtra.copy(fileName, newFileName, ready);	
};






