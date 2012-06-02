
var jsonReady = $.Deferred();
var templatesReady = $.Deferred();

$.when(templatesReady).done(buildToolbox);
$.when(jsonReady).done(init);

var template = function(name){
	return $.trim($('#' + name + '-tmpl').html());
};

function injectTemplates(){
	var dSlides = $.Deferred(),
		dDefault = $.Deferred();
	
	$.when(dSlides, dDefault).done(function(){
		templatesReady.resolve();
	});
	
	$.get('/partialViews/_slides.html', function(templates) {
	  $('body').append(templates);
	  dDefault.resolve();
	});
	
	$.get('/partialViews/_editor.html', function(templates) {
	  $('body').append(templates);
	  dSlides.resolve();
	});
	
}

function buildToolbox(){
	var djsonToolbox = $.Deferred(),
		djsonSlides = $.Deferred();

	$.when(djsonSlides, djsonToolbox).done(function(slides){
		jsonReady.resolve(slides);
	});

	$.getJSON('/js/editor/json/toolbox.json', function(toolboxItems){
		
		var items = $.mustache(template('toolboxItem'), {items: toolboxItems});
		$('#toolbox').append(items);

		djsonToolbox.resolve();
	
	  }).error(function(data,status,xhr) { 
	  	console.dir({
	  		"data": data,
	  		"status": status,
	  		"xhr": xhr
		}); 
	});
	
	$.getJSON('slides.json', function(data){
		
		djsonSlides.resolve(data);
	
	  }).error(function(data,status,xhr) { 
	  	console.dir({
	  		"data": data,
	  		"status": status,
	  		"xhr": xhr
		}); 
	});
}

function init(slides){
	$('a', '#toolbox').live('click', function(){
		var that = $(this),
			label = that.text();
			type = that.attr('data-type'),
			field = that.attr('data-field');
		
			buildForm(label, type, field);
	});
	
	Slider.init(slides, 0, {
		container: $('#preview'),
		editorTmpl: 'editor-'
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








