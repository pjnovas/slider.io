

(function($){
	
	StyleManager = function(element, myStyle, options){
		var defaults = {
			background: {
				color: {
					r: true,
					g: true,
					b: true,
					a: true
				},
				image: {
			 		high: true,
			 		seamless: true
			 	}
			}
		};
		
		var style = {
			background: {
				color:{
					r:69,
					g:69,
					b:69,
					a: 1
				},
				image: {
			 		high: '',
			 		seamless: false
			 	}
			}
		};
		
		var newStyle = $.extend({}, style, myStyle);
		var settings = $.extend({}, defaults, options);
		
		var container = $('<div class="style-container"></div>');
		if (settings.title) {
			container.append('<hr/><span>' + settings.title + '</span>');
		}
		
		var template = function(name){
			return $.trim($('#' + name + '-tmpl').html());
		};
		
		var build = {
			background: function() {
				
				function updateColorElement(){
					color = newStyle.background.color;
					var c = "rgba(" + color.r + "," + color.g + "," + color.b + "," + (color.a || 1) + ")";
					$(element).css("background-color", c).css("-moz-box-shadow", "0px 0px 10px " + c)
						.css("-webkit-box-shadow", "0px 0px 10px " + c).css("box-shadow", "0px 0px 10px " + c);	
				}
				
				this.color(newStyle.background, function(color){
					newStyle.background.color = color;
					updateColorElement();
				}, function(alpha){
					newStyle.background.color.a = alpha;
					updateColorElement();
				});
				
				this.image(newStyle.background, function(file){
					if(file){
						newStyle.background.image.high = file;
						$(element).css("backgroundImage", "url('images/" + file + "')");
					}
					else {
						newStyle.background.image.high = '';
						$(element).css("backgroundImage", "none");
					}
				}, function(seamless){
					newStyle.background.image.seamless = seamless;
					if (seamless)
						$(element).css("background-position", "repeat").css("background-size", "auto");
 					else $(element).css("background-size", "100% 100%").css("background-position", "no-repeat");
				});
			},
			image: function(entity, onImageChange, onSeamlessChange) {
				
				var imageHtml = $($.mustache(template('style-image'), entity));
				container.append(imageHtml);
				
				$('.image-field', imageHtml).bind('click', function(){
					var currRes,
						ele = $(this);
					
					if (ele.val()){
						currRes = {
							url: 'images/' + ele.val(),
							file: ele.val()	
						};
					}
					
					sliderio.view.resources.show(function(resource){
						ele.val(resource.file);
						ele.trigger('change');
					}, currRes);
				}).bind('change', function(){
					onImageChange($(this).val());
				})
				
				$('.image-seamless', imageHtml).bind('change', function(){
					onSeamlessChange($(this).is(':checked'));
				});
			},
			color: function(entity, onChangeColor, onChangeAlpha) {
				
				var colorHtml = $($.mustache(template('style-color'), entity));
				container.append(colorHtml);
				
				var hexToRgb = function (hex) {
			    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
			    return result ? {
			        r: parseInt(result[1], 16),
			        g: parseInt(result[2], 16),
			        b: parseInt(result[3], 16)
			    } : null;
				};
				
				$('.color-field', colorHtml).applyFarbtastic()
				.bind('click', function(){
					$('#color-picker').remove();
					$(this).after('<div id="color-picker"></div>');
					$('#color-picker').farbtastic(this);
				})
				.bind('blur', function(){
					var self = $(this);
					var color = hexToRgb(self.val());
					var alpha = self.nextAll('input[data-field=color.a]').val();
					
					if(alpha) color.a = parseFloat(alpha); 
					$('#color-picker').remove();
					onChangeColor(color);
				});
				
				if (onChangeAlpha) {
					$('.colorA', colorHtml)
						.bind('change',function(){
							var alpha = parseFloat($(this).val());
							onChangeAlpha(alpha);
						});
				}
			}
			
		};
		
		if (settings.background) build.background();
		
		
		this.getContainer = function(){
			return container;
		},
		this.getStyle = function(){
			return newStyle;
		},
		this.destroy = function(){
			
		};
	};
	  
})(jQuery);

/*
style {
	 font {
	 	name [string]
	 	color {
	 		r [int]
	 		g [int]
	 		b [int]
	 	}
	 	align [string]
	 	size [int] em
	 }
	 
	 background {
	 	color {
	 		r [int]
	 		g [int]
	 		b [int]
	 		a [float]
	 	}
	 	image {
	 		high [string]
	 		seamless [bool]
	 		size {
	 			width [float] %
	 			height [float] %
	 		}
	 	}
	 }
	 
	 border {
	 	radius [int]
	 	color {
	 		r [int]
	 		g [int]
	 		b [int]
	 	}
	 	size [int] px
	 }
}
 */


