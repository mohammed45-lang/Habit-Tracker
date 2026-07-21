document.addEventListener('DOMContentLoaded', () => {
    const habitForm = document.getElementById('habitForm');
    const habitInput = document.getElementById('habitInput');
    const habitCategory = document.getElementById('habitCategory');
    const habitsContainer = document.getElementById('habitsContainer');
    const emptyState = document.getElementById('emptyState');
    const totalHabitsEl = document.getElementById('totalHabits');
    const heroTotalHabitsEl = document.getElementById('heroTotalHabits');
    const completedTodayEl = document.getElementById('completedToday');
    const currentDateEl = document.getElementById('currentDate');

    // Date formatting in Arabic
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    currentDateEl.textContent = new Date().toLocaleDateString('ar-EG', options);

    const todayKey = new Date().toISOString().split('T')[0];
    let habits = JSON.parse(localStorage.getItem('habits_app_v2_data')) || [];

    function saveAndRender() {
        localStorage.setItem('habits_app_v2_data', JSON.stringify(habits));
        renderHabits();
        updateStats();
    }

    function renderHabits() {
        habitsContainer.innerHTML = '';
        
        if (habits.length === 0) {
            emptyState.style.display = 'block';
            habitsContainer.appendChild(emptyState);
            return;
        }

        emptyState.style.display = 'none';

        habits.forEach((habit, index) => {
            const isCompletedToday = habit.completedDates && habit.completedDates.includes(todayKey);

            const item = document.createElement('div');
            item.className = `habit-item ${isCompletedToday ? 'completed' : ''}`;
            
            item.innerHTML = `
                <div class="habit-info-group">
                    <input type="checkbox" class="habit-checkbox" ${isCompletedToday ? 'checked' : ''} data-index="${index}">
                    <div class="habit-details">
                        <h4>${escapeHtml(habit.name)}</h4>
                        <span class="habit-tag">${escapeHtml(habit.category)}</span>
                    </div>
                </div>
                <button class="delete-btn" data-index="${index}" title="حذف العادة">🗑️</button>
            `;

            habitsContainer.appendChild(item);
        });

        // Event listeners
        document.querySelectorAll('.habit-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const idx = e.target.getAttribute('data-index');
                toggleHabitCompletion(idx);
            });
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = e.target.getAttribute('data-index');
                deleteHabit(idx);
            });
        });
    }

    function toggleHabitCompletion(index) {
        if (!habits[index].completedDates) {
            habits[index].completedDates = [];
        }

        const dateIndex = habits[index].completedDates.indexOf(todayKey);
        if (dateIndex > -1) {
            habits[index].completedDates.splice(dateIndex, 1);
        } else {
            habits[index].completedDates.push(todayKey);
        }

        saveAndRender();
    }

    function deleteHabItem(index) {
        habits.splice(index, 1);
        saveAndRender();
    }

    // Assign delete handler properly
    window.deleteHabit = function(index) {
        habits.splice(index, 1);
        saveAndRender();
    };

    function updateStats() {
        const total = habits.length;
        totalHabitsEl.textContent = total;
        heroTotalHabitsEl.textContent = total;
        
        const completedCount = habits.filter(habit => 
            habit.completedDates && habit.completedDates.includes(todayKey)
        ).length;

        completedTodayEl.textContent = completedCount;
    }

    habitForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = habitInput.value.trim();
        const category = habitCategory.value;

        if (name) {
            habits.push({
                name: name,
                category: category,
                completedDates: []
            });
            habitInput.value = '';
            saveAndRender();
        }
    });

    function escapeHtml(text) {
        const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    renderHabits();
    updateStats();
});
