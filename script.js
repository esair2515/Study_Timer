let timeLeft = 0;
let timer;
let isRunning = false;
let totalStudyTime = 0;
let totalBreakTime = 0;

const timerElement = document.getElementById('timer');
const progressBar = document.getElementById('progress-bar');
const logList = document.getElementById('log-list');
const totalStudyTimeElement = document.getElementById('total-study-time');
const totalBreakTimeElement = document.getElementById('total-break-time');
const historyList = document.getElementById('history-list');
const soundSelect = document.getElementById('sound-select');
const themeSelect = document.getElementById('theme-select');
const endSound = new Audio();
const settingsModal = document.getElementById('settings-modal');
const studyTimeInput = document.getElementById('study-time');
const breakTimeInput = document.getElementById('break-time');

// Update timer display
function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    progressBar.value = progressBar.max - timeLeft;
}

// Start timer for study or break
function startTimer() {
    if (isRunning) return; // Prevent starting a new timer if one is already running

    let studyMinutes = parseInt(studyTimeInput.value);
    let breakMinutes = parseInt(breakTimeInput.value);

    if (isNaN(studyMinutes) || studyMinutes <= 0 || isNaN(breakMinutes) || breakMinutes <= 0) {
        alert("Please enter valid study and break times.");
        return;
    }

    timeLeft = studyMinutes * 60;
    progressBar.max = timeLeft;
    isRunning = true;

    timer = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateTimerDisplay();
        } else {
            clearInterval(timer);
            endSound.play();
            logSession('Study', studyMinutes);
            totalStudyTime += studyMinutes;
            displayNotification('Study session complete! Time for a break.');

            // Start break timer
            timeLeft = breakMinutes * 60;
            progressBar.max = timeLeft;
            timer = setInterval(() => {
                if (timeLeft > 0) {
                    timeLeft--;
                    updateTimerDisplay();
                } else {
                    clearInterval(timer);
                    endSound.play();
                    logSession('Break', breakMinutes);
                    totalBreakTime += breakMinutes;
                    displayNotification('Break time over! Back to study.');
                    isRunning = false;
                }
            }, 1000);
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timer);
    isRunning = false;
}

function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    timeLeft = 0;
    updateTimerDisplay();
    progressBar.value = 0;
}

function logSession(type, minutes) {
    const listItem = document.createElement('li');
    listItem.textContent = `${type} session of ${minutes} minutes`;
    logList.appendChild(listItem);
    updateSummary();
    saveSessionHistory(type, minutes);
}

function displayNotification(message) {
    alert(message);
}

function saveSessionHistory(type, minutes) {
    const historyItem = document.createElement('li');
    historyItem.textContent = `${type} session: ${minutes} minutes`;
    historyList.appendChild(historyItem);
}

function updateSummary() {
    totalStudyTimeElement.textContent = `Total Study Time: ${totalStudyTime} minutes`;
    totalBreakTimeElement.textContent = `Total Break Time: ${totalBreakTime} minutes`;
}

function applyTheme(theme) {
    document.body.className = '';
    document.body.classList.add(theme);
}

function openSettings() {
    settingsModal.classList.add('show');
}

function closeSettings() {
    settingsModal.classList.remove('show');
}

document.getElementById('start-btn').addEventListener('click', startTimer);
document.getElementById('pause-btn').addEventListener('click', pauseTimer);
document.getElementById('reset-btn').addEventListener('click', resetTimer);
document.getElementById('save-settings-btn').addEventListener('click', () => {
    endSound.src = soundSelect.value;
    applyTheme(themeSelect.value);
    closeSettings();
});
document.getElementById('settings-btn').addEventListener('click', openSettings);
document.getElementById('close-settings-btn').addEventListener('click', closeSettings);
document.getElementById('clear-log-btn').addEventListener('click', () => {
    logList.innerHTML = '';
});

document.getElementById('clear-history-btn').addEventListener('click', () => {
    historyList.innerHTML = '';
});
