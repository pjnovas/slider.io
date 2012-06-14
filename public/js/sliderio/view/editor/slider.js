
var sliderio = sliderio || {};
sliderio.view = sliderio.view || {};
sliderio.view.editor = sliderio.view.editor || {};

sliderio.view.editor.slider = (function($){
	var slides,
		addFieldItems = [];
	
	var template = function(name){
		return $.trim($('#' + name + '-tmpl').html());
	};
	
	var addField = function(fieldName, idx){
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
	
	var hydrateSlide = function(idx){
	
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
			
		sliderio.service.slider.saveSlides(slides, function(){
			//TODO: do something
		});
	};

	var initSlider = function(){
		Slider.init(slides, sliderio.view.toolbox.currentIndex(), {
			container: window,
			editorTmpl: 'editor-'
		});
		
		Slider.toggle(true);
		refresh();
	};
	
	var refresh = function(){
		$('textarea').attr('rows', 1).css('height', '1em');
		
		Slider.updateList(10);
			
		$("li.current").sortable({
			revert: true,
			items: '.editorField',
			handle: 'a.moveField',
			update: function(event, ui) {
				hydrateSlide(sliderio.view.toolbox.currentIndex());
			}
		}).disableSelection();
	};
	
	var attachEvents = function(){
		var liCurrent = $("li.current");
		
		$('a', '#toolbox').live('click', function(){
			var that = $(this),
			field = that.attr('data-field');
			
			addField(field, sliderio.view.toolbox.currentIndex());
			initSlider();
		});
		
		$('a.addField').live('click', function(){
			$('#toolbox').show();
		});
		
		$('a.closePopup').live('click', function(){
			$('#toolbox').hide();
		});
		
		$('textarea', liCurrent).live('change cut paste drop keydown', function(){
				var self = this;
				setTimeout(function(){
					self.style.height = 'auto';
					self.style.height = self.scrollHeight + 'px';
				}, 0);
		});
			
		$('textarea.newListItem', liCurrent).live('click', function(){
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
		
		$('textarea', liCurrent).live('change', function(){
			hydrateSlide(sliderio.view.toolbox.currentIndex());
		});
		
		$('a.remove', liCurrent).live('click', function(){
			$(this).parent('.editorField').remove();
			hydrateSlide(sliderio.view.toolbox.currentIndex());
		});
		
	};
	
	return {
		build: function(done){
			var dPartial = $.Deferred(),
				dSlides = $.Deferred();
				
			$.when(dSlides, dPartial).done(function(data){
				slides = data;
				attachEvents();
				done();
			});
			
			sliderio.service.slider.getSlides(function(data){
				dSlides.resolve(data);
			});
			
			sliderio.view.partials.importEditor(function(){
				sliderio.service.slider.getToolbox(function(addFieldItems){
					var addFieldPopup = $.mustache(template('toolboxItem'), {items: addFieldItems});
					$('.sliderCtn').append(addFieldPopup);
			
					dPartial.resolve();
				});	
			});
		},
		
		init: function(){
			initSlider();
		},
		
		refresh: function(){
			refresh();
		},
		
		getSlides: function(){
			return slides;
		}
		
	};
	
})(jQuery);
