
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
		var h100 = 700,
			h = $(mainCtn).height(),
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
		
		$('html').css('font-size', ((h*100)/h100) + '%');
		
		for(var i=0; i< slideData.length; i++){
			if(slideData[i].isChapter)
				slides.eq(i).addClass('title');
		}
		
		var slideCommon = $("<li>").width(Math.floor(width)).css('margin-right', Math.floor(mr));;
		var slideChapter = $("<li>").addClass('title').width(Math.floor(width)).css('margin-right', Math.floor(mr));;
		slider.append(slideCommon).append(slideChapter);
		
		var theBiggest;
		if (slideCommon.outerWidth() > slideChapter.outerWidth()){
			theBiggest = slideCommon;
			var dif = slideCommon.outerWidth(true) - slideChapter.outerWidth(true);
			slides.filter('.title').width(width + dif);
			slides.not('.title').width(width);
		}
		else {
			theBiggest = slideChapter;
			var dif = slideChapter.outerWidth(true) - slideCommon.outerWidth(true);
			slides.not('.title').width(width + dif);
			slides.filter('.title').width(width);
		}
		
		slides.height(Math.floor(height)).css('margin-right', Math.floor(mr));
		slider.height(Math.ceil(height + mt)).css('margin-top', Math.floor(mt));

		currentSlide = slides.eq(currentIndex).addClass('current');
		increment = Math.floor(width + (theBiggest.outerWidth(true) - theBiggest.innerWidth()));
		
		slideCommon.remove();
		slideChapter.remove();
		theBiggest.remove();
		
		slider.width(Math.ceil(increment * slidesLen) + 200);
		
		if (h > w) initialMargin = 0;
		else initialMargin = Math.floor((w - width) / 2);
		
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
				}
			};
			
			sContent = $.mustache(template(type), data, {'style': template('fieldStyle')});
			fContent = $.mustache(template('footer'), data);
			
			curr.append(sContent).append(fContent).prop('data-built', true);
			
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
		
		$('ul.bulletList li', curr).hide();
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
			var hiddenItems = $('ul.bulletLis li:hidden', currentSlide);
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
				var hiddenItems = $('ul.bulletList li:hidden', currentSlide);
				if (hiddenItems.length > 0) {
					hiddenItems.eq(0).show();
					finish($('ul.bulletList li:visible', currentSlide).length, 'list');
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
				if (visible && slides) slides.show();
			  else if(slides) slides.hide();
			}
		},
		toggleCheatSheet: function(visible){
			toggle('aside', visible);
		},
		toggleComments: function(visible){
			toggle('details', visible);
		},
		updateList: function (index){
			var items = $('ul.bulletList li', currentSlide);
			for (var i=0; i< index; i++){
				items.eq(i).show();
			}
		},
		resizeSlider: function(){
			resize();
		}
	};
	
})(jQuery);

