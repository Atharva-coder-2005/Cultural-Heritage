
const config = {
    apiBaseUrl: 'https://your-backend-api.com', 
    currentMonth: new Date().getMonth(),
    currentYear: new Date().getFullYear()
};

const elements = {
    calendarContainer: document.querySelector('.calendar-container'),
    currentMonthEl: document.getElementById('current-month'),
    prevMonthBtn: document.getElementById('prev-month'),
    nextMonthBtn: document.getElementById('next-month'),
    
    searchInput: document.getElementById('search-input'),
    searchBtn: document.getElementById('search-btn'),
    
    currentPhraseEl: document.getElementById('current-phrase'),
    playAudioBtn: document.getElementById('play-audio'),
    prevPhraseBtn: document.getElementById('prev-phrase'),
    nextPhraseBtn: document.getElementById('next-phrase'),
    audioUpload: document.getElementById('audio-upload'),
    uploadBtn: document.getElementById('upload-btn'),
    
    loginBtn: document.getElementById('login-btn'),
    registerBtn: document.getElementById('register-btn'),
    authModal: document.getElementById('auth-modal'),
    closeModal: document.querySelector('.close-modal'),
    authForm: document.getElementById('auth-form'),
    switchAuthBtn: document.getElementById('switch-auth-btn'),
    switchAuthText: document.getElementById('switch-auth-text'),
    
    submissionForm: document.getElementById('submission-form')
};

let state = {
    currentUser: null,
    currentPhraseIndex: 0,
    isLoginForm: true,
    phrases: [],
    events: []
};

document.addEventListener('DOMContentLoaded', () => {
    initCalendar();
    setupEventListeners();
    checkAuthState();
    loadPhrases();
    loadEvents();
});

function setupEventListeners() {
    elements.prevMonthBtn.addEventListener('click', () => {
        config.currentMonth--;
        if (config.currentMonth < 0) {
            config.currentMonth = 11;
            config.currentYear--;
        }
        initCalendar();
    });
    
    elements.nextMonthBtn.addEventListener('click', () => {
        config.currentMonth++;
        if (config.currentMonth > 11) {
            config.currentMonth = 0;
            config.currentYear++;
        }
        initCalendar();
    });
    
    elements.searchBtn.addEventListener('click', performSearch);
    elements.searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });
    
    elements.playAudioBtn.addEventListener('click', playCurrentPhraseAudio);
    elements.prevPhraseBtn.addEventListener('click', showPreviousPhrase);
    elements.nextPhraseBtn.addEventListener('click', showNextPhrase);
    elements.uploadBtn.addEventListener('click', handleAudioUpload);
    
    elements.loginBtn.addEventListener('click', () => {
        state.isLoginForm = true;
        showAuthModal();
    });
    elements.registerBtn.addEventListener('click', () => {
        state.isLoginForm = false;
        showAuthModal();
    });
    elements.closeModal.addEventListener('click', hideAuthModal);
    elements.switchAuthBtn.addEventListener('click', toggleAuthForm);
    elements.authForm.addEventListener('submit', handleAuthSubmit);
    
    elements.submissionForm.addEventListener('submit', handleContributionSubmit);
}

function initCalendar() {
    const monthNames = ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"];
    elements.currentMonthEl.textContent = `${monthNames[config.currentMonth]} ${config.currentYear}`;
    
    elements.calendarContainer.innerHTML = '';
    
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    dayNames.forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day-header';
        dayElement.textContent = day;
        elements.calendarContainer.appendChild(dayElement);
    });
    
    const firstDay = new Date(config.currentYear, config.currentMonth, 1).getDay();
    const daysInMonth = new Date(config.currentYear, config.currentMonth + 1, 0).getDate();
    
    for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day empty';
        elements.calendarContainer.appendChild(emptyDay);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        
        const dayNumber = document.createElement('div');
        dayNumber.className = 'calendar-day-number';
        dayNumber.textContent = day;
        dayElement.appendChild(dayNumber);
        
        const dateStr = `${config.currentYear}-${String(config.currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayEvents = state.events.filter(event => event.date === dateStr);
        
        dayEvents.forEach(event => {
            const eventElement = document.createElement('div');
            eventElement.className = 'calendar-event';
            eventElement.textContent = event.title;
            eventElement.title = event.description;
            dayElement.appendChild(eventElement);
        });
        
        elements.calendarContainer.appendChild(dayElement);
    }
}

function performSearch() {
    const query = elements.searchInput.value.trim();
    if (!query) return;
    console.log(`Searching for: ${query}`);
    alert(`Search functionality would look for: ${query}\nThis would connect to your backend in a real implementation.`);
}

function loadPhrases() {
    state.phrases = [
        {
            id: 1,
            phrase: "Welcome to our home",
            translation: "Ngiyanemukela kukhaya lethu",
            pronunciation: "Ngee-ya-neh-moo-keh-la koo-kha-ya leh-too",
            audioUrl: "audio/welcome.mp3" 
        },
        {
            id: 2,
            phrase: "Thank you very much",
            translation: "Ngiyabonga kakhulu",
            pronunciation: "Ngee-ya-bon-ga ka-khoo-loo",
            audioUrl: "audio/thanks.mp3"
        },
        {
            id: 3,
            phrase: "How are you?",
            translation: "Unjani?",
            pronunciation: "Oon-ja-nee",
            audioUrl: "audio/howareyou.mp3"
        }
    ];
    
    if (state.phrases.length > 0) {
        displayCurrentPhrase();
    }
}

function displayCurrentPhrase() {
    const phrase = state.phrases[state.currentPhraseIndex];
    elements.currentPhraseEl.innerHTML = `
        <strong>${phrase.phrase}</strong><br>
        <em>Translation:</em> ${phrase.translation}<br>
        <em>Pronunciation:</em> ${phrase.pronunciation}
    `;
}

function playCurrentPhraseAudio() {
    const phrase = state.phrases[state.currentPhraseIndex];
    if (phrase.audioUrl) {
        const audio = new Audio(phrase.audioUrl);
        audio.play().catch(e => console.error("Audio playback failed:", e));
    } else {
        alert(`Audio for: ${phrase.phrase}`);
    }
}

function showPreviousPhrase() {
    state.currentPhraseIndex = (state.currentPhraseIndex - 1 + state.phrases.length) % state.phrases.length;
    displayCurrentPhrase();
}

function showNextPhrase() {
    state.currentPhraseIndex = (state.currentPhraseIndex + 1) % state.phrases.length;
    displayCurrentPhrase();
}

function handleAudioUpload() {
    const file = elements.audioUpload.files[0];
    if (!file) {
        alert("Please select an audio file first");
        return;
    }
    
    console.log("Would upload file:", file.name);
    alert(`Audio file "${file.name}" would be uploaded to your backend in a real implementation.`);
}

function loadEvents() {
    state.events = [
        {
            id: 1,
            title: "Harvest Festival",
            date: "2023-10-15",
            description: "Annual celebration of the harvest season",
            location: "Town Square"
        },
        {
            id: 2,
            title: "Winter Lights",
            date: "2023-12-20",
            description: "Festival of lights marking the winter solstice",
            location: "Throughout town"
        }
    ];
    
    initCalendar();
}
function checkAuthState() {
    updateAuthUI();
}

function showAuthModal() {
    updateAuthForm();
    elements.authModal.style.display = 'flex';
}

function hideAuthModal() {
    elements.authModal.style.display = 'none';
}

function toggleAuthForm() {
    state.isLoginForm = !state.isLoginForm;
    updateAuthForm();
}

function updateAuthForm() {
    if (state.isLoginForm) {
        elements.authForm.querySelector('button[type="submit"]').textContent = 'Sign In';
        elements.switchAuthText.textContent = 'New to the archive?';
        elements.switchAuthBtn.textContent = 'Register instead';
    } else {
        elements.authForm.querySelector('button[type="submit"]').textContent = 'Register';
        elements.switchAuthText.textContent = 'Already have an account?';
        elements.switchAuthBtn.textContent = 'Sign in instead';
    }
}

function handleAuthSubmit(e) {
    e.preventDefault();
    
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;
    
    console.log(`${state.isLoginForm ? 'Login' : 'Register'} with:`, email, password);
    
    // Simulate successful auth
    state.currentUser = { email, name: email.split('@')[0] };
    updateAuthUI();
    hideAuthModal();
    alert(`${state.isLoginForm ? 'Login' : 'Registration'} successful!\n(In a real app, this would properly authenticate with your backend)`);
}

function updateAuthUI() {
    if (state.currentUser) {
        elements.loginBtn.style.display = 'none';
        elements.registerBtn.style.display = 'none';
    } else {
        elements.loginBtn.style.display = 'inline-block';
        elements.registerBtn.style.display = 'inline-block';
    }
}

function handleContributionSubmit(e) {
    e.preventDefault();
    
    if (!state.currentUser) {
        alert("Please sign in to contribute");
        showAuthModal();
        return;
    }
    
    const type = document.getElementById('contribution-type').value;
    const title = document.getElementById('contribution-title').value;
    const description = document.getElementById('contribution-desc').value;
    const imageFile = document.getElementById('contribution-image').files[0];
    
    console.log("New contribution:", { type, title, description, imageFile });
    alert(`Contribution "${title}" would be submitted to your backend in a real implementation.`);
    
    elements.submissionForm.reset();
}

window.addEventListener('click', (e) => {
    if (e.target === elements.authModal) {
        hideAuthModal();
    }
});