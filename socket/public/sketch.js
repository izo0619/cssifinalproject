// let socket;
let brushHue, brushSat, brushBright;
let input, button, question, guesses;
let guessY;
let words;
let drawerBtn, guesserBtn;
let drawer, guesser;
let playerChosen, start;

function setup(){
  var myCanvas = createCanvas(600, 600);
    myCanvas.parent("canvas");
  // drawing
  socket.on('mouse', newDrawing)
  // colors
  colorMode(HSB, 360, 100, 100);
  strokeWeight(6);
  background(90);
  brushHue = 0;
  brushSat = 80;
  brushBright = 80;

  //intiialize some variables
  start = false;

  let parent = createDiv();
  parent.id('guessContainer');
  // input
  input = createInput();
  input.position(0, 550);
  input.parent('guessContainer')

  button = createButton('guess');
  button.position(input.x + input.width, 550);
  button.mousePressed(greet);
  button.parent('guessContainer')

  question = createElement('h3', 'what do you think this is?');
  question.position(0, 500);
  question.parent('guessContainer')

  textAlign(CENTER);
  textSize(32);

  socket.on('guess', newGuess)

  // initialize guess output
  guesses = createElement('h3', 'Guess History');
  guesses.position(0,50)
  guesses.parent('guessContainer')
  guessY = 100

  //initialize words
  words = ['apple', 'banana', 'grapes', 'hat', 'sunset', 'daisy', 'camera', 'pie', 'pencil', 'line', 'sea', 'cupcake', 'plant']
  randomWord = random(words)
  assignWord = createElement('h2', randomWord)
  assignWord.position(0, 570)
  assignWord.parent('guessContainer')
  socket.emit('chosenWord', randomWord)
  socket.on('chosenWord', newWord)

  //player checkboxes
  playerChosen = false;
  drawerBtn = select("#box1").elt;
  guesserBtn = select("#box2").elt;

  drawerBtn.onchange = function() {
    if (drawerBtn.checked && !playerChosen) {
      player1 = new Player("drawer")
      player2 = new Player("guesser")
      socket.emit('playerRole', "drawer")
      guesserBtn.checked = false;
      console.log('drawerBtn')
    } else if (drawerBtn.checked && playerChosen){
      guesserBtn.checked = false;
    }
    playerChosen = true;
    drawerBtn.disabled = true;
    guesserBtn.disabled = true;
  }
  guesserBtn.onchange = function() {
    if (guesserBtn.checked && !playerChosen) {
      player1 = new Player("guesser")
      player2 = new Player("drawer")
      socket.emit('playerRole', "guesser")
      drawerBtn.checked = false;
      console.log('guesserBtn')
    } else if (guesserBtn.checked && playerChosen){
      drawerBtn.checked = false;
    }
    playerChosen = true;
    drawerBtn.disabled = true;
    guesserBtn.disabled = true;
  }
  socket.on('playerRole', setRole)


}

function draw() {
  
}


//Canvas functionality:
function keyPressed() {
  if (keyCode === 32) { //space bar to clear canvas
    clear();
    background(90);
  }
}



//Disable or Enable features when starting
function startGame() {
  if (playerChosen === true) {
    start = true
  } else {
    text("Please select a role: Drawer or Guesser.", width / 2, height / 2);
  }
}
// draw + send drawing data
function mouseDragged(){
  if (start === true) {
    chooseColors();
    line(pmouseX, pmouseY, mouseX, mouseY)

	let data = {
    px: pmouseX,
    py: pmouseY,
		x: mouseX,
		y: mouseY
	}

  socket.emit('mouse', data)
 }
}

// draw from sent data
function newDrawing(data){
  stroke(0, 0, 0);
  fill(0, 0, 0);
 	line(data.px, data.py, data.x, data.y)
 }


 // rainbow brush coloring
function chooseColors() {
  // brushHue = random(360)
  stroke(brushHue, brushSat, brushBright);
  fill(brushHue, brushSat, brushBright);
  brushHue += 3;
  if (brushHue > 359){
    brushHue = 0;
  }
}

// what to do with input
 function greet() {
  const guess = input.value();
  newGuess = createP(guess)
  newGuess.position(0,guessY)
  newGuess.parent('guessContainer')
  guessY += 20
  input.value('');

  if (guess == randomWord && guesserBtn.checked){
    if (player1.role == "guesser"){
      player1.addScore()
    } else if (player2.role == "guesser"){
      player2.addScore()
    }
    console.log(player1, player2)
    // hi eileen plz do something here to display score
    guessIsCorrect = true;
    newGuess.style('color', '#32a852')
  } else {
    fill(0)
    guessIsCorrect = false;
    newGuess.style('color', '#a83232')
  }

  let guessData = {
    guess: guess,
    isCorrect: guessIsCorrect,
  }
  socket.emit('guess', guessData)
}

// passes guessed words
function newGuess(data){
  guess = data.guess;
  newGuess = createP(guess)
  newGuess.position(400,guessY)
  guessY += 20
}

// syncs assigned word with word guesser has to guess
function newWord(word){
  assignWord.html(word)
}

function setRole(role){
  if (role == "drawer"){
    guesserBtn.checked = true;
    drawerBtn.disabled = true;
    guesserBtn.disabled = true;
  } else if (role == "guesser"){
    drawerBtn.checked = true;
    drawerBtn.disabled = true;
    guesserBtn.disabled = true;
  }
}

class Player{
  constructor(role){
    this.role = role;
    this.score = 0;
  }

  addScore(){
    this.score += 1;
    return this.score
  }

  switchRole(){
    if (this.role == "guesser"){
      this.role = "drawer"
    } else{
      this.role = "guesser";
    }
    
  }
}
