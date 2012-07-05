
var sliderio = sliderio || {};
sliderio.view = sliderio.view || {};
sliderio.view.editor = sliderio.view.editor || {};

sliderio.view.editor.slider = (function($){
	var slides,
		currentCode,
		codeModal;
	
	var template = function(name){
		return $.trim($('#' + name + '-tmpl').html());
	};
	
	var createCodeModal = function() {
		codeModal = $('<div id="codeModal"></div>').appendTo('.sliderCtn');
		
		var modal = $.mustache(template('codeModal'), {});
		codeModal.append(modal);

		codeModal.dialog({
			autoOpen: false,
			title: "Code Block",
			width: 650,
			height: 350,
			resizable: false,
			zIndex: 500,
			modal: true,
			buttons: {
				"Ok": function(){
								
				}
			},
			open: function(){
				
			},
			close: function(){
				
			}
		});
	};
	
	var saveSlides = function(callback){
		sliderio.view.status.show('Saving ...');
		
		sliderio.service.slider.saveSlides(slides, function(data, err){
			if (err && err !== "success"){
				sliderio.view.status.error();
			}
			else {
				sliderio.view.status.success('Saved');
				if (callback) callback();
			}
		});
	};
	
	var addField = function(fieldName, idx){
		var field = {};
		field[fieldName] = {};
		
		switch(fieldName) {
			case 'title':
			case 'subTitle':
				field[fieldName].text = 'double click me';
				break;
			case 'list':
				field[fieldName].items = [];
				break;
			case 'image':
				field[fieldName].url = '';
				field[fieldName].style = {
					size: {
						width: 50,
						height: 50
					}
				};
				break;
			case 'code':
				field[fieldName].language = 'javascript';
				field[fieldName].script = 'double click me';
				break;
		}
		
		slides[idx].fields.push(field);
		saveSlides();
	}
	
	var hydrateSlide = function(idx){
	
		var fieldCtrls = $('.field', '#slider-list li:nth-child(' + (idx + 1) + ')');
		
		slides[idx].fields = [];
		
		fieldCtrls.each(function(){
			var fieldName = $(this).attr('data-field');
			var field = {};
			field[fieldName] = {};
			field[fieldName].style = field[fieldName].style || {};
			
			var ele = $(this).parents('.editorField');
			
			switch(fieldName) {
				case 'title':
				case 'subTitle':
					field[fieldName].text = $(this).val();
					var txtAlign = ele.css('text-align');
					if (txtAlign){
						if (txtAlign === 'center' && field[fieldName].style.align)
							delete field[fieldName].style.align;
						else field[fieldName].style.align = txtAlign;
					}
					
					var newW = (ele.width() * 100) / $("li.current").width();
					field[fieldName].style.size = {
						width: (newW <= 100)? newW : 100
					};
					
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
					
					var newW = (ele.width() * 100) / $("li.current").width();
					var newH = (ele.height() * 100) / $("li.current").height();
					
					field[fieldName].style.size = {
						width: (newW <= 100)? newW : 100,
						height: (newH <= 100)? newH : 100
					};
					
					break;
				case 'code':
					field[fieldName].language = 'javascript';
					field[fieldName].script = $(this).val();
					break;
				}
				
				field[fieldName].style.position = {
					top: (ele.position().top * 100) / $("li.current").height(),
					left: (ele.position().left * 100) / $("li.current").width()
				};
				
				var lazy = ele.find('.lazy-show');
				if (lazy.length > 0){
					field[fieldName].lazy = {};
					field[fieldName].lazy.visible = (lazy.hasClass('show'))? true: false;
					field[fieldName].lazy.index = parseInt(lazy.find('input').val(), 10);
				}
				
				slides[idx].fields.push(field);
			});
			
		saveSlides();
	};

	var initSlider = function(){
		Slider.init(slides, sliderio.view.toolbox.currentIndex(), {
			container: '.sliderCtn',
			editorTmpl: 'editor-'
		});
		
		Slider.toggle(true);
		refresh();
	};
	
	var refresh = function(){
		$('textarea', "li.current").attr('rows', 1).css('height', '1em');
		
		Slider.updateList(10);
		
		$(".editorField", "li.current").draggable({
			revert: 'invalid'
		});
		
		$("li.current").droppable({
			accept: ".editorField",
			tolerance: "fit",
			drop: function( event, ui ) {
				hydrateSlide(sliderio.view.toolbox.currentIndex());
			}
		}).disableSelection();
		
		$("#delete-field").droppable({
			activeClass: "active",
			hoverClass: "hover",
			tolerance: "pointer",
			accept: '.editorField',
			drop: function( event, ui ) {
				$(ui.draggable).remove();
				hydrateSlide(sliderio.view.toolbox.currentIndex());
			}
		});
		
		$('.fTextAlign', $("li.current")).each(function(){
			var ele = $(this).parents('.editorField');
			var align = ele.css('text-align');
			if(!align) align = 'center';
			$('a.icon-align-' + align, $(this)).addClass('selected'); 
		});
		
		$('textarea', "li.current").each(function(){
				var self = this;
				setTimeout(function(){
					self.style.height = 'auto';
					self.style.height = self.scrollHeight + 'px';
				}, 0);
		}).hide();

	};
	
	var attachEvents = function(){
		var liCurrent = $("li.current");
		
		$('a', '#toolbox').live('click', function(){
			var that = $(this),
			field = that.attr('data-field');
			
			addField(field, sliderio.view.toolbox.currentIndex());
			initSlider();
		});
		
		$('textarea', $("li.current")).live('change cut paste drop keydown', function(){
				var self = this;
				setTimeout(function(){
					self.style.height = 'auto';
					self.style.height = self.scrollHeight + 'px';
				}, 0);
		});
		
		$('.sliderWrapper').live('click', function(){
			$('.editorField.selected').removeClass('selected').resizable('destroy');
		});
			
		$('.editorField', $("li.current")).live('click', function(e){
			
			$('.editorField.selected').removeClass('selected').resizable('destroy');
			
			var ele = $(this);
			var handles = "e";
			if(ele.hasClass('isImage'))
				handles = "se";
			
			ele.addClass('selected').resizable({ 
				maxWidth: $("li.current").width() - (ele.position().left + 20),
				maxHeight: $("li.current").height() - (ele.position().top + 50),
				handles: handles,
			  stop: function(event, ui) {
			  	hydrateSlide(sliderio.view.toolbox.currentIndex());
			  }
			});
			
			e.stopPropagation();
		});
			
		$('textarea.newListItem', $("li.current")).live('click', function(){
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
		
		$('textarea', $("li.current")).live('change', function(){
			hydrateSlide(sliderio.view.toolbox.currentIndex());
		});
		
		$('textarea', $("li.current")).live('blur', function(){
			var txt = $(this),
				span = txt.prev('span');
				
			span.text(txt.val()).show();
			txt.hide();
		});
		
		$('span', $("li.current")).live('dblclick', function(){
			$(this).hide().nextAll('textarea').show().attr('rows', 1).css('height', '1em').focus();
		});
		
		$('pre', $("li.current")).live('dblclick', function(){
			currentCode = $(this);
			$('#codeModal').dialog('open');
		});
		
		$('.fTextAlign a', $("li.current")).live('click', function(){
			var ele = $(this).parents('.editorField');
			ele.css('text-align', $(this).attr('data-align'));
			
			$('.fTextAlign a.selected', ele).removeClass('selected');
			$(this).addClass('selected');
			hydrateSlide(sliderio.view.toolbox.currentIndex());
		});
		
		/*
		 * Lazy Show
		 */
		
		$('.lazy-show a', $("li.current")).live('click', function(){
			var self = $(this),
				holder = self.parents('.lazy-show');
			
			if (holder.hasClass('show')) {
				holder.removeClass('show').addClass('hide');
				self.removeClass('icon-eye-open').addClass('icon-eye-close');
			}
			else {
				holder.removeClass('hide').addClass('show');
				self.removeClass('icon-eye-close').addClass('icon-eye-open');
			}
			
			hydrateSlide(sliderio.view.toolbox.currentIndex());
		});
		
		$('.lazy-show input', $("li.current")).live('change', function(){
			hydrateSlide(sliderio.view.toolbox.currentIndex());
		});
				
		/*
		 * isChapter
		 */
		
		$('a.chapter-field', liCurrent).live('click', function(){
			var $this = $(this),
				idx = sliderio.view.toolbox.currentIndex();
				
			if ($this.attr('data-chapter') == "true"){
				slides[idx].isChapter = false;
				$this.removeClass('icon-bookmark').addClass('icon-bookmark-empty');
			}
			else {
				slides[idx].isChapter = true;
				$this.removeClass('icon-bookmark-empty').addClass('icon-bookmark');
			}
			
			saveSlides(function(){
				initSlider();
			});
		});
		
		/*
		 * Image Editor
		 */
		
		$('.editor-image', $("li.current")).live('dblclick', function() {
			var currRes,
				ele = $(this),
				_file = ele.attr('data-field-url');
				
			if (_file){
				currRes = {
					url: 'images/' + _file,
					file: _file
				};
			}
			
			sliderio.view.resources.show(function(resource){
				ele.attr('data-field-url', resource.file);
				ele.attr('src', 'images/' + resource.file);
				hydrateSlide(sliderio.view.toolbox.currentIndex());
			}, currRes);	
		});
		
	};
	
	return {
		build: function(done){
			var dPartial = $.Deferred(),
				dSlides = $.Deferred(),
				dStyles = $.Deferred();
				
			$.when(dSlides, dPartial, dStyles).done(function(data){
				slides = data;
				createCodeModal();
				attachEvents();
				done();
			});
			
			sliderio.service.slider.getSlides(function(data){
				dSlides.resolve(data);
			});
			
			sliderio.view.partials.importStyles(function(){
				dStyles.resolve();
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
		},
		
		save: function(){
			saveSlides();
		}
		
	};
	
})(jQuery);
