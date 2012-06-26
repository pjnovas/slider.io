
var expect = require('expect.js'),
	Browser = require('zombie'),
	browser = new Browser();

describe('User who enters the application', function(){

  it('should load the home page', function(done){
    browser.visit("http://localhost:3000/", function () {
      expect(browser.success);
      done();
    });
  });

  it('should be redirected to slider manager page', function(done){
    browser.visit("http://localhost:3000/", function () {
      expect(browser.location.pathname).to.equal("/slider/");
      expect(browser.text("title")).to.equal('Presentaciones');
      done();
    });
  });

	describe('#enters slider manager', function(){
	
	  it('should load the manage slider page', function(done){
	    browser.visit("http://localhost:3000/slider", function () {
	      expect(browser.success);
	      done();
	    });
	  });
	
	  it('should be able to visualize the list of current sliders', function(done){
	
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
		
		it('should be able to visualize a form to add a new slider', function(done){
		
			browser.visit("http://localhost:3000/slider", function () {
				var form = browser.query('form.new-slider');
				if (form === undefined) done(new Error('the form is not present'));
				else done();
			});
		});
	});
	
	describe('#works with sliders', function(){
		
		require('./slider/new.js');
		require('./slider/speaker.js');
		require('./slider/viewer.js');
		require('./slider/solo.js');
		require('./slider/offline.js');
		
		require('./slider/editor/editor.js');
		
	});

});