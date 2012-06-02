
var jsonReady = $.Deferred();
var templatesReady = $.Deferred();

$.when(templatesReady).done(buildToolbox);
$.when(jsonReady).done(init);

var template = function(name){
	return $.trim($('#' + name + '-tmpl').html());
};

function injectTemplates(){
	var dSlides = $.Deferred(),
		dToolbox = $.Deferred(),
		dDefault = $.Deferred();
	
	$.when(dSlides, dToolbox, dDefault).done(function(){
		templatesReady.resolve();
	});
	
	$.get('/partialViews/_templates.html', function(templates) {
	  $('body').append(templates);
	  dDefault.resolve();
	});
	
	$.get('/partialViews/_slide.html', function(templates) {
	  $('body').append(templates);
	  dSlides.resolve();
	});
	
	$.get('/partialViews/_toolbox.html', function(templates) {
	  $('body').append(templates);
	  dToolbox.resolve();
	});
	
}

function buildToolbox(){

	$.getJSON('/js/editor/json/toolbox.json', function(toolboxItems){
		
		var items = $.mustache(template('toolboxItem'), {items: toolboxItems});
		$('#toolbox').append(items);
		
		jsonReady.resolve();
			
	  }).error(function(data,status,xhr) { 
	  	console.dir({
	  		"data": data,
	  		"status": status,
	  		"xhr": xhr
		}); 
	});
}

function init(){
	$('a', '#toolbox').live('click', function(){
		var that = $(this),
			label = that.text();
			type = that.attr('data-type'),
			field = that.attr('data-field');
		
			buildForm(label, type, field);
	});
	
	Slider.init([{
		"title" : "2009",
		"bulletList": [
			"Item 1",
			"Item 2",
			"Item 3",
			"Item 4"
		]
	},
	{
		"title" : "2010",
		"bottomImage": {
			"url": "left_arrow.png",
			"size": "small"
		}
	},
	{
		"title" : "2011",
		"bottomImage": {
			"url": "left_arrow.png",
			"size": "small"
		}
	}], 0, {
		container: $('#preview')
	});
	
	Slider.toggle(true);
	Slider.updateList(10);
	
	$('#nextSlide').bind('click', function(){
		Slider.moveRight();
	});
	$('#prevSlide').bind('click', function(){
		Slider.moveLeft();
	});
	$('#addField').bind('click', function(){
		$('#toolbox').slideToggle(1000);
		$('#addField').toggleClass('close');
	});
	
	$('#screen-mode').buttonset();
	$('#view-edit').click(function(){
		$('.vEditor', '#preview').show();
	});
	$('#view-free').click(function(){
		$('.vEditor', '#preview').hide();
	});
}

function buildForm(label, type, field){
	
}

$(document).ready(function(){
	hljs.tabReplace = '  ';
	
	injectTemplates();
});








