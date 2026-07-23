// ==========================================
// 1. TIMER LOGIC (BULLETPROOF & PERSISTENT)
// ==========================================
const mainDisplay = document.getElementById('time-main');
let startTime = 0;
let elapsedTime = 0;
let timerInterval = null;
let isRunning = false;

function displayTime(ms) {
    if (!mainDisplay) return;
    const totalSeconds = Math.floor(Math.max(0, ms) / 1000);
    const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    mainDisplay.textContent = `${hours}:${minutes}:${seconds}`;
}

function saveTimerState() {
    localStorage.setItem('timer_saved_elapsed', elapsedTime);
    localStorage.setItem('timer_saved_is_running', isRunning ? 'yes' : 'no');
    localStorage.setItem('timer_saved_timestamp', Date.now());
}

function restoreTimerState() {
    const savedElapsed = parseInt(localStorage.getItem('timer_saved_elapsed'), 10) || 0;
    const wasRunning = localStorage.getItem('timer_saved_is_running') === 'yes';
    const lastStamp = parseInt(localStorage.getItem('timer_saved_timestamp'), 10) || Date.now();

    if (wasRunning) {
        const offlineTime = Math.max(0, Date.now() - lastStamp);
        elapsedTime = savedElapsed + offlineTime;
        startTimer(true); // Force it to resume
    } else {
        elapsedTime = savedElapsed;
        displayTime(elapsedTime);
    }
}

function updateTimer() {
    elapsedTime = Date.now() - startTime;
    displayTime(elapsedTime);
    saveTimerState();
}

function startTimer(forceResume = false) {
    if (isRunning && !forceResume) {
        // User clicked pause
        isRunning = false;
        clearInterval(timerInterval);
        saveTimerState();
        return;
    }
    // Start or Resume
    isRunning = true;
    startTime = Date.now() - elapsedTime;
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
    saveTimerState();
}

function resetTimer() {
    isRunning = false;
    clearInterval(timerInterval);
    elapsedTime = 0;
    displayTime(0);
    saveTimerState();
}

function setTimerFromTimeString(timeString) {
    const parts = timeString.split(':').map(p => parseInt(p, 10) || 0);
    let totalMs = 0;
    if (parts.length === 3) totalMs = (parts[0] * 3600 + parts[1] * 60 + parts[2]) * 1000;
    else if (parts.length === 2) totalMs = (parts[0] * 60 + parts[1]) * 1000;
    else if (parts.length === 1) totalMs = parts[0] * 1000;

    elapsedTime = totalMs;
    startTime = Date.now() - elapsedTime;
    displayTime(elapsedTime);
    saveTimerState();
}

// ==========================================
// 2. TWITCH CHAT LOGIC
// ==========================================
const CHAT_HISTORY_LIMIT = 20;
const ALLOWED_EDITORS = ['soreyasu', 'dretda', 'saarion'];
// NEW: Hardcode your ignored bots/users here (must be lowercase)
const IGNORED_USERS = ['nightbot', 'streamelements', 'fossabot', 'moobot','pokemoncommunitygame'];
const TWITCH_SERVER = 'wss://irc-ws.chat.twitch.tv:443';
let twitchSocket = null;

function connectToTwitch() {
    const channel = localStorage.getItem('twitch_channel');
    if (!channel) return;

    if (twitchSocket) {
        twitchSocket.close();
        twitchSocket = null;
    }

    twitchSocket = new WebSocket(TWITCH_SERVER);

    twitchSocket.addEventListener('open', () => {
        twitchSocket.send('PASS SCHMACC');
        twitchSocket.send('NICK justinfan12345');
        twitchSocket.send(`JOIN #${channel}`);
    });

    twitchSocket.addEventListener('message', (event) => {
        event.data.split('\r\n').forEach(handleTwitchMessage);
    });

    twitchSocket.addEventListener('close', () => {
        twitchSocket = null;
    });

    twitchSocket.addEventListener('error', () => {
        twitchSocket?.close();
        twitchSocket = null;
    });
}

function handleTwitchMessage(data) {
    if (!data) return;
    if (data.startsWith('PING')) {
        twitchSocket?.send('PONG :tmi.twitch.tv');
        return;
    }
    if (!data.includes('PRIVMSG')) return;

    const match = data.match(/:([^!]+)![^@]+@[^ ]+ PRIVMSG #[^ ]+ :(.*)/);
    if (!match) return;

    const rawUsername = match[1];
    const username = rawUsername.toLowerCase();
    const rawMessage = match[2].trim();

    // NEW: Stop execution if the chatter is in the ignored list
    if (IGNORED_USERS.includes(username)) {
        return; 
    }

    if (ALLOWED_EDITORS.includes(username) && handleRemoteCommand(rawMessage)) {
        loadLiveLayoutData();
        return;
    }

    appendChatMessage(rawUsername, escapeHtml(rawMessage));
}

function handleRemoteCommand(message) {
    const commandMap = {
        '!setgame ': 'info_game_title',
        '!setcategory ': 'info_category',
        '!setplayer ': 'info_runner',
        '!setcomms ': 'info_commentators',
        '!setest ': 'info_estimate'
    };

    for (const trigger in commandMap) {
        if (message.startsWith(trigger)) {
            localStorage.setItem(commandMap[trigger], message.slice(trigger.length));
            return true;
        }
    }

    if (message === '!timer start' || message === '!timer pause') {
        startTimer();
        return true;
    }

    if (message === '!timer reset') {
        resetTimer();
        return true;
    }

    return false;
}

function escapeHtml(text) {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function appendChatMessage(username, message) {
    if (shouldShowSpeedrunSplits()) return;

    const chatContainer = document.querySelector('.sidebar-chat');
    if (!chatContainer) return;

    let messageBox = chatContainer.querySelector('.chat-messages-holder');
    if (!messageBox) {
        messageBox = document.createElement('div');
        messageBox.className = 'chat-messages-holder';
        messageBox.id = 'chat-messages-holder';
        chatContainer.appendChild(messageBox);
    }

    const messageElement = document.createElement('div');
    messageElement.className = 'chat-msg';
    messageElement.innerHTML = `
        <span class="chat-msg-user">${username}:</span>
        <span class="chat-msg-text">${message}</span>
    `;

    messageBox.appendChild(messageElement);

    while (messageBox.children.length > CHAT_HISTORY_LIMIT) {
        messageBox.removeChild(messageBox.firstChild);
    }

    messageBox.scrollTop = messageBox.scrollHeight;
}

// ==========================================
// 3. DYNAMIC TEXT & LISTENER LOGIC
// ==========================================
const displayGameTitle = document.getElementById('display-game-title');
const displayCategory = document.getElementById('display-category');
const displayRunner = document.getElementById('display-runner');
const displayCommentators = document.getElementById('display-commentators');
const displayEstimate = document.getElementById('display-estimate');
const displayPersonalBest = document.getElementById('display-personal-best');
const personalBestRow = document.getElementById('personal-best-row');
const timerLabel = document.getElementById('timer-label');
const localTimeDisplay = document.getElementById('display-local-time');
const rerunLabel = document.getElementById('rerun-label');
const cameraLabel = document.getElementById('camera-label');
const chatLabel = document.getElementById('chat-label');
const chatMessagesHolder = document.getElementById('chat-messages-holder');
const chatDisabledMessage = document.getElementById('chat-disabled-message');

const TIMER_MODE_KEY = 'timer_mode';
const TIMER_MODE_STREAM = 'stream';
const TIMER_MODE_SPEEDRUN = 'speedrun';
const SWAP_CAMERA_CHAT_KEY = 'swap_camera_chat';
const SHOW_RERUN_LABEL_KEY = 'show_rerun_label';

let lastObservedUpdateToken = null;
let lastObservedBackgroundColor = null;
let lastObservedStartColor = null;
let lastObservedEndColor = null;
let lastObservedGradientFlag = null;
let lastObservedAngle = null;
let lastObservedStartStop = null;
let lastObservedEndStop = null;

function getTimerMode() { return localStorage.getItem(TIMER_MODE_KEY) || TIMER_MODE_STREAM; }
function getSwapCameraChat() { return localStorage.getItem(SWAP_CAMERA_CHAT_KEY) === 'true'; }
function shouldShowPersonalBest() { return localStorage.getItem('show_personal_best') !== 'false'; }
function shouldUseBlackLabelText() { return localStorage.getItem('show_black_label_text') === 'true'; }
function shouldShowCameraLabel() { return localStorage.getItem('show_camera_label') !== 'false'; }
function shouldShowChatLabel() { return localStorage.getItem('show_chat_label') !== 'false'; }
function shouldShowRerunLabel() { return localStorage.getItem(SHOW_RERUN_LABEL_KEY) === 'true'; }
function shouldShowSpeedrunSplits() { return localStorage.getItem('show_speedrun_splits') === 'true'; }

function updateTimerLabel() {
    if (!timerLabel) return;
    timerLabel.textContent = getTimerMode() === TIMER_MODE_SPEEDRUN ? 'Speedrun Timer' : 'Current Game Time';
    if (personalBestRow) {
        personalBestRow.style.display = (getTimerMode() === TIMER_MODE_SPEEDRUN && shouldShowPersonalBest()) ? 'block' : 'none';
    }
}

function getBrightnessFromHex(hex) {
    const cleanHex = hex.trim().replace('#', '');
    const r = parseInt(cleanHex.slice(0, 2), 16);
    const g = parseInt(cleanHex.slice(2, 4), 16);
    const b = parseInt(cleanHex.slice(4, 6), 16);
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

function updateLabelTextColor() {
    let textColor = '#ffffff';
    if (shouldUseBlackLabelText()) {
        const computed = getComputedStyle(document.documentElement);
        const colors = [
            computed.getPropertyValue('--label-color-rerun'),
            computed.getPropertyValue('--label-color-cam'),
            computed.getPropertyValue('--label-color-chat')
        ].map(color => color.trim()).filter(Boolean);

        if (colors.length) {
            const averageBrightness = colors.reduce((sum, color) => sum + getBrightnessFromHex(color), 0) / colors.length;
            textColor = averageBrightness > 0.65 ? '#000000' : '#ffffff';
        }
    }
    document.documentElement.style.setProperty('--label-text-color', textColor);
}

function updateSidebarLabels() {
    if (cameraLabel) cameraLabel.style.display = shouldShowCameraLabel() ? 'inline-block' : 'none';
    if (chatLabel) chatLabel.style.display = shouldShowChatLabel() ? 'inline-block' : 'none';
}

function updateChatLabel() {
    if (!chatLabel) return;
    chatLabel.textContent = shouldShowSpeedrunSplits() ? 'Speedrun Splits' : 'Stream Chat';
    if (chatMessagesHolder) chatMessagesHolder.style.display = shouldShowSpeedrunSplits() ? 'none' : 'block';
    if (chatDisabledMessage) chatDisabledMessage.style.display = shouldShowSpeedrunSplits() ? 'block' : 'none';
}

function updateLocalTime() {
    if (!localTimeDisplay) return;
    const now = new Date();
    localTimeDisplay.textContent = now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' });
}

function startLocalTimeUpdates() {
    updateLocalTime();
    setInterval(updateLocalTime, 1000);
}

function updateSidebarLayout() {
    const container = document.querySelector('.overlay-container');
    if (!container) return;
    container.classList.toggle('swap-camera-chat', getSwapCameraChat());

    const showCameraOnly = localStorage.getItem('layout_camera_only') === 'true';
    const showChatOnly = localStorage.getItem('layout_chat_only') === 'true';

    container.classList.toggle('single-camera', showCameraOnly && !showChatOnly);
    container.classList.toggle('single-chat', showChatOnly && !showCameraOnly);

    const camera = document.getElementById('sidebar-camera');
    const chat = document.getElementById('sidebar-chat');
    if (camera) camera.hidden = showChatOnly;
    if (chat) chat.hidden = showCameraOnly;

    if (showCameraOnly && chatLabel) chatLabel.textContent = 'Stream Chat';
    else if (showChatOnly && cameraLabel) cameraLabel.textContent = 'Live Camera';
}

function updateRerunLabel() {
    if (!rerunLabel) return;
    rerunLabel.style.display = shouldShowRerunLabel() ? 'inline-block' : 'none';
}

function getActiveEstimate() {
    const streamEstimate = localStorage.getItem('info_estimate');
    const speedrunEstimate = localStorage.getItem('info_estimate_speedrun');
    return (getTimerMode() === TIMER_MODE_SPEEDRUN) ? (speedrunEstimate || streamEstimate || '0:00:00') : (streamEstimate || '0:00:00');
}

function applyBackgroundStyle() {
    const selectedColor = localStorage.getItem('overlay_background_color') || '#1e1e24';
    const startColor = localStorage.getItem('overlay_background_start_color') || selectedColor;
    const endColor = localStorage.getItem('overlay_background_end_color') || '#0f0f12';
    const useGradient = localStorage.getItem('overlay_background_gradient') === 'true';
    const angle = localStorage.getItem('overlay_background_angle') || '135';
    const startStop = localStorage.getItem('overlay_background_start_stop') || '0';
    const endStop = localStorage.getItem('overlay_background_end_stop') || '100';
    
    const gradientValue = useGradient 
        ? `linear-gradient(${angle}deg, ${startColor} ${startStop}%, ${endColor} ${endStop}%)` 
        : selectedColor;
        
    document.documentElement.style.setProperty('--overlay-background', gradientValue);
    document.documentElement.style.setProperty('--base-color-gradient', gradientValue);
}

function checkForUpdates() {
    const currentToken = localStorage.getItem('info_update_trigger');
    const currentBackgroundColor = localStorage.getItem('overlay_background_color');
    const currentStartColor = localStorage.getItem('overlay_background_start_color');
    const currentEndColor = localStorage.getItem('overlay_background_end_color');
    const currentGradientFlag = localStorage.getItem('overlay_background_gradient');
    const currentAngle = localStorage.getItem('overlay_background_angle');
    const currentStartStop = localStorage.getItem('overlay_background_start_stop');
    const currentEndStop = localStorage.getItem('overlay_background_end_stop');

    const changed = currentToken !== lastObservedUpdateToken ||
        currentBackgroundColor !== lastObservedBackgroundColor ||
        currentStartColor !== lastObservedStartColor ||
        currentEndColor !== lastObservedEndColor ||
        currentGradientFlag !== lastObservedGradientFlag ||
        currentAngle !== lastObservedAngle ||
        currentStartStop !== lastObservedStartStop ||
        currentEndStop !== lastObservedEndStop;

    if (changed) {
        lastObservedUpdateToken = currentToken;
        lastObservedBackgroundColor = currentBackgroundColor;
        lastObservedStartColor = currentStartColor;
        lastObservedEndColor = currentEndColor;
        lastObservedGradientFlag = currentGradientFlag;
        lastObservedAngle = currentAngle;
        lastObservedStartStop = currentStartStop;
        lastObservedEndStop = currentEndStop;
        loadLiveLayoutData();
    }
}

function loadLiveLayoutData() {
    if (displayGameTitle) displayGameTitle.textContent = localStorage.getItem('info_game_title') || 'No Title Set';
    if (displayCategory) displayCategory.textContent = localStorage.getItem('info_category') || 'Any%';
    if (displayRunner) displayRunner.textContent = localStorage.getItem('info_runner') || 'Unknown';
    if (displayCommentators) displayCommentators.textContent = localStorage.getItem('info_commentators') || 'None';
    if (displayEstimate) displayEstimate.textContent = getActiveEstimate();
    if (displayPersonalBest) displayPersonalBest.textContent = localStorage.getItem('info_personal_best') || '--:--:--';
    
    updateTimerLabel();
    updateSidebarLayout();
    updateRerunLabel();
    updateLocalTime();
    applyBackgroundStyle();

    const borderVariables = [
        '--border-color-game-feed', '--border-color-cam', '--label-color-cam', 
        '--border-color-chat', '--label-color-chat', '--border-color-bottom-info', 
        '--border-color-bottom-timer', '--border-color-bottom-logo'
    ];

    borderVariables.forEach(variableName => {
        const storedColor = localStorage.getItem(`overlay_color_${variableName}`);
        if (storedColor) document.documentElement.style.setProperty(variableName, storedColor);
        else document.documentElement.style.removeProperty(variableName);
    });
    // DYNAMIC INFO BLOCK BACKGROUND IMAGE
    const infoBgUrl = localStorage.getItem('overlay_info_bg_image');
    if (infoBgUrl && infoBgUrl.trim() !== '') {
        document.documentElement.style.setProperty('--info-bg-image', `url('${infoBgUrl}')`);
    } else {
        document.documentElement.style.removeProperty('--info-bg-image');
    }
    // DYNAMIC INFO BLOCK BACKGROUND OPACITY
    const infoBgOpacity = localStorage.getItem('overlay_info_bg_opacity');
    if (infoBgOpacity !== null) {
        document.documentElement.style.setProperty('--info-bg-opacity', infoBgOpacity);
    } else {
        document.documentElement.style.removeProperty('--info-bg-opacity');
    }
    // INFO BLOCK BACKGROUND HIDE TOGGLE
    const infoBlock = document.querySelector('.info-block');
    if (infoBlock) {
        const hideBg = localStorage.getItem('overlay_info_bg_hidden') === 'true';
        infoBlock.classList.toggle('hide-bg', hideBg);
    }
    // DYNAMIC GAME TITLE FONT SIZE
    const titleFontSize = localStorage.getItem('overlay_game_title_font_size');
    if (titleFontSize !== null) {
        document.documentElement.style.setProperty('--game-title-font-size', titleFontSize + 'px');
    } else {
        document.documentElement.style.removeProperty('--game-title-font-size');
    }
    // DYNAMIC GAME TITLE COLOR
    const titleColor = localStorage.getItem('overlay_game_title_color');
    if (titleColor) {
        document.documentElement.style.setProperty('--game-title-color', titleColor);
    } else {
        document.documentElement.style.removeProperty('--game-title-color');
    }
    // DYNAMIC TIMER COLOR
    const timerColor = localStorage.getItem('overlay_color_--timer-color');
    if (timerColor) {
        document.documentElement.style.setProperty('--timer-color', timerColor);
    } else {
        document.documentElement.style.removeProperty('--timer-color');
    }
    // DYNAMIC GLOBAL FONT FAMILY
    const fontFamily = localStorage.getItem('overlay_font_family');
    if (fontFamily) {
        document.documentElement.style.setProperty('--main-font-family', fontFamily);
    } else {
        document.documentElement.style.removeProperty('--main-font-family');
    }
    // DYNAMIC INFO BLOCK GRADIENT
    const infoStart = localStorage.getItem('overlay_info_block_start');
    const infoEnd = localStorage.getItem('overlay_info_block_end');
    const infoAngle = localStorage.getItem('overlay_info_block_angle');

    if (infoStart) {
        document.documentElement.style.setProperty('--info-block-start', infoStart);
    } else {
        document.documentElement.style.removeProperty('--info-block-start');
    }

    if (infoEnd) {
        document.documentElement.style.setProperty('--info-block-end', infoEnd);
    } else {
        document.documentElement.style.removeProperty('--info-block-end');
    }

    if (infoAngle) {
        document.documentElement.style.setProperty('--info-block-angle', infoAngle + 'deg');
    } else {
        document.documentElement.style.removeProperty('--info-block-angle');
    }

    updateLabelTextColor();
    updateSidebarLabels();
    updateChatLabel();
}

// ==========================================
// 4. INITIALIZATION & STORAGE LISTENERS
// ==========================================

loadLiveLayoutData();
restoreTimerState(); // Kickstarts the persistent timer!
startLocalTimeUpdates();
setInterval(checkForUpdates, 250);

if (localStorage.getItem('twitch_channel')) {
    connectToTwitch();
}

// Single, clean listener for remote commands
window.addEventListener('storage', (e) => {
    // NEW: Listen for the hard reset command and reload the OBS browser source
    if (e.key === 'force_hard_reset') {
        window.location.reload();
    }
    else if (e.key === 'timer_command' && e.newValue) {
        if (e.newValue.startsWith('toggle')) {
            startTimer();
        } else if (e.newValue.startsWith('reset')) {
            resetTimer();
        } else if (e.newValue.startsWith('set_')) {
            const parts = e.newValue.split('_');
            if (parts.length >= 2) setTimerFromTimeString(parts[1]);
        }
    } else if (e.key === 'chat_command' && e.newValue?.startsWith('connect')) {
        connectToTwitch();
    } else if (e.key === 'info_update_trigger' || e.key?.startsWith('overlay_color_') || e.key === SWAP_CAMERA_CHAT_KEY || e.key === SHOW_RERUN_LABEL_KEY || e.key === 'show_speedrun_splits' || e.key === 'show_personal_best') {
        loadLiveLayoutData();
    }
});