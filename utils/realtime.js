var socketIO = require('socket.io');

exports.start = function(app, initSlider){
	var io = socketIO.listen(app),
		slider = {
			currIndex: initSlider,
			currItemIndex: 0,
			visible: false
		},
		clients = 0;
	
	io.sockets.on('connection', function (socket) {
	  clients++;
	  socket.broadcast.emit('clientOnline', { current: clients });
	  
	  socket.emit('initSlider', { 
	  		visible: slider.visible, 
	  		index: slider.currIndex, 
	  		itemIndex: slider.currItemIndex, 
	  		current: clients 
	  });
	  
	  socket.on('toggleSlider', function (_visible) {
	  	slider.visible = _visible;
	    socket.broadcast.emit('toggleSlider', { visible: _visible });
	  });
	  
	  socket.on('moveSlider', function (_index) {
	  	slider.currItemIndex = 0;
	  	slider.currIndex = _index;
	    socket.broadcast.emit('moveSlider', { index: _index });
	  });
	  
	  socket.on('updatedItemList', function (_currIndex) {
	  	slider.currItemIndex = _currIndex;
	    socket.broadcast.emit('updatedItemList', { itemIndex: _currIndex });
	  });
	  
		socket.on('disconnect', function() {
			clients--;
			socket.broadcast.emit('clientOffline', { current: clients });
		});
	  
	});

};