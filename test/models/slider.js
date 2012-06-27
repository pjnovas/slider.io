
var expect = require('expect.js'),
	slider = require('../../models/slider.js'),
	util = require('../utils/slider.js');

describe('Sliders versions', function(){
	var sliderMock,
		sliderName = "reverts";
	
	beforeEach(function(done){
		slider.defaultSlider(createSlider, function(err){
			done(err);
		});
		
		function createSlider(data){
			sliderMock = data;
			sliderMock.name = sliderName;
			slider.saveSlider(sliderName, sliderMock, function(){
				createVersions();
			}, function(err){
				done(err);
			});
		}
		
		function createVersions(){
			var i = 0;
			
			function doVersion(){
				i++;
				
				sliderMock.initIndex = i;
				slider.saveSlider(sliderName, sliderMock, function(){
					if (i > 10)	done();
					else doVersion();	
				}, function(err){
					done(err);
				});
				
				
			}
			
			doVersion();
		}
	});
		
	afterEach(function(done){
		util.cleanSliderTrash(sliderName, done);
	});

  it('should sort the files desc and pick the first one', function(done){
    var idx = -1;
    //slider.revert()
    done();
  });
  
});