
var slider = require('./controllers/slider'),
	config = require('./controllers/config'),
	resource = require('./controllers/resource'),
	user = require('./controllers/user');

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
	
	/* User Routes ****************************************
	********************************************************/
	//TODO: This method is temporal, will be removed after login is implemented
	app.post('/slider/:slider/authenticate', user.authorizePassCode, function (req, res){
		res.send({}, 200);
	});
	
	
	/* Slider Routes ****************************************
	********************************************************/
	app.get('/slider/:slider/speaker', slider.views.speaker); 
	
	app.get('/slider/:slider/listener', slider.views.listener); 
	
	app.get('/slider/:slider/solo', slider.views.solo);
	
	app.get('/slider/:slider/editor', slider.views.editor);
	
	app.get('/slider/:slider/styles.css', slider.actions.getCSS);
	
	app.get('/slider/:slider/slides.json', slider.actions.get);
	
	app.post('/slider/:slider/slides.json', user.authorizePassCode , slider.actions.save);
	
	app.post('/slider/new', slider.actions.create);
	
	app.get('/slider/:slider/', slider.views.listener);
	
	app.get('/slider', slider.views.list);
	
	/* Config Routes ****************************************
	********************************************************/
	app.get('/slider/:slider/config.json', config.actions.get);
	
	app.post('/slider/:slider/config.json', user.authorizePassCode, config.actions.save);
	
	/* Resources Routes ****************************************
	********************************************************/
	app.post('/slider/:slider/resources/new', resource.actions.create);
	
	app.del('/slider/:slider/resources/:file', user.authorizePassCode, resource.actions.remove);
	
	app.get('/slider/:slider/resources', resource.actions.list);
};

