let timer;
let timeLeft;
let isRunning = false;

const timerElement = document.getElementById('timer');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const studyTimeInput = document.getElementById('studyTime');
const breakTimeInput = document.getElementById('breakTime');
const endSound = document.getElementById('endSound');
const progressBar = document.getElementById('progressBar');
const logList = document.getElementById('logList');
const notificationElement = document.getElementById('notification');

function updateTimerDisplay() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    let totalSeconds = parseInt(studyTimeInput.value) * 60;
    let progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;
    progressBar.value = progress;
}

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        let studyMinutes = parseInt(studyTimeInput.value);
        timeLeft = studyMinutes * 60;
        progressBar.max = timeLeft;
        timer = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateTimerDisplay();
            } else {
                clearInterval(timer);
                endSound.play();
                logSession('Study', studyMinutes);
                displayNotification('Study session over! Time for a break.');
                startBreakTimer();
            }
        }, 1000);
    }
}

function startBreakTimer() {
    let breakMinutes = parseInt(breakTimeInput.value);
    timeLeft = breakMinutes * 60;
    progressBar.max = timeLeft;
    timer = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateTimerDisplay();
            progressBar.value = (breakMinutes * 60 - timeLeft) / (breakMinutes * 60) * 100;
        } else {
            clearInterval(timer);
            endSound.play();
            logSession('Break', breakMinutes);
            displayNotification('Break over! Back to studying.');
            resetTimer();
        }
    }, 1000);
}

function pauseTimer() {
    isRunning = false;
    clearInterval(timer);
}

function resetTimer() {
    isRunning = false;
    clearInterval(timer);
    timeLeft = parseInt(studyTimeInput.value) * 60; // Reset to the current study time
    updateTimerDisplay();
    progressBar.value = 0;
}

function logSession(type, duration) {
    let listItem = document.createElement('li');
    let now = new Date();
    listItem.textContent = `${type} - ${duration} minutes (${now.toLocaleTimeString()})`;
    logList.appendChild(listItem);
}

function displayNotification(message) {
    notificationElement.textContent = message;
    notificationElement.style.display = 'block';
    setTimeout(() => {
        notificationElement.style.display = 'none';
    }, 3000);
}

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

updateTimerDisplay();
