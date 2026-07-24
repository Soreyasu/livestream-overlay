 const gameTitleInput = document.getElementById('game-title-input');
        const categoryInput = document.getElementById('category-input');
        const estimateInput = document.getElementById('estimate-input');
        const estimateSpeedrunInput = document.getElementById('estimate-speedrun-input');
        const runnerInput = document.getElementById('runner-input');
        const commentatorInput = document.getElementById('commentator-input');
        const personalBestInput = document.getElementById('personal-best-input');
        const updateBtn = document.getElementById('btn-update');

        const startBtn = document.getElementById('btn-start');
        const resetBtn = document.getElementById('btn-reset');
        const timerModeToggle = document.getElementById('timer-mode-toggle');
        const swapCameraChatToggle = document.getElementById('swap-camera-chat-toggle');
        const rerunLabelToggle = document.getElementById('rerun-label-toggle');
        const personalBestToggle = document.getElementById('personal-best-toggle');
        const blackLabelTextToggle = document.getElementById('black-label-text-toggle');
        const speedrunSplitsToggle = document.getElementById('speedrun-splits-toggle');
        const cameraLabelToggle = document.getElementById('camera-label-toggle');
        const chatLabelToggle = document.getElementById('chat-label-toggle');
        const cameraOnlyToggle = document.getElementById('camera-only-toggle');
        const chatOnlyToggle = document.getElementById('chat-only-toggle');
        const connectBtn = document.getElementById('btn-connect');
        const channelInput = document.getElementById('channel-input');
        const backgroundColorInput = document.getElementById('ctrl-background-color');
        const backgroundStartColorInput = document.getElementById('ctrl-background-start-color');
        const backgroundEndColorInput = document.getElementById('ctrl-background-end-color');
        const backgroundGradientToggle = document.getElementById('ctrl-background-gradient');
        const backgroundAngleInput = document.getElementById('ctrl-background-angle');
        const backgroundStartStopInput = document.getElementById('ctrl-background-start-stop');
        const backgroundEndStopInput = document.getElementById('ctrl-background-end-stop');
        const backgroundAngleValue = document.getElementById('background-angle-value');
        const backgroundStartStopValue = document.getElementById('background-start-stop-value');
        const backgroundEndStopValue = document.getElementById('background-end-stop-value');
        const infoBgInput = document.getElementById('info-bg-input');
        const infoBgPreview = document.getElementById('info-bg-preview');
        const setInfoBgBtn = document.getElementById('btn-set-info-bg');
        const infoBgOpacityInput = document.getElementById('info-bg-opacity-input');
        const infoBgOpacityValue = document.getElementById('info-bg-opacity-value');
        const infoBgHideToggle = document.getElementById('info-bg-hide-toggle');
        const titleFontSizeInput = document.getElementById('ctrl-title-font-size');
        const titleFontSizeValue = document.getElementById('title-font-size-value');
        const titleColorInput = document.getElementById('ctrl-title-color');
        const infoStartInput = document.getElementById('ctrl-info-gradient-start');
        const infoEndInput = document.getElementById('ctrl-info-gradient-end');
        const infoAngleInput = document.getElementById('ctrl-info-gradient-angle');
        const infoAngleValue = document.getElementById('info-gradient-angle-value');
        const timerColorInput = document.getElementById('ctrl-timer-color');
        const fontFamilySelect = document.getElementById('ctrl-font-family');

        const colorMap = {
            'ctrl-border-game-feed': ['--border-color-game-feed'],
            'ctrl-border-cam': ['--border-color-cam', '--label-color-cam'],
            'ctrl-border-chat': ['--border-color-chat', '--label-color-chat'],
            'ctrl-border-bottom-info': ['--border-color-bottom-info'],
            'ctrl-border-bottom-timer': ['--border-color-bottom-timer'],
            'ctrl-border-bottom-logo': ['--border-color-bottom-logo']
        };
        const manualTimerInput = document.getElementById('timer-manual-input');
        const setTimerBtn = document.getElementById('btn-set-timer');

        let pendingBackgroundStyle = {
            color: localStorage.getItem('overlay_background_color') || '#1e1e24',
            startColor: localStorage.getItem('overlay_background_start_color') || '#1e1e24',
            endColor: localStorage.getItem('overlay_background_end_color') || '#0f0f12',
            gradient: localStorage.getItem('overlay_background_gradient') === 'true',
            angle: parseInt(localStorage.getItem('overlay_background_angle') || '135', 10),
            startStop: parseInt(localStorage.getItem('overlay_background_start_stop') || '0', 10),
            endStop: parseInt(localStorage.getItem('overlay_background_end_stop') || '100', 10)
        };
        let pendingBorderColors = {};
        const defaultBorderColors = {
            'ctrl-border-game-feed': '#ffbb00',
            'ctrl-border-cam': '#0ebe3a',
            'ctrl-border-chat': '#0ebe3a',
            'ctrl-border-bottom-info': '#3a3a4b',
            'ctrl-border-bottom-timer': '#ffbb00',
            'ctrl-border-bottom-logo': '#3a3a4b'
        };

        function loadSavedData() {
            gameTitleInput.value = localStorage.getItem('info_game_title') || '';
            categoryInput.value = localStorage.getItem('info_category') || '';
            estimateInput.value = localStorage.getItem('info_estimate') || '';
            estimateSpeedrunInput.value = localStorage.getItem('info_estimate_speedrun') || '';
            runnerInput.value = localStorage.getItem('info_runner') || '';
            commentatorInput.value = localStorage.getItem('info_commentators') || '';
            personalBestInput.value = localStorage.getItem('info_personal_best') || '';
            channelInput.value = localStorage.getItem('twitch_channel') || '';
            swapCameraChatToggle.checked = localStorage.getItem('swap_camera_chat') === 'true';
            rerunLabelToggle.checked = localStorage.getItem('show_rerun_label') === 'true';
            document.getElementById('personal-best-toggle').checked = localStorage.getItem('show_personal_best') !== 'false';
            blackLabelTextToggle.checked = localStorage.getItem('show_black_label_text') === 'true';
            speedrunSplitsToggle.checked = localStorage.getItem('show_speedrun_splits') === 'true';
            cameraLabelToggle.checked = localStorage.getItem('show_camera_label') !== 'false';
            chatLabelToggle.checked = localStorage.getItem('show_chat_label') !== 'false';
            cameraOnlyToggle.checked = localStorage.getItem('layout_camera_only') === 'true';
            chatOnlyToggle.checked = localStorage.getItem('layout_chat_only') === 'true';
            backgroundColorInput.value = pendingBackgroundStyle.color;
            backgroundStartColorInput.value = pendingBackgroundStyle.startColor;
            backgroundEndColorInput.value = pendingBackgroundStyle.endColor;
            backgroundGradientToggle.checked = pendingBackgroundStyle.gradient;
            backgroundAngleInput.value = pendingBackgroundStyle.angle;
            backgroundStartStopInput.value = pendingBackgroundStyle.startStop;
            backgroundEndStopInput.value = pendingBackgroundStyle.endStop;
            manualTimerInput.value = localStorage.getItem('info_manual_timer') || '';
            updateBackgroundValueLabels();
            const savedFont = localStorage.getItem('overlay_font_family');
            if (savedFont) {
                fontFamilySelect.value = savedFont;
            }


            Object.keys(colorMap).forEach(id => {
                const input = document.getElementById(id);
                const savedColor = localStorage.getItem(`overlay_color_${colorMap[id][0]}`);
                if (savedColor) {
                    input.value = savedColor;
                    pendingBorderColors[id] = savedColor;
                }
            });

            updateColorLabel('label-cam-color', document.getElementById('ctrl-border-cam').value);
            updateColorLabel('label-chat-color', document.getElementById('ctrl-border-chat').value);

            timerModeToggle.checked = localStorage.getItem('timer_mode') === 'speedrun';

            const savedTimerColor = localStorage.getItem('overlay_color_--timer-color');
            if (savedTimerColor) {
                timerColorInput.value = savedTimerColor;
            }

            const savedInfoBg = localStorage.getItem('overlay_info_bg_image') || '';
            infoBgInput.value = savedInfoBg;
            updateBgPreview(savedInfoBg);
            const savedInfoBgOpacity = localStorage.getItem('overlay_info_bg_opacity');
            if (savedInfoBgOpacity !== null) {
                infoBgOpacityInput.value = savedInfoBgOpacity;
                infoBgOpacityValue.textContent = Math.round(savedInfoBgOpacity * 100) + '%';
            }
            infoBgHideToggle.checked = localStorage.getItem('overlay_info_bg_hidden') === 'true';
            const savedTitleSize = localStorage.getItem('overlay_game_title_font_size');
            if (savedTitleSize !== null) {
                titleFontSizeInput.value = savedTitleSize;
                titleFontSizeValue.textContent = savedTitleSize + 'px';
            }
            const savedTitleColor = localStorage.getItem('overlay_game_title_color');
            if (savedTitleColor) {
                titleColorInput.value = savedTitleColor;
            }
            infoStartInput.value = localStorage.getItem('overlay_info_block_start') || '#af881c';
            infoEndInput.value = localStorage.getItem('overlay_info_block_end') || '#15151c';
            const savedAngle = localStorage.getItem('overlay_info_block_angle') || '180';
            infoAngleInput.value = savedAngle;
            infoAngleValue.textContent = savedAngle + '°';
        }

        function updateBgPreview(url) {
            if (url && url.trim() !== '') {
                infoBgPreview.style.backgroundImage = `url('${url}')`;
            } else {
                // Show default preview or blank if empty
                infoBgPreview.style.backgroundImage = `url('../images/hollowk.jpg')`;
            }
        }

        function triggerLiveUpdate() {
            localStorage.setItem('info_update_trigger', 'update_' + Date.now());
        }

        function saveLayoutData() {
            localStorage.setItem('info_game_title', gameTitleInput.value.trim() || '');
            localStorage.setItem('info_category', categoryInput.value.trim() || '');
            localStorage.setItem('info_estimate', estimateInput.value.trim() || '');
            localStorage.setItem('info_estimate_speedrun', estimateSpeedrunInput.value.trim() || '');
            localStorage.setItem('info_runner', runnerInput.value.trim() || '');
            localStorage.setItem('info_commentators', commentatorInput.value.trim() || '');
            localStorage.setItem('info_personal_best', personalBestInput.value.trim() || '');
            triggerLiveUpdate();
        }

        function updateBorderColor(cssVars, value) {
            cssVars.forEach(cssVar => {
                localStorage.setItem(`overlay_color_${cssVar}`, value);
            });
        }

        function commitBorderColors() {
            Object.entries(colorMap).forEach(([id, cssVars]) => {
                const input = document.getElementById(id);
                pendingBorderColors[id] = input.value;
                updateBorderColor(cssVars, input.value);
            });
            triggerLiveUpdate();
        }

        function updateColorLabel(labelId, value) {
            const label = document.getElementById(labelId);
            if (!label) return;
            label.style.background = value;
            label.style.color = (parseInt(value.slice(1), 16) > 0xffffff / 2) ? '#111' : '#fff';
        }

        function resetBorderColors() {
            Object.keys(colorMap).forEach(id => {
                const input = document.getElementById(id);
                const defaultValue = defaultBorderColors[id] || '#ffffff';
                input.value = defaultValue;
                pendingBorderColors[id] = defaultValue;
            });
        }

        timerModeToggle.addEventListener('change', () => {
            localStorage.setItem('timer_mode', timerModeToggle.checked ? 'speedrun' : 'stream');
            triggerLiveUpdate();
        });

        swapCameraChatToggle.addEventListener('change', () => {
            localStorage.setItem('swap_camera_chat', swapCameraChatToggle.checked ? 'true' : 'false');
            triggerLiveUpdate();
        });

        rerunLabelToggle.addEventListener('change', () => {
            localStorage.setItem('show_rerun_label', rerunLabelToggle.checked ? 'true' : 'false');
            triggerLiveUpdate();
        });

        personalBestToggle.addEventListener('change', () => {
            localStorage.setItem('show_personal_best', personalBestToggle.checked ? 'true' : 'false');
            triggerLiveUpdate();
        });

        function updateBackgroundValueLabels() {
            if (backgroundAngleValue) backgroundAngleValue.textContent = `${backgroundAngleInput.value}°`;
            if (backgroundStartStopValue) backgroundStartStopValue.textContent = `${backgroundStartStopInput.value}%`;
            if (backgroundEndStopValue) backgroundEndStopValue.textContent = `${backgroundEndStopInput.value}%`;
        }

        function updateBackgroundStyle() {
            pendingBackgroundStyle = {
                color: backgroundColorInput.value,
                startColor: backgroundStartColorInput.value,
                endColor: backgroundEndColorInput.value,
                gradient: backgroundGradientToggle.checked,
                angle: parseInt(backgroundAngleInput.value, 10),
                startStop: parseInt(backgroundStartStopInput.value, 10),
                endStop: parseInt(backgroundEndStopInput.value, 10)
            };
            updateBackgroundValueLabels();
        }

        function applyPendingBackgroundStyle() {
            localStorage.setItem('overlay_background_color', pendingBackgroundStyle.color);
            localStorage.setItem('overlay_background_start_color', pendingBackgroundStyle.startColor);
            localStorage.setItem('overlay_background_end_color', pendingBackgroundStyle.endColor);
            localStorage.setItem('overlay_background_gradient', pendingBackgroundStyle.gradient ? 'true' : 'false');
            localStorage.setItem('overlay_background_angle', String(pendingBackgroundStyle.angle));
            localStorage.setItem('overlay_background_start_stop', String(pendingBackgroundStyle.startStop));
            localStorage.setItem('overlay_background_end_stop', String(pendingBackgroundStyle.endStop));
            triggerLiveUpdate();
        }

        function resetBackgroundStyle() {
            pendingBackgroundStyle = {
                color: '#1e1e24',
                startColor: '#1e1e24',
                endColor: '#0f0f12',
                gradient: false,
                angle: 135,
                startStop: 0,
                endStop: 100
            };
            backgroundColorInput.value = pendingBackgroundStyle.color;
            backgroundStartColorInput.value = pendingBackgroundStyle.startColor;
            backgroundEndColorInput.value = pendingBackgroundStyle.endColor;
            backgroundGradientToggle.checked = pendingBackgroundStyle.gradient;
            backgroundAngleInput.value = pendingBackgroundStyle.angle;
            backgroundStartStopInput.value = pendingBackgroundStyle.startStop;
            backgroundEndStopInput.value = pendingBackgroundStyle.endStop;
            updateBackgroundValueLabels();
        }

        backgroundColorInput.addEventListener('input', updateBackgroundStyle);
        backgroundStartColorInput.addEventListener('input', updateBackgroundStyle);
        backgroundEndColorInput.addEventListener('input', updateBackgroundStyle);
        backgroundGradientToggle.addEventListener('change', updateBackgroundStyle);
        backgroundAngleInput.addEventListener('input', updateBackgroundStyle);
        backgroundStartStopInput.addEventListener('input', updateBackgroundStyle);
        backgroundEndStopInput.addEventListener('input', updateBackgroundStyle);
        document.getElementById('reset-background-btn').addEventListener('click', resetBackgroundStyle);

        blackLabelTextToggle.addEventListener('change', () => {
            localStorage.setItem('show_black_label_text', blackLabelTextToggle.checked ? 'true' : 'false');
            triggerLiveUpdate();
        });

        speedrunSplitsToggle.addEventListener('change', () => {
            localStorage.setItem('show_speedrun_splits', speedrunSplitsToggle.checked ? 'true' : 'false');
            triggerLiveUpdate();
        });

        cameraLabelToggle.addEventListener('change', () => {
            localStorage.setItem('show_camera_label', cameraLabelToggle.checked ? 'true' : 'false');
            triggerLiveUpdate();
        });

        chatLabelToggle.addEventListener('change', () => {
            localStorage.setItem('show_chat_label', chatLabelToggle.checked ? 'true' : 'false');
            triggerLiveUpdate();
        });

        function syncSidebarModeToggles() {
            const cameraOnly = cameraOnlyToggle.checked;
            const chatOnly = chatOnlyToggle.checked;
            if (cameraOnly && chatOnly) {
                chatOnlyToggle.checked = false;
            }
            localStorage.setItem('layout_camera_only', cameraOnly && !chatOnlyToggle.checked ? 'true' : 'false');
            localStorage.setItem('layout_chat_only', chatOnly && !cameraOnlyToggle.checked ? 'true' : 'false');
            triggerLiveUpdate();
        }

        cameraOnlyToggle.addEventListener('change', syncSidebarModeToggles);
        chatOnlyToggle.addEventListener('change', syncSidebarModeToggles);

        estimateSpeedrunInput.addEventListener('input', () => {
            localStorage.setItem('info_estimate_speedrun', estimateSpeedrunInput.value.trim() || '');
            triggerLiveUpdate();
        });

        personalBestInput.addEventListener('input', () => {
            localStorage.setItem('info_personal_best', personalBestInput.value.trim() || '');
            triggerLiveUpdate();
        });

        updateBtn.addEventListener('click', () => {
            saveLayoutData();
        });

        startBtn.addEventListener('click', () => {
            localStorage.setItem('timer_command', 'toggle_' + Date.now());
        });

        resetBtn.addEventListener('click', () => {
            localStorage.setItem('timer_command', 'reset_' + Date.now());
        });
        setTimerBtn.addEventListener('click', () => {
            const timeValue = manualTimerInput.value.trim();
            if (!timeValue) return;

            // Save the value to LocalStorage
            localStorage.setItem('info_manual_timer', timeValue);

            // Trigger command event for live overlay sync
            localStorage.setItem('timer_command', 'set_' + timeValue + '_' + Date.now());
            triggerLiveUpdate();
        });

        connectBtn.addEventListener('click', () => {
            const channel = channelInput.value.trim().toLowerCase();
            if (!channel) return;
            localStorage.setItem('twitch_channel', channel);
            localStorage.setItem('chat_command', 'connect_' + Date.now());
        });

        Object.entries(colorMap).forEach(([id, cssVars]) => {
            const input = document.getElementById(id);
            input.addEventListener('input', (event) => {
                const value = event.target.value;
                pendingBorderColors[id] = value;
                if (id === 'ctrl-border-cam') updateColorLabel('label-cam-color', value);
                if (id === 'ctrl-border-chat') updateColorLabel('label-chat-color', value);
            });
        });

        const masterPicker = document.getElementById('ctrl-border-master');
        masterPicker.addEventListener('input', (event) => {
            const value = event.target.value;
            Object.keys(colorMap).forEach(id => {
                const input = document.getElementById(id);
                input.value = value;
                pendingBorderColors[id] = value;
                if (id === 'ctrl-border-cam') updateColorLabel('label-cam-color', value);
                if (id === 'ctrl-border-chat') updateColorLabel('label-chat-color', value);
            });
        });

        document.getElementById('apply-borders-btn').addEventListener('click', commitBorderColors);
        document.getElementById('reset-borders-btn').addEventListener('click', resetBorderColors);
        document.getElementById('apply-background-btn').addEventListener('click', applyPendingBackgroundStyle);

        window.addEventListener('DOMContentLoaded', loadSavedData);

        // Helper function to smartly add .jpg if an extension is missing
        function formatImagePath(path) {
            let cleanPath = path.trim();
            if (!cleanPath) return '';
            // If the path doesn't end with a common image extension, add .jpg
            if (!/\.(jpg|jpeg|png|gif|webp)$/i.test(cleanPath) && !cleanPath.startsWith('http')) {
                cleanPath += '.jpg';
            }
            return cleanPath;
        }

        // Updates the preview box in real-time as you type or paste a link
        infoBgInput.addEventListener('input', (event) => {
            const smartUrl = formatImagePath(event.target.value);
            updateBgPreview(smartUrl);
        });

        // Saves the image to storage and triggers the OBS update
        setInfoBgBtn.addEventListener('click', () => {
            const smartUrl = formatImagePath(infoBgInput.value);
            localStorage.setItem('overlay_info_bg_image', smartUrl);
            triggerLiveUpdate();
        });
        infoBgOpacityInput.addEventListener('input', (event) => {
            const val = event.target.value;
            // Update the visual text percentage (e.g., 0.45 becomes "45%")
            infoBgOpacityValue.textContent = Math.round(val * 100) + '%';

            // Save and send to overlay
            localStorage.setItem('overlay_info_bg_opacity', val);
            triggerLiveUpdate();
        });
        infoBgHideToggle.addEventListener('change', (event) => {
            localStorage.setItem('overlay_info_bg_hidden', event.target.checked ? 'true' : 'false');
            triggerLiveUpdate();
        });
        titleFontSizeInput.addEventListener('input', (event) => {
            const val = event.target.value;
            titleFontSizeValue.textContent = val + 'px';

            localStorage.setItem('overlay_game_title_font_size', val);
            triggerLiveUpdate();
        });
        titleColorInput.addEventListener('input', (event) => {
            localStorage.setItem('overlay_game_title_color', event.target.value);
            triggerLiveUpdate();
        });
        infoStartInput.addEventListener('input', (e) => {
            localStorage.setItem('overlay_info_block_start', e.target.value);
            triggerLiveUpdate();
        });

        infoEndInput.addEventListener('input', (e) => {
            localStorage.setItem('overlay_info_block_end', e.target.value);
            triggerLiveUpdate();
        });

        infoAngleInput.addEventListener('input', (e) => {
            const val = e.target.value;
            infoAngleValue.textContent = val + '°';
            localStorage.setItem('overlay_info_block_angle', val);
            triggerLiveUpdate();
        });
        timerColorInput.addEventListener('input', (event) => {
            localStorage.setItem('overlay_color_--timer-color', event.target.value);
            triggerLiveUpdate();
        });
        fontFamilySelect.addEventListener('change', (event) => {
            localStorage.setItem('overlay_font_family', event.target.value);
            triggerLiveUpdate();
        });

        // ==========================================
        // QUICK THEME DROPDOWN SYSTEM (OBS FRIENDLY)
        // ==========================================
        const themeSelect = document.getElementById('ctrl-theme-select');
        const loadThemeBtn = document.getElementById('btn-load-theme');
        const deleteThemeBtn = document.getElementById('btn-delete-theme');
        const themeNameInput = document.getElementById('theme-name-input');
        const saveThemeBtn = document.getElementById('btn-save-theme');

        function getThemesDB() {
            return JSON.parse(localStorage.getItem('overlay_themes_db') || '{}');
        }

        function saveThemesDB(db) {
            localStorage.setItem('overlay_themes_db', JSON.stringify(db));
        }

        function updateThemeDropdown() {
            const db = getThemesDB();
            themeSelect.innerHTML = '';
            const themeNames = Object.keys(db);

            if (themeNames.length === 0) {
                themeSelect.innerHTML = '<option value="">No saved themes...</option>';
                return;
            }

            // Sort the list alphabetically for better organization
            themeNames.sort().forEach(name => {
                const opt = document.createElement('option');
                opt.value = name;
                opt.textContent = name;
                themeSelect.appendChild(opt);
            });

            // RECALL ACTIVE THEME: Check if we have an active theme saved, and lock the dropdown to it
            const activeTheme = localStorage.getItem('active_theme_name');
            if (activeTheme && themeNames.includes(activeTheme)) {
                themeSelect.value = activeTheme;
            }
        }
        // HELPER: Checks if the live layout differs from the saved database
        function hasUnsavedChanges() {
            const activeTheme = localStorage.getItem('active_theme_name');
            const db = getThemesDB();

            // If no theme is actively tracked, skip the warning
            if (!activeTheme || !db[activeTheme]) return false;

            const savedData = db[activeTheme];

            // 1. Check if any current setting differs from the saved version
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                // Ignore system keys that aren't part of the theme's visuals
                if (key !== 'overlay_themes_db' && key !== 'active_theme_name' && key !== 'force_hard_reset') {
                    if (localStorage.getItem(key) !== savedData[key]) {
                        return true; // Found a mismatch!
                    }
                }
            }

            // 2. Check if the saved theme has keys that were completely removed from the live layout
            for (const key in savedData) {
                if (localStorage.getItem(key) !== savedData[key]) {
                    return true; // Found a missing key!
                }
            }

            return false; // Everything matches perfectly
        }

        // SAVE THEME
        saveThemeBtn.addEventListener('click', () => {
            const themeName = themeNameInput.value.trim();
            if (!themeName) return;

            const db = getThemesDB();
            const currentSettings = {};

            // Package settings, ignoring the database and the active theme tracker
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key !== 'overlay_themes_db' && key !== 'active_theme_name') {
                    currentSettings[key] = localStorage.getItem(key);
                }
            }

            db[themeName] = currentSettings;
            saveThemesDB(db);

            // Set this newly saved theme as the active one
            localStorage.setItem('active_theme_name', themeName);

            updateThemeDropdown();
            themeNameInput.value = '';
        });

        // LOAD THEME
        loadThemeBtn.addEventListener('click', () => {
            const themeName = themeSelect.value;
            if (!themeName) return;

            // NEW: Unsaved changes warning!
            if (hasUnsavedChanges()) {
                const activeTheme = localStorage.getItem('active_theme_name');
                const confirmAbandon = confirm(`You have unsaved changes made to "${activeTheme}". Loading a new theme will erase them. Are you sure you want to continue?`);

                // If the user clicks "Cancel" on the popup, stop the load process entirely
                if (!confirmAbandon) return;
            }

            const db = getThemesDB();
            const themeData = db[themeName];
            if (!themeData) return;

            // Wipe current active settings (Keep the DB and the active tracker safe)
            for (let i = localStorage.length - 1; i >= 0; i--) {
                const key = localStorage.key(i);
                if (key !== 'overlay_themes_db' && key !== 'active_theme_name') {
                    localStorage.removeItem(key);
                }
            }

            // Inject the loaded theme data
            for (const key in themeData) {
                localStorage.setItem(key, themeData[key]);
            }

            // Lock in the active theme name before reloading
            localStorage.setItem('active_theme_name', themeName);

            localStorage.setItem('force_hard_reset', Date.now().toString());
            window.location.reload();
        });

        // DELETE THEME
        deleteThemeBtn.addEventListener('click', () => {
            const themeName = themeSelect.value;
            if (!themeName) return;

            if (confirm(`Are you sure you want to delete the "${themeName}" preset?`)) {
                const db = getThemesDB();
                delete db[themeName];
                saveThemesDB(db);

                // If you delete the theme you are currently using, clear the tracker
                if (localStorage.getItem('active_theme_name') === themeName) {
                    localStorage.removeItem('active_theme_name');
                }

                updateThemeDropdown();
            }
        });

        // Initialize on boot
        updateThemeDropdown();

        // ==========================================
        // HARD RESET SYSTEM
        // ==========================================
        document.getElementById('btn-hard-reset').addEventListener('click', () => {
            const confirmReset = confirm("WARNING: This will wipe all saved colors, text, and timer history. Are you sure you want to factory reset everything?");

            if (confirmReset) {
                // 1. Wipe the computer's local storage completely
                localStorage.clear();

                // 2. Trigger the OBS browser source to refresh itself instantly
                localStorage.setItem('force_hard_reset', Date.now().toString());

                // 3. Refresh the controller page itself
                window.location.reload();
            }
        });