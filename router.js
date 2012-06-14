
var sliderCtrl = require('./controllers/slider'),
	configCtrl = require('./controllers/config'),
	resourceCtrl = require('./controllers/resource'),
	userCtrl = require('./controllers/user');

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
	 * (GET)  /slider/:slider/editor/							-> slider editor view 
	 * (GET)  /slider/:slider/offline/	 					-> response zip with slider offline
	 * 
	 * (GET)  /slider/:slider/styles.css					-> slider custom styles
	 * (GET)  /slider/:slider/slides.json					-> slider json (containing slides)
	 * (GET)  /slider/:slider/config.json					-> config json (containing the configuration)
	 * (POST) /slider/:slider/slides.json					-> saves slider json 
	 * (POST) /slider/:slider/config.json					-> saves config json 
	 *
	 * (GET)  /slider/:slider/resources						-> gets an array of slider resources  
	 * (POST) /slider/:slider/resources/new				-> add a new resource to the slider 
	 * (POST) /slider/:slider/resources/del				-> delete a resource of the slider 
	 * 
	 * (GET)  /slider/create/											-> create slider form
	 * (POST) /slider/new/												-> inserts a new slider -> redirects to /slider/:slider/editor
	 * 
	 */

	app.get('/', function (req, res){
	  res.send("HOME");
	});
	
	/* Slider Routes ****************************************
	********************************************************/
	app.get('/slider/:slider/speaker', function (req, res){
	  sliderCtrl.renderSlider(res, req.params.slider, 'speaker');
	});
	
	app.get('/slider/:slider/solo', function (req, res){
	  sliderCtrl.renderSlider(res, req.params.slider, 'solo');
	});
	
	app.get('/slider/:slider/editor', function (req, res){
		sliderCtrl.renderSlider(res, req.params.slider, 'editor');
	});
	
	app.get('/slider/:slider/styles.css', function (req, res){
		sliderCtrl.renderSliderCSS(req.params.slider, res);
	});
	
	app.get('/slider/:slider/slides.json', function (req, res){
		sliderCtrl.getSlides(req.params.slider, res);
	});
	
	app.post('/slider/:slider/slides.json', userCtrl.authorizePassCode , function (req, res){
	  sliderCtrl.saveSlides(req.params.slider, req.body.slider, res);
	});
	
	app.get('/slider/:slider/', function (req, res){
	  sliderCtrl.renderSlider(res, req.params.slider);
	});
	
	app.get('/slider', function (req, res){
	  sliderCtrl.renderSliderList(res);
	});
	
	/* Config Routes ****************************************
	********************************************************/
	app.get('/slider/:slider/config.json', function (req, res){
		configCtrl.getConfig(req.params.slider, res);
	});
	
	app.post('/slider/:slider/config.json', userCtrl.authorizePassCode, function (req, res){
	  configCtrl.saveConfig(req.params.slider, req.body.config, res);
	});
	
	/* Resources Routes ****************************************
	********************************************************/
	app.post('/slider/:slider/resources/new', function (req, res){
	  resourceCtrl.addResource(req.params.slider, req.files.resource, res);
	});
	
	app.post('/slider/:slider/resources/del', userCtrl.authorizePassCode, function (req, res){
	  resourceCtrl.removeResource(req.params.slider, req.body.resource, res);
	});
	
	app.get('/slider/:slider/resources', function (req, res){
	  resourceCtrl.getResources(req.params.slider, res);
	});
};

