
var sliderio = sliderio || {};
sliderio.view = sliderio.view || {};
sliderio.view.editor = sliderio.view.editor || {};

sliderio.view.editor.config = (function($){
	var config;
	
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
		
		var mainBg = new StyleManager(".sliderCtn", { background: config.background }, {});
		var allBg = new StyleManager("#slider-list li:not(.title)", { background: config.slide.all.background }, {});
		var titleBg = new StyleManager("#slider-list li.title", { background: config.slide.title.background }, {});
		
		
		$("#mainConfigs")
			.append(main)
			.append(mainBg.getContainer())
			.append(allBg.getContainer())
			.append(titleBg.getContainer());
		
		
		/*
		$('.cfg-field').live('change', function(){
			var self = $(this);
			var ctrlVal = self.val();
			
			if (self.is(':checkbox'))
				ctrlVal = self.is(':checked');
			
			hydrateConfigs({
				container: self.parents('div.cfg-ctn').attr('data-ctn'),
				value: ctrlVal,
				type: self.attr('data-field')
			});
		});
		*/
	};
	
	var hydrateConfigs = function (cfgField){
		var p = config;
		
		var buildProperty = function(ctn){
			if (ctn) {
				var props = ctn.split('.');
				for(var i=0; i< props.length; i++){
					if (p[props[i]] === undefined) {
						if (i === props.length-1)
							cfgField.type = props[i]; 
						else p[props[i]] = {};
					}
					else if (i === props.length-1 && typeof p[props[i]] !== 'object') {
						cfgField.type = props[i]; 
					}
					else p = p[props[i]];
				}
			}
		};
		
		buildProperty(cfgField.container);
		
		if (cfgField.type.indexOf('.') > -1){
			buildProperty(cfgField.type);
		}
		
		var newValue = cfgField.value;
		
		var val = parseFloat(newValue);
		if(!isNaN(val)) newValue = val; 
		
		p[cfgField.type] = newValue;
		
		var updateCSS = function(){
			
			function getSelector(){
				switch(cfgField.container){
					case "background": return ".sliderCtn";
					case "slide.all.background": return "#slider-list li:not(.title)";
					case "slide.title.background": return "#slider-list li.title";
					default: return ".sliderCtn";
				}
			}
			
			switch(cfgField.type){
				case "initIndex":
					Slider.moveTo(newValue);
					break;
				case "title":
					document.title = newValue;
					break;
				case "fontFamily":
					$(getSelector()).css("font-family", newValue);
					break;
			}
		};
		
		updateCSS();
	};

	var saveConfig = function(cfg) {	
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

