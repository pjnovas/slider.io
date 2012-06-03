
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
			container: $('#preview'),
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
				$('#prevSlide').text('+').addClass('addSlide');
			}
			else {
				$('#prevSlide').text('<').removeClass('addSlide');
			}
			
			if (currentSliderIndex === slides.length-1){
				$('#nextSlide').text('+').addClass('addSlide');
			}
			else {
				$('#nextSlide').text('>').removeClass('addSlide');
			}
		}
		else {
			$('#prevSlide').text('<').removeClass('addSlide');
			$('#nextSlide').text('>').removeClass('addSlide');
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
			label = that.text();
			type = that.attr('data-type'),
			field = that.attr('data-field');
		
			buildForm(label, type, field);
	});
	
	$('#nextSlide').bind('click', function(){
		moveRight();
	});
	
	$('#prevSlide').bind('click', function(){
		moveLeft();
	});
	
	$('#addField').bind('click', function(){
		$('#toolbox').slideToggle(1000);
		$('#addField').toggleClass('close');
	});
	
	$('#screen-mode').buttonset();
	
	$('#view-edit').click(function(){
		$('.vEditor', '#preview').show();
		initSlider(true);
		rebuildMoveCtrls();
	});
	
	$('#view-free').click(function(){
		$('.vEditor', '#preview').hide();
		initSlider(false);
		rebuildMoveCtrls();
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
}

function buildForm(label, type, field){
	
}

$(document).ready(function(){
	hljs.tabReplace = '  ';
	
	injectTemplates();
});
