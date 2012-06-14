
var fs = require('fs');

var callError = function(error, callbackFunction){
	console.log(error);
	
	if (error.code === 'ENOENT')
		callbackFunction({code: "notfound"});
	else callbackFunction({code: "unknown"});
};
	
exports.callError = callError;

exports.getJSONFile = function(name, done, error){
	
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