
var expect = require('expect.js'),
	Browser = require('zombie'),
	browser = new Browser();

describe('User enter slider manager', function(){

  it('should load the page', function(done){
    browser.visit("http://localhost:3000/slider", function () {
      expect(browser.success);
      done();
    });
  });

  it('should visualize the list of current sliders', function(done){

    browser.visit("http://localhost:3000/slider", function () {
    	var fs = require('fs');
			fs.realpath('./sliders', function(err, localPath){
				fs.readdir(localPath, function(err, files){	
					
					var countFiles = 0;
					for(var i=0; i< files.length; i++) {
				 		if (files[i].indexOf('cache') === -1
				 			&& files[i].indexOf('base') === -1) {
				 			countFiles++;
				 		}
				 	}
				 	
				 	var LIs = browser.queryAll('#sliderList li');
				 	expect(countFiles).to.equal(LIs.length);
				 	done();
				});      	
      });
    });
	});
	
	it('should visualize a form to add new sliders', function(done){
	
		browser.visit("http://localhost:3000/slider", function () {
			var form = browser.query('form.new-slider');
			if (form === undefined) done(new Error('the form is not present'));
			else done();
		});
	});
});

describe('User creates a new slider', function(){
	
	var newSlider = {
		name: "newslider",
		passcode: "mycode",
		title: "new slider title",
		description: "new slider description"
	};

	beforeEach(function(done){
		//Fills the form and post it for a new slider
		browser.visit("http://localhost:3000/slider", function () {
			
			browser
				.fill("name", newSlider.name)
				.fill("passcode", newSlider.passcode)
				.fill("title", newSlider.title)
				.fill("description", newSlider.description)
				.pressButton("Create!", done);
				
		});
	});

	afterEach(function(done){
		// Removes files & foldes created for the new slider
		var fs = require('fs');
		fs.realpath('./', function(err, localPath){
			fs.unlink(localPath + '/sliders/' + newSlider.name + '.json', function(err){
				if(err) done(err);
				else {
					fs.rmdir(localPath + '/public/slider/' + newSlider.name + '/images', function(err){
						if(err) done(err);
						else {
							fs.rmdir(localPath + '/public/slider/' + newSlider.name, function(err){
								if(err) done(err);
								else done();
							});
						}
					});
				}
			});
		});
		
  });

	it('should redirects after add a new slider', function(done){
					
		expect(browser.success);
		expect(browser.location.pathname).to.equal("/slider/" + newSlider.name + '/editor');
    expect(browser.text("title")).to.equal(newSlider.title);
    
    done();
	});
	
	it('should create a json file and a resource folder', function(done){
		
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
	
	it('should create a valid json file', function(done){
		
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
	
	it('should show an error when name has spaces');
	it('should show an error when passcode is blank');
});

