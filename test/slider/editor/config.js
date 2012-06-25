
var expect = require('expect.js'),
	Browser = require('zombie'),
	browser = new Browser();

describe('User configs the slider', function(){
	var newSlider = require('../../mocks/newSlider.js').slider;

	beforeEach(function(done){
		 browser.visit("http://localhost:3000/slider/" + newSlider.name + "/editor", function () {
      expect(browser.success);
      
      browser
				.fill("passcode", newSlider.passcode)
				.pressButton("OK", function(){
					done();
				});
    });
	});
		
	
	describe('User visualizes the config panel', function(){
	
		it('should be able to visualize main slider values', function(){
			var cfgPanel = browser.queryAll('#mainConfigs');
			expect(cfgPanel.length).to.equal(1);
			
			var txtIniIndex = browser.queryAll('#txtInitIndex');
			expect(txtIniIndex.length).to.equal(1);
			expect(browser.evaluate("$('#txtInitIndex').val();")).to.eql(0);
			
			var txtTitle = browser.queryAll('#txtTitle');
			expect(txtTitle.length).to.equal(1);
			expect(browser.evaluate("$('#txtTitle').val();")).to.eql(newSlider.title);
		
			var styleCtns = browser.queryAll('.style-container');
			expect(styleCtns.length).to.equal(4);
		});
		
		it('should only be able to visualize defaults background for Main Slider', function(){
			
			expect(browser.evaluate("$('.style-container').eq(1).children('div.font').length;")).to.eql(0);
			expect(browser.evaluate("$('.style-container').eq(1).children('div.border').length;")).to.eql(0);
			expect(browser.evaluate("$('.style-container').eq(1).children('div.background').length;")).to.eql(1);
		});
		
		it('should be able to visualize defaults fonts, borders & backgrounds', function(){
			
			//All
			expect(browser.evaluate("$('.style-container').eq(2).children('div').length;")).to.eql(3);
			//Chapter
			expect(browser.evaluate("$('.style-container').eq(3).children('div').length;")).to.eql(3);
			
			
			function getSelector(idx, type, selector){
				return "$('.style-container').eq(" + idx + ").find('div." + type + " " + selector + "').val();";
			}
			
			//Main background
			expect(browser.evaluate(getSelector(1, 'background', '.color-field'))).to.eql('#ffffff');
			
			//All
			expect(browser.evaluate(getSelector(2, 'background', '.color-field'))).to.eql('#dedede');
			
			expect(browser.evaluate(getSelector(2, 'font', '.color-field'))).to.eql('#454545');
			expect(browser.evaluate(getSelector(2, 'font', '.fontName-field'))).to.eql('arial');
			
			expect(browser.evaluate(getSelector(2, 'border', '.color-field'))).to.eql('#000000');
			expect(browser.evaluate(getSelector(2, 'border', '.radius-field'))).to.eql(0);
			expect(browser.evaluate(getSelector(2, 'border', '.size-field'))).to.eql(0);
			
			//Chapter
			expect(browser.evaluate(getSelector(3, 'background', '.color-field'))).to.eql('#c8d8b6');
			
			expect(browser.evaluate(getSelector(3, 'font', '.color-field'))).to.eql('#454545');
			expect(browser.evaluate(getSelector(3, 'font', '.fontName-field'))).to.eql('arial');
			
			expect(browser.evaluate(getSelector(3, 'border', '.color-field'))).to.eql('#000000');
			expect(browser.evaluate(getSelector(3, 'border', '.radius-field'))).to.eql(0);
			expect(browser.evaluate(getSelector(3, 'border', '.size-field'))).to.eql(0);
	
		});
	});
	
	
	describe('User changes values and see them updated to slider', function(){
		
		it('should be able to change main slider values');
		
		it('should be able to change fonts for All Slides');
		it('should be able to change fonts for Chapter Slides');
		
		it('should be able to change borders for All Slides');
		it('should be able to change borders for Chapter Slides');
		
		it('should be able to change background for Slider');
		it('should be able to change background for All Slides');
		it('should be able to change background for Chapter Slides');
		
	});
	
});