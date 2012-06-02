
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
	var currentSliderIndex = 0,
		currentStateEdit = true;
	
	var initSlider = function(editor){
		currentStateEdit = editor;
		Slider.init(slides, currentSliderIndex, {
			container: $('#preview'),
			editorTmpl: (editor) ? 'editor-' : ''
		});
		
		Slider.toggle(true);
		Slider.updateList(10);
		
		$('textarea').attr('rows', 1).css('height', '1em');
	};
	
	$('a', '#toolbox').live('click', function(){
		var that = $(this),
			label = that.text();
			type = that.attr('data-type'),
			field = that.attr('data-field');
		
			buildForm(label, type, field);
	});
	
	$('#nextSlide').bind('click', function(){
		Slider.moveRight(function(idx){
			currentSliderIndex = idx;
			$('textarea').attr('rows', 1).css('height', '1em');
			
			if (currentStateEdit)
				Slider.updateList(10);
		});
	});
	
	$('#prevSlide').bind('click', function(){
		Slider.moveLeft(function(idx){
			currentSliderIndex = idx;
			$('textarea').attr('rows', 1).css('height', '1em');
			
			if (currentStateEdit)
				Slider.updateList(10);
		});
	});
	
	$('#addField').bind('click', function(){
		$('#toolbox').slideToggle(1000);
		$('#addField').toggleClass('close');
	});
	
	$('#screen-mode').buttonset();
	
	$('#view-edit').click(function(){
		$('.vEditor', '#preview').show();
		initSlider(true);
	});
	
	$('#view-free').click(function(){
		$('.vEditor', '#preview').hide();
		initSlider(false);
	});
	
	$('textarea').live('change, cut, paste, drop, keydown', function(){
			var self = this;
			setTimeout(function(){
				self.style.height = 'auto';
				self.style.height = self.scrollHeight + 'px';
			}, 0);
	});
		
	$('textarea.newListItem').live('click', function(){
		var li = $(this).parent('li');
		var newItem = $("<li style='display: list-item;'><textarea></textarea></li>");
		newItem.insertBefore(li);
		$('textarea', newItem).attr('rows', 1).css('height', '1em').focus();
	});
	
	$('textarea').live('change', function(){
		hydrateSlide(currentSliderIndex, slides);
	});
	
	initSlider(true);
}

function hydrateSlide(idx, slides){
	
	var fieldCtrls = $('.field', '#slider-list li:nth-child(' + (idx + 1) + ')');

	slides[idx].fields = [];
	
	fieldCtrls.each(function(){
		var fieldName = $(this).attr('data-field');
		var field = {};
		field[fieldName] = {};
		
		switch(fieldName) {
			case 'title':
			case 'subTitle':
				field[fieldName].text = $(this).val();
				break;
			case 'list':
				field[fieldName].items = [];
				
				$('li textarea', $(this)).not('.newListItem').each(function(){
					field[fieldName].items.push($(this).val());
				});
				break;
		}
		
		slides[idx].fields.push(field);
	});
}

function buildForm(label, type, field){
	
}

$(document).ready(function(){
	hljs.tabReplace = '  ';
	
	injectTemplates();
});
