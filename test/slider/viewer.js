var expect = require('expect.js'),
	Browser = require('zombie'),
	browser = new Browser();

var utils = require('../utils/slider.js');

describe('User enter as viewer', function(){
	var newSlider = require('../mocks/newSlider.js').slider;
	
	beforeEach(utils.createSliderMock);	
	afterEach(utils.deleteSliderFiles);
	
	it('should load the page', function(done){
    
    browser.visit("http://localhost:3000/slider/" + newSlider.name + "/", function () {
      expect(browser.success);
      done();
    });
  });
  
  it('should NOT ask for passcode', function(done){
    
    browser.visit("http://localhost:3000/slider/" + newSlider.name + "/", function () {
      expect(browser.success);
      
      var authPopup = browser.query('.popup-auth');
      if (authPopup)
				done(new Error("authentication popup should not be present"));
			else done();
    });
  });
  
  it('should NOT move the slider', function(done){
	 	browser.visit("http://localhost:3000/slider/" + newSlider.name + "/", function () {
      expect(browser.success);
  
  		var script = "$('li.current', '#slider-list').is(':visible');";
			browser.window.socket.once('initSlider', function() {
  			var beforeVisible = browser.evaluate(script);

				browser.evaluate(utils.simulateKeyUp(83)); //keyboard s
				
				var afterVisible = browser.evaluate(script);
				expect(beforeVisible).to.equal(afterVisible);
				
				browser.visit("http://localhost:3000/slider/");
				done();
  		});
  	});
	});
  
}); 