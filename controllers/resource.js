var resourceM = require('../models/resource');

var addResource = function(name, resource, res){

	resourceM.saveResource(name.toLowerCase(), resource, function(savedResource){
		res.send(savedResource);
	}, function(error){
		res.send(error.toString(), 500);
	});
};

var removeResource = function(name, resource, res){

	resourceM.removeResource(name.toLowerCase(), resource, function(){
		res.send();
	}, function(error){
		res.send(error.toString(), 500);
	});
};

var getResources = function(sliderName, res){

	resourceM.getResources(sliderName.toLowerCase(), function(resources){
		res.send(resources);
	}, function(error){
		res.send(error.toString(), 500);
	});
};

exports.actions = {
	list: function (req, res){
		getResources(req.params.slider, res);
	},
	create: function (req, res){
		addResource(req.params.slider, req.files.resource, res);
	},
	remove: function (req, res){
		removeResource(req.params.slider, req.body.resource, res);
	}
};
