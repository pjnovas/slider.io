
var sliderio = sliderio || {};
sliderio.view = sliderio.view || {};

sliderio.view.resources = (function($){
	var status = 'idle',
		resources = [],
		selected;
	
	var template = function(name){
		return $.trim($('#' + name + '-tmpl').html());
	};
	
	var createModal = function() {
		var resMan = $('<div id="resourceManager"></div>').appendTo('.sliderCtn');
		
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
			modal: true,
			buttons: [{
	        text: "Select",
	        click: function() { 
	  				selected = {};      	
	        }
	    },{
	        text: "Cancel",
	        click: function() { 
	        	$('#resourceManager').dialog('close');
	        }
	    }]
		});
	};
	
	var initFormAjax = function() {
		$('#uploadResourceForm').submit(function() {
		 	status('uploading the file ...');
		
	    $(this).ajaxSubmit({
	    	error: function(xhr) {
					console.dir(xhr);
					status('Error on uploading');
	      },
	      success: function(resource) {
					resources.unshift(resource);
					updateResources();
	      }
			});
		
			return false;
    });
	};
	
	var updateResources = function(){
		var resMan = $('#resourceManager');
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
				done();
			});
			
			sliderio.service.slider.getResources(function(data){
				dResources.resolve(data);
			});
			
			sliderio.view.partials.importResources(function(){
				dPartial.resolve();
			});		
		},
		
		show: function(onSelect, resource){
			$('#resourceManager').dialog('open');
			onSelect(selected);
		},
		
		selected: function(){
			return selected;
		}
	};
	
})(jQuery);
