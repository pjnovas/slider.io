
var sliderio = sliderio || {};
sliderio.view = sliderio.view || {};
sliderio.view.editor = sliderio.view.editor || {};

sliderio.view.editor.config = (function($){
	var config,
		styles = {};
	
	var template = function(name){
		return $.trim($('#' + name + '-tmpl').html());
	};

	var bind = function(){
		
		var main = $.mustache(template('config-main'), config);
		
		styles.mainBg = new StyleManager(".sliderCtn", config.style, {
			border: false,
			font: false,
			background: {
				color: {
					alpha: false
				}
			},
			onChange: saveConfig
		});
		
		styles.allBg = new StyleManager("#slider-list li:not(.title)", config.slide.all.style, {
			title:"All Slides",
			onChange: saveConfig
		});
		
		styles.titleBg = new StyleManager("#slider-list li.title", config.slide.title.style, {
			title:"Chapter Slides",
			onChange: saveConfig
		});
		
		var contentConfigs = $("#mainConfigs .content");
		$('*', contentConfigs).remove();
		
		contentConfigs
			.append(main)
			.append(styles.mainBg.getContainer())
			.append(styles.allBg.getContainer())
			.append(styles.titleBg.getContainer());
		
		$('#txtInitIndex').bind('change', function(){
			var newIndex = parseInt($(this).val(), 10);
			config.initIndex = newIndex;
			Slider.moveTo(newIndex);
			saveConfig();
		});
		
		$('#txtTitle').bind('change', function(){
			var newTitle = $(this).val();
			config.title = newTitle;
			document.title = newTitle;
			saveConfig();
		});
	};
	
	var saveConfig = function() {
		cfg = config;	
		cfg.style = styles.mainBg.getStyle();
		cfg.slide.all.style = styles.allBg.getStyle(); 
		cfg.slide.title.style = styles.titleBg.getStyle();
		
		sliderio.view.status.show('Saving ...');
		
		sliderio.service.slider.saveConfig(cfg, function(data, err){
			if (err && err !== "success"){
				sliderio.view.status.error();
			}
			else {
				sliderio.view.status.success('Saved');
				if (callback) callback();
			}
		});
	};
	
	return {
		build: function(done){
			var dPartial = $.Deferred(),
				dConfig = $.Deferred();
			
			$.when(dConfig, dPartial).done(function(data){
				config = data;
				bind();
				done();
			});
			
			sliderio.view.partials.importConfig(function(){
				dPartial.resolve();
			});
			
			sliderio.service.slider.getConfig(function(data){
				dConfig.resolve(data);				
			});
		}
	};
	
})(jQuery);


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

