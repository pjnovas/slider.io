
var sliderCtrl = require('./controllers/slider'),
	editorCtrl = require('./controllers/user');

exports.configure = function(app) {

	/*
	 * (GET)  / -> home
	 * 
	 * Users:
	 * 
	 * (POST) /login/															-> User login -> redirects to /slider/
	 * (GET)  /user/register/ 										-> New Account form
	 * (POST) /user/new/ 													-> Insert User
	 * (GET)  /user/:user/												-> User Info
	 * (GET)  /user/:user/edit/										-> Account form edit
	 * (POST) /user/:user/update/									-> Update User info
	 * 
	 * Sliders:
	 * 
	 * (GET)  /slider/														-> List of Sliders by Session User || /login/
	 * (GET)  /slider/:slider/										-> renders the Slider with ws as listener 
	 * (GET)  /slider/:slider/speaker/						-> renders the Slider with ws as speaker for session user || /login/
	 * (GET)  /slider/:slider/solo/								-> renders the Slider without ws
	 * (GET)  /slider/:slider/offline/	 					-> response zip with slider offline
	 * 
	 * (GET)  /slider/:slider/styles.css					-> slider custom styles
	 * (GET)  /slider/:slider/slides.json					-> slider json (containing slides)
	 * 
	 * (GET)  /slider/create/											-> create slider form
	 * (POST) /slider/new/												-> inserts a new slider -> redirects to /slider/:slider/editor
	 * (GET)  /slider/:slider/editor/							-> slider editor view 
	 * (POST) /slider/:slider/										-> updates slider json (slides)
	 * 
	 */

	app.get('/', function (req, res){
	  res.send("HOME");
	});
	
	
	/* User Routes ****************************************
	********************************************************/

	
	
	
	/* Slider Routes ****************************************
	********************************************************/
	app.get('/slider/:slider/speaker', function (req, res){
	  sliderCtrl.renderSlider(res, req.params.slider, 'speaker');
	});
	
	app.get('/slider/:slider/solo', function (req, res){
	  sliderCtrl.renderSlider(res, req.params.slider, 'solo');
	});
	
	app.get('/slider/:slider/sliderStyles.css', function (req, res){
		sliderCtrl.renderSliderCSS(req.params.slider, res);
	});
	
	app.get('/slider/:slider/slides.json', function (req, res){
		sliderCtrl.sendSlides(req.params.slider, res);
	});

	app.get('/slider/:slider', function (req, res){
	  sliderCtrl.renderSlider(res, req.params.slider);
	});
	
	
};

