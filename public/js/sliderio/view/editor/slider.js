
var sliderio = sliderio || {};
sliderio.view = sliderio.view || {};
sliderio.view.editor = sliderio.view.editor || {};

sliderio.view.editor.slider = (function($){
	var slides;
	
	var template = function(name){
		return $.trim($('#' + name + '-tmpl').html());
	};
	
	var saveSlides = function(callback){
		var saveStatus = $('#save-msg');
		
		if(saveStatus.length === 0)
			saveStatus = $("<div id='save-msg'><span></span></div>").appendTo('body');
			 
		saveStatus.show().css('opacity', 1);
		var span = $('span', saveStatus).text('Saving ...');
		
		sliderio.service.slider.saveSlides(slides, function(data, err){
			if (err && err !== "success"){
				$('a', saveStatus).remove();
				var lnk = $("<a href='#'>Reload</a>")
					.bind('click', function(){
						sliderio.service.slider.revert(function(){
							window.location.href = '/';
						});
					});

				span.text('Error: ');
				saveStatus.addClass('error').append(lnk);
			}
			else {
				span.text('Saved');
				saveStatus.addClass('success').stop(true).animate({opacity: 0}, 2000, function(){
					saveStatus.hide();
				});
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
		saveSlides();
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
					var txtAlign = $(this).css('text-align');
					if (txtAlign){
						if (txtAlign === 'center' && field[fieldName].align)
							delete field[fieldName].align;
						else {
							field[fieldName].align = txtAlign;
						}
					}
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
		$('textarea').attr('rows', 1).css('height', '1em');
		
		Slider.updateList(10);
			
		$("li.current").sortable({
			revert: true,
			items: '.editorField',
			update: function(event, ui) {
				hydrateSlide(sliderio.view.toolbox.currentIndex());
			}
		}).disableSelection();
		
		$("#delete-field").droppable({
			activeClass: "active",
			hoverClass: "hover",
			tolerance: "pointer",
			drop: function( event, ui ) {
				$(ui.draggable).remove();
				hydrateSlide(sliderio.view.toolbox.currentIndex());
			}
		})
		
		$('.fTextAlign', $("li.current")).each(function(){
			var ele = $(this).parents('.editorField');
			var align = $('textarea', ele).css('text-align');
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
		
		$('textarea', liCurrent).live('blur', function(){
			var txt = $(this),
				span = txt.prev('span');
				
			span.text(txt.val()).show();
			txt.hide();
		});
		
		$('span', 'li.current').live('dblclick', function(){
			$(this).hide().nextAll('textarea').show().attr('rows', 1).css('height', '1em').focus();
		});
		
		$('a.remove', liCurrent).live('click', function(){
			$(this).parent('.editorField').remove();
			hydrateSlide(sliderio.view.toolbox.currentIndex());
		});
		
		$('.fTextAlign a', liCurrent).live('click', function(){
			var ele = $(this).parents('.editorField');
			$('span', ele).css('text-align', $(this).attr('data-align'));
			$('textarea', ele).css('text-align', $(this).attr('data-align'));
			$('.fTextAlign a.selected', ele).removeClass('selected');
			$(this).addClass('selected');
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
		
		$('.editor-image', liCurrent).live('mouseenter', function(){
			$('.imageOptions' ,this).show();
		}).live('mouseleave', function(){
			$('.imageOptions' ,this).hide();
		});
		
		$('.editor-image li a.edit-resource', liCurrent).live('click', function(){
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
				var img = ele.parents('div.editor-image').children('img.field'); 
				
				ele.attr('data-field-url', resource.file);
				img.attr('data-field-url', resource.file);
				img.attr('src', 'images/' + resource.file);
				hydrateSlide(sliderio.view.toolbox.currentIndex());
			}, currRes);	
		});
		
		var resizeImage = function(ele, size){
			var img = ele.parents('div.editor-image').children('img.field');
			img.attr('data-field-size', size)
				.attr('class', size + ' field');
			hydrateSlide(sliderio.view.toolbox.currentIndex());
		};
		
		$('.editor-image li a.edit-small', liCurrent).live('click', function(){
			resizeImage($(this), 'small');
		});
		
		$('.editor-image li a.edit-normal', liCurrent).live('click', function(){
			resizeImage($(this), 'normal');
		});
		
		$('.editor-image li a.edit-big', liCurrent).live('click', function(){
			resizeImage($(this), 'big');
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
		},
		
		save: function(){
			saveSlides();
		}
		
	};
	
})(jQuery);
