
var express = require('express'),
	app = express.createServer(),
	stache = require('stache'),
	realtime = require('./utils/realtime'),
	router = require('./router');

app.set('view engine', 'mustache');
app.register(".mu", stache);
app.set('views', __dirname + '/views');

router.configure(app);

app.use(express.static(__dirname + '/public'));

realtime.start(app, 3);
app.listen(17283);

console.log('Server Express started at port %d', app.address().port);
