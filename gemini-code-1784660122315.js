import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// نظام التبديل السلس بين الأقسام والصفحات
window.switchSection = function(targetId) {
    document.querySelectorAll('.content-section').forEach(sec => sec.classList.remove('active'));
    document.querySelectorAll('.nav-links a').forEach(link => link.classList.remove('active'));

    const targetSection = document.getElementById(targetId);
    if(targetSection) targetSection.classList.add('active');

    const matchingLink = document.querySelector(`.nav-links a[data-target="${targetId}"]`);
    if(matchingLink) matchingLink.classList.add('active');
}

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = link.getAttribute('data-target');
        switchSection(target);
    });
});

// تفاعل العدادات داخل صفحة متتبع العدادات
let countValue = 0;
const incrementBtn = document.getElementById('incrementBtn');
const dailyCounter = document.getElementById('dailyCounter');
if(incrementBtn) {
    incrementBtn.addEventListener('click', () => {
        countValue++;
        dailyCounter.textContent = countValue;
    });
}

// حاسبة السعرات
const calcBtn = document.getElementById('calcBtn');
if(calcBtn) {
    calcBtn.addEventListener('click', () => {
        const weight = parseFloat(document.getElementById('calcWeight').value);
        const height = parseFloat(document.getElementById('calcHeight').value);
        const age = parseFloat(document.getElementById('calcAge').value);
        const resultBox = document.getElementById('calcResult');
        const caloriesOutput = document.getElementById('caloriesOutput');

        if(weight && height && age) {
            const bmr = 10 * weight + 6.25 * height - 5 * age + 5;
            const totalCalories = Math.round(bmr * 1.375);
            caloriesOutput.textContent = totalCalories;
            resultBox.style.display = 'block';
        } else {
            alert('يرجى إدخال جميع البيانات بشكل صحيح.');
        }
    });
}

// نظام النوافذ المنبثقة وتسجيل الدخول
const authModal = document.getElementById('authModal');
const openAuthBtn = document.getElementById('openAuthBtn');
const closeModal = document.getElementById('closeModal');
const tabLoginBtn = document.getElementById('tabLoginBtn');
const tabRegBtn = document.getElementById('tabRegBtn');
const loginForm = document.getElementById('loginForm');
const regForm = document.getElementById('regForm');
const authMsg = document.getElementById('authMsg');
const logoutBtn = document.getElementById('logoutBtn');
const loggedUserEmail = document.getElementById('loggedUserEmail');

openAuthBtn.addEventListener('click', () => authModal.style.display = 'flex');
closeModal.addEventListener('click', () => authModal.style.display = 'none');

tabLoginBtn.addEventListener('click', () => {
    tabLoginBtn.classList.add('active');
    tabRegBtn.classList.remove('active');
    loginForm.style.display = 'block';
    regForm.style.display = 'none';
    authMsg.textContent = '';
});

tabRegBtn.addEventListener('click', () => {
    tabRegBtn.classList.add('active');
    tabLoginBtn.classList.remove('active');
    regForm.style.display = 'block';
    loginForm.style.display = 'none';
    authMsg.textContent = '';
});

regForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    try {
        await createUserWithEmailAndPassword(auth, email, password);
        authModal.style.display = 'none';
        regForm.reset();
    } catch (error) {
        authMsg.textContent = "خطأ في التسجيل: تحقق من صحة البيانات.";
    }
});

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    try {
        await signInWithEmailAndPassword(auth, email, password);
        authModal.style.display = 'none';
        loginForm.reset();
    } catch (error) {
        authMsg.textContent = "خطأ: البريد أو كلمة المرور غير صحيحة.";
    }
});

logoutBtn.addEventListener('click', async () => {
    await signOut(auth);
});

onAuthStateChanged(auth, (user) => {
    if (user) {
        loggedUserEmail.textContent = user.email;
        openAuthBtn.style.display = 'none';
        logoutBtn.style.display = 'inline-block';
    } else {
        loggedUserEmail.textContent = '';
        openAuthBtn.style.display = 'inline-block';
        logoutBtn.style.display = 'none';
    }
});