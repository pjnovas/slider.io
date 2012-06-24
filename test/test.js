
var expect = require('expect.js'),
	Browser = require('zombie'),
	browser = new Browser();

describe('User enter the application', function(){

  it('should load the page', function(done){
    browser.visit("http://localhost:3000/", function () {
      expect(browser.success);
      done();
    });
  });

  it('show redirects to Sliders page', function(done){
    browser.visit("http://localhost:3000/", function () {
      expect(browser.location.pathname).to.equal("/slider/");
      expect(browser.text("title")).to.equal('Presentaciones');
      done();
    });
  });

});

require('./slider/new.js').run();
require('./slider/speaker.js').run();



