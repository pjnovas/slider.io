
var Slider = (function($) {
	"use strict";
	
	var totIncrement = 0,
		increment,
		initialMargin,
		mainCtn,
		ulId,
		editorTmpl = '',
		
		currentIndex = 0,
		slider,
		slides,
		slidesLen,
		firstSlider,
		currentSlide,
		
		velocity = 500,
		slideData = null;
	
	var toggle = function(wich, visible){
		if (visible === undefined){
				$(wich, currentSlide).slideToggle(velocity);
			}
			else {
				if (visible) $(wich, currentSlide).slideDown(velocity);
			  else $(wich, currentSlide).slideUp(velocity);
			}
	};

	var setPosition = function(finishMove, dontAnimate){
		totIncrement = (-1 * currentIndex * increment) + initialMargin;
		
		if (currentSlide) {
			toggle('aside', false);
			toggle('details', false);
			currentSlide.removeClass('current');
		}
		
		function endMove(){
			currentSlide = slides.eq(currentIndex).addClass('current');
			buildSlide(currentIndex);

			if (currentIndex < slidesLen-1)
				buildSlide(currentIndex+1);
			
			if (finishMove) finishMove(currentIndex);
		}
		
		if (dontAnimate){
			slider.css({ marginLeft: totIncrement});
			endMove();
		}
		else {
			slider.stop(true).animate({ marginLeft: totIncrement}, velocity, function(){
				endMove();
			});
		}
	};
	
	var resize = function(){
		var h = $(mainCtn).height(),
			w = $(mainCtn).width(),
			mr = 0,
			mt = (h * 0.05),
			height,
			width;
			
		height = h - mt * 2;
		width = height;
		
		var gap = ((w - width) /2);
		
		if (h > w) {
			height = width = w;
			mt = (h - w) / 2;
			mr = gap * -1;
		}
		else {
			mr = gap * 0.75;
		}
		
		slider.height(height + mt).css('margin-top', mt);
		slides.height(height).width(width).css('margin-right', mr);
		
		currentSlide = slides.eq(currentIndex).addClass('current');
		
		increment = width + (currentSlide.outerWidth(true) - currentSlide.innerWidth());	
		slider.width(increment * slidesLen);
		
		if (h > w) initialMargin = 0;
		else initialMargin = (w - width) / 2;
		
		slider.css('margin-left', initialMargin);
		
		setPosition(null, true);
	};
	
	var template = function(name){
		return $('#' + name + '-tmpl').html().trim();
	};
	
	var buildSlide = function(idx){
		var data = slideData[idx],
			sContent, 
			fContent, 
			li,
			type = data.type || 'content',
			curr = slides.eq(idx);
		
		type = editorTmpl + type;
		
		if (!curr.prop('data-built')) {
			
			data.htmlFormat = function(){
				return function(text, render){
					text = render(text);
					
					return text.replace(/\[b\]/g, '<b>').replace(/\[\/b\]/, '</b>')
									.replace(/\[i\]/g, '<i>').replace(/\[\/i\]/, '</i>');
					
					//TODO: color & links
					/*
					var colorPattern = /\[c (#)?([0-9a-fA-F]{3})([0-9a-fA-F]{3})?\]/g;
					var colors = text.match(colorPattern);
					*/
				}
			};
			
			sContent = $.mustache(template(type), data);
			fContent = $.mustache(template('footer'), data);
			
			curr.append(sContent).append(fContent).prop('data-built', true);
			if (data.isChapter) curr.addClass('title');
			
			if (data.next || data.next === 0){
				curr.attr('data-next', data.next);
			}
			if (data.prev || data.prev === 0){
				curr.attr('data-prev', data.prev);
			}
			
			$('pre code', curr).each(function(i, e) {
				try {
					hljs.highlightBlock(e);
				} catch(e){
					console.log('highlighter blowed up inside the jquery.slider.js');
				}
			});
		}
		
		$('ul li', curr).hide();
	};
	
	return {
		init: function(slideList, start, options){
			mainCtn = options && options.container || window;
			editorTmpl = options && options.editorTmpl || '';
			ulId = options && options.ulId || 'slider-list';
			slideData = slideList;
			
			$('li', '#' + ulId).remove();
			for (var i=0; i< slideData.length; i++){
				$('#' + ulId).append('<li>');
			}
			
			slider = $('#' + ulId);
			slides = $('li', slider);
			slidesLen = slides.length;
			firstSlider = $('li:first', slider);
			
			currentIndex = start;
			
			resize();
			
			$('#' + ulId).show();
			
			$(mainCtn).bind('resize orientationchange', resize);
		},
		moveLeft: function(finishMove){
			var hiddenItems = $('ul li:hidden', currentSlide);
			if (hiddenItems.length > 0) {
				this.moveTo(currentIndex, finishMove);		
			}
			else {
				var prev = currentSlide.attr('data-prev');
				if (prev) {
					this.moveTo(parseInt(prev,10), finishMove);
				}
				else if(currentIndex > 0) {
					this.moveTo(currentIndex - 1, finishMove);
				}
			}
		},
		moveRight: function(finishMove) {
			var hiddenItems = $('ul.bulletList li:hidden', currentSlide);
			if (hiddenItems.length > 0) {
				this.moveTo(currentIndex, finishMove);		
			}
			else {
				var next = currentSlide.attr('data-next');
				if (next) {
					this.moveTo(parseInt(next,10), finishMove);
				}
				else if(currentIndex < slidesLen-1) {
					this.moveTo(currentIndex + 1, finishMove);
				}
			}
		},
		moveTo: function(index, finish){
			if (index < 0 || index > slidesLen) return;
			
			if (index === currentIndex){
				var hiddenItems = $('ul li:hidden', currentSlide);
				if (hiddenItems.length > 0) {
					hiddenItems.eq(0).show();
					finish($('ul li:visible', currentSlide).length, 'list');
				}
				return;
			}
			
			currentIndex = index;
			setPosition(function(){
				if (finish) finish(currentIndex);
			});
		},
		toggle: function(visible){
			if (visible === undefined){
				slides.toggle();
				return firstSlider.is(':visible');
			}
			else {
				if (visible) slides.show();
			  else slides.hide();
			}
		},
		toggleCheatSheet: function(visible){
			toggle('aside', visible);
		},
		toggleComments: function(visible){
			toggle('details', visible);
		},
		updateList: function (index){
			var items = $('ul li', currentSlide);
			for (var i=0; i< index; i++){
				items.eq(i).show();
			}
		}
	};
	
})(jQuery);

