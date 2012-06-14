var resourceM = require('../models/resource');

exports.addResource = function(name, resource, res){

	resourceM.saveResource(name.toLowerCase(), resource, function(savedResource){
		res.send(savedResource);
	}, function(error){
		res.send(error.toString(), 500);
	});
};

exports.removeResource = function(name, resource, res){

	resourceM.removeResource(name.toLowerCase(), resource, function(){
		res.send();
	}, function(error){
		res.send(error.toString(), 500);
	});
};

exports.getResources = function(sliderName, res){

	resourceM.getResources(sliderName.toLowerCase(), function(resources){
		res.send(resources);
	}, function(error){
		res.send(error.toString(), 500);
	});
};
