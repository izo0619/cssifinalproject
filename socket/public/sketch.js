// let socket;
let brushHue, brushSat, brushBright;
let input, button, question, guesses;
let guessY;
let words;

function setup(){
  createCanvas(600,600);
  // drawing
  socket.on('mouse', newDrawing)
  // colors
  colorMode(HSB, 360, 100, 100);
  strokeWeight(6);
  background(90);
  brushHue = 0;
  brushSat = 80;
  brushBright = 80;

  // input
  input = createInput();
  input.position(400, 550);

  button = createButton('guess');
  button.position(input.x + input.width, 550);
  button.mousePressed(greet);

  question = createElement('h3', 'what do you think this is?');
  question.position(400, 500);

  textAlign(CENTER);
  textSize(32);

  socket.on('guess', newGuess)

  // guess output
  guesses = createElement('h3', 'Guess History');
  guesses.position(400,50)
  guessY = 100

  //words
  words = ['apple', 'banana', 'grapes', 'hat', 'sunset', 'daisy', 'camera', 'pie', 'pencil', 'line', 'sea', 'cupcake', 'plant']
  randomWord = random(words)
  assignWord = createElement('h2', randomWord)
  assignWord.position(400, 570)

}

function draw(){
  
}

// draw + send drawing data
function mouseDragged(){
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
  newGuess.position(400,guessY)
  guessY += 20
  input.value('');

  if (guess == randomWord){
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
 
function newGuess(data){
  guess = data.guess;
  newGuess = createP(guess)
  newGuess.position(400,guessY)
  guessY += 20
}