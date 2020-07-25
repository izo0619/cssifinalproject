// let socket;

function setup(){
  createCanvas(600,400);
  background(51);
  socket.on('mouse', newDrawing)
}

function draw(){
  
}

function mouseDragged(){
	// console.log(mouseX + ',' + mouseY);
	noStroke();
  fill(255);
  ellipse(mouseX, mouseY, 10, 10)

  	var data = {
  		x: mouseX,
  		y: mouseY
  	}

  	socket.emit('mouse', data)
 }

 function newDrawing(data){
 	noStroke();
 	fill(250,0,100);
 	ellipse(data.x, data.y, 10.10)
 }