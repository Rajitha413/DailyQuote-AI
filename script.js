document.addEventListener('DOMContentLoaded', () => {
    // --- DOM ELEMENTS ---
    const authPageWrapper = document.getElementById('authPageWrapper');
    const mainPage = document.getElementById('mainPage');
    const authBtn = document.getElementById('authBtn');
    const authToggle = document.getElementById('authToggle');
    const authHeader = document.getElementById('authHeader');
    const emailField = document.getElementById('emailField');
    const logoutBtn = document.getElementById('logoutBtn');
    const settingsBtn = document.getElementById('settingsBtn');
    const profileBtn = document.getElementById('profileBtn');
    const navButtons = document.querySelectorAll('.nav-btn');
    const pages = document.querySelectorAll('.page');
    const moodButtons = document.querySelectorAll('.mood-btn');
    const quoteText = document.getElementById('quoteText');
    const backToLoggerBtn = document.getElementById('backToLoggerBtn');
    const historyList = document.getElementById('historyList');
    const moodChartCanvas = document.getElementById('moodChart');
    const headerTitle = document.getElementById('headerTitle');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const emailInput = document.getElementById('email');
    const authError = document.getElementById('authError');
    const loggedInUserEl = document.getElementById('loggedInUser');
    const insightsList = document.getElementById('insightsList');
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');

    // Calendar & Transitions Elements
    const calendarTitle = document.getElementById('calendarTitle');
    const moodCalendar = document.getElementById('moodCalendar');
    const moodTransitionsList = document.getElementById('moodTransitionsList');
    const dayDetailModal = document.getElementById('dayDetailModal');
    const modalDate = document.getElementById('modalDate');
    const modalContent = document.getElementById('modalContent');
    const closeModalBtn = document.getElementById('closeModalBtn');

    // Email Scheduler Elements
    const scheduleBtn = document.getElementById('scheduleBtn');
    const scheduleStatus = document.getElementById('scheduleStatus');
    const scheduleEmailInput = document.getElementById('scheduleEmail');
    const scheduleFrequencyInput = document.getElementById('scheduleFrequency');
    const scheduleTimeInput = document.getElementById('scheduleTime');
    const scheduleCategoryInput = document.getElementById('scheduleCategory');
    const sendTestBtn = document.getElementById('sendTestBtn');
    const cancelScheduleBtn = document.getElementById('cancelScheduleBtn');

    // Dashboard elements
    const greetingEl = document.getElementById('greeting'), currentDateEl = document.getElementById('currentDate'), recentMood = document.getElementById('recentMood'), totalLogs = document.getElementById('totalLogs'), streakCountEl = document.getElementById('streakCount'), weeklyMoodChartCanvas = document.getElementById('weeklyMoodChart'), throwbackCard = document.getElementById('throwbackCard'), throwbackText = document.getElementById('throwbackText'), wellnessTipEl = document.getElementById('wellnessTip');

    // Settings elements
    const themeSelector = document.getElementById('themeSelector'), accentColorSelector = document.getElementById('accentColorSelector'), defaultPageSelector = document.getElementById('defaultPageSelector'), exportDataBtn = document.getElementById('exportDataBtn'), clearDataBtn = document.getElementById('clearDataBtn'), confirmationModal = document.getElementById('confirmationModal'), cancelDeleteBtn = document.getElementById('cancelDeleteBtn'), confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

    // Profile Settings Elements
    const profileUsername = document.getElementById('profileUsername');
    const profileEmail = document.getElementById('profileEmail');
    const currentPasswordInput = document.getElementById('currentPassword');
    const newPasswordInput = document.getElementById('newPassword');
    const updatePasswordBtn = document.getElementById('updatePasswordBtn');
    const passwordUpdateStatus = document.getElementById('passwordUpdateStatus');
    const profileMemberSince = document.getElementById('profileMemberSince');
    const profileTotalLogs = document.getElementById('profileTotalLogs');
    const profileLongestStreak = document.getElementById('profileLongestStreak');

    // --- STATE MANAGEMENT ---
    let currentUser = null;
    let moodHistory = [];
    let userSettings = {};
    let moodChart = null;
    let weeklyMoodChart = null;
    let authMode = 'login';
    const moodEmoji = {happy: '😊', sad: '😢', motivated: '🚀', anxious: '😟', calm: '😌', thoughtful: '🤔', proud: '🥳', tired: '😴', default: '🤔'};
    const wellnessTips = ["Take 5 deep, slow breaths. Inhale calm, exhale stress.", "Stretch your arms above your head for 30 seconds.", "Drink a full glass of water right now.", "Think of one thing you're grateful for today.", "Step outside for a minute and notice the weather.", "Tidy up one small thing in your immediate space.", "Listen to one of your favorite songs from start to finish.", "Jot down one goal for tomorrow, no matter how small."];
    const quotes = { happy: ["The purpose of our lives is to be happy. - Dalai Lama", "The very least you can do in your life is figure out what you hope for. And the most you can do is live inside that hope. - Barbara Kingsolver", "Happiness is not something ready made. It comes from your own actions. - Dalai Lama", "For every minute you are angry you lose sixty seconds of happiness. - Ralph Waldo Emerson", "The most important thing is to enjoy your life—to be happy—it's all that matters. - Audrey Hepburn", "Count your age by friends, not years. Count your life by smiles, not tears. - John Lennon", "The secret of happiness is not in doing what one likes, but in liking what one does. - J.M. Barrie", "Folks are usually about as happy as they make their minds up to be. - Abraham Lincoln", "Let us be grateful to the people who make us happy; they are the charming gardeners who make our souls blossom. - Marcel Proust", "There is only one happiness in this life, to love and be loved. - George Sand"], sad: ["The way to get started is to quit talking and begin doing. - Walt Disney", "It is during our darkest moments that we must focus to see the light. - Aristotle", "Tears come from the heart and not from the brain. - Leonardo da Vinci", "Heavy hearts, like heavy clouds in the sky, are best relieved by the letting of a little water. - Christopher Morley", "The word 'happy' would lose its meaning if it were not balanced by sadness. - Carl Jung", "First, accept sadness. Realize that without losing, winning isn't so great. - Alyssa Milano", "Sadness flies away on the wings of time. - Jean de La Fontaine", "We must understand that sadness is an ocean, and sometimes we drown, while other days we are forced to swim. - R.M. Drake", "Don't cry because it's over, smile because it happened. - Dr. Seuss", "The good times of today are the sad thoughts of tomorrow. - Bob Marley"], motivated: ["The only way to do great work is to love what you do. - Steve Jobs", "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill", "Believe you can and you're halfway there. - Theodore Roosevelt", "The secret of getting ahead is getting started. - Mark Twain", "You are never too old to set another goal or to dream a new dream. - C.S. Lewis", "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt", "Act as if what you do makes a difference. It does. - William James", "It does not matter how slowly you go as long as you do not stop. - Confucius", "Don't watch the clock; do what it does. Keep going. - Sam Levenson", "I find that the harder I work, the more luck I seem to have. - Thomas Jefferson"], anxious: ["You wouldn't worry so much about what others think of you if you realized how seldom they do. - Eleanor Roosevelt", "Breathe. Let go. And remind yourself that this very moment is the only one you know you have for sure. - Oprah Winfrey", "Worry is a misuse of imagination. - Dan Zadra", "Anxiety is a thin stream of fear trickling through the mind. If encouraged, it cuts a channel into which all other thoughts are drained. - Arthur Somers Roche", "It's not the load that breaks you down, it's the way you carry it. - Lou Holtz", "Nothing diminishes anxiety faster than action. - Walter Anderson", "Do not anticipate trouble, or worry about what may never happen. Keep in the sunlight. - Benjamin Franklin", "You don't have to control your thoughts. You just have to stop letting them control you. - Dan Millman", "Worry often gives a small thing a big shadow. - Swedish Proverb", "Rule number one is, don't sweat the small stuff. Rule number two is, it's all small stuff. - Richard Carlson"], calm: ["Within you, there is a stillness and a sanctuary to which you can retreat at any time and be yourself. - Hermann Hesse", "The quieter you become, the more you are able to hear. - Rumi", "Calmness is the cradle of power. - Josiah Gilbert Holland", "There is a calmness to a life lived in gratitude, a quiet joy. - Ralph H. Blum", "Be like a duck. Calm on the surface, but paddling like the dickens underneath. - Michael Caine", "Peace is the result of retraining your mind to process life as it is, rather than as you think it should be. - Wayne W. Dyer", "Set peace of mind as your highest goal, and organize your life around it. - Brian Tracy", "The greatest weapon against stress is our ability to choose one thought over another. - William James", "Breathe. It’s just a bad day, not a bad life. - Unknown", "Remain calm in every situation because peace equals power. - Joyce Meyer"], thoughtful: ["The unexamined life is not worth living. - Socrates", "The only true wisdom is in knowing you know nothing. - Socrates", "All that we see or seem is but a dream within a dream. - Edgar Allan Poe", "It is the mark of an educated mind to be able to entertain a thought without accepting it. - Aristotle", "Thinking is the hardest work there is, which is probably the reason so few engage in it. - Henry Ford", "The world as we have created it is a process of our thinking. It cannot be changed without changing our thinking. - Albert Einstein", "The mind is everything. What you think you become. - Buddha", "We cannot solve our problems with the same thinking we used when we created them. - Albert Einstein", "A man who does not think for himself does not think at all. - Oscar Wilde", "The trouble with having an open mind, of course, is that people will insist on coming along and trying to put things in it. - Terry Pratchett"], proud: ["If you can dream it, you can do it. - Walt Disney", "Be proud of your scars. They have a story to tell.", "The more you praise and celebrate your life, the more there is in life to celebrate. - Oprah Winfrey", "It's a fine thing to be proud of your home town, but a better thing to make your home town proud of you. - Unknown", "Your best champion and cheerleader is yourself. Always be proud of your accomplishments, big or small. - Dr. T.P. Chia", "Whatever you did today was the way it was meant to be. Be proud of you. - Oprah Winfrey", "Be proud of who you are, and not ashamed of how someone else sees you. - Unknown", "Take pride in how far you've come. Have faith in how far you can go. But don't forget to enjoy the journey. - Michael Josephson", "There is nothing noble in being superior to your fellow man; true nobility is being superior to your former self. - Ernest Hemingway", "Pride is a personal commitment. It is an attitude which separates excellence from mediocrity. - Unknown"], tired: ["Rest and be thankful. - William Wordsworth", "Almost everything will work again if you unplug it for a few minutes, including you. - Anne Lamott", "Sleep is the best meditation. - Dalai Lama", "The time to relax is when you don't have time for it. - Sydney J. Harris", "A well-spent day brings happy sleep. - Leonardo da Vinci", "Sometimes the most productive thing you can do is relax. - Mark Black", "Tiredness is a warning sign that you need to take a break. Listen to your body. - Unknown", "A little sleep can fix a lot of problems. - Unknown", "It's okay to take a break. The world will not fall apart without you. - Unknown", "Even a soul submerged in sleep is hard at work and helps make something of the world. - Heraclitus"] };
    const moodColors = ['#22c55e', '#3b82f6', '#f97316', '#eab308', '#14b8a6', '#8b5cf6', '#ec4899', '#6b7280'];

    // --- NOTIFICATION FUNCTION ---
    const showToast = (message, type = 'info') => { toastMessage.textContent = message; toast.className = 'toast show'; if (type === 'warning') toast.classList.add('warning'); setTimeout(() => { toast.classList.remove('show'); toast.classList.remove('warning'); }, 3000); };
    // --- SETTINGS (FRONT-END ONLY) ---
    const applySettings = () => { const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches; document.body.classList.toggle('light-mode', userSettings.theme === 'auto' ? !prefersDark : userSettings.theme === 'light'); document.documentElement.style.setProperty('--accent-color', `var(--${userSettings.accentColor}-400, #818cf8)`); document.documentElement.style.setProperty('--accent-color-hover', `var(--${userSettings.accentColor}-600, #6366f1)`); updateActiveSettingButtons(); };
    const updateActiveSettingButtons = () => { document.querySelectorAll('#themeSelector .setting-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.theme === userSettings.theme)); document.querySelectorAll('#accentColorSelector .color-swatch').forEach(btn => btn.classList.toggle('active', btn.dataset.color === userSettings.accentColor)); document.querySelectorAll('#defaultPageSelector .setting-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.page === userSettings.defaultPage)); };
    
    // --- AUTHENTICATION FUNCTIONS ---
    const toggleAuthMode = () => { authMode = authMode === 'login' ? 'signup' : 'login'; authError.textContent = ''; usernameInput.value = ''; passwordInput.value = ''; emailInput.value = ''; if (authMode === 'login') { authHeader.textContent = 'Log in to find your daily inspiration.'; authBtn.textContent = 'Secure Login'; authToggle.textContent = 'New user? Click here to Sign Up.'; emailField.classList.add('hidden'); } else { authHeader.textContent = 'Sign up to start your mood journey.'; authBtn.textContent = 'Register Account'; authToggle.textContent = 'Existing user? Click here to Log In.'; emailField.classList.remove('hidden'); } };
    const handleAuth = async () => {
        const username = usernameInput.value.trim(); const password = passwordInput.value; const email = emailInput.value.trim(); authError.textContent = '';
        if (!username || !password) { authError.textContent = "All fields are required."; return; }
        try {
            if (authMode === 'signup') {
                const response = await api.registerUser(username, password, email);
                if (response.success) { showToast("Registration successful! Please log in.", 'info'); toggleAuthMode(); }
            } else if (authMode === 'login') {
                const response = await api.loginUser(username, password);
                if (response.success) { showToast(`Welcome back, ${username}!`, 'info'); currentUser = response.user.username; await finalizeLogin(username); }
            }
        } catch (error) { authError.textContent = error.message; }
    };
    const finalizeLogin = async (username) => {
        loggedInUserEl.textContent = username;
        authPageWrapper.classList.add('hidden');
        mainPage.classList.remove('hidden');
        try {
            const data = await api.loadAllUserData();
            moodHistory = data.moodHistory;
            userSettings = JSON.parse(localStorage.getItem(`dailyquote_settings_${currentUser}`)) || { theme: 'dark', accentColor: 'indigo', defaultPage: 'dashboardPage' };
            applySettings();
            showPage(userSettings.defaultPage);
        } catch (error) { console.error("Failed to load user data:", error); showToast("Could not load your data.", "warning"); }
    };
    const handleLogout = () => { api.logoutUser(); currentUser = null; moodHistory = []; mainPage.classList.add('hidden'); authPageWrapper.classList.remove('hidden'); usernameInput.value = ''; passwordInput.value = ''; authError.textContent = ''; if (authMode !== 'login') { toggleAuthMode(); } };
    
    // --- GENERAL FUNCTIONS & PAGE ROUTING ---
    const updateHeaderTitle = (pageId) => { const title = { dashboardPage: "Dashboard", moodLogger: "Log Mood", historyPage: "Mood History", analyzerPage: "Mood Analyzer", settingsPage: "Settings", profilePage: "My Profile", quotePage: "Your Quote", schedulerPage: "Email Scheduler" }[pageId]; headerTitle.textContent = title || "DailyQuoteAI"; };
    const showPage = async (pageId) => {
        pages.forEach(page => page.classList.toggle('hidden', page.id !== pageId));
        updateHeaderTitle(pageId);
        navButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.page === pageId));
        if (pageId === 'analyzerPage') { renderMoodChart(); renderInsights(); renderMoodCalendar(); renderMoodTransitions(); }
        if (pageId === 'dashboardPage') renderDashboard();
        if (pageId === 'historyPage') displayHistory();
        if (pageId === 'schedulerPage') await loadScheduleData();
        if (pageId === 'profilePage') await loadProfileData();
    };
    const getQuoteForMood = (mood) => { const moodQuotes = quotes[mood] || ["Just keep swimming!"]; return moodQuotes[Math.floor(Math.random() * moodQuotes.length)]; };
    
    // --- MOOD LOGGING & HISTORY ---
    const logMoodHistory = async (mood, quote) => { const moodEntry = { mood, quote, date: new Date().toISOString() }; try { await api.saveMood(moodEntry); moodHistory.unshift(moodEntry); } catch (error) { showToast("Failed to save your mood. Please try again.", "warning"); } };
    const displayHistory = () => { historyList.innerHTML = ''; if (moodHistory.length === 0) { historyList.innerHTML = `<p class="text-center text-text-secondary">No moods logged yet.</p>`; return; } moodHistory.forEach(entry => { const div = document.createElement('div'); div.className = 'p-4 bg-surface/80 rounded-lg glass-card'; div.innerHTML = `<div class="flex items-start space-x-4"><span class="text-3xl">${moodEmoji[entry.mood]}</span><div><p class="font-semibold text-text-primary italic">"${entry.quote}"</p><p class="text-xs text-text-secondary mt-2">${new Date(entry.date).toLocaleString()}</p></div></div>`; historyList.appendChild(div); }); };
    
    // --- DASHBOARD & ANALYTICS ---
    const getGreeting = () => { const h=new Date().getHours(); return h<12?"Good Morning!":h<18?"Good Afternoon!":"Good Evening!"; };
    const getCurrentDate = () => new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    const calculateStreak = () => { if(moodHistory.length===0)return 0; let s=0; const t=new Date(); t.setHours(0,0,0,0); const d=new Set(moodHistory.map(e=>{const dt=new Date(e.date); dt.setHours(0,0,0,0); return dt.getTime();})); if(!d.has(t.getTime())){t.setDate(t.getDate()-1);} while(d.has(t.getTime())){s++; t.setDate(t.getDate()-1);} return s; };
    const findThrowbackMood = () => { const today = new Date(); const throwback = moodHistory.find(e => { const d = new Date(e.date); return d.getMonth()===today.getMonth() && d.getDate()===today.getDate() && d.getFullYear()!==today.getFullYear(); }); throwbackCard.classList.toggle('hidden', !throwback); if (throwback) throwbackText.textContent = `In ${new Date(throwback.date).getFullYear()}, you felt ${throwback.mood}.`; };
    const getDailyWellnessTip = () => { const n=new Date(),s=new Date(n.getFullYear(),0,0); return wellnessTips[Math.floor((n-s)/(1e3*60*60*24))%wellnessTips.length]; };
    const renderWeeklyChart = () => { const ctx = weeklyMoodChartCanvas.getContext('2d'); if (weeklyMoodChart) weeklyMoodChart.destroy(); const sevenDaysAgo = new Date(); sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7); const weeklyHistory = moodHistory.filter(e => new Date(e.date) > sevenDaysAgo); const container = weeklyMoodChartCanvas.parentElement; if(weeklyHistory.length === 0){ if(weeklyMoodChartCanvas) weeklyMoodChartCanvas.classList.add('hidden'); container.innerHTML = `<div class="flex items-center justify-center h-full text-text-secondary">Log moods to see your weekly vibe.</div>`; if(!container.contains(weeklyMoodChartCanvas)) container.appendChild(weeklyMoodChartCanvas); return; } weeklyMoodChartCanvas.classList.remove('hidden'); const moodCounts = weeklyHistory.reduce((a,e)=>(a[e.mood]=(a[e.mood]||0)+1,a),{}); const labels = Object.keys(moodCounts); weeklyMoodChart = new Chart(ctx, { type: 'bar', data: { labels: labels.map(l=>moodEmoji[l]), datasets: [{ data: Object.values(moodCounts), backgroundColor: moodColors, borderRadius: 4 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c)=>`${labels[c.dataIndex]}: ${c.raw}` } } }, scales: { y: { beginAtZero: true, ticks: { color: getComputedStyle(document.body).getPropertyValue('--text-secondary'), stepSize: 1 }, grid: { color: 'rgba(255, 255, 255, 0.1)' } }, x: { ticks: { font: { size: 20 }, color: getComputedStyle(document.body).getPropertyValue('--text-secondary') }, grid: { display: false } } } } }); };
    const renderDashboard = () => { recentMood.textContent = moodHistory.length > 0 ? moodEmoji[moodHistory[0].mood] : moodEmoji['default']; totalLogs.textContent = moodHistory.length; greetingEl.textContent = getGreeting(); currentDateEl.textContent = getCurrentDate(); streakCountEl.innerHTML = `${calculateStreak()} 🔥`; wellnessTipEl.textContent = getDailyWellnessTip(); findThrowbackMood(); renderWeeklyChart(); };
    const renderMoodChart = () => { const ctx = moodChartCanvas.getContext('2d'); if (moodChart) moodChart.destroy(); const moodCounts = moodHistory.reduce((a,e)=>(a[e.mood]=(a[e.mood]||0)+1,a),{}); if (Object.keys(moodCounts).length === 0) { const c=moodChartCanvas.parentElement; if(!c.contains(moodChartCanvas)) c.appendChild(moodChartCanvas); ctx.clearRect(0,0,moodChartCanvas.width,moodChartCanvas.height); ctx.fillStyle=getComputedStyle(document.body).getPropertyValue('--text-secondary'); ctx.textAlign='center'; ctx.fillText('Log moods to see analysis!',moodChartCanvas.width/2,moodChartCanvas.height/2); return; } moodChart = new Chart(ctx, { type: 'doughnut', data: { labels: Object.keys(moodCounts).map(l => l.charAt(0).toUpperCase()+l.slice(1)), datasets: [{ data: Object.values(moodCounts), backgroundColor: moodColors, borderColor: getComputedStyle(document.body).getPropertyValue('--bg-surface'), borderWidth: 4 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', labels: { color: getComputedStyle(document.body).getPropertyValue('--text-primary'), font: {size: 14} } } } } }); };
    const renderInsights = () => { insightsList.innerHTML = ''; const MIN_ENTRIES_FOR_ANALYSIS = 5; if (moodHistory.length < MIN_ENTRIES_FOR_ANALYSIS) { insightsList.innerHTML = `<li>Log at least ${MIN_ENTRIES_FOR_ANALYSIS} moods to uncover detailed patterns!</li>`; return; } const findDominant = obj => Object.keys(obj).reduce((a, b) => obj[a] > obj[b] ? a : b, null); const moodCounts = moodHistory.reduce((a, e) => (a[e.mood] = (a[e.mood] || 0) + 1, a), {}); const dominantMood = findDominant(moodCounts); if (dominantMood) { insightsList.innerHTML += `<li>Your most frequent mood is <strong class="text-text-primary">${dominantMood}</strong> ${moodEmoji[dominantMood]}.</li>`; } const timeAnalysis = { Morning: {}, Afternoon: {}, Evening: {} }; moodHistory.forEach(entry => { const hour = new Date(entry.date).getHours(); let slot; if (hour >= 5 && hour < 12) slot = 'Morning'; else if (hour >= 12 && hour < 18) slot = 'Afternoon'; else slot = 'Evening'; timeAnalysis[slot][entry.mood] = (timeAnalysis[slot][entry.mood] || 0) + 1; }); const dominantTimeSlot = findDominant({ Morning: Object.values(timeAnalysis.Morning).reduce((a,b)=>a+b,0), Afternoon: Object.values(timeAnalysis.Afternoon).reduce((a,b)=>a+b,0), Evening: Object.values(timeAnalysis.Evening).reduce((a,b)=>a+b,0) }); if (dominantTimeSlot && Object.keys(timeAnalysis[dominantTimeSlot]).length > 0) { const dominantMoodInSlot = findDominant(timeAnalysis[dominantTimeSlot]); insightsList.innerHTML += `<li>You log most often in the <strong class="text-text-primary">${dominantTimeSlot}</strong>, typically feeling <strong class="text-text-primary">${dominantMoodInSlot}</strong>.</li>`; } };
    const renderMoodCalendar = () => { moodCalendar.innerHTML = ''; const today = new Date(); const month = today.getMonth(); const year = today.getFullYear(); calendarTitle.textContent = today.toLocaleString('default', { month: 'long', year: 'numeric' }); const firstDay = new Date(year, month, 1).getDay(); const daysInMonth = new Date(year, month + 1, 0).getDate(); const moodsByDay = new Map(); moodHistory.forEach(entry => { const entryDate = new Date(entry.date); if (entryDate.getFullYear() === year && entryDate.getMonth() === month) { const day = entryDate.getDate(); if (!moodsByDay.has(day)) moodsByDay.set(day, []); moodsByDay.get(day).push(entry); } }); for (let i = 0; i < firstDay; i++) { moodCalendar.innerHTML += `<div class="calendar-day"></div>`; } for (let day = 1; day <= daysInMonth; day++) { const dayLogs = moodsByDay.get(day); let dayCell = `<div class="calendar-day ${dayLogs ? 'has-mood' : ''}" data-day="${day}">`; dayCell += `<span class="day-number">${day}</span>`; if (dayLogs) { const uniqueMoods = [...new Set(dayLogs.map(log => log.mood))]; dayCell += `<div class="mood-emoji-wrapper">${uniqueMoods.slice(0, 2).map(mood => moodEmoji[mood] || '').join('')}</div>`; } dayCell += '</div>'; moodCalendar.innerHTML += dayCell; } };
    const renderMoodTransitions = () => { moodTransitionsList.innerHTML = ''; if (moodHistory.length < 10) { moodTransitionsList.innerHTML = '<li>Log more moods to see your common emotional transitions.</li>'; return; } const transitions = {}; const reversedHistory = [...moodHistory].reverse(); for (let i = 0; i < reversedHistory.length - 1; i++) { const from = reversedHistory[i].mood; const to = reversedHistory[i+1].mood; const key = `${from}->${to}`; transitions[key] = (transitions[key] || 0) + 1; } const topTransitions = Object.entries(transitions).sort((a, b) => b[1] - a[1]).slice(0, 3); if (topTransitions.length === 0) { moodTransitionsList.innerHTML = '<li>Not enough consecutive mood logs to identify transitions.</li>'; return; } topTransitions.forEach(t => { const [from, to] = t[0].split('->'); moodTransitionsList.innerHTML += `<li class="text-left">After feeling ${from} ${moodEmoji[from]}, you often feel <strong class="text-text-primary">${to} ${moodEmoji[to]}</strong>.</li>`; }); };
    
    // --- PROFILE & DATA FUNCTIONS ---
    const loadProfileData = async () => { try { const response = await api.getProfileData(); if (response.success) { const { profile, stats } = response; profileUsername.textContent = profile.username; profileEmail.textContent = profile.email || 'No email provided'; profileMemberSince.textContent = new Date(profile.memberSince).toLocaleDateString(); profileTotalLogs.textContent = stats.totalLogs; profileLongestStreak.textContent = `${stats.longestStreak} days`; } } catch (error) { showToast("Could not load profile data.", "warning"); } currentPasswordInput.value = ''; newPasswordInput.value = ''; passwordUpdateStatus.textContent = ''; };
    const handleUpdatePassword = async () => { const currentPassword = currentPasswordInput.value; const newPassword = newPasswordInput.value; passwordUpdateStatus.textContent = ''; if (!currentPassword || !newPassword) { passwordUpdateStatus.textContent = 'Both fields are required.'; passwordUpdateStatus.classList.add('text-red-400'); return; } try { const response = await api.updatePassword(currentPassword, newPassword); passwordUpdateStatus.textContent = response.message; passwordUpdateStatus.classList.remove('text-red-400'); passwordUpdateStatus.classList.add('text-emerald-400'); currentPasswordInput.value = ''; newPasswordInput.value = ''; showToast('Password updated!', 'info'); } catch(error) { passwordUpdateStatus.textContent = error.message; passwordUpdateStatus.classList.remove('text-emerald-400'); passwordUpdateStatus.classList.add('text-red-400'); } };
    const exportDataToCSV = () => { if(moodHistory.length === 0) { showToast('No data to export.', 'warning'); return; } const headers = 'date,mood,quote\n', rows = moodHistory.map(e => `"${new Date(e.date).toISOString()}","${e.mood}","${e.quote.replace(/"/g, '""')}"`).join('\n'), csv = headers + rows, blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' }), link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = `dailyquote_history_${new Date().toISOString().split('T')[0]}.csv`; link.click(); };
    
    // --- EMAIL SCHEDULER FUNCTIONS ---
    const populateScheduleCategories = () => { scheduleCategoryInput.innerHTML = `<option value="auto">Auto (Based on mood)</option>`; for (const mood in quotes) { const option = document.createElement('option'); option.value = mood; option.textContent = mood.charAt(0).toUpperCase() + mood.slice(1); scheduleCategoryInput.appendChild(option); } };
    const loadScheduleData = async () => { try { const { schedule } = await api.loadSchedule(); if (schedule) { scheduleEmailInput.value = schedule.email; scheduleFrequencyInput.value = schedule.frequency; scheduleTimeInput.value = schedule.time; scheduleCategoryInput.value = schedule.category || 'auto'; scheduleStatus.textContent = `Current schedule: ${schedule.frequency} at ${schedule.time}.`; scheduleStatus.classList.remove('text-red-400'); scheduleStatus.classList.add('text-emerald-400'); cancelScheduleBtn.classList.remove('hidden'); } else { scheduleEmailInput.value = ''; scheduleFrequencyInput.value = 'daily'; scheduleTimeInput.value = '09:00'; scheduleCategoryInput.value = 'auto'; scheduleStatus.textContent = 'No email schedule is currently set.'; scheduleStatus.classList.remove('text-emerald-400', 'text-red-400'); cancelScheduleBtn.classList.add('hidden'); } } catch (error) { showToast("Could not load schedule.", "warning"); } };
    const handleScheduleEmail = async () => { const email = scheduleEmailInput.value.trim(); if (!email || !email.includes('@')) { showToast('Please enter a valid email address.', 'warning'); return; } const scheduleData = { email: email, frequency: scheduleFrequencyInput.value, time: scheduleTimeInput.value, category: scheduleCategoryInput.value, }; try { const response = await api.saveSchedule(scheduleData); if (response.success) { showToast('Email schedule saved!', 'info'); await loadScheduleData(); } } catch (error) { showToast(error.message, "warning"); } };
    const handleCancelSchedule = async () => { try { const response = await api.cancelSchedule(); showToast(response.message, 'warning'); await loadScheduleData(); } catch (error) { showToast(error.message, "warning"); }};
    const handleSendTestEmail = async () => { const email = scheduleEmailInput.value.trim(); if (!email || !email.includes('@')) { showToast('Please enter a valid email to send a test.', 'warning'); return; } const category = scheduleCategoryInput.value === 'auto' ? 'motivated' : scheduleCategoryInput.value; const subject = `Your Test Quote from DailyQuoteAI`; const quote = getQuoteForMood(category); showToast('Sending test email...', 'info'); try { const response = await api.sendTestEmail(email, subject, quote); if (response.success) { showToast(response.message, 'info'); } else { showToast(response.message, 'warning'); } } catch (error) { showToast(error.message, "warning"); } };

    // --- EVENT LISTENERS ---
    authBtn.addEventListener('click', handleAuth);
    authToggle.addEventListener('click', (e) => { e.preventDefault(); toggleAuthMode(); });
    logoutBtn.addEventListener('click', handleLogout);
    settingsBtn.addEventListener('click', () => showPage('settingsPage'));
    profileBtn.addEventListener('click', () => showPage('profilePage'));
    navButtons.forEach(btn => { if(btn.id !== 'logoutBtn') btn.addEventListener('click', () => showPage(btn.dataset.page))});
    
    moodButtons.forEach(btn => btn.addEventListener('click', async () => { 
        const m = btn.dataset.mood; 
        const q = getQuoteForMood(m); 
        quoteText.textContent = q; 
        await logMoodHistory(m,q);
        showPage('quotePage'); 
    }));
    
    backToLoggerBtn.addEventListener('click', () => showPage('moodLogger'));

    scheduleBtn.addEventListener('click', handleScheduleEmail);
    sendTestBtn.addEventListener('click', handleSendTestEmail);
    cancelScheduleBtn.addEventListener('click', handleCancelSchedule);
    themeSelector.addEventListener('click', async e => { if(e.target.dataset.theme){ userSettings.theme = e.target.dataset.theme; applySettings(); localStorage.setItem(`dailyquote_settings_${currentUser}`, JSON.stringify(userSettings)); showToast('Theme updated!'); } });
    accentColorSelector.addEventListener('click', async e => { if(e.target.dataset.color){ userSettings.accentColor = e.target.dataset.color; applySettings(); localStorage.setItem(`dailyquote_settings_${currentUser}`, JSON.stringify(userSettings)); showToast('Accent color updated!'); } });
    defaultPageSelector.addEventListener('click', async e => { if(e.target.dataset.page){ userSettings.defaultPage = e.target.dataset.page; updateActiveSettingButtons(); localStorage.setItem(`dailyquote_settings_${currentUser}`, JSON.stringify(userSettings)); showToast('Default page saved!'); } });
    exportDataBtn.addEventListener('click', exportDataToCSV);
    clearDataBtn.addEventListener('click', () => confirmationModal.classList.remove('hidden'));
    cancelDeleteBtn.addEventListener('click', () => confirmationModal.classList.add('hidden'));
    updatePasswordBtn.addEventListener('click', handleUpdatePassword);
    confirmDeleteBtn.addEventListener('click', async () => { /* This would need to become a backend call */ });
    
    moodCalendar.addEventListener('click', (e) => { 
        const dayCell = e.target.closest('.calendar-day.has-mood');
        if (!dayCell) return;
        const day = parseInt(dayCell.dataset.day);
        const today = new Date();
        const date = new Date(today.getFullYear(), today.getMonth(), day);
        modalDate.textContent = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
        const dayLogs = moodHistory.filter(entry => { const entryDate = new Date(entry.date); return entryDate.getDate() === day && entryDate.getMonth() === today.getMonth() && entryDate.getFullYear() === today.getFullYear(); });
        modalContent.innerHTML = dayLogs.map(log => `
            <div class="p-3 bg-background rounded-md">
                <p class="font-semibold text-text-primary">${moodEmoji[log.mood]} ${log.mood.charAt(0).toUpperCase() + log.mood.slice(1)} at ${new Date(log.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                <p class="text-sm text-text-secondary italic">"${log.quote}"</p>
            </div>
        `).join('');
        dayDetailModal.classList.remove('hidden');
     });
    closeModalBtn.addEventListener('click', () => dayDetailModal.classList.add('hidden'));

    // --- INITIAL SETUP ---
    populateScheduleCategories();
    toggleAuthMode();
});