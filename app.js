const dateElement = document.getElementById('date');
const hourElement = document.getElementById('hour');
const minsElement = document.getElementById('mins');
const secsElement = document.getElementById('secs');
const am_pm = document.getElementById('am-pm');

const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const clockContainer = document.getElementById('clock-container');
const timerContainer = document.getElementById('timer-container');
const goToButton = document.getElementById('go-to-button');

const setTimerBtn = document.getElementById('set-timer-btn');
const timerSections = document.querySelectorAll('.timer-section');
const inputedHours = document.getElementById('inputed-hours');
const inputedMins = document.getElementById('inputed-mins');
const inputedSecs = document.getElementById('inputed-secs');
const displayAlert = document.getElementById('alert');
const endTimerBtn = document.getElementById('end-timer-btn');
const progressBar = document.getElementById('progress-bar');


/******************EVENT LISTNERS*******************/
goToButton.addEventListener('click', ()=>{
    timerContainer.classList.toggle('show');
    clockContainer.classList.toggle('show');
    formatButton();
});

setTimerBtn.addEventListener('click', ()=>{
    if(!timerActive && timerValueInputed){
        getTimer();
        setTimer();
    }
    else if(timerActive){
        briefMessage('Timer in Session');
    }
    else{
        briefMessage('Please Input Timer Value');
    }

});

endTimerBtn.addEventListener('click', endTimer);

inputedHours.addEventListener('input', formatTimerInput);
inputedMins.addEventListener('input', formatTimerInput);
inputedSecs.addEventListener('input', formatTimerInput);




/*******************FUNCTIONS**********************/
function formatButton(){
    if(clockContainer.classList.contains('show')){
        goToButton.textContent = 'go to timer';
    }
    else{
        goToButton.textContent = 'go to clock';
    }
}
function calculateTime(){
    const currentDateObject = new Date();
    const currentYear = currentDateObject.getFullYear();
    const currentDate = currentDateObject.getDate();
    const currentMonth =  months[currentDateObject.getMonth()];
    const currentDay = weekDays[currentDateObject.getDay()];


    date.innerHTML =   `${currentDay}, ${currentMonth} ${currentDate}, ${currentYear}`;

    let currentHour = currentDateObject.getHours();
    let currentMins = currentDateObject.getMinutes();
    let currentSecs = currentDateObject.getSeconds();

    if(currentHour > 12){
        currentHour = currentHour - 12;
        am_pm.innerHTML = 'PM';
    }
    else{
        am_pm.innerHTML = 'AM';
    }

    hourElement.innerHTML = formatTime(currentHour);
    minsElement.innerHTML = formatTime(currentMins);
    secsElement.innerHTML = formatTime(currentSecs);
}
let clock = setInterval(calculateTime, 1000);

function formatTime(item){
    if(item < 10){
        return item = '0' + item;
    }
    else{
        return item;
    }
}

let timerDurationInMs = 2000;
let timerActive = false;
let timerValueInputed = false;

// units of time in ms
const oneHour = 60 * 60 * 1000;
const oneMin = 60 * 1000;
const oneSec = 1000;

function getTimer(){
    const currentDateObject = new Date();
    const currentTimeInMs = currentDateObject.getTime();

    const inputedHoursInMs = inputedHours.value * oneHour;
    const inputedMinsInMs = inputedMins.value * oneMin;
    const inputedSecsInMs = inputedSecs.value * oneSec;

    timerDurationInMs += currentTimeInMs + inputedHoursInMs + inputedMinsInMs + inputedSecsInMs;
}
let remainingTime = 0;
let timerfunction;

function setTimer(){
    timerActive = true;
    timerfunction = setInterval(()=>{
    const currentTimeInMs = new Date().getTime();
    remainingTime = timerDurationInMs - currentTimeInMs;

    const remainingTimeInHours = Math.floor(remainingTime/oneHour);
    const remainingTimeInMins = Math.floor((remainingTime % oneHour) / oneMin);
    const remainingTimeInSecs = Math.floor(((remainingTime % oneHour) % oneMin) / oneSec);

    if(!(remainingTimeInHours < 0)){
        timerSections[0].innerHTML = formatTime(remainingTimeInHours);
    }
    if(!(remainingTimeInMins < 0)){
        timerSections[1].innerHTML = formatTime(remainingTimeInMins);
    }
    if(!(remainingTimeInSecs < 0)){
        timerSections[2].innerHTML = formatTime(remainingTimeInSecs);
    }
    if(remainingTime < 0){
        clearInterval(timerfunction);
        toggleAlert(true, 'Time Up');
        timerSections.forEach(timerSection => {
            timerSection.style.color = 'red';
        })
        endTimerBtn.style.animation = 'pulse 2s infinite ease';
    }
    }, 1000)
    animateProgressBar(timerDurationInMs);

}
function endTimer(){
    clearInterval(timerfunction);
    timerActive = false;
    timerValueInputed = false;
    remainingTime = 0;
    timerDurationInMs = 2000;
    endTimerBtn.style.animation = 'none';
    progressBar.style.animation = 'none';
    toggleAlert(false)
    timerSections.forEach(timerSection => {
        timerSection.style.color = 'white';
    });
    inputedHours.value = '';
    inputedMins.value = '';
    inputedSecs.value = '';
    timerSections.forEach(timerSection => {
        timerSection.textContent = '00';
    })

}
function animateProgressBar(timerDurationInMs,){
    const currentTimeInMs = new Date().getTime();
    const animationTime = (timerDurationInMs - currentTimeInMs) / 1000;
    console.log(animationTime);

    progressBar.style.animation =  `progress ${animationTime}s 1 linear`;
}
function formatTimerInput(){
    const regExp = /[^\d]/gi;

    inputedHours.value = inputedHours.value.replace(regExp, '');
    inputedMins.value = inputedMins.value.replace(regExp, '');
    inputedSecs.value = inputedSecs.value.replace(regExp, '');
    
    timerValueInputed = true;
}
function toggleAlert(display, message){
    if(display){
        displayAlert.classList.add('show');
        displayAlert.innerHTML = message;
    }
    else{
        displayAlert.classList.remove('show');
    }
}
function briefMessage(message){
    toggleAlert(true, message);
    setTimeout(() => {
        if(remainingTime < 0){
            toggleAlert(true, 'Time Up!');
        }
        else{
            toggleAlert(false);
        }
    }, 1500);
}