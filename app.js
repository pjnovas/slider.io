
var express = require('express'),
	stache = require('stache'),
	realtime = require('./utils/realtime'),
	router = require('./router'),
	app = express.createServer();

/*
process.on("uncaughtException", function (err) { 
	console.log('>>>>>> Unhandled Exception Ocurred: ' + err);
});
*/
app.set('view engine', 'mustache');
app.register(".mu", stache);
app.set('views', __dirname + '/views');

app.configure(function(){
    app.use(express.methodOverride());
    app.use(express.bodyParser());
    app.use(app.router);
});

router.configure(app);

app.use(express.static(__dirname + '/public'));

var port = process.env.PORT || 5000;
realtime.start(app);
app.listen(port);

console.log('SliderIO Server started at port %d', app.address().port);
