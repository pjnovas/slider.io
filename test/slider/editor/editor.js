var expect = require('expect.js'),
	Browser = require('zombie'),
	browser = new Browser();

var utils = require('../../utils/slider.js');

describe('#And enter to editor', function(){
	var newSlider = require('../../mocks/newSlider.js').slider;
	
	beforeEach(utils.createSliderMock);	
	afterEach(utils.deleteSliderFiles);
	
	it('should load the editor page', function(done){
    
    browser.visit("http://localhost:3000/slider/" + newSlider.name + "/editor", function () {
      expect(browser.success);
      done();
    });
  });
  
  it('should be asked for passcode', function(done){
    
    browser.visit("http://localhost:3000/slider/" + newSlider.name + "/editor", function () {
      expect(browser.success);
      
      var authPopup = browser.query('.popup-auth');
      if (!authPopup)
				done(new Error("authentication popup not present"));
			else done();
    });
  });
	
	it('should be redirected to slider manager after 3 invalid passcode tries', function(done){
    var maxtries = 3,
    	tries = 0;
    
    browser.visit("http://localhost:3000/slider/" + newSlider.name + "/editor", function () {
      expect(browser.success);
      
      function tryInvalid(){
      	tries++;

        browser
					.fill("passcode", "invalid pass")
					.pressButton("OK", function(){
						
						if (tries < maxtries){

							browser.wait(1000, function(){
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
			
			tryInvalid();
    });
  });
	
	it('should close the passcode popup and start slider editor when passcode is correct', function(done){
    
    browser.visit("http://localhost:3000/slider/" + newSlider.name + "/editor", function () {
      expect(browser.success);
      
      browser
				.fill("passcode", newSlider.passcode)
				.pressButton("OK", function(){
					
					var authPopup = browser.query('.popup-auth');
    			var popupExists = (authPopup != null)? true : false;
    			expect(popupExists).to.equal(false);
    
    			done();
				});
    });
  });
  
  describe('#And edits the slider', function(){
		
		require('./slider.js');
		require('./config.js');
		require('./resources.js');
		
  });
});




