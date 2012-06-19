var go = {};
go.left = function(){
	Slider.moveLeft();
};
go.right = function(){
	Slider.moveRight();
};
go.toggle = function(){
	Slider.toggle();
};
go.toggleDetails = function(visible){
	Slider.toggleComments(visible);
};

function initSlider(){
	Slider.init(jsonData, 0);
	Slider.toggle(true);
	Slider.updateList(10);
	
	$("body").bind('keyup', function(e) {
		
		switch(e.keyCode || e.wich){
			case 83: //s
				go.toggle();
			break;
			case 37: //left
				go.left();
			break;
			case 39: //right
				go.right();
			break;
			case 38: //up
				go.toggleDetails(true);
			break;
			case 40: //down
				go.toggleDetails(false);
			break;
		}
		
	});
}

$(document).ready(function(){
	hljs.tabReplace = '  ';
	initSlider();
});

