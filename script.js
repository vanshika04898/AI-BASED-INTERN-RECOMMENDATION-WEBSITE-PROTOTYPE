// ===========================
// SIMULATED DATABASE (LocalStorage)
// ===========================
if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify([]));
}
if (!localStorage.getItem('internships')) {
    const internships = [
        {id:1, title:"Web Developer", skills:"HTML, CSS, JS", location:"Delhi", duration:"2 months", sector:"IT"},
        {id:2, title:"Data Analyst", skills:"Excel, Python", location:"Mumbai", duration:"3 months", sector:"IT"},
        {id:3, title:"Healthcare Intern", skills:"Patient Care", location:"Bangalore", duration:"1 month", sector:"Healthcare"},
        {id:4, title:"Marketing Intern", skills:"Marketing, Social Media", location:"Hyderabad", duration:"2 months", sector:"Marketing"},
        {id:5, title:"AI Research Intern", skills:"Python, ML", location:"Pune", duration:"3 months", sector:"IT"}
    ];
    localStorage.setItem('internships', JSON.stringify(internships));
}

// ===========================
// LOGIN & REGISTER
// ===========================
function login() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const users = JSON.parse(localStorage.getItem('users'));
    const user = users.find(u => u.username === username && u.password === password);
    if(user){
        localStorage.setItem('currentUser', JSON.stringify(user));
        window.location.href = "dashboard.html";
    } else {
        alert("Invalid credentials!");
    }
}

function register() {
    const username = document.getElementById('reg-username').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value.trim();
    let users = JSON.parse(localStorage.getItem('users'));

    if(users.find(u=>u.username===username)){
        alert("Username already exists!");
        return;
    }

    const newUser = {username, email, password, skills:"", age:"", gender:"", resume:false, applied:[], bookmarks:[]};
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    alert("Registration successful! Please login.");
    window.location.href = "index.html";
}

// ===========================
// DASHBOARD FUNCTIONS
// ===========================
function loadDashboard() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if(!user) window.location.href = "index.html";

    document.getElementById('user-name').innerText = user.username;
    document.getElementById('applied-count').innerText = user.applied.length;
    document.getElementById('bookmarks-count').innerText = user.bookmarks.length;
    document.getElementById('resume-status').innerText = user.resume ? "Yes" : "No";

    const recentAppliedDiv = document.getElementById('recent-applied');
    recentAppliedDiv.innerHTML = "";
    user.applied.forEach(id=>{
        const internship = JSON.parse(localStorage.getItem('internships')).find(i=>i.id===id);
        if(internship){
            const div = document.createElement('div');
            div.className = "application-card";
            div.innerHTML = `<h3>${internship.title}</h3><p>${internship.duration} | ${internship.location}</p>`;
            recentAppliedDiv.appendChild(div);
        }
    });

    const recentBookmarksDiv = document.getElementById('recent-bookmarks');
    recentBookmarksDiv.innerHTML = "";
    user.bookmarks.forEach(id=>{
        const internship = JSON.parse(localStorage.getItem('internships')).find(i=>i.id===id);
        if(internship){
            const div = document.createElement('div');
            div.className = "internship-card";
            div.innerHTML = `<h3>${internship.title}</h3><p>${internship.duration} | ${internship.location}</p>`;
            recentBookmarksDiv.appendChild(div);
        }
    });
}

// ===========================
// INTERNSHIP SEARCH & APPLY/BOOKMARK
// ===========================
function searchInternships() {
    const query = document.getElementById('internship-search').value.trim().toLowerCase();
    const internships = JSON.parse(localStorage.getItem('internships'));
    const user = JSON.parse(localStorage.getItem('currentUser'));

    const filtered = internships.filter(i => 
        i.title.toLowerCase().includes(query) || 
        i.skills.toLowerCase().includes(query) || 
        i.sector.toLowerCase().includes(query)
    );

    const listDiv = document.getElementById('internship-list');
    listDiv.innerHTML = "";

    filtered.forEach(i=>{
        const div = document.createElement('div');
        div.className = "internship-card";
        div.innerHTML = `
            <h3>${i.title}</h3>
            <p>${i.skills} | ${i.duration} | ${i.location}</p>
            <button onclick="applyInternship(${i.id})">Apply</button>
            <button onclick="bookmarkInternship(${i.id})">Bookmark</button>
        `;
        listDiv.appendChild(div);
    });
}

function applyInternship(id){
    let user = JSON.parse(localStorage.getItem('currentUser'));
    if(!user.applied.includes(id)) user.applied.push(id);
    localStorage.setItem('currentUser', JSON.stringify(user));

    let users = JSON.parse(localStorage.getItem('users'));
    const idx = users.findIndex(u=>u.username===user.username);
    users[idx] = user;
    localStorage.setItem('users', JSON.stringify(users));

    alert("Internship Applied!");
    loadDashboard();
}

function bookmarkInternship(id){
    let user = JSON.parse(localStorage.getItem('currentUser'));
    if(!user.bookmarks.includes(id)) user.bookmarks.push(id);
    localStorage.setItem('currentUser', JSON.stringify(user));

    let users = JSON.parse(localStorage.getItem('users'));
    const idx = users.findIndex(u=>u.username===user.username);
    users[idx] = user;
    localStorage.setItem('users', JSON.stringify(users));

    alert("Internship Bookmarked!");
    loadDashboard();
}

// ===========================
// PROFILE EDIT
// ===========================
function loadProfile() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if(!user) window.location.href="index.html";

    document.getElementById('profile-username').value = user.username;
    document.getElementById('profile-email').value = user.email;
    document.getElementById('profile-skills').value = user.skills;
    document.getElementById('profile-age').value = user.age;
    document.getElementById('profile-gender').value = user.gender;
    document.getElementById('profile-resume-status').innerText = user.resume ? "Uploaded" : "Not Uploaded";
}

function saveProfile(){
    let user = JSON.parse(localStorage.getItem('currentUser'));
    user.username = document.getElementById('profile-username').value.trim();
    user.email = document.getElementById('profile-email').value.trim();
    user.skills = document.getElementById('profile-skills').value.trim();
    user.age = document.getElementById('profile-age').value.trim();
    user.gender = document.getElementById('profile-gender').value;

    localStorage.setItem('currentUser', JSON.stringify(user));

    let users = JSON.parse(localStorage.getItem('users'));
    const idx = users.findIndex(u=>u.username===user.username);
    if(idx!==-1) users[idx] = user;
    localStorage.setItem('users', JSON.stringify(users));

    alert("Profile Updated!");
}

function uploadResume(){
    let user = JSON.parse(localStorage.getItem('currentUser'));
    user.resume = true;
    localStorage.setItem('currentUser', JSON.stringify(user));

    let users = JSON.parse(localStorage.getItem('users'));
    const idx = users.findIndex(u=>u.username===user.username);
    users[idx] = user;
    localStorage.setItem('users', JSON.stringify(users));

    alert("Resume Uploaded!");
    loadProfile();
}

// ===========================
// CHATBOT - Multi-language with memory
// ===========================
let chatOpen = false;
function toggleChat(){
    const chatWindow = document.getElementById('chat-window');
    chatOpen = !chatOpen;
    if(chatOpen) chatWindow.classList.add('open');
    else chatWindow.classList.remove('open');
}

// Language selection
let chatLanguage = 'en';
function changeLanguage() {
    chatLanguage = document.getElementById('chat-language').value;
}

// Multi-language responses
const chatbotResponses = [
    {
        keywords: ["help", "support"],
        response: {
            en: "You can contact support at <b>support@internshipbuddy.com</b> or call 1800-123-456.",
            hi: "आप <b>support@internshipbuddy.com</b> पर संपर्क कर सकते हैं या 1800-123-456 पर कॉल करें।",
            ta: "நீங்கள் <b>support@internshipbuddy.com</b> இல் தொடர்பு கொள்ளலாம் அல்லது 1800-123-456 அழைக்கலாம்."
        }
    },
    {
        keywords: ["career"],
        response: {
            en: "Check the Career Path page for recommended courses, videos, and guidance!",
            hi: "अनुशंसित पाठ्यक्रम, वीडियो और मार्गदर्शन के लिए करियर पथ पृष्ठ देखें!",
            ta: "பரிந்துரைக்கப்பட்ட பாடங்கள், வீடியோக்கள் மற்றும் வழிகாட்டலுக்காக Career Path பக்கத்தைப் பாருங்கள்!"
        }
    },
    {
        keywords: ["internship", "apply", "search"],
        response: {
            en: "Visit the Internships page to search and apply for internships.",
            hi: "इंटर्नशिप खोजने और आवेदन करने के लिए इंटर्नशिप पृष्ठ पर जाएँ।",
            ta: "இணையப்பக்கத்தில் Internship தேட மற்றும் விண்ணப்பிக்க செல்லவும்."
        }
    },
    {
        keywords: ["hi", "hello"],
        response: {
            en: "Hello! I am your Internship Buddy. Ask me about internships, career paths, or type 'help'.",
            hi: "नमस्ते! मैं आपका Internship Buddy हूँ। मुझसे इंटर्नशिप, करियर पथ के बारे में पूछें या 'help' टाइप करें।",
            ta: "வணக்கம்! நான் உங்கள் Internship Buddy. Internship, Career Path பற்றிய கேள்விகளை கேட்கலாம் அல்லது 'help' என type செய்யலாம்."
        }
    }
];

function loadChat(){
    const messagesDiv = document.getElementById('chat-messages');
    messagesDiv.innerHTML = "";

    let chatHistory = JSON.parse(sessionStorage.getItem('chatHistory') || "[]");
    chatHistory.forEach(msg => {
        const div = document.createElement('div');
        div.className = msg.type === 'user' ? 'chat-user' : 'chat-bot';
        div.innerHTML = msg.message;
        messagesDiv.appendChild(div);
    });
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function sendMessage(event){
    event.preventDefault();
    const input = document.getElementById('chat-input');
    const msg = input.value.trim();
    if(!msg) return;

    const messagesDiv = document.getElementById('chat-messages');

    const userDiv = document.createElement('div');
    userDiv.className = 'chat-user';
    userDiv.innerText = msg;
    messagesDiv.appendChild(userDiv);

    let chatHistory = JSON.parse(sessionStorage.getItem('chatHistory') || "[]");
    chatHistory.push({type:'user', message:msg});
    sessionStorage.setItem('chatHistory', JSON.stringify(chatHistory));

    const botDiv = document.createElement('div');
    botDiv.className = 'chat-bot';
    let found = false;

    for(let i=0; i<chatbotResponses.length; i++){
        const item = chatbotResponses[i];
        if(item.keywords.some(k => msg.toLowerCase().includes(k))){
            botDiv.innerHTML = item.response[chatLanguage] || item.response['en'];
            found = true;
            break;
        }
    }

    if(!found){
        const fallback = {
            en: "Sorry, I didn't understand. Type 'help' for support or 'career' for guidance.",
            hi: "माफ़ कीजिए, मैं समझ नहीं पाया। सहायता के लिए 'help' या मार्गदर्शन के लिए 'career' टाइप करें।",
            ta: "மன்னிக்கவும், நான் புரிந்துகொள்ளவில்லை. உதவிக்கு 'help' அல்லது வழிகாட்டலுக்கு 'career' என type செய்யவும்."
        };
        botDiv.innerHTML = fallback[chatLanguage] || fallback['en'];
    }

    messagesDiv.appendChild(botDiv);
    chatHistory.push({type:'bot', message:botDiv.innerHTML});
    sessionStorage.setItem('chatHistory', JSON.stringify(chatHistory));

    input.value = "";
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function clearChat(){
    sessionStorage.removeItem('chatHistory');
    loadChat();
}

// ===========================
// LOGOUT
// ===========================
function logout(){
    localStorage.removeItem('currentUser');
    window.location.href="index.html";
}

