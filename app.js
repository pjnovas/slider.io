
var express = require('express'),
	stache = require('stache'),
	realtime = require('./utils/realtime'),
	router = require('./router');
	
var app = module.exports = express.createServer();

app.configure(function(){
	app.register(".mu", stache);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'mustache');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  
  app.use(function(err, req, res, next) {
	  // error ocurred
	  if (err.code === 'notfound')
			res.send("NOT FOUND", 404);
		else res.send(err.toString(), 500);
	});
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

router.configure(app);
realtime.start(app);

app.listen(process.env.PORT || 3000, function(){
  console.log("SliderIO server listening on port %d in %s mode", app.address().port, app.settings.env);
});

/*
process.on("uncaughtException", function (err) { 
	console.log('>>>>>> Unhandled Exception Ocurred: ' + err);
});
*/
