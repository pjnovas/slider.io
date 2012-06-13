var socketIO = require('socket.io'),
	config = require('../models/config');

exports.start = function(app){
	var io = socketIO.listen(app),
		rooms = [];
	
	io.sockets.on('connection', function (socket) {
		var roomName = "";
		  
	  socket.on('joinSlider', function (_roomName) {
	  	
	  	var joinSliderRoom = function(){
	  		roomName = _roomName;
		  	
		  	console.log(roomName);
		  	console.dir(rooms[roomName]);
		  	
		  	socket.join(roomName);
		  	rooms[roomName].clients++;
		  	socket.broadcast.to(roomName).emit('clientOnline', { current: rooms[roomName].clients });
		  	
			  socket.emit('initSlider', { 
			  		visible: rooms[roomName].visible, 
			  		index: rooms[roomName].currIndex, 
			  		itemIndex: rooms[roomName].currItemIndex, 
			  		current: rooms[roomName].clients 
			  });	
	  	}
	  	
	  	if (!rooms[_roomName]) {
	  		console.log('room not found!');
	  		config.getConfig(_roomName, function(sliderCfg){
	  			
	  			rooms[_roomName] = {
						currIndex: sliderCfg.initIndex,
						currItemIndex: 0,
						visible: false,
						clients: 0
					};
					
					joinSliderRoom();
					
	  		}, function(err){
	  			console.log('error');
	  			socket.disconnect();
	  			return;
	  		});
	  	}
	  	else joinSliderRoom();
	  });
	  
	  socket.on('toggleSlider', function (_visible) {
	  	rooms[roomName].visible = _visible;
	    socket.broadcast.to(roomName).emit('toggleSlider', { visible: _visible });
	  });
	  
	  socket.on('moveSlider', function (_index) {
	  	rooms[roomName].currItemIndex = 0;
	  	rooms[roomName].currIndex = _index;
	    socket.broadcast.to(roomName).emit('moveSlider', { index: _index });
	  });
	  
	  socket.on('updatedItemList', function (_currIndex) {
	  	rooms[roomName].currItemIndex = _currIndex;
	    socket.broadcast.to(roomName).emit('updatedItemList', { itemIndex: _currIndex });
	  });
	  
		socket.on('disconnect', function() {
			rooms[roomName].clients--;
			socket.broadcast.to(roomName).emit('clientOffline', { current: rooms[roomName].clients });
			socket.leave(roomName);
		});
	  
	});

};