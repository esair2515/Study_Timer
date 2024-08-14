// JavaScript Code
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
const summaryElement = document.getElementById('summary-section');
const historyList = document.getElementById('history-list');
const soundSelect = document.getElementById('sound-select');
const themeSelect = document.getElementById('theme-select');
const endSound = new Audio();
const settingsModal = document.getElementById('settings-modal');
const authSection = document.getElementById('auth-section');
const timerSection = document.getElementById('timer-section');
const progressContainer = document.getElementById('progress-container');
const logSection = document.getElementById('log-section');
const summarySection = document.getElementById('summary-section');
const historySection = document.getElementById('history-section');
const authMessage = document.getElementById('auth-message');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const forgotPassword = document.getElementById('forgotPassword');

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    progressBar.value = progressBar.max - timeLeft;
}

function startTimer() {
    if (!isRunning) {
        let studyMinutes = parseInt(studyTimeInput.value);
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
                startBreak();
            }
        }, 1000);
    }
}

function startBreak() {
    let breakMinutes = parseInt(breakTimeInput.value);
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
    updateProgressDisplay();
    updateSummary();
    saveSessionHistory(type, minutes);
}

function displayNotification(message) {
    notificationElement.textContent = message;
    notificationElement.classList.add('show');
    setTimeout(() => {
        notificationElement.classList.remove('show');
    }, 3000);
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

document.getElementById('login-btn').addEventListener('click', () => {
    // Simplified authentication check
    const username = usernameInput.value;
    const password = passwordInput.value;

    if (username === 'admin' && password === 'password') {
        authMessage.textContent = 'Login successful!';
        authMessage.style.color = 'green';
        authSection.classList.add('hidden');
        timerSection.classList.remove('hidden');
        logSection.classList.remove('hidden');
        summarySection.classList.remove('hidden');
        historySection.classList.remove('hidden');
    } else {
        authMessage.textContent = 'Invalid username or password.';
        authMessage.style.color = 'red';
    }
});

document.getElementById('register-btn').addEventListener('click', () => {
    authMessage.textContent = 'Registration is currently disabled.';
    authMessage.style.color = 'orange';
});

forgotPassword.addEventListener('click', function () {
    authMessage.textContent = "Please contact support for password reset.";
    authMessage.style.color = 'blue';
});
