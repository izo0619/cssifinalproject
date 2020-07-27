let input, button, question, guesses;
let guessY;
let words;

function setup(){
  var myCanvas = createCanvas(600, 600);
    myCanvas.parent("canvas");
  // input
  input = createInput();
  // input.position(400, 550);

  button = createButton('guess');
  // button.position(input.x + input.width, 550);
  button.mousePressed(greet);

  question = createElement('h3', 'what do you think this is?');
  // question.position(400, 500);

  textAlign(CENTER);
  textSize(32);

  socket.on('guess', newGuess)

  // initialize guess output
  guesses = createElement('h3', 'Guess History');
  guesses.position(400,50)
  guessY = 100

  //initialize words
  words = ['apple', 'banana', 'grapes', 'hat', 'sunset', 'daisy', 'camera', 'pie', 'pencil', 'line', 'sea', 'cupcake', 'plant']
  randomWord = random(words)
  assignWord = createElement('h2', randomWord)
  // assignWord.position(400, 570)

}

function draw() {

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
