var socketIO = require('socket.io'),
	slider = require('../models/slider');

exports.start = function(app){
	var io = socketIO.listen(app),
		rooms = [];
	
	io.sockets.on('connection', function (socket) {
		var roomName = "";
		  
	  socket.on('joinSlider', function (_roomName) {
	  	
	  	var joinSliderRoom = function(){
	  		roomName = _roomName;
	  	
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
	  		slider.getSlider(_roomName, function(sliderJSON){
	  			
	  			rooms[_roomName] = {
						currIndex: sliderJSON.config.initIndex,
						currItemIndex: 0,
						visible: false,
						clients: 0,
						passcode: sliderJSON.config.passcode
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
	  
	  socket.on('toggleSlider', function (data) {
	  	if (data.pass === rooms[roomName].passcode) {	  	
		  	rooms[roomName].visible = data.visible;
		    socket.broadcast.to(roomName).emit('toggleSlider', { visible: data.visible });
		  }
	  });
	  
	  socket.on('moveSlider', function (data) {
	  	if (data.pass === rooms[roomName].passcode) {	 
		  	rooms[roomName].currItemIndex = 0;
		  	rooms[roomName].currIndex = data.index;
		    socket.broadcast.to(roomName).emit('moveSlider', { index: data.index });
		  }
	  });
	  
	  socket.on('updatedItemList', function (data) {
	  	if (data.pass === rooms[roomName].passcode) {	 
		  	rooms[roomName].currItemIndex = data.currIndex;
		    socket.broadcast.to(roomName).emit('updatedItemList', { itemIndex: data.currIndex });
		  }
	  });
	  
		socket.on('disconnect', function() {
			if (rooms[roomName].clients > 0) {
				rooms[roomName].clients--;
				socket.broadcast.to(roomName).emit('clientOffline', { current: rooms[roomName].clients });
				socket.leave(roomName);	
			}
			else {
				delete rooms[roomName];
			}
		});
	  
	});

};