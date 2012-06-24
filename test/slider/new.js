
var expect = require('expect.js'),
	Browser = require('zombie'),
	browser = new Browser();

var utils = require('../utils/slider.js');

describe('User creates a new slider', function(){
	var newSlider = require('../mocks/newSlider.js').slider;
	
	afterEach(utils.deleteSliderFiles);

	it('should redirects after add a new slider', function(done){
		//Fills the form and post it for a new slider
		browser.visit("http://localhost:3000/slider", function () {
			
			browser
				.fill("name", newSlider.name)
				.fill("passcode", newSlider.passcode)
				.fill("title", newSlider.title)
				.fill("description", newSlider.description)
				.pressButton("Create!", function(){
					expect(browser.success);
						expect(browser.location.pathname).to.equal("/slider/" + newSlider.name + '/editor');
				    expect(browser.text("title")).to.equal(newSlider.title);
				    
				    done();		
				});
				
		});
	});
	
	it('should create a json file and a resource folder', function(done){
		browser.visit("http://localhost:3000/slider", function () {
			
			browser
				.fill("name", newSlider.name)
				.fill("passcode", newSlider.passcode)
				.fill("title", newSlider.title)
				.fill("description", newSlider.description)
				.pressButton("Create!", function(){
					
					var fs = require('fs');
					fs.realpath('./', function(err, localPath){
						fs.stat(localPath + '/sliders/' + newSlider.name + '.json', function(err){
							if(err == null) {
								fs.readdir(localPath + '/public/slider/' + newSlider.name + '/images', function(err){
									if(err) done(err);
									else {
										fs.readdir(localPath + '/public/slider/' + newSlider.name, function(err){
											if(err) done(err);
											else done();
										});
									}
								});
							}
					    else done(err);
						});
					});
					
			});
		});
	});
	
	it('should create a valid json file', function(done){
		browser.visit("http://localhost:3000/slider", function () {
			
			browser
				.fill("name", newSlider.name)
				.fill("passcode", newSlider.passcode)
				.fill("title", newSlider.title)
				.fill("description", newSlider.description)
				.pressButton("Create!", function(){
					
					var fs = require('fs');
					fs.realpath('./', function(err, localPath){
						var path = localPath + '/sliders/' + newSlider.name + '.json';
						fs.readFile(path, 'utf8', function(err, data){
							if(err) done(err);
							else {
								try {
									var slider = JSON.parse(data);
								} catch(e){
									error(new Error("Error parsing to JSON file: " + path));
								}
								
								expect(slider).not.to.be(undefined);
								expect(slider.name).to.equal(newSlider.name);
								
								expect(slider.config).to.be.an('object');
								expect(slider.config.initIndex).to.equal(0);
								expect(slider.config.passcode).to.equal(newSlider.passcode);
								expect(slider.config.title).to.equal(newSlider.title);
								
								expect(slider.slides).to.be.an('array');
								expect(slider.slides.length).to.equal(1);
								
								expect(slider.slides[0].fields).to.be.an('array');
								expect(slider.slides[0].fields.length).to.equal(0);
								
								done();
							}
						});
					});
					
				});
			});
	});
	
	it('should show an error when name has spaces');
	it('should show an error when passcode is blank');
});

