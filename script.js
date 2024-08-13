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

const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = document.getElementById('settingsModal');
const closeBtn = document.querySelector('.closeBtn');
const soundSelect = document.getElementById('soundSelect');
const themeSelect = document.getElementById('themeSelect');
const saveSettingsBtn = document.getElementById('saveSettingsBtn');

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
    isRunning = true;

    timer = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateTimerDisplay();
        } else {
            clearInterval(timer);
            endSound.play();
            logSession('Break', breakMinutes);
            displayNotification('Break time is over! Time to get back to studying.');
            isRunning = false;
        }
    }, 1000);
}

function pauseTimer() {
    if (isRunning) {
        clearInterval(timer);
        isRunning = false;
    }
}

function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    let studyMinutes = parseInt(studyTimeInput.value);
    timeLeft = studyMinutes * 60;
    updateTimerDisplay();
    progressBar.value = 0;
}

function logSession(type, minutes) {
    let logEntry = document.createElement('li');
    logEntry.textContent = `${type} session of ${minutes} minutes completed at ${new Date().toLocaleTimeString()}`;
    logList.appendChild(logEntry);
}

function displayNotification(message) {
    notificationElement.textContent = message;
    notificationElement.style.display = 'block';
    setTimeout(() => {
        notificationElement.style.display = 'none';
    }, 3000);
}

function loadSettings() {
    const sound = localStorage.getItem('notificationSound') || 'bell.mp3';
    const theme = localStorage.getItem('theme') || 'light';
    
    soundSelect.value = sound;
    themeSelect.value = theme;
    
    document.body.className = theme === 'dark' ? 'dark-mode' : '';
    endSound.src = sound;
}

function saveSettings() {
    const sound = soundSelect.value;
    const theme = themeSelect.value;
    
    localStorage.setItem('notificationSound', sound);
    localStorage.setItem('theme', theme);
    
    endSound.src = sound;
    document.body.className = theme === 'dark' ? 'dark-mode' : '';
}

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

settingsBtn.addEventListener('click', () => {
    settingsModal.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
    settingsModal.style.display = 'none';
});

saveSettingsBtn.addEventListener('click', () => {
    saveSettings();
    settingsModal.style.display = 'none';
});

window.addEventListener('load', loadSettings);
