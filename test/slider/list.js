
var expect = require('expect.js'),
	Browser = require('zombie'),
	browser = new Browser();
browser.debug = true;
exports.run = function(){
	
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
  
		it('should add new sliders', function(done){
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
				
	});
};

