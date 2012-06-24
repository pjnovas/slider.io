var expect = require('expect.js'),
	Browser = require('zombie'),
	browser = new Browser();

var simulateKeyUp = function(keyCode){
	return "var press=jQuery.Event('keyup');press.ctrlKey=false;press.keyCode=" + keyCode + ";$('body').trigger(press);";
};

exports.run = function(){
	
	describe('User enter as viewer', function(){
		
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
      
      browser.visit("http://localhost:3000/slider/" + newSlider.name + "/solo", function () {
        expect(browser.success);
        done();
      });
    });
    
    it('should NOT ask for passcode', function(done){
      
      browser.visit("http://localhost:3000/slider/" + newSlider.name + "/solo", function () {
        expect(browser.success);
        
        var authPopup = browser.query('.popup-auth');
        if (authPopup)
					done(new Error("authentication popup should not be present"));
				else done();
      });
    });
    
    it('can move the slider but offline (without websockets)', function(done){
		 	browser.visit("http://localhost:3000/slider/" + newSlider.name + "/solo", function () {
        expect(browser.success);
    
    		expect(browser.window.socket).to.be(undefined);
    		
    		var script = "$('li.current', '#slider-list').is(':visible');";
    		var beforeVisible = browser.evaluate(script);

				browser.evaluate(simulateKeyUp(83)); //keyboard s
				
				var afterVisible = browser.evaluate(script);
				expect(beforeVisible).not.to.equal(afterVisible);
				
				done();
    	});
		});
    
	}); 
};
