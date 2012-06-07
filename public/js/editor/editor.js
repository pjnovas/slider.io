
var jsonReady = $.Deferred();
var templatesReady = $.Deferred();

$.when(templatesReady).done(buildToolbox);
$.when(jsonReady).done(init);

var template = function(name){
	return $.trim($('#' + name + '-tmpl').html());
};

function injectTemplates(){
	var dSlides = $.Deferred(),
		dDefault = $.Deferred(),
		dConfig = $.Deferred();
	
	$.when(dSlides, dDefault, dConfig).done(function(){
		templatesReady.resolve();
	});
	
	$.get('/partialViews/_config.html', function(templates) {
	  $('body').append(templates);
	  dConfig.resolve();
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
		djsonSlides = $.Deferred(),
		djsonConfig = $.Deferred();

	$.when(djsonSlides, djsonConfig, djsonToolbox).done(function(slides, config){
		jsonReady.resolve(slides, config);
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
	
	$.getJSON('config.json', function(data){
		
		djsonConfig.resolve(data);
	
	  }).error(function(data,status,xhr) { 
	  	console.dir({
	  		"data": data,
	  		"status": status,
	  		"xhr": xhr
		}); 
	});
}

function init(slides, config) {
	var currentSliderIndex = 0,
		currentStateEdit = true;
		
	var rebuildEditMode = function(){
		Slider.updateList(10);
			
		$("li.current").sortable({
			revert: true,
			items: '.editorField',
			handle: 'a.moveField',
			update: function(event, ui) {
				hydrateSlide(currentSliderIndex, slides);
			}
		}).disableSelection();
	}
	
	var initSlider = function(editor){
		currentStateEdit = editor;
		Slider.init(slides, currentSliderIndex, {
			container: window,
			editorTmpl: (editor) ? 'editor-' : ''
		});
		
		Slider.toggle(true);
		
		$('textarea').attr('rows', 1).css('height', '1em');
		
		if (currentStateEdit) {
			rebuildEditMode();
		}
		
	};
	
	var rebuildMoveCtrls = function(){
		if (currentStateEdit){
			rebuildEditMode();
			
			if (currentSliderIndex === 0){
				$('#prevSlide').addClass('icon-plus').addClass('addSlide');
				$('#insertLeft').hide();
			}
			else {
				$('#prevSlide').addClass('icon-chevron-left').removeClass('addSlide').removeClass('icon-plus');
				$('#insertLeft').show();
			}
			
			if (currentSliderIndex === slides.length-1){
				$('#nextSlide').addClass('icon-plus').addClass('addSlide');
				$('#insertRight').hide();
			}
			else {
				$('#nextSlide').addClass('icon-chevron-left').removeClass('addSlide').removeClass('icon-plus');
				$('#insertRight').show();
			}
		}
		else {
			$('#insertLeft, #insertRight').hide();
			$('#prevSlide').addClass('icon-chevron-left').removeClass('addSlide').removeClass('icon-plus');
			$('#nextSlide').addClass('icon-chevron-right').removeClass('addSlide').removeClass('icon-plus');
		}
	}
	
	var moveLeft = function(callback){
		Slider.moveLeft(function(idx){
			currentSliderIndex = idx;
			$('textarea').attr('rows', 1).css('height', '1em');
			rebuildMoveCtrls();
			if (callback)
				callback();
		});
	};
	
	var moveRight = function(callback){
		Slider.moveRight(function(idx){
			currentSliderIndex = idx;
			$('textarea').attr('rows', 1).css('height', '1em');
			rebuildMoveCtrls();
			if (callback)
				callback();
		});
	};
	
	$('a', '#toolbox').live('click', function(){
		var that = $(this),
			field = that.attr('data-field');
			
			addField(field, currentSliderIndex, slides);
			initSlider(true);
	});
	
	$('#nextSlide').bind('click', function(){
		moveRight();
	});
	
	$('#prevSlide').bind('click', function(){
		moveLeft();
	});
	
	$('a.addField').live('click', function(){
		$('#toolbox').toggle();
	});
	
	$('textarea').live('change cut paste drop keydown', function(){
			var self = this;
			setTimeout(function(){
				self.style.height = 'auto';
				self.style.height = self.scrollHeight + 'px';
			}, 0);
	});
		
	$('textarea.newListItem').live('click', function(){
		var li = $(this).parent('li');
		
		var newItem = $("<li>");
		newItem
			.addClass('editorField')
			.css('display','list-item')
			.append('<textarea>')
			.append("<a href='#' class='remove'>x</a>");
			
		newItem.insertBefore(li);
		$('textarea', newItem).attr('rows', 1).css('height', '1em').focus();
	});
	
	$('textarea').live('change', function(){
		hydrateSlide(currentSliderIndex, slides);
	});
	
	$('a.remove').live('click', function(){
		$(this).parent('.editorField').remove();
		hydrateSlide(currentSliderIndex, slides);
	});
	
	$('#insertLeft, #prevSlide.addSlide').live('click', function(){
		insertSlide(currentSliderIndex, slides);
		currentSliderIndex++;
		initSlider(true);
		
		moveLeft();
	});
	
	$('#insertRight, #nextSlide.addSlide').live('click', function(){
		insertSlide(currentSliderIndex+1, slides);
		initSlider(true);
		
		moveRight();
	});
	
	$('#deleteCurrent').live('click', function(){
		
		if (slides.length > 1){
			if (currentSliderIndex === 0){
				moveRight(function(){
					removeSlide(0, slides);
					currentSliderIndex--;
					initSlider(true);
					rebuildMoveCtrls();
				});
			}
			else if(currentSliderIndex === slides.length-1) {
				moveLeft(function(){
					removeSlide(currentSliderIndex+1, slides);
					initSlider(true);
					rebuildMoveCtrls();
				});
			}
			else {
				moveRight(function(){
					removeSlide(currentSliderIndex-1, slides);
					currentSliderIndex--;
					initSlider(true);
					rebuildMoveCtrls();
				});
			}
		}
		else if (slides.length === 1){
			insertSlide(0, slides);
			removeSlide(currentSliderIndex+1, slides);
			initSlider(true);
			rebuildMoveCtrls();
		}
		
	});
	
	$("#preview").resizable();
	
	$("#mainConfigs").dialog({
		autoOpen: false,
		title: "Configurations",
		width: 450,
		height: 500,
		resizable: false,
		zIndex: 3,
		buttons: [{
        text: "Save",
        click: function() { 
        	$(this).dialog("close"); 
        }
    },{
        text: "Cancel",
        click: function() { 
        	$(this).dialog("close"); 
        }
    }]
	});
	
	$('#configs').bind('click', function(){
		$('#mainConfigs').dialog('open');
	});
	
	var bindConfig = function(){
		var main = $.mustache(template('config-main'), config);
		var mainBg = $.mustache(template('config-bg'), config.background);
		
		config.slide.all.background.title = "All Slides";
		config.slide.title.background.title = "Chapter Slide";
		var allBg = $.mustache(template('config-bg'), config.slide.all.background);
		var titleBg = $.mustache(template('config-bg'), config.slide.title.background);
		
		$("#mainConfigs").append(main).append(mainBg).append(allBg).append(titleBg);
	
		$('.color-field', $("#mainConfigs")).live('click', function(){
			$('#color-picker').remove();
			$(this).after('<div id="color-picker"></div>');
			$('#color-picker').farbtastic(this);
		}).live('blur', function(){
			$('#color-picker').remove();
		}).applyFarbtastic();
	};
	
	bindConfig();
	
	initSlider(true);
	rebuildMoveCtrls();
}

function insertSlide(idx, slides){
	slides.splice(idx, 0, {
		"fields": []
	});
}

function removeSlide(idx, slides){
	slides.splice(idx, 1);
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
			case 'image':
				field[fieldName].url = $(this).attr('data-field-url');
				field[fieldName].size = $(this).attr('data-field-size');
				break;
			case 'code':
				field[fieldName].language = 'javascript';
				field[fieldName].script = $(this).val();
				break;
		}
		
		slides[idx].fields.push(field);
	});
	
	saveSlider(slides);
}

function addField(fieldName, idx, slides){
	var field = {};
	field[fieldName] = {};
	
	switch(fieldName) {
		case 'title':
		case 'subTitle':
			field[fieldName].text = 'some text here';
			break;
		case 'list':
			field[fieldName].items = [];
			break;
		case 'image':
			field[fieldName].url = '';
			field[fieldName].size = 'small';
			break;
		case 'code':
			field[fieldName].language = 'javascript';
			field[fieldName].script = 'put some code here';
			break;
	}
	
	slides[idx].fields.push(field);
}

var saveSlider = function(slides) {	
		
	$.ajax({
    url: "update",
    type: "POST",
    dataType: "json",
    data: JSON.stringify({slider: slides}),
    contentType: "application/json",
    cache: false,
    timeout: 5000,
    success: function(data) {
    	
    },
    error: function() {
      alert("Wow ... save didn't work");
    },
  }); 
};

$.fn.applyFarbtastic = function() {
	return this.each(function() {
		var self = $(this);
		
		if (self.attr('data-rgb')){
			
			function rgbToHex(r, g, b) {
				function componentToHex(c) {
			    var hex = c.toString(16);
			    return hex.length == 1 ? "0" + hex : hex;
				}
	
		    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
			}
			
			var colors = self.attr('data-rgb').split(',');
			var hexColor = rgbToHex(
				parseInt(colors[0],10), 
				parseInt(colors[1],10),
				parseInt(colors[2],10));
				
    	self.val(hexColor);
		}
		
		$('<div/>').farbtastic(this).remove();
	});
};

$(document).ready(function(){
	hljs.tabReplace = '  ';
	
	injectTemplates();
});

