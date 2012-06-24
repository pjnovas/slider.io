
var expect = require('expect.js'),
	Browser = require('zombie'),
	browser = new Browser();

var simulateKeyUp = function(keyCode){
	return "var press=jQuery.Event('keyup');press.ctrlKey=false;press.keyCode=" + keyCode + ";$('body').trigger(press);";
};

exports.run = function(){
	
	describe('User enter as speaker', function(){
		
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
		
		it('should load the page', function(done){
      
      browser.visit("http://localhost:3000/slider/" + newSlider.name + "/speaker", function () {
        expect(browser.success);
        done();
      });
    });
    
    it('should ask for passcode', function(done){
      
      browser.visit("http://localhost:3000/slider/" + newSlider.name + "/speaker", function () {
        expect(browser.success);
        
        var authPopup = browser.query('.popup-auth');
        if (!authPopup)
					done(new Error("authentication popup not present"));
				else done();
      });
    });
		
		it('should redirect after 3 invalid passcode tries', function(done){
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
		
		it('should validate passcode', function(done){
      
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
		
		it('can move the slider', function(done){
		 	browser.visit("http://localhost:3000/slider/" + newSlider.name + "/speaker", function () {
        expect(browser.success);
    
    		var script = "$('li.current', '#slider-list').is(':visible');";
				
				browser.window.socket.once('initSlider', function() {
    		
				browser
					.fill("passcode", newSlider.passcode)
					.pressButton("OK", function(){
	    			var beforeVisible = browser.evaluate(script);
						
						browser.evaluate(simulateKeyUp(83)); //keyboard s
						
						var afterVisible = browser.evaluate(script);
						expect(beforeVisible).not.to.equal(afterVisible);
						
						browser.visit("http://localhost:3000/slider/");
						done();
					});
    		});
    	});
		});
		
   	it('should emit slider toggle and being received by a viewer', function(done){
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
									
									speaker.evaluate(simulateKeyUp(83)); //keyboard s
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
   
   it('should not emit slider toggle if passcode provided is invalid', function(done){
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
				      	viewer.window.socket.once('toggleSlider', function() {
				      		toggleViewerCalled = true;
				      	});
				      	
				      	viewer.window.socket.once('initSlider', function() {					      		
				      		speaker_visible = speaker.evaluate(script);
									viewer_visible = viewer.evaluate(script);
									expect(speaker_visible).to.equal(viewer_visible);

									speaker.evaluate(simulateKeyUp(83)); //keyboard s
									
									//wait 3 seconds after emit to check if the viewer got it.
									setTimeout(function(){
					      		expect(toggleViewerCalled).to.equal(false);
					      		done();
					      	}, 3000);
				      	});
				      	
				      });
						});
	      });
      });
   });
        
	});
};

