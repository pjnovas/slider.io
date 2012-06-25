var expect = require('expect.js'),
	Browser = require('zombie'),
	browser = new Browser();

var utils = require('../utils/slider.js');

describe('#And request the offline slider', function(){
	var newSlider = require('../mocks/newSlider.js').slider;
	
	beforeEach(utils.createSliderMock);	
	afterEach(utils.deleteSliderFiles);
	
	it('should be able to click a link on manage sliders page', function(done){
    
    browser.visit("http://localhost:3000/slider/", function () {
      expect(browser.success);
      
      var lnkOffline = browser.queryAll('#sliderList li[data-sld=' + newSlider.name  + '] a.offline');
			expect(lnkOffline.length).to.equal(1);
      
      done();
    });
  });
  
  it('should be asked for passcode when clicks the link', function(done){
    
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

