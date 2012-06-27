
var expect = require('expect.js'),
	slider = require('../models/slider.js'),
	util = require('../utils/slider.js');

describe('Sliders versions', function(){
	var sliderMock,
		sliderName = "reverts";
	
	beforeEach(function(done){
		sliderMock = slider.defaultSlider();
		sliderMock.name = sliderName;
		slider.saveSlider("reverts", sliderMock, function(){
			createVersions();
		}, function(err){
			done(err);
		});
		
		function createVersions(){
			var i = 0;
			
			function doVersion(){
				i++;
				
				sliderMock.initIndex = i;
				slider.saveSlider(sliderName, sliderMock, doVersion, function(err){
					done(err);
				});
				
				if (i > 10){
					done();
				}
			}
		}
	});
		
	afterEach(function(done){
		
		function cleanCache(dirPath){
			
			fs.realpath('./', function(err, localPath){
				var dirPath = localPath + '/sliders/cache';
	      try { var files = fs.readdirSync(dirPath); }
	      catch(e) { return; }
	      if (files.length > 0) {
	        for (var i = 0; i < files.length; i++) {
	          var filePath = dirPath + '/' + files[i];
	          if (fs.statSync(filePath).isFile())
	            fs.unlinkSync(filePath);
	          else
	            rmDir(filePath);
	        }
	      }
	      fs.rmdirSync(dirPath);
      			
				done();
			});
		}
		
		util.cleanSliderTrash(sliderName, cleanCache);
	});

  it('should sort the files desc and pick the first one', function(done){
    var idx = -1;
    slider.revert()
    
  });
  
});