
var fs = require('fs');
	
exports.callError = function(error, callbackFunction){
	console.log(error);
	
	if (error.code === 'ENOENT')
		callbackFunction({code: "notfound"});
	else callbackFunction({code: "unknown"});
}

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