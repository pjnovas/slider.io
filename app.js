
var express = require('express'),
	app = express.createServer(),
	stache = require('stache'),
	realtime = require('./utils/realtime'),
	sliderCtrl = require('./controllers/slider');
 
app.set('view engine', 'mustache');
app.register(".mustache", stache);
app.set('views', __dirname + '/views');

app.get('/', function (req, res){
  res.send("TODO: here is gonna be a lists of sliders");
});

app.get('/:slider/', function (req, res){
  sliderCtrl.renderSlider(res, req.params.slider);
});

app.get('/:slider/speaker', function (req, res){
  sliderCtrl.renderSlider(res, req.params.slider, 'speaker');
});

app.get('/:slider/solo', function (req, res){
  sliderCtrl.renderSlider(res, req.params.slider, 'solo');
});

app.get('/:slider/sliderStyles.css', function (req, res){
	sliderCtrl.renderSliderCSS(req.params.slider, res);
});

app.use(express.static(__dirname + '/public'));

realtime.start(app, 3);
app.listen(17283);

console.log('Server Express iniciado en %d', app.address().port);
