
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

realtime.start(app);
app.listen(17283);

console.log('Server Express started at port %d', app.address().port);
