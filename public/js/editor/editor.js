
var jsonReady = $.Deferred();
var templatesReady = $.Deferred();

$.when(templatesReady).done(buildToolbox);
//$.when(jsonReady, templatesReady).done(init);

var template = function(name){
	return $.trim($('#' + name + '-tmpl').html());
};

function injectTemplates(){
	var dSlides = $.Deferred(),
		dToolbox = $.Deferred();
	
	$.when(dSlides, dToolbox).done(function(){
		templatesReady.resolve();
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
}

function buildForm(label, type, field){
	
}

$(document).ready(function(){
	hljs.tabReplace = '  ';
	
	injectTemplates();
});








