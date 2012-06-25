
var expect = require('expect.js'),
	Browser = require('zombie'),
	browser = new Browser();

var utils = require('../utils/slider.js');

describe('#And enter as speaker', function(){
	var newSlider = require('../mocks/newSlider.js').slider;
	
	beforeEach(utils.createSliderMock);	
	afterEach(utils.deleteSliderFiles);

	it('should load the speaker page', function(done){
    
    browser.visit("http://localhost:3000/slider/" + newSlider.name + "/speaker", function () {
      expect(browser.success);
      done();
    });
  });
  
  it('should be asked for passcode', function(done){
    
    browser.visit("http://localhost:3000/slider/" + newSlider.name + "/speaker", function () {
      expect(browser.success);
      
      var authPopup = browser.query('.popup-auth');
      if (!authPopup)
				done(new Error("authentication popup not present"));
			else done();
    });
  });
	
	it('should redirect to manage sliders after 3 invalid passcode tries', function(done){
    var maxtries = 3,
    	tries = 0;
    
    browser.visit("http://localhost:3000/slider/" + newSlider.name + "/speaker", function () {
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
	
	it('should close the passcode popup and start slide when passcode is correct', function(done){
    
    browser.visit("http://localhost:3000/slider/" + newSlider.name + "/speaker", function () {
      expect(browser.success);
      
      browser
				.fill("passcode", newSlider.passcode)
				.pressButton("OK", function(){
					
					browser.wait(1000, function(){
						var authPopup = browser.query('.popup-auth');
      			var popupExists = (authPopup != null)? true : false;
      			expect(popupExists).to.equal(false);
      
      			done();
      		});
							
				});
    });
  });
	
	it('should be able to show and hide the slider', function(done){
	 	browser.visit("http://localhost:3000/slider/" + newSlider.name + "/speaker", function () {
      expect(browser.success);
  
  		var script = "$('li.current', '#slider-list').is(':visible');";
			
			browser.window.socket.once('initSlider', function() {
  		
			browser
				.fill("passcode", newSlider.passcode)
				.pressButton("OK", function(){
    			var beforeVisible = browser.evaluate(script);
					
					browser.evaluate(utils.simulateKeyUp(83)); //keyboard s
					
					var afterVisible = browser.evaluate(script);
					expect(beforeVisible).not.to.equal(afterVisible);
					
					browser.visit("http://localhost:3000/slider/");
					done();
				});
  		});
  	});
	});
	
 	it('should be able to show and hide the slider emit by websockets to a viewer', function(done){
    var speaker = new Browser();
    var viewer = new Browser();
    
		var script = "$('li.current', '#slider-list').is(':visible');";
		var speaker_visible;
		var viewer_visible;

    speaker.visit("http://localhost:3000/slider/" + newSlider.name + "/speaker", function () {
      expect(speaker.success);
    	
    	speaker.window.socket.once('initSlider', function() {
      	speaker
					.fill("passcode", newSlider.passcode)
					.pressButton("OK", function(){
						
						viewer.visit("http://localhost:3000/slider/" + newSlider.name + "/speaker", function () {
			        expect(speaker.success);
			      	
			      	viewer.window.socket.once('initSlider', function() {					      		
			      		speaker_visible = speaker.evaluate(script);
								viewer_visible = viewer.evaluate(script);
								expect(speaker_visible).to.equal(viewer_visible);
								
								speaker.evaluate(utils.simulateKeyUp(83)); //keyboard s
			      	});
			      	
			      	viewer.window.socket.once('toggleSlider', function() {
			      		var before = speaker_visible;
			      		speaker_visible = speaker.evaluate(script);
								viewer_visible = viewer.evaluate(script);
								expect(speaker_visible).to.equal(viewer_visible);
								expect(speaker_visible).not.to.equal(before);
								
								speaker.visit("http://localhost:3000/slider/");
								viewer.visit("http://localhost:3000/slider/");
								done();
			      	});
			      	
			      });
					});
      });
    });
 });
 
 it('should not be able to emit by websockets slider actions if passcode provided is invalid', function(done){
    var speaker = new Browser();
    var viewer = new Browser();
    
		var script = "$('li.current', '#slider-list').is(':visible');";
		var speaker_visible;
		var viewer_visible;

    speaker.visit("http://localhost:3000/slider/" + newSlider.name + "/speaker", function () {
      expect(speaker.success);
    	
    	speaker.window.socket.once('initSlider', function() {
      	speaker
					.fill("passcode", "invalid pass")
					.pressButton("OK", function(){
						
						viewer.visit("http://localhost:3000/slider/" + newSlider.name + "/speaker", function () {
			        expect(speaker.success);
			      	
			      	var toggleViewerCalled = false;
			      	
			      	viewer.window.socket.once('initSlider', function() {					      		
			      		speaker_visible = speaker.evaluate(script);
								viewer_visible = viewer.evaluate(script);
								expect(speaker_visible).to.equal(viewer_visible);
								speaker.evaluate(utils.simulateKeyUp(83)); //keyboard s
			      	});
			      	
			      	viewer.window.socket.once('toggleSlider', function() {
			      		toggleViewerCalled = true;
			      	});
			      	
			      	//wait 3 seconds after emit to check if the viewer got it.
							setTimeout(function(){
			      		expect(toggleViewerCalled).to.equal(false);
			      		done();
			      	}, 2000);
			      });
					});
      });
    });
 });
 
 it('should be able to move left and right the slider');
 it('should emit slider actions by websockets to a viewer');
 
});

