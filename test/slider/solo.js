var expect = require('expect.js'),
	Browser = require('zombie'),
	browser = new Browser();

var utils = require('../utils/slider.js');

describe('#And enter as solo', function(){
	var newSlider = require('../mocks/newSlider.js').slider;
	
	beforeEach(utils.createSliderMock);
	afterEach(utils.deleteSliderFiles);

	it('should load the solo page', function(done){
    
    browser.visit("http://localhost:3000/slider/" + newSlider.name + "/solo", function () {
      expect(browser.success);
      done();
    });
  });
  
  it('should NOT be asked for passcode', function(done){
    
    browser.visit("http://localhost:3000/slider/" + newSlider.name + "/solo", function () {
      expect(browser.success);
      
      var authPopup = browser.query('.popup-auth');
      if (authPopup)
				done(new Error("authentication popup should not be present"));
			else done();
    });
  });
  
  it('should be able to show and hide the slider without emiting by websockets', function(done){
	 	browser.visit("http://localhost:3000/slider/" + newSlider.name + "/solo", function () {
      expect(browser.success);
  
  		expect(browser.window.socket).to.be(undefined);
  		
  		var script = "$('li.current', '#slider-list').is(':visible');";
  		var beforeVisible = browser.evaluate(script);

			browser.evaluate(utils.simulateKeyUp(83)); //keyboard s
			
			var afterVisible = browser.evaluate(script);
			expect(beforeVisible).not.to.equal(afterVisible);
			
			done();
  	});
	});
  
  it('should be able to mode left and right the slider without emiting by websockets');
  
}); 
