// --- INITIAL SETUP ---
const nameElement = document.getElementById('user-name');

// Load Persisted Data
if (localStorage.getItem('auraName')) {
    nameElement.textContent = localStorage.getItem('auraName');
}

if (localStorage.getItem('auraVibe')) {
    changeVibe(localStorage.getItem('auraVibe'), false);
}

// --- NAME EDITING ---
nameElement.addEventListener('blur', () => {
    localStorage.setItem('auraName', nameElement.textContent);
});

nameElement.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); nameElement.blur(); }
});

// --- CLOCK & GREETING ---
function updateClock() {
    const now = new Date();
    const hours = now.getHours();
    let greet = "Good Evening";
    if (hours < 12) greet = "Good Morning";
    else if (hours < 18) greet = "Good Afternoon";
    
    document.getElementById('greeting-text').textContent = greet;
    document.getElementById('clock').textContent = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'});
}
setInterval(updateClock, 1000);
updateClock();

// --- THEME & FOCUS ---
function changeVibe(gradient, save = true) {
    document.body.style.background = gradient;
    if (gradient.includes('#000000')) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
    if (save) localStorage.setItem('auraVibe', gradient);
}

function toggleFocus() {
    document.body.classList.toggle('focus-active');
    const btn = document.getElementById('focus-toggle');
    btn.textContent = document.body.classList.contains('focus-active') ? "Show All" : "Focus Mode";
}

// --- DATA FETCHING (Weather, Quote, News) ---
async function fetchAll() {
    // Weather (Krakow)
    try {
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=50.0647&longitude=19.9450&current_weather=true');
        const data = await res.json();
        document.getElementById('weather').textContent = `Krakow: ${data.current_weather.temperature}°C`;
    } catch {}

    // Quotes
    try {
        const res = await fetch('https://api.allorigins.win/get?url=' + encodeURIComponent('https://zenquotes.io/api/random'));
        const data = await res.json();
        const quote = JSON.parse(data.contents)[0];
        document.getElementById('quote').textContent = `"${quote.q}" — ${quote.a}`;
    } catch { document.getElementById('quote').textContent = "Make today amazing."; }

    // News
    try {
        const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent('https://www.bbc.com/news/world/rss.xml')}`);
        const data = await res.json();
        const list = document.getElementById('news-list');
        list.innerHTML = '';
        data.items.slice(0, 4).forEach(item => {
            const div = document.createElement('div');
            div.className = 'news-item';
            div.innerHTML = `<a href="${item.link}" target="_blank"><strong>•</strong> ${item.title}</a>`;
            list.appendChild(div);
        });
    } catch {}
}
fetchAll();
setInterval(fetchAll, 1800000); // Refresh every 30 mins

// --- TIMER LOGIC ---
let timerInterval;
let timeLeft = 25 * 60;
const timerDisplay = document.getElementById('timer-display');

document.getElementById('start-btn').addEventListener('click', () => {
    if (timerInterval) return;
    timerInterval = setInterval(() => {
        timeLeft--;
        const mins = Math.floor(timeLeft / 60);
        const secs = timeLeft % 60;
        timerDisplay.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        if (timeLeft <= 0) { clearInterval(timerInterval); alert("Focus session finished!"); }
    }, 1000);
});

document.getElementById('reset-btn').addEventListener('click', () => {
    clearInterval(timerInterval);
    timerInterval = null;
    timeLeft = 25 * 60;
    timerDisplay.textContent = "25:00";
});