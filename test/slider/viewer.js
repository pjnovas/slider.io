var expect = require('expect.js'),
	Browser = require('zombie'),
	browser = new Browser();

var simulateKeyUp = function(keyCode){
	return "var press=jQuery.Event('keyup');press.ctrlKey=false;press.keyCode=" + keyCode + ";$('body').trigger(press);";
};
	
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
  
  it('can NOT move the slider', function(done){
	 	browser.visit("http://localhost:3000/slider/" + newSlider.name + "/", function () {
      expect(browser.success);
  
  		var script = "$('li.current', '#slider-list').is(':visible');";
			browser.window.socket.once('initSlider', function() {
  			var beforeVisible = browser.evaluate(script);

				browser.evaluate(simulateKeyUp(83)); //keyboard s
				
				var afterVisible = browser.evaluate(script);
				expect(beforeVisible).to.equal(afterVisible);
				
				browser.visit("http://localhost:3000/slider/");
				done();
  		});
  	});
	});
  
}); 
