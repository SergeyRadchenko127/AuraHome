// --- STATE MANAGEMENT (Persistence) ---
const nameElement = document.getElementById('user-name');

// 1. Load Saved Name
const savedName = localStorage.getItem('auraName');
if (savedName) nameElement.textContent = savedName;

// 2. Save Name on Change
nameElement.addEventListener('blur', () => {
    localStorage.setItem('auraName', nameElement.textContent);
});

// 3. Prevent "Enter" key from making a new line in the name
nameElement.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        nameElement.blur();
    }
});

// --- CLOCK & GREETING ---
function updateDashboard() {
    const now = new Date();
    const hours = now.getHours();
    
    let greetText = "Good Evening";
    if (hours < 12) greetText = "Good Morning";
    else if (hours < 18) greetText = "Good Afternoon";
    
    document.getElementById('greeting-text').textContent = greetText;
    document.getElementById('clock').textContent = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'});
}
setInterval(updateDashboard, 1000);
updateDashboard();

// --- VIBE SAVING ---
function changeVibe(gradient, save = true) {
    document.body.style.background = gradient;
    if (gradient.includes('#000000')) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
    if (save) localStorage.setItem('auraVibe', gradient);
}
const savedVibe = localStorage.getItem('auraVibe');
if (savedVibe) changeVibe(savedVibe, false);

// --- APIs (Weather, Quotes, News) ---
async function fetchData() {
    // Weather
    try {
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=50.0647&longitude=19.9450&current_weather=true');
        const data = await res.json();
        document.getElementById('weather').textContent = `Krakow: ${data.current_weather.temperature}°C`;
    } catch { }

    // Quote
    try {
        const res = await fetch('https://api.allorigins.win/get?url=' + encodeURIComponent('https://zenquotes.io/api/random'));
        const data = await res.json();
        const quote = JSON.parse(data.contents)[0];
        document.getElementById('quote').textContent = `"${quote.q}" — ${quote.a}`;
    } catch { }

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
    } catch { }
}
fetchData();
setInterval(fetchData, 1800000); // Refresh every 30 mins

// --- TIMER ---
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
        if (timeLeft <= 0) { clearInterval(timerInterval); alert("Done!"); }
    }, 1000);
});

document.getElementById('reset-btn').addEventListener('click', () => {
    clearInterval(timerInterval);
    timerInterval = null;
    timeLeft = 25 * 60;
    timerDisplay.textContent = "25:00";
});