
var jsonReady = $.Deferred();
var templatesReady = $.Deferred();

$.when(templatesReady).done(buildToolbox);
$.when(jsonReady).done(init);

var template = function(name){
	return $.trim($('#' + name + '-tmpl').html());
};

function injectTemplates(){
	var dSlides = $.Deferred(),
		dDefault = $.Deferred(),
		dConfig = $.Deferred();
	
	$.when(dSlides, dDefault, dConfig).done(function(){
		templatesReady.resolve();
	});
	
	sliderio.view.partials.importSlides(function(){
		dDefault.resolve();
	});
	
	sliderio.view.partials.importConfig(function(){
		dConfig.resolve();
	});
	
	sliderio.view.partials.importEditor(function(){
		dSlides.resolve();
	});
}

function buildToolbox(){
	var djsonFieldAdd = $.Deferred(),
		djsonSlides = $.Deferred(),
		djsonConfig = $.Deferred(),
		djsonToolbox = $.Deferred();

	$.when(djsonSlides, djsonConfig, djsonFieldAdd, djsonToolbox).done(function(slides, config){
		jsonReady.resolve(slides, config);
	});

	sliderio.service.slider.getToolbox(function(toolboxItems){
		var items = $.mustache(template('toolboxItem'), {items: toolboxItems});
		$('#toolbox').append(items);

		djsonFieldAdd.resolve();
	});
	
	sliderio.service.slider.getSlides(function(data){
		djsonSlides.resolve(data);
	});
	
	sliderio.service.slider.getConfig(function(data){
		djsonConfig.resolve(data);
	});
	
	sliderio.view.toolbox.build(function(){
		djsonToolbox.resolve();
	});
}

function init(slides, config) {
	
	var rebuildEditMode = function(){
		Slider.updateList(10);
			
		$("li.current").sortable({
			revert: true,
			items: '.editorField',
			handle: 'a.moveField',
			update: function(event, ui) {
				hydrateSlide(sliderio.view.toolbox.currentIndex(), slides);
			}
		}).disableSelection();
	}
	
	var initSlider = function(){
		Slider.init(slides, sliderio.view.toolbox.currentIndex(), {
			container: window,
			editorTmpl: 'editor-'
		});
		
		Slider.toggle(true);
		
		$('textarea').attr('rows', 1).css('height', '1em');
		rebuildEditMode();		
	};
	
	sliderio.view.toolbox.init({
		sliderIndex: 0,
		slides: slides,
		onMove: function(){
			initSlider();
		},
		onInsertSlide: function(idx){
			initSlider();
		},
		onRemoveSlide: function(idx){
			initSlider();
		}
	});
	
	$('a', '#toolbox').live('click', function(){
		var that = $(this),
			field = that.attr('data-field');
			
			addField(field, sliderio.view.toolbox.currentIndex(), slides);
			initSlider();
	});
	
	$('a.addField').live('click', function(){
		$('#toolbox').toggle();
	});
	
	$('textarea').live('change cut paste drop keydown', function(){
			var self = this;
			setTimeout(function(){
				self.style.height = 'auto';
				self.style.height = self.scrollHeight + 'px';
			}, 0);
	});
		
	$('textarea.newListItem').live('click', function(){
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
	
	$('textarea').live('change', function(){
		hydrateSlide(sliderio.view.toolbox.currentIndex(), slides);
	});
	
	$('a.remove').live('click', function(){
		$(this).parent('.editorField').remove();
		hydrateSlide(sliderio.view.toolbox.currentIndex(), slides);
	});
	
	$("#preview").resizable();
	
	$("#mainConfigs").dialog({
		autoOpen: false,
		title: "Configurations",
		width: 450,
		height: 500,
		resizable: false,
		zIndex: 3,
		close: function(event, ui) { 
			alert("Warning: Your changes are not saved, you have press Save Button for save them.");
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
	
	$('#configs').bind('click', function(){
		$('#mainConfigs').dialog('open');
	});
	
	var bindConfig = function(){
		var main = $.mustache(template('config-main'), config);
		
		config.background.ctn = 'background';
		var mainBg = $.mustache(template('config-bg'), config.background);
		 
		config.slide.all.background.ctn = 'slide.all.background';
		config.slide.all.background.title = "All Slides";
		var allBg = $.mustache(template('config-bg'), config.slide.all.background);
		
		config.slide.title.background.ctn = 'slide.title.background';
		config.slide.title.background.title = "Chapter Slide";
		var titleBg = $.mustache(template('config-bg'), config.slide.title.background);
		
		$("#mainConfigs").append(main).append(mainBg).append(allBg).append(titleBg);
	
		$('.color-field', $("#mainConfigs"))
		.applyFarbtastic()
		.live('click', function(){
			
			$('#color-picker').remove();
			$(this).after('<div id="color-picker"></div>');
			
			$('#color-picker').farbtastic(this);
			
		})
		.live('blur', function(){
			var self = $(this);
			var color = hexToRgb(self.val());
			var alpha = self.nextAll('input[data-field=color.a]').val();
			
			if(alpha) color.a = alpha; 
			hydrateConfigs(config, slides, {
				container: self.parents('div.cfg-ctn').attr('data-ctn'),
				value: color,
				type: self.attr('data-field')
			});
			
			$('#color-picker').remove();
		});
		
		$('.cfg-field').live('change', function(){
			var self = $(this);
			var ctrlVal = self.val();
			
			if (self.is(':checkbox'))
				ctrlVal = self.is(':checked');
			
			hydrateConfigs(config, slides, {
				container: self.parents('div.cfg-ctn').attr('data-ctn'),
				value: ctrlVal,
				type: self.attr('data-field')
			});
		});
	};
	
	bindConfig();
	
	initSlider();
}

function hydrateSlide(idx, slides){
	
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
	
	saveSlider(slides);
}

function addField(fieldName, idx, slides){
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

var saveSlider = function(slides) {	
		
	$.ajax({
    url: "slides.json",
    type: "POST",
    dataType: "json",
    data: JSON.stringify({slider: slides}),
    contentType: "application/json",
    cache: false,
    timeout: 5000,
    success: function(data) {
    	
    },
    error: function() {
      alert("Wow ... save didn't work");
    },
  }); 
};

function hydrateConfigs(config, slides, cfgField){
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
			case "alpha":
			case "color":
				var c = "rgba(" + newValue.r + "," + newValue.g + "," + newValue.b + "," + (newValue.a || 1) + ")";
				$(getSelector()).css("background-color", c)
					.css("-moz-box-shadow", "0px 0px 10px " + c)
					.css("-webkit-box-shadow", "0px 0px 10px " + c)
					.css("box-shadow", "0px 0px 10px " + c);
				break;
			case "initIndex":
				Slider.moveTo(newValue);
				break;
			case "title":
				document.title = newValue;
				break;
			case "fontFamily":
				$(getSelector()).css("font-family", newValue);
				break;
			case "high":
				if (newValue) {
					console.log('adentro' + newValue);
					$(getSelector()).css("backgroundImage", "url('images/" + newValue + "')");
				}
				else {
					console.log('afuera' + newValue);
					$(getSelector()).css("backgroundImage", "none");
				}
				break;
			case "seamless":
				if (newValue) {
					$(getSelector())
						.css("background-position", "repeat")
						.css("background-size", "auto");
				}
				else $(getSelector())
					.css("background-size", "100% 100%")
					.css("background-position", "no-repeat")
				break;
		}
	}
	
	updateCSS();
}

var saveConfig = function(cfg) {	
	
	delete cfg.background.ctn;
	delete cfg.slide.all.background.ctn;
	delete cfg.slide.all.background.title;
	delete cfg.slide.title.background.ctn;
	delete cfg.slide.title.background.title;
	
	$.ajax({
    url: "config.json",
    type: "POST",
    dataType: "json",
    data: JSON.stringify({config: cfg}),
    contentType: "application/json",
    cache: false,
    timeout: 5000,
    success: function(data) {
    	location.reload(true);
    },
    error: function() {
      alert("Wow ... save didn't work");
      location.reload(true);
    },
  }); 
  
};

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

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

$(document).ready(function(){
	hljs.tabReplace = '  ';
	
	injectTemplates();
});

