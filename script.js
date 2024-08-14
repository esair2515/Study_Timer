let timer;
let timeLeft;
let isRunning = false;
let totalStudyTime = 0;
let totalBreakTime = 0;

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

const totalStudyTimeElement = document.getElementById('totalStudyTime');
const totalBreakTimeElement = document.getElementById('totalBreakTime');
const progressLog = document.getElementById('progressLog');
const clearLogBtn = document.getElementById('clearLogBtn');

const authSection = document.getElementById('authSection');
const timerSection = document.getElementById('timerSection');
const progressContainer = document.getElementById('progressContainer');
const logSection = document.getElementById('logSection');
const summarySection = document.getElementById('summarySection');
const summaryElement = document.getElementById('summary');
const historySection = document.getElementById('historySection');
const historyList = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const authMessage = document.getElementById('authMessage');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
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
    progressLog.innerHTML += `<li>${type} session of ${minutes} minutes</li>`;
    updateProgressDisplay();
    updateSummary();
    saveSessionHistory(type, minutes);
}

function displayNotification(message) {
    notificationElement.textContent = message;
    setTimeout(() => notificationElement.textContent = '', 3000);
}

function updateProgressDisplay() {
    totalStudyTimeElement.textContent = `Total Study Time: ${totalStudyTime} minutes`;
    totalBreakTimeElement.textContent = `Total Break Time: ${totalBreakTime} minutes`;
}

function updateSummary() {
    summaryElement.innerHTML = `
        <p>Total Study Sessions: ${logList.children.length}</p>
        <p>Total Study Time: ${totalStudyTime} minutes</p>
        <p>Total Break Time: ${totalBreakTime} minutes</p>
    `;
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

function clearLog() {
    logList.innerHTML = '';
    progressLog.innerHTML = '';
    totalStudyTime = 0;
    totalBreakTime = 0;
    updateProgressDisplay();
    updateSummary();
}

function saveSessionHistory(type, minutes) {
    const session = `${type} session of ${minutes} minutes`;
    const history = JSON.parse(localStorage.getItem('sessionHistory')) || [];
    history.push(session);
    localStorage.setItem('sessionHistory', JSON.stringify(history));
    updateSessionHistory();
}

function updateSessionHistory() {
    const history = JSON.parse(localStorage.getItem('sessionHistory')) || [];
    historyList.innerHTML = '';
    history.forEach(session => {
        const listItem = document.createElement('li');
        listItem.textContent = session;
        historyList.appendChild(listItem);
    });
}

function clearSessionHistory() {
    localStorage.removeItem('sessionHistory');
    historyList.innerHTML = '';
}

function authenticateUser(username, password) {
    let users = JSON.parse(localStorage.getItem('users')) || {};
    return users[username] === password;
}

function registerUser(username, password) {
    let users = JSON.parse(localStorage.getItem('users')) || {};
    if (users[username]) {
        return false; // User already exists
    }
    users[username] = password;
    localStorage.setItem('users', JSON.stringify(users));
    return true;
}

function recoverPassword(username) {
    let users = JSON.parse(localStorage.getItem('users')) || {};
    if (users[username]) {
        authMessage.textContent = `Your password is: ${users[username]}`;
    } else {
        authMessage.textContent = 'Username not found.';
    }
}

function handleAuthentication(action) {
    const username = usernameInput.value;
    const password = passwordInput.value;

    if (!username || !password) {
        authMessage.textContent = 'Please enter both username and password.';
        return;
    }

    if (action === 'login') {
        if (authenticateUser(username, password)) {
            authSection.classList.add('hidden');
            timerSection.classList.remove('hidden');
            progressContainer.classList.remove('hidden');
            logSection.classList.remove('hidden');
            summarySection.classList.remove('hidden');
            historySection.classList.remove('hidden');
            authMessage.textContent = 'Login successful!';
            updateSessionHistory();
        } else {
            authMessage.textContent = 'Invalid username or password.';
        }
    } else if (action === 'register') {
        if (registerUser(username, password)) {
            authMessage.textContent = 'Registration successful! You can now log in.';
        } else {
            authMessage.textContent = 'Username already exists.';
        }
    }
}

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);
clearLogBtn.addEventListener('click', clearLog);

settingsBtn.addEventListener('click', () => {
    settingsModal.classList.add('show');
    settingsModal.classList.remove('hide');
});

closeBtn.addEventListener('click', () => {
    settingsModal.classList.add('hide');
    settingsModal.classList.remove('show');
});

saveSettingsBtn.addEventListener('click', () => {
    saveSettings();
    settingsModal.classList.add('hide');
    settingsModal.classList.remove('show');
});

loginBtn.addEventListener('click', () => handleAuthentication('login'));
registerBtn.addEventListener('click', () => handleAuthentication('register'));
forgotPassword.addEventListener('click', () => {
    const username = usernameInput.value;
    if (username) {
        recoverPassword(username);
    } else {
        authMessage.textContent = 'Please enter your username to recover your password.';
    }
});

clearHistoryBtn.addEventListener('click', clearSessionHistory);

window.addEventListener('load', loadSettings);
updateProgressDisplay(); // Initial update
updateSummary(); // Initial summary update
updateSessionHistory(); // Initial history update
