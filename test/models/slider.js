
var expect = require('expect.js'),
	slider = require('../../models/slider.js'),
	fsAccess = require('../../utils/fsWrapper.js'),
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
					if (i > 17)	done();
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

	it('should delete the last history json when the current save is the 21th', function(done){
    var initIndex = sliderMock.initIndex;
    
    sliderMock.initIndex++;
    slider.saveSlider(sliderMock.name, sliderMock, function(){
			
			sliderMock.initIndex++;
			slider.saveSlider(sliderMock.name, sliderMock, function(){
			
				sliderMock.initIndex++;
				slider.saveSlider(sliderMock.name, sliderMock, function(){
				
		    	slider.getSlider(sliderMock.name,	function(sliderGot){
		    		
		    		expect(sliderGot.initIndex).to.equal(initIndex+3);
		    		
		    		var path = '/sliders/cache/';
						fsAccess.getDirectoryFiles(done, path, function(allfiles){
							
							var files = [];
							for(var i=0; i<allfiles.length;i++){
								if (allfiles[i].indexOf(sliderMock.name + '.json-') > -1){
									files.push(parseInt(allfiles[i].split('-')[1]));
								}
							}
							
							expect(files.length).to.equal(20);
							done();
						});
						
					}, done);
    		}, done);
    	}, done);
    }, done);
    
  });

	it('should NOT delete the last history json when the current save is less than the 20th', function(done){
    var initIndex = sliderMock.initIndex;
    
    sliderMock.initIndex++;
    
    slider.saveSlider(sliderMock.name, sliderMock, function(){

    	slider.getSlider(sliderMock.name,	function(sliderGot){
    		
    		expect(sliderGot.initIndex).to.equal(initIndex+1);
    		
    		var path = '/sliders/cache/';
				fsAccess.getDirectoryFiles(done, path, function(allfiles){
					
					var files = [];
					for(var i=0; i<allfiles.length;i++){
						if (allfiles[i].indexOf(sliderMock.name + '.json-') > -1){
							files.push(parseInt(allfiles[i].split('-')[1]));
						}
					}
					
					expect(files.length).to.equal(19);
					done();
				});
    		
    	}, done);
    }, done);
    
  });

  it('should revert the slider one step back', function(done){
    var initIndex = sliderMock.initIndex;
    
    slider.revert(done, 1, sliderMock, function(){
    	
    	slider.getSlider(sliderMock.name,	function(sliderGot){
    		
    		expect(sliderGot.initIndex).to.equal(initIndex-1);
    		done(); 
    		
    	}, done);
    		
    });
    
  });
  
  it('should revert the slider three step back', function(done){
    var initIndex = sliderMock.initIndex;
    
    slider.revert(done, 3, sliderMock, function(){
    	
    	slider.getSlider(sliderMock.name,	function(sliderGot){
    		
    		expect(sliderGot.initIndex).to.equal(initIndex-3);
    		done(); 
    		
    	}, done);
    		
    });
    
  });
  
});