// let socket;
let brushHue, brushSat, brushBright;
let input, button, question, guesses, guessBox;
let guessY;
let words;
let drawerBtn, guesserBtn;
let drawer, guesser;
let playerChosen, start;
let yourScore, oppScore; 

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
  yourScore = 0;
  oppScore = 0;

  let parent = createDiv();
  parent.id('guessContainer');
  // input
  input = createInput();
  input.position(0, 450);
  input.parent('guessContainer')

  button = createButton('Guess');
  button.position(input.x + input.width, 450);
  button.mousePressed(greet);
  button.parent('guessContainer')

  question = createElement('h3', 'What is this?');
  question.position(0, 400);
  question.parent('guessContainer')

  textAlign(CENTER);
  textSize(32);

  socket.on('guess', newGuess)
  
  // div to hold guesses
  guessBox = createDiv()
  guessBox.parent('guessContainer')
  guessBox.id('guessBox')

  // initialize guess output
  guesses = createElement('h3', 'Guess History');
  guesses.position(0,30)
  guesses.parent('guessContainer')
  guessY = 60

  //initialize words
  words = ['apple', 'banana', 'grapes', 'hat', 'sunset', 'daisy', 'camera', 'pie', 'pencil', 'line', 'sea', 'cupcake', 'plant']
  randomWord = random(words)
  assignWord = createElement('h2', randomWord)
  assignWord.position(0, 500)
  assignWord.parent('guessContainer')
  assignWord.hide()
  socket.emit('chosenWord', randomWord)
  socket.on('chosenWord', newWord)


  //player checkboxes
  playerChosen = false;
  drawerBtn = select("#box1").elt;
  guesserBtn = select("#box2").elt;

  drawerBtn.onchange = function() {
    if (drawerBtn.checked && !playerChosen) {
      player = new Player("drawer", false)
      socket.emit('player1', "drawer")
      socket.emit('playerRole', "guesser")
      guesserBtn.checked = false;
    } else if (drawerBtn.checked && playerChosen){
      guesserBtn.checked = false;
    }
    playerChosen = true;
    drawerBtn.disabled = true;
    guesserBtn.disabled = true;
  }
  guesserBtn.onchange = function() {
    if (guesserBtn.checked && !playerChosen) {
      player = new Player("guesser", false)
      socket.emit('player1', "guesser")
      socket.emit('playerRole', "drawer")
      drawerBtn.checked = false;
    } else if (guesserBtn.checked && playerChosen){
      drawerBtn.checked = false;
    }
    playerChosen = true;
    drawerBtn.disabled = true;
    guesserBtn.disabled = true;
  }
  socket.on('playerRole', setRole)
  socket.on('player1', syncPlayers)
  socket.on('playerScore', updateOppScore)
  socket.on('showWord', showWord)
  socket.on('restartTimer', restartTimer)
  socket.on("eraseScreen", eraseScreen)
  socket.on('words', syncWords)

}

function draw() {
  if(timerEnd){
    newRound();
  }
  if (words.length == 0){
    onTimesUp()
    assignWord.hide()
    if (yourScore == oppScore){
      text("Tie!", width / 2, height / 2);
    } else if (yourScore > oppScore){
      text("You Win!", width / 2, height / 2);
    } else {
       text("You Lose!", width / 2, height / 2);
    }
    noLoop()
  }
}



function restartTimer(data){
  if (data){
    if (player.timeKeeper == true){
        onTimesUp()
       startTimer()
    } else {
      socket.emit("restartTimer", true)
    }
  }   
}

//Canvas functionality:
function keyPressed() {
  if (keyCode === 32) { //space bar to clear canvas 
    clear();
    background(90);
    socket.emit("eraseScreen", true)  
  } else if (keyCode === 13){
    greet()
  }
}


function eraseScreen(){ 
  clear();  
  background(90); 
}

function showWord(data){
  start = true;
  if (data){
    assignWord.show()
  } else {
    assignWord.hide()
  }
}

function syncWords(data){
  words = data
}

//Disable or Enable features when starting
function startGame() {
  if (playerChosen === true) {
    start = true
    player.timeKeeper = true;
    if (player.role == "guesser"){
      assignWord.hide()
      socket.emit("showWord", true)
    } else {
      assignWord.show()
      socket.emit("showWord", false)
    }
    startTimer();
  } else {
    alert("Please select a role: Drawer or Guesser.", width / 2, height / 2);
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

  if (guess == randomWord){
    if (player.role == "guesser"){
      player.addScore()
      socket.emit('playerScore', player.score)
      updateScore(player.score)
      newRound()
    }     
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
  newGuess.position(0,guessY)
  newGuess.parent('guessContainer')
  guessY += 20
}

// syncs assigned word with word guesser has to guess
function newWord(word){
  randomWord = word
  assignWord.html(word)
}

function setRole(role){
  player.role = role
  if (role == "guesser"){
    assignWord.hide()
    guesserBtn.checked = true;
    drawerBtn.checked = false;
    drawerBtn.disabled = true;
    guesserBtn.disabled = true;
  } else if (role == "drawer"){
    assignWord.show()
    drawerBtn.checked = true;
    guesserBtn.checked = false;
    drawerBtn.disabled = true;
    guesserBtn.disabled = true;
  }
}


function updateScore(score){
  yourScore = score
  let player1score = select("#player1").elt;
  player1score.innerHTML = "Your Score: " + score
}

function updateOppScore(score){
  oppScore = score
  player2score = select("#player2").elt
  player2score.innerHTML = "Opponent's Score: " + score
}

function newRound(){
  socket.emit('playerRole', player.role)
  player.switchRole()
  setRole(player.role)
  let index = words.indexOf(randomWord);
  words.splice(index, 1);
  randomWord = random(words)
  assignWord.html(randomWord);
  socket.emit('chosenWord', randomWord)
  socket.on('chosenWord', newWord)
  restartTimer(true)
  socket.emit('words', words)
  clear();  
  background(90); 
  socket.emit("eraseScreen", true)  
}

function syncPlayers(role){
  playerChosen = true;
  if (role == "guesser"){
    player = new Player("drawer", false)
    guesserBtn.disabled = true;    
  } else if (role == "drawer"){
    player = new Player("guesser", false)
  }
}

class Player{
  constructor(role, timeKeeper){
    this.role = role;
    this.score = 0;
    this.timeKeeper = timeKeeper;
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
