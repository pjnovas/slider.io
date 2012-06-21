
var sliderio = sliderio || {};
sliderio.view = sliderio.view || {};
sliderio.view.editor = sliderio.view.editor || {};

sliderio.view.editor.config = (function($){
	var config,
		data = {};
	
	var template = function(name){
		return $.trim($('#' + name + '-tmpl').html());
	};

	var createDialog = function(){
		$('<div id="mainConfigs"></div>').appendTo('.sliderCtn');
		
		$("#mainConfigs").dialog({
			autoOpen: false,
			title: "Configurations",
			width: 450,
			height: 500,
			resizable: false,
			zIndex: 3,
			close: function(event, ui) { 
				alert("Warning: Your changes are not saved, press Save Button to do it.");
			},
			buttons: [{
	        text: "Save",
	        click: function() { 
	        	saveConfig(config);
	        }
	    },{
	        text: "Cancel",
	        click: function() { 
	        	location.reload(true);
	        }
	    }]
		});
	};
	
	var bind = function(){
		var main = $.mustache(template('config-main'), config);
		
		data.mainBg = new StyleManager(".sliderCtn", { background: config.background }, {});
		
		data.allBg = new StyleManager("#slider-list li:not(.title)", { 
			background: config.slide.all.background 
		}, {
			title:"All Slides"
		});
		
		data.titleBg = new StyleManager("#slider-list li.title", { 
			background: config.slide.title.background 
		}, {
			title:"Chapter Slides" 
		});
		
		
		$("#mainConfigs")
			.append(main)
			.append(data.mainBg.getContainer())
			.append(data.allBg.getContainer())
			.append(data.titleBg.getContainer());
		
		
		$('#txtInitIndex').bind('change', function(){
			var newIndex = parseInt($(this).val(), 10);
			config.initIndex = newIndex;
			Slider.moveTo(newIndex);
		});
		
		$('#txtTitle').bind('change', function(){
			var newTitle = $(this).val();
			config.title = newTitle;
			document.title = newTitle;
		});
		
		$('#txtFontFamily').bind('change', function(){
			var newFont = $(this).val();
			config.fontFamily = newFont;
			$(".sliderCtn").css("font-family", newValue);
		});
	};
	
	var saveConfig = function(cfg) {	
		cfg.background = data.mainBg.getStyle().background;
		cfg.slide.all.background = data.allBg.getStyle().background; 
		cfg.slide.title.background = data.titleBg.getStyle().background;
		 
		sliderio.service.slider.saveConfig(cfg, function(){
			location.reload(true);
		});
	};
	
	return {
		build: function(done){
			var dPartial = $.Deferred(),
				dConfig = $.Deferred();
			
			createDialog();
			
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
		},
			
		show: function(){
			$('#mainConfigs').dialog('open');
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

