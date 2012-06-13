
var sliderio = sliderio || {};
sliderio.view = sliderio.view || {};

sliderio.view.resources = (function($){
	var status = 'idle',
		resources = [],
		selected,
		resMan,
		onSelect;
	
	var template = function(name){
		return $.trim($('#' + name + '-tmpl').html());
	};
	
	var createModal = function() {
		resMan = $('<div id="resourceManager"></div>').appendTo('.sliderCtn');
		
		updateResources();
		
		var newRes = $.mustache(template('newResource'), {});
		resMan.append(newRes);
		
		resMan.dialog({
			autoOpen: false,
			title: "Resources",
			width: 650,
			height: 500,
			resizable: false,
			zIndex: 3,
			modal: true
		});
	};
	
	var initFormAjax = function() {
		$('#uploadResourceForm').submit(function() {
		 	//status('uploading the file ...');
		
	    $(this).ajaxSubmit({
	    	error: function(xhr) {
					console.dir(xhr);
					//status('Error on uploading');
	      },
	      success: function(resource) {
					resources.unshift(resource);
					updateResources();
					selected = resource;
					if (onSelect) onSelect(selected);
					//resMan.dialog('close');
	      }
			});
		
			return false;
    });
	};
	
	var attachEvents = function(){
		$('#resources li').live('click', function(){
			var ele = $(this);
			
			selected = {
				file: ele.attr('data-file'),
				url: $('img', ele).attr('src')
			}
			
			$('#resources li.selected', resMan).removeClass('selected');
			ele.addClass('selected');
			
			if (onSelect) onSelect(selected);
			//resMan.dialog('close');
		});
	};
	
	var updateResources = function(){
		$('#resources', resMan).remove();
		var resList = $.mustache(template('resources'), {resources: resources});
		resMan.append(resList);
	};
	
	return {
		build: function(done){
			var dPartial = $.Deferred(),
				dResources = $.Deferred();

			$.when(dResources, dPartial).done(function(data){
				resources = data;
				createModal();
				initFormAjax();
				attachEvents();
				done();
			});
			
			sliderio.service.slider.getResources(function(data){
				dResources.resolve(data);
			});
			
			sliderio.view.partials.importResources(function(){
				dPartial.resolve();
			});		
		},
		
		show: function(_onSelect, resource){
			resMan.dialog('open');
			$('#resources li.selected', resMan).removeClass('selected');
			selected = resource;
			
			if(resource) {
				$('#resources li').each(function(){
					if ($(this).attr('data-file') == selected.file)
						$(this).addClass('selected');
				});
			}
			
			onSelect = _onSelect;
			return this;
		},
		
		selected: function(resource){
			if (resource) {
				selected = resource;
				return this;
			}
			return selected;
		}
	};
	
})(jQuery);
