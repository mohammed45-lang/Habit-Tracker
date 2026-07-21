// ===== البيانات =====
let habits = [];
let editingId = null;

// بيانات صحية
const healthData = [
    { icon: '🚶', name: 'خطوات اليوم', value: '0', target: '10,000', unit: 'خطوة' },
    { icon: '💧', name: 'شرب الماء', value: '0', target: '2', unit: 'لتر' },
    { icon: '😴', name: 'ساعات النوم', value: '0', target: '8', unit: 'ساعة' },
    { icon: '🏋️', name: 'تمارين', value: '0', target: '30', unit: 'دقيقة' },
    { icon: '🍎', name: 'وجبات صحية', value: '0', target: '5', unit: 'وجبة' },
    { icon: '🧘', name: 'تأمل', value: '0', target: '15', unit: 'دقيقة' },
];

// ===== تحميل البيانات =====
function loadData() {
    const saved = localStorage.getItem('habitsData');
    if (saved) {
        habits = JSON.parse(saved);
    } else {
        habits = [
            { id: 1, name: '🚶 مشي 30 دقيقة', category: 'رياضية', target: 1, progress: 70, streak: 5, done: false },
            { id: 2, name: '💧 شرب 2 لتر ماء', category: 'صحية', target: 1, progress: 45, streak: 3, done: false },
            { id: 3, name: '📖 قراءة 10 صفحات', category: 'ذهنية', target: 1, progress: 90, streak: 12, done: false },
        ];
        saveData();
    }
}

function saveData() {
    localStorage.setItem('habitsData', JSON.stringify(habits));
}

// ===== عرض العادات =====
function renderHabits() {
    const grid = document.getElementById('habitsGrid');
    if (habits.length === 0) {
        grid.innerHTML = `
            <div style="text-align:center; padding:40px; background:white; border-radius:16px; color:#6c757d; grid-column:1/-1;">
                🎯 لا توجد عادات بعد<br/>
                <span style="font-size:14px;">أضف عادتك الأولى من زر "إضافة عادة"</span>
            </div>
        `;
        return;
    }

    grid.innerHTML = habits.map(h => `
        <div class="habit-card">
            <div class="top">
                <span class="name ${h.done ? 'done' : ''}">${h.name}</span>
                <span class="category">${h.category}</span>
            </div>
            <div class="progress-section">
                <input type="checkbox" ${h.done ? 'checked' : ''} onchange="toggleHabit(${h.id})" />
                <div class="progress-bar">
                    <div class="progress-fill" style="width:${h.progress}%;"></div>
                </div>
                <span class="percentage">${h.progress}%</span>
            </div>
            <div class="bottom">
                <span class="streak">🔥 ${h.streak} يوم</span>
                <div class="actions">
                    <button class="btn-edit" onclick="editHabit(${h.id})">✏️</button>
                    <button class="btn-delete" onclick="deleteHabit(${h.id})">🗑️</button>
                </div>
            </div>
        </div>
    `).join('');

    updateStats();
}

// ===== الإحصائيات =====
function updateStats() {
    document.getElementById('totalHabits').textContent = habits.length;
    document.getElementById('completedToday').textContent = habits.filter(h => h.done).length;
    document.getElementById('bestStreak').textContent = habits.reduce((max, h) => Math.max(max, h.streak), 0);
}

// ===== إضافة / تعديل / حذف =====
function openModal(habit = null) {
    const modal = document.getElementById('habitModal');
    document.getElementById('modalTitle').textContent = habit ? '✏️ تعديل العادة' : '➕ إضافة عادة جديدة';
    document.getElementById('habitNameInput').value = habit ? habit.name : '';
    document.getElementById('habitCategory').value = habit ? habit.category : 'يومية';
    document.getElementById('habitTarget').value = habit ? habit.target : 1;
    editingId = habit ? habit.id : null;
    modal.classList.add('show');
}

function closeModal() {
    document.getElementById('habitModal').classList.remove('show');
    editingId = null;
}

function saveHabit() {
    const name = document.getElementById('habitNameInput').value.trim();
    const category = document.getElementById('habitCategory').value;
    const target = parseInt(document.getElementById('habitTarget').value) || 1;

    if (!name) {
        showToast('❌ الرجاء إدخال اسم العادة', 'error');
        return;
    }

    if (editingId) {
        const index = habits.findIndex(h => h.id === editingId);
        if (index !== -1) {
            habits[index].name = name;
            habits[index].category = category;
            habits[index].target = target;
            showToast('✅ تم التعديل بنجاح', 'success');
        }
    } else {
        habits.push({
            id: Date.now(),
            name,
            category,
            target,
            progress: 0,
            streak: 0,
            done: false
        });
        showToast('🎉 تم إضافة العادة', 'success');
    }

    saveData();
    renderHabits();
    closeModal();
}

function deleteHabit(id) {
    if (confirm('هل أنت متأكد من الحذف؟')) {
        habits = habits.filter(h => h.id !== id);
        saveData();
        renderHabits();
        showToast('🗑️ تم الحذف', 'success');
    }
}

function editHabit(id) {
    const habit = habits.find(h => h.id === id);
    if (habit) openModal(habit);
}

function toggleHabit(id) {
    const habit = habits.find(h => h.id === id);
    if (habit) {
        habit.done = !habit.done;
        habit.progress = habit.done ? Math.min(100, habit.progress + 10) : Math.max(0, habit.progress - 10);
        habit.streak = habit.done ? habit.streak + 1 : Math.max(0, habit.streak - 1);
        saveData();
        renderHabits();
        showToast(habit.done ? '✅ أحسنت! استمر 💪' : '⏳ لا بأس، غداً أفضل', 'success');
    }
}

// ===== عرض الصحة =====
function renderHealth() {
    document.getElementById('healthGrid').innerHTML = healthData.map(item => `
        <div class="health-card">
            <div class="icon">${item.icon}</div>
            <h3>${item.name}</h3>
            <p>الهدف: ${item.target} ${item.unit}</p>
            <div class="value">${item.value}</div>
        </div>
    `).join('');
}

// ===== عرض التقارير =====
function renderReports() {
    const total = habits.length;
    const completed = habits.filter(h => h.done).length;
    const avgProgress = total > 0 ? Math.round(habits.reduce((s, h) => s + h.progress, 0) / total) : 0;
    const bestStreak = habits.reduce((max, h) => Math.max(max, h.streak), 0);

    document.getElementById('reportGrid').innerHTML = `
        <div class="report-card"><div class="number">${total}</div><div class="label">إجمالي العادات</div></div>
        <div class="report-card"><div class="number">${completed}</div><div class="label">منجزة اليوم</div></div>
        <div class="report-card"><div class="number">${avgProgress}%</div><div class="label">متوسط التقدم</div></div>
        <div class="report-card"><div class="number">${bestStreak}</div><div class="label">أطول سلسلة</div></div>
    `;

    const days = ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];
    const data = [65, 45, 80, 70, 90, 55, 75];
    document.getElementById('chartBars').innerHTML = data.map((v, i) => `
        <div class="chart-bar">
            <div class="bar" style="height:${v * 2}px;"></div>
            <span class="label">${days[i]}</span>
            <span style="font-size:11px;font-weight:600;color:#e94560;">${v}%</span>
        </div>
    `).join('');
}

// ===== التنبيه =====
function showToast(msg, type = 'success') {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.className = 'toast show ' + type;
    clearTimeout(t._timeout);
    t._timeout = setTimeout(() => t.classList.remove('show'), 2500);
}

// ===== التنقل =====
function navigate(page) {
    document.querySelectorAll('.nav-links a').forEach(l => l.classList.toggle('active', l.dataset.page === page));
    
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    
    if (page === 'home' || page === 'habits') {
        document.getElementById('tab-daily').classList.add('active');
        document.querySelector('.tabs').style.display = 'flex';
        renderHabits();
    } else if (page === 'health') {
        document.getElementById('tab-health').classList.add('active');
        document.querySelector('.tabs').style.display = 'flex';
        document.querySelectorAll('.tabs button').forEach(b => b.classList.toggle('active', b.dataset.tab === 'health'));
        renderHealth();
    } else if (page === 'reports') {
        document.getElementById('tab-reports').classList.add('active');
        document.querySelector('.tabs').style.display = 'none';
        renderReports();
    }
}

// ===== الأحداث =====
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    renderHabits();
    renderHealth();
    renderReports();

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            navigate(this.dataset.page);
        });
    });

    document.querySelectorAll('.tabs button').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tabs button').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            if (this.dataset.tab === 'daily') {
                document.getElementById('tab-daily').classList.add('active');
                document.getElementById('tab-health').classList.remove('active');
                renderHabits();
            } else {
                document.getElementById('tab-health').classList.add('active');
                document.getElementById('tab-daily').classList.remove('active');
                renderHealth();
            }
        });
    });

    document.getElementById('habitModal').addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });
});