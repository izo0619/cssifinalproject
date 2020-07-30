
var express = require('express');

var app = express();
const server = app.listen(process.env.PORT || 3000);

app.use(express.static('public'))

console.log('my socket server is running')

var socket = require('socket.io');

var io = socket(server)
// Make sure our scripts and styles can be seen.
app.use(express.static("public"));

// The "webapp" portion just delivers the main page.
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

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
		socket.broadcast.emit('playerRole', data)
	}
	socket.on('timeLeft', syncTimer);
	function syncTimer(timeLeft){
		socket.broadcast.emit('timeLeft', timeLeft)
	}
	socket.on('player1', initPlayers);
	function initPlayers(data){
		socket.broadcast.emit('player1', data)
	}
	socket.on('playerScore', playerScore);
	function playerScore(data){
		socket.broadcast.emit('playerScore', data)
	}
	socket.on('showWord', showWord);
	function showWord(data){
		socket.broadcast.emit('showWord', data)
	}
	socket.on("restartTimer", restartTimer);
	function restartTimer(data){
		socket.broadcast.emit('restartTimer', data)
	}
	
	socket.on("eraseScreen", eraseScreen);
	function eraseScreen(data){
		console.log(data)
		socket.broadcast.emit('eraseScreen', data)
	}
}