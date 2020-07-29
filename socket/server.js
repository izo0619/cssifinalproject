
var express = require('express');

var app = express();
var server = app.listen(3000)

app.use(express.static('public'))

console.log('my socket server is running')

var socket = require('socket.io');

var io = socket(server)

io.sockets.on('connection', newConnection)

function newConnection(socket){
	console.log('newConnection: ' + socket.id) //sorry I need to keep this in here for the time being so I know it's working LOL

	socket.on('mouse', mouseMsg);
	function mouseMsg(data){
		socket.broadcast.emit('mouse', data)
	}

	socket.on('guess', guessMsg);
	function guessMsg(data){
		socket.broadcast.emit('guess', data)
	}

	socket.on('chosenWord', wordMsg);
	function wordMsg(data){
		socket.broadcast.emit('chosenWord', data)
	}

	socket.on('playerRole', role);
	function role(data){
		console.log(data)
		socket.broadcast.emit('playerRole', data)
	}
}