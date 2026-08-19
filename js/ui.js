// ============================================================
// UI Module - وظائف مساعدة للواجهة
// ============================================================

const UI = (() => {
    // عرض رسالة في عنصر محدد
    function showMessage(elementId, message, type = 'info') {
        const el = document.getElementById(elementId);
        if (!el) return;
        el.textContent = message;
        el.className = `message ${type}`;
        el.style.display = 'block';
    }

    // إخفاء رسالة
    function hideMessage(elementId) {
        const el = document.getElementById(elementId);
        if (!el) return;
        el.style.display = 'none';
    }

    // عرض نافذة منبثقة (مودال)
    function showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.style.display = 'flex';
    }

    function hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.style.display = 'none';
    }

    // تبديل الوضع الداكن
    function toggleTheme() {
        const body = document.body;
        body.classList.toggle('dark');
        const settings = Storage.getSettings();
        settings.theme = body.classList.contains('dark') ? 'dark' : 'light';
        Storage.setSettings(settings);
        updateThemeButton();
    }

    function updateThemeButton() {
        const btn = document.getElementById('theme-toggle');
        if (!btn) return;
        const isDark = document.body.classList.contains('dark');
        btn.textContent = isDark ? '☀️' : '🌙';
    }

    // تهيئة الثيم من الإعدادات
    function initTheme() {
        const settings = Storage.getSettings();
        if (settings.theme === 'dark') {
            document.body.classList.add('dark');
        }
        updateThemeButton();
    }

    // إنشاء بطاقة دورة/تطبيق
    function createCard(data, type = 'course') {
        const card = document.createElement('div');
        card.className = 'card';

        const isActivated = type === 'course' ? Activation.isActivated(data.id) : false;
        const hasTrial = type === 'course' ? Trial.hasActiveTrial(data.id) : false;

        let statusBadge = '';
        if (isActivated) {
            statusBadge = '<span class="badge success">✅ مفعل</span>';
        } else if (hasTrial) {
            statusBadge = '<span class="badge warning">🎁 تجربة</span>';
        }

        card.innerHTML = `
            <div class="card-header">
                <div class="icon">${data.icon || '📚'}</div>
                <h3>${data.title}</h3>
                ${statusBadge}
            </div>
            <div class="card-body">
                <p class="description">${data.description || ''}</p>
                <div class="meta">
                    ${data.subject ? `<span>📖 ${data.subject}</span>` : ''}
                    ${data.grade ? `<span>🎓 ${data.grade}</span>` : ''}
                    ${data.price ? `<span>💰 ${data.price}</span>` : ''}
                </div>
            </div>
            <div class="card-footer">
                ${type === 'course' ? renderCourseButtons(data, isActivated, hasTrial) : renderAppButtons(data)}
            </div>
        `;

        return card;
    }

    function renderCourseButtons(course, isActivated, hasTrial) {
        let buttons = '';

        if (isActivated) {
            buttons += `<button class="btn btn-success" data-action="open-course" data-id="${course.id}">📖 فتح الدورة</button>`;
        } else if (hasTrial) {
            buttons += `<button class="btn btn-warning" data-action="continue-trial" data-id="${course.id}">⏳ متابعة التجربة</button>`;
        } else {
            buttons += `<button class="btn btn-primary" data-action="start-trial" data-id="${course.id}">🎁 تجربة مجانية</button>`;
        }

        buttons += `<button class="btn btn-outline" data-action="buy-course" data-id="${course.id}">🛒 شراء</button>`;

        return buttons;
    }

    function renderAppButtons(app) {
        return `
            <button class="btn btn-primary" data-action="open-app" data-id="${app.id}">🚀 تجربة التطبيق</button>
            <button class="btn btn-outline" data-action="app-details" data-id="${app.id}">ℹ️ معرفة المزيد</button>
        `;
    }

    // عرض محتوى الدورة (داخل المشغل)
    function renderCourseContent(courseId, contentData, isTrial = false) {
        const container = document.getElementById('course-player');
        if (!container) return;

        let html = `
            <div class="course-player">
                <h2>${contentData.title || 'الدورة'}</h2>
                ${isTrial ? '<div class="trial-bar">🎁 تجربة مجانية <span class="timer" id="trial-timer"></span></div>' : ''}
                <div class="content-body">
        `;

        // عرض الأقسام
        if (contentData.content && Array.isArray(contentData.content)) {
            contentData.content.forEach(section => {
                html += `<div class="section">`;
                html += `<h3>${section.title || ''}</h3>`;
                if (section.type === 'text') {
                    html += `<p>${section.text || ''}</p>`;
                } else if (section.type === 'image' && section.src) {
                    html += `<img src="${section.src}" alt="${section.title || ''}" loading="lazy">`;
                } else if (section.type === 'audio' && section.src) {
                    html += `<audio controls><source src="${section.src}" type="audio/mpeg">متصفحك لا يدعم الصوت</audio>`;
                } else if (section.type === 'video' && section.src) {
                    html += `<video controls><source src="${section.src}" type="video/mp4">متصفحك لا يدعم الفيديو</video>`;
                } else if (section.type === 'list' && section.items) {
                    html += `<ul>${section.items.map(item => `<li>${item}</li>`).join('')}</ul>`;
                }
                html += `</div>`;
            });
        }

        html += `
                </div>
            </div>
        `;

        container.innerHTML = html;

        // بدء عداد التجربة إذا كانت تجربة
        if (isTrial) {
            Trial.updateTrialUI(courseId, 'trial-timer');
        }

        return container;
    }

    // واجهة عامة
    return {
        showMessage,
        hideMessage,
        showModal,
        hideModal,
        toggleTheme,
        initTheme,
        createCard,
        renderCourseContent
    };
})();

window.UI = UI;