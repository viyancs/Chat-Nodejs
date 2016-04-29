module.exports = function(io){
	// usernames which are currently connected to the chat
	var usernames = {};

	// rooms which are currently available in chat
	var rooms = ['room1','room2','room3'];
	io.on('connection', function(socket){
		console.log('client connected..');
		// when the client emits 'adduser', this listens and executes
		socket.on('adduser', function(username,colorProfile){
			// store the username in the socket session for this client
			socket.username = username;
			socket.colorProfile = colorProfile;
			// store the room name in the socket session for this client
			socket.room = 'room1';
			// add the client's username to the global list
			usernames[username] = username;
			// send client to room 1
			socket.join('room1');
			// echo to client they've connected
			socket.emit('updatechat', 'SERVER', 'you have connected to room1');
			// echo to room 1 that a person has connected to their room
			socket.broadcast.to('room1').emit('updatechat', 'SERVER', username + ' has connected to this room');
			//socket.emit('updaterooms', rooms, 'room1');
		});

		// when the client emits 'sendchat', this listens and executes
		socket.on('sendchat', function (data) {
			// we tell the client to execute 'updatechat' with 2 parameters
			io.sockets.in(socket.room).emit('updatechat', socket.username,data,socket.colorProfile);
		});

		socket.on('disconnect', function () {
			console.log('Got disconnect!');
			socket.broadcast.to('room1').emit('updatechat', 'SERVER', socket.username + ' has disconnected from this room');
			// leave client from room 1
			socket.leave('room1');
		});
	});


}