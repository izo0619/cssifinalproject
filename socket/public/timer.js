// Credit: Mateusz Rybczonec

// Timer Work 

const FULL_DASH_ARRAY = 283;
//warning occurs at 10s left
const WARNING_THRESHOLD = 10;

//alert occurs at 5s left
const ALERT_THRESHOLD = 5;


const COLOR_CODES = {
    info: {
        color: "green"
    },
    warning: {
        color: "orange",
        threshold: WARNING_THRESHOLD
    },
    alert: {
        color: "red",
        threshold: ALERT_THRESHOLD
    }
};

let remainingPathColor = COLOR_CODES.info.color;

//Set intial value to 20 seconds
const TIME_LIMIT = 20;

//At first no time has passed, but it will count up and subtract from the TIME_LIMIT
let timePassed = 0;
let timeLeft = TIME_LIMIT;
let timerInterval = null;
let timerEnd = false;

document.getElementById("Timer").innerHTML = `
  <div class="base-timer">
    <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <g class="base-timer__circle">
        <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
        <path
            id="base-timer-path-remaining"
            stroke-dasharray="283"
            class="base-timer__path-remaining ${remainingPathColor}"
            d="
                M 50, 50
                m -45, 0
                a 45,45 0 1,0 90,0
                a 45,45 0 1,0 -90,0
            "
        ></path>
      </g>
    </svg>
    <span id="base-timer-label" class="base-timer__label">
        ${formatTime(timeLeft)}
    </span>
  </div>
  `;

// if(timerStart){
//     startTimer();
// }


socket.on('timeLeft', syncTimer)

function onTimesUp() {
    clearInterval(timerInterval);
    timerEnd = true;
}

function startTimer() {
    clearInterval(timerInterval);
    timerEnd=false;
    timePassed = 0;
    timeLeft = TIME_LIMIT;
    timerInterval = null;
    remainingPathColor = COLOR_CODES.info.color;
    setRemainingPathColor(timeLeft);
    timerInterval = setInterval(() => {
        //amount of time passed increments by one
        timePassed = timePassed += 1;
        timeLeft = TIME_LIMIT - timePassed;
        socket.emit('timeLeft', timeLeft)
        //time left label gets updated
        document.getElementById("base-timer-label").innerHTML = formatTime(timeLeft);
        
        setCircleDasharray();
        setRemainingPathColor(timeLeft);
        if (timeLeft === 0) {
            onTimesUp();
            return timerEnd;
        }
    }, 1000);
}

function formatTime(time) {
    //The largest round integer less than or equal to the result of time being divided by 60. 
    const minutes = Math.floor(time / 60);

    //Seconds are the remainder of the time divided by 60 (modulus operator)
    let seconds = time % 60;

    //If the value of seconds if < 10, then we display seconds with a leading zero
    if (seconds < 10) {
        seconds = `0${seconds}`;
        }

    //The output is in MM:SS format
    return `${minutes}:${seconds}`;
    }

//Divides the time left by the defined time limit
function calculateTimeFraction() {
    const rawTimeFraction = timeLeft / TIME_LIMIT;
    return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
}

//update the dasharray value as time passes, starting with 283
function setCircleDasharray() {
    const circleDasharray = `${(
        calculateTimeFraction() * FULL_DASH_ARRAY
    ).toFixed(0)} 283`;
    document
        .getElementById("base-timer-path-remaining")
        .setAttribute("stroke-dasharray", circleDasharray);
}

function setRemainingPathColor(timeLeft) {
    const { alert, warning, info } = COLOR_CODES;

    //if the remaining time is <= 5, remove warning class and apply alert class
    if (timeLeft <= alert.threshold) {
        document
            .getElementById("base-timer-path-remaining")
            .classList.remove(warning.color);
        document
            .getElementById("base-timer-path-remaining")
            .classList.add(alert.color);

    //if the remaining time is <= 10, remove base color and apply warning class
    } else if (timeLeft <= warning.threshold) {
        document
            .getElementById("base-timer-path-remaining")
            .classList.remove(info.color);
        document
            .getElementById("base-timer-path-remaining")
            .classList.add(warning.color);
    } else if (timeLeft == 20){
        document
            .getElementById("base-timer-path-remaining")
            .classList.remove(warning.color);
        document
            .getElementById("base-timer-path-remaining")
            .classList.remove(alert.color);
        document
            .getElementById("base-timer-path-remaining")
            .classList.add(info.color);
    }
}

function syncTimer(data){
    setRemainingPathColor(data);
    document.getElementById("base-timer-label").innerHTML = formatTime(data);
    setCircleDasharray();
    // setRemainingPathColor(data);
}
//End Timer Work

//end Credit: Mateusz Rybczonec
