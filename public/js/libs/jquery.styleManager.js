

(function($){
	
	StyleManager = function(element, myStyle, options){
		var defaults = {
			font: {
				name: true,
				color: true,
				align: true,
				size: true
			},
			border: {
				radius: true,
				color: true,
				size: true
			},
			background: {
				color: {
					rgb: true,
					alpha: true
				},
				image: true
			}
		};
		
		var style = {
			font: {
				name: 'arial',
				color: {
					r: 0,
					g: 0,
					b: 0
				},
				align: 'center',
				size: 1
			},
			border: {
				radius: {
					top: 20,
					right: 20,
					bottom: 20,
					left: 20
				},
				color: {
					r: 0,
					g: 0,
					b: 0
				},
				size: {
					top: 0,
					right: 0,
					bottom: 0,
					left: 0
				}
			},
			background: {
				color:{
					r:69,
					g:69,
					b:69,
					alpha: 1
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
			container.append('<h2>' + settings.title + '</h2>');
		}
		
		var template = function(name){
			return $.trim($('#' + name + '-tmpl').html());
		};
		
		var build = {
			border: function(){
				
				var borderH = $($.mustache(template('config-head'), {title:'Border Styles'}));
				container.append(borderH);
								
				function radiusChanged(radius){
					newStyle.border.radius = radius;
					var r = radius.top + 'px ' + radius.right + 'px '
						+ radius.bottom + 'px ' + radius.left + 'px';
						
					$(element)
						.css("-moz-border-radius", r)
						.css("-webkit-border-radius", r)
						.css("border-radius", r);
				}
				
				function sizeChanged(size){
					newStyle.border.size = size;
					var s = size.top + 'px ' + size.right + 'px '
						+ size.bottom + 'px ' + size.left + 'px';
						
					$(element).css("border-style", 'solid');
					$(element).css("border-width", s);
				}
				
				this.borderCfg(newStyle.border, radiusChanged, sizeChanged); 
				
				if (settings.border.color){
					this.color(newStyle.border, function(color){
						newStyle.border.color = newStyle.border.color || 'transparent';
						newStyle.border.color = color;
						var c = "rgb(" + color.r + "," + color.g + "," + color.b + ")";

						$(element).css("border-style", 'solid');
						$(element).css("border-color", c);
					});
				}
			},
			
			font: function(){
				
				var fontH = $($.mustache(template('config-head'), {title:'Font Styles'}));
				container.append(fontH);
				
				this.fontName(newStyle.font, function(name){
					newStyle.font.name = name;
					$(element).css("font-family", name);
					$('textarea', element).css("font-family", name);
				});
				
				this.color(newStyle.font, function(color){
					newStyle.font.color = newStyle.font.color || {r:1,g:1,b:1};
					newStyle.font.color = color;
					var c = "rgb(" + color.r + "," + color.g + "," + color.b + ")";
					$(element).css("color", c);
					$('textarea', element).css("color", c);
				});
			},
			background: function() {
				var bgH = $($.mustache(template('config-head'), {title:'Background Styles'}));
				container.append(bgH);
				
				function updateColorElement(){
					color = newStyle.background.color;
					var c = "rgba(" + color.r + "," + color.g + "," + color.b + "," + (color.alpha || 1) + ")";
					$(element).css("background-color", c).css("-moz-box-shadow", "0px 0px 10px " + c)
						.css("-webkit-box-shadow", "0px 0px 10px " + c).css("box-shadow", "0px 0px 10px " + c);	
				}
				
				this.color(newStyle.background, function(color){
					var alpha = newStyle.background.color.alpha || 1;
					color.alpha = alpha;
					newStyle.background.color = color;
					updateColorElement();
				});
				
				if (settings.background.color.alpha) {
					this.alpha(newStyle.background.color, function(alpha){
						newStyle.background.color.alpha = alpha;
						updateColorElement();
					});
				}
				
				this.image(newStyle.background, function(file){
					newStyle.background.image = newStyle.background.image || {};
					if(file){
						newStyle.background.image.high = file;
						$(element).css("backgroundImage", "url('images/" + file + "')");
					}
					else {
						newStyle.background.image.high = '';
						$(element).css("backgroundImage", "none");
					}
				}, function(seamless){
					newStyle.background.image = newStyle.background.image || {};
					newStyle.background.image.seamless = seamless;
					if (seamless)
						$(element).css("background-position", "repeat").css("background-size", "auto");
 					else $(element).css("background-size", "100% 100%").css("background-position", "no-repeat");
				});
			},
			
			image: function(entity, onImageChange, onSeamlessChange) {
				
				var imageHtml = $($.mustache(template('style-image'), entity));
				container.append(imageHtml);
				
				var img = $('.image-field', imageHtml).bind('click', function(){
					var currRes,
						ele = $(this);
					
					if (ele.val()){
						currRes = {
							url: 'images/' + ele.attr('data-url'),
							file: ele.attr('data-url')	
						};
					}
					
					sliderio.view.resources.show(function(resource){
						ele.attr("data-url", resource.file)
							.trigger('change');
					}, currRes);
				}).bind('change', function(){
					var url = $(this).attr('data-url');
					if (!url) $(this).attr("src","/img/no-image.gif");
					else $(this).attr("src","images/" + url);
					onImageChange(url);
				});
				
				var url = img.attr('data-url');
				if (!url) img.attr("src","/img/no-image.gif");
				else img.attr("src","images/" + url);
				
				$('.image-seamless', imageHtml).button()
				.bind('change', function(){
					onSeamlessChange($(this).is(':checked'));
				});
				
				$('.image-field-remove', imageHtml).bind('click', function(){
					img.attr("data-url", '')
						.trigger('change')
						.attr("src","/img/no-image.gif");
				});
			},
			
			color: function(entity, onChangeColor) {
				entity.color = entity.color || {r:1, g:1, b:1}; 
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
					$('#color-picker').remove();
					onChangeColor(color);
				});
			},
			
			alpha: function(entity, onChangeAlpha){
				var alphaHtml = $($.mustache(template('style-alpha'), entity));
				container.append(alphaHtml);
				
				$('.alpha-field', alphaHtml).slider({
					value: entity.alpha || 1,
					range: "min",
					min: 0.1,
					max: 1,
					step: 0.1,
					slide: function( event, ui ) {
						onChangeAlpha(parseFloat(ui.value));
					}
				});
			},
			
			fontName: function(entity, onChange){
				var fontNameHtml = $($.mustache(template('style-fontFamily'), entity));
				container.append(fontNameHtml);
				
				$('.fontName-field', fontNameHtml)
					.bind('change',function(){
						onChange($(this).val());
				});
			},
			
			borderCfg: function (entity, onRadiusChanged, onSizeChanged) {
				var borderHtml = $($.mustache(template('style-border'), entity));
				container.append(borderHtml);
				
				$('.radius-field', borderHtml)
					.bind('change',function(){
						onRadiusChanged({
							top: parseInt($('.radius-top-field', borderHtml).val(),10) || 0,
							right: parseInt($('.radius-right-field', borderHtml).val(),10) || 0,
							bottom: parseInt($('.radius-bottom-field', borderHtml).val(),10) || 0,
							left: parseInt($('.radius-left-field', borderHtml).val(),10) || 0
						});
				});
				
				$('.size-field', borderHtml)
					.bind('change',function(){
						onSizeChanged({
							top: parseInt($('.size-top-field', borderHtml).val(),10) || 0,
							right: parseInt($('.size-right-field', borderHtml).val(),10) || 0,
							bottom: parseInt($('.size-bottom-field', borderHtml).val(),10) || 0,
							left: parseInt($('.size-left-field', borderHtml).val(),10) || 0
						});
				});
			}
		};
		
		if (settings.background) build.background();
		if (settings.font) build.font();
		if (settings.border) build.border();
		
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
