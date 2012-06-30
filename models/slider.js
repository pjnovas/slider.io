
var fsAccess = require('../utils/fsWrapper'),
	resource = require('../models/resource'),
	mustache = require("mustache"),
	zip = require("node-native-zip");

exports.getSlider = function(_sliderName, done, error){
	fsAccess.getJSONFile(error, '/sliders/' + _sliderName + '.json', done);
};

var getSlidesCSS = function(_slider, done, error){
	
	function renderCSS(sliderCSS, sliderCSSStyle){
		var css = mustache.to_html(sliderCSS, _slider.config, {'style': sliderCSSStyle});
	 	done(css);
	}
	
	fsAccess.getFiles(error, [
				'/views/templates/sliderCSS.css', 
				'/views/templates/sliderCSSStyle.css'
			], 'ascii', renderCSS);
	
};

exports.getSlidesCSSTemplate = getSlidesCSS;

exports.getSliderList = function(done, error){
	
	function sendFiles(files){
		
		for(var i=0; i< files.length; i++) {
	 		if (files[i].indexOf('cache') > -1
	 			|| files[i].indexOf('base') > -1) {
	 				
	 			files.splice(i, 1);
	 			i--;
	 		}
	 		else files[i] = files[i].replace('.json', '');
	 	}
	 	
	 	done(files);
	}
	
	fsAccess.getDirectoryFiles(error, '/sliders', sendFiles);
};

function saveSlider(name, data, done, error){
	var fileName = '/sliders/' + name + '.json';
	
	function writeFile(){
		try {
			var jsonData = JSON.parse(JSON.stringify(data));
			fsAccess.saveJSONFile(error, fileName, data, done);
		} catch(e) {
			error(new Error("Error parsing to JSON file" + e.toString()));
		}
	}
	
	function versionate(){
		var now = new Date().getTime(),
			newFileName = '/sliders/cache/' + name  + '.json' + '-' + now;
		
		fsAccess.copy(error, fileName, newFileName, writeFile)
	}
	
	function doesnot(){
		resource.createSliderFolder(name, writeFile, error);
	}
	
	fsAccess.fileExist(error, fileName, versionate, doesnot);
};
exports.saveSlider = saveSlider;

exports.defaultSlider = function(done, error){
	fsAccess.getJSONFile(error, '/sliders/base/slider.json', done);
};

function getOfflineFiles(_slider, done, error){

	function buildFiles(err, _path){
		var files = [
			{ name: "js/offline.js", path: _path + "/offline/offline.js" },
			
			{ name: "css/slider.css", path: _path + "/public/css/slider.css" },
			{ name: "css/highlight/solarized_dark.min.css", path: _path + "/public/css/highlight/solarized_dark.min.css" },
			
			{ name: "js/libs/highlight.min.js", path: _path + "/public/js/libs/highlight.min.js" },
			{ name: "js/libs/jquery.slider.js", path: _path + "/public/js/libs/jquery.slider.js" },
			{ name: "js/libs/jquery-1.7.2.min.js", path: _path + "/public/js/libs/jquery-1.7.2.min.js" },
			{ name: "js/libs/mustache.js", path: _path + "/public/js/libs/mustache.js" }	
		];
	
		function buildSliderResources(resources){
			for(var i=0; i<resources.length; i++){
				files.push({
					name: "images/" + resources[i].file,
					path: _path + "/public/slider/" + _slider.name + "/images/" + resources[i].file
				});
			}
		
			done(files);
		}
			
		resource.getResources(_slider.name, buildSliderResources, error);
	}
	
	fsAccess.getRoot(buildFiles);
}

function buildOffLineHTML(error, _slider, done){
	
	function renderHTML(indexHtml, slidesView, slideStyles){
		var html = mustache.to_html(indexHtml, { 
			title: _slider.config.title, 
			partialView: slidesView, 
			partialStyles: slideStyles
		});
	 	
	 	done(html);
	}
	
	fsAccess.getFiles(error, [
				'/offline/index.html', 
				'/public/partialViews/_slides.html',
				'/public/partialViews/_style.html'
			], 'ascii', renderHTML);
};

exports.getSliderZIP = function(_slider, done, error){
	
  var archive = new zip();
	
	function sendZipFile(err) {
	  if (err) error(new Error('Error generating zip file: ' + err));
		done(archive.toBuffer());
	}
	
	function addOfflineFiles(files){
	  archive.addFiles(files, sendZipFile);
	}
	
	function addSliderCSS(css){
    archive.add("styles.css", new Buffer(css, "utf8"));
		getOfflineFiles(_slider, addOfflineFiles, error);		
	}
	
	function addIndexHTML(html){
		archive.add("index.html", new Buffer(html), "utf8");
		
		var slides = "var jsonData = " + JSON.stringify(_slider.slides) + ";";
		archive.add("js/slides.js", new Buffer(slides), "utf8");
	
	  getSlidesCSS(_slider, addSliderCSS, error);
	}
	
	buildOffLineHTML(error, _slider, addIndexHTML);
};

exports.revert = function(error, index, _slider, done){
	var fileRecovered;
	function removePrevious(){
		fsAccess.removeFile(error, "/sliders/cache/" + fileRecovered, done);
	}
	
	function saveNew(recovered){
		var fileName = '/sliders/' + _slider.name + '.json';
		fsAccess.saveJSONFile(error, fileName, recovered, removePrevious);
	}
	
	function sortFilesDesc(allfiles){
		var files = [];
		for(var i=0; i<allfiles.length;i++){
			if (allfiles[i].indexOf(_slider.name + '.json-') > -1){
				files.push(parseInt(allfiles[i].split('-')[1]));
			}
		}
		
		files.sort(function(a, b){ return b-a } );
		
		fileRecovered = _slider.name + '.json-' + files[index-1];
		fsAccess.getJSONFile(error, '/sliders/cache/' + fileRecovered, saveNew);
	}
	
	var path = '/sliders/cache/';
	fsAccess.getDirectoryFiles(error, path, sortFilesDesc);
};

