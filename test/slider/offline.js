var expect = require('expect.js'),
	Browser = require('zombie'),
	browser = new Browser();

describe('User request the offline slider', function(){
	
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
	
	it('should have a link on manage sliders page', function(done){
    
    browser.visit("http://localhost:3000/slider/", function () {
      expect(browser.success);
      
      var lnkOffline = browser.queryAll('#sliderList li[data-sld=' + newSlider.name  + '] a.offline');
			expect(lnkOffline.length).to.equal(1);
      
      done();
    });
  });
  
  it('should ask for passcode when clicks the link', function(done){
    
    browser.visit("http://localhost:3000/slider/", function () {
      expect(browser.success);
      
      var selector = '#sliderList li[data-sld=' + newSlider.name  + '] a.offline';
      var lnkOffline = browser.queryAll(selector);
			expect(lnkOffline.length).to.equal(1);
			
			browser.evaluate("$('"+ selector +"').click();");
			
			var authPopup = browser.query('.popup-auth');
      if (!authPopup) 
      	done(new Error('Passcode popup should be present'));
      else done();
		  
    });
  });
  
  it('should NOT download a zip file when passcode is incorrect', function(done){
  	var maxtries = 3,
    	tries = 0;
  	browser.visit("http://localhost:3000/slider/", function () {
      expect(browser.success);
      
      function tryInvalid(){
	    	tries++;
	
	      var selector = '#sliderList li[data-sld=' + newSlider.name  + '] a.offline';
	      var lnkOffline = browser.queryAll(selector);
				expect(lnkOffline.length).to.equal(1);
				
				browser.evaluate("$('"+ selector +"').click();");
				
				var authPopup = browser.query('.popup-auth');
	      if (!authPopup) 
	      	done(new Error('Passcode popup should be present'));
	      else {
	      	browser
						.fill("passcode", "invalid pass")
						.pressButton("OK", function(){
							
							if (tries < maxtries){
								browser.wait(500, function(){
									var authPopup = browser.query('.popup-auth');
		        			var popupExists = (authPopup != null)? true : false;
		        			expect(popupExists).to.equal(true);
		        			
		        			tryInvalid();
		        		});
	      			}
	      			else {
	      				expect(browser.location.pathname).to.equal("/slider");
	      				done();
	      			}
						});
	      }
			}  
			tryInvalid();
    });
  });
     
  it('should download a zip file when passcode is correct', function(done){
    
    browser.visit("http://localhost:3000/slider/", function () {
      expect(browser.success);
      
      var selector = '#sliderList li[data-sld=' + newSlider.name  + '] a.offline';
      var lnkOffline = browser.queryAll(selector);
			expect(lnkOffline.length).to.equal(1);
			
			browser.evaluate("$('"+ selector +"').click();");
			
			var authPopup = browser.query('.popup-auth');
      if (!authPopup) 
      	done(new Error('Passcode popup should be present'));
      else {
      	browser
					.fill("passcode", newSlider.passcode)
					.pressButton("OK", function(){
						expect(browser.success);
						done();
					});
			}
		  
    });
  }); 
}); 

