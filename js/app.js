const app = document.getElementById('app');
let coursesData = [];
let categoriesData = [];
let deferredInstallPrompt = null;

// ================================
// تأمين النصوص
// ================================
function esc(s) {
    if (!s) return '';
    return String(s).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m]));
}

// ================================
// تحديد مسار التطبيق
// ================================
function getBasePath() {
    let path = window.location.pathname;
    return path.substring(0, path.lastIndexOf('/') + 1);
}

// ================================
// دوال وهمية (Stubs) لضمان عدم ظهور خطأ من hero-ui.js
// ================================
function getMyCourses() {
    return [];
}
function saveMyCourse(courseId) {
    // لا تفعل شيئاً
}
function isMyCourse(courseId) {
    return false;
}

// ================================
// تحميل بيانات الدورات
// ================================
async function loadCourses() {
    try {
        const base = getBasePath();
        const response = await fetch(base + 'courses.json', { cache: 'no-store' });
        if (!response.ok) throw new Error('تعذر تحميل بيانات الدورات');
        const data = await response.json();
        coursesData = data.courses || [];
        categoriesData = data.categories || [];
        route();
    } catch (e) {
        app.innerHTML = `<div style="padding:40px;text-align:center;">❌ ${esc(e.message)}</div>`;
    }
}

// ================================
// الصفحة الرئيسية (تُستبدل بواجهة hero-ui.js)
// ================================
function renderAcademy() {
    app.innerHTML = `<div style="min-height:100vh;background:#f8fafc;padding:25px 15px;">
        <div style="max-width:850px;margin:auto;">
            <div style="text-align:center;padding:25px;">
                <div style="font-size:58px;">🎓</div>
                <h1 style="color:#172033;">أكاديمية هيرو</h1>
                <p style="color:#64748b;">تعلم بطريقة أبسط وأذكى</p>
            </div>
            <button onclick="location.hash='#courses'" style="width:100%;background:#fff;border:0;border-radius:18px;padding:22px;margin-bottom:15px;text-align:right;cursor:pointer;display:flex;align-items:center;gap:18px;">
                <div style="width:58px;height:58px;border-radius:15px;background:#eff6ff;display:flex;align-items:center;justify-content:center;font-size:30px;">📚</div>
                <div style="flex:1;"><div style="font-weight:bold;font-size:19px;">الدورات المتاحة</div><div style="color:#64748b;font-size:14px;">تصفح جميع التصنيفات</div></div>
            </button>
            <button onclick="location.hash='#about'" style="width:100%;background:#fff;border:0;border-radius:18px;padding:22px;margin-bottom:25px;text-align:right;cursor:pointer;display:flex;align-items:center;gap:18px;">
                <div style="width:58px;height:58px;border-radius:15px;background:#f1f5f9;display:flex;align-items:center;justify-content:center;font-size:30px;">ℹ️</div>
                <div style="flex:1;"><div style="font-weight:bold;font-size:19px;">عن الأكاديمية</div><div style="color:#64748b;font-size:14px;">تعرف علينا</div></div>
            </button>
        </div>
    </div>`;
    setupInstallButton();
}

// ================================
// عرض التصنيفات فقط (صفحة الدورات)
// ================================
function renderHome() {
    let html = `<div style="max-width:900px;margin:auto;padding:20px;">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:20px;">
            <button onclick="location.hash='#home'" style="border:0;background:#fff;width:42px;height:42px;border-radius:10px;cursor:pointer;font-size:22px;">←</button>
            <h1 style="font-size:25px;margin:0;">📚 التصنيفات</h1>
        </div>`;

    if (!categoriesData.length) {
        html += `<div style="text-align:center;padding:40px;background:#fff;border-radius:12px;">لا توجد تصنيفات متاحة</div>`;
    } else {
        html += `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:15px;">`;
        categoriesData.forEach(cat => {
            // حساب عدد الدورات في هذا التصنيف
            const catCount = coursesData.filter(c => c.category === cat.id && c.visible !== false).length;
            html += `
                <div onclick="location.hash='#category/${cat.id}'" style="background:#fff;border:1px solid #e0e0e0;border-radius:16px;padding:24px;cursor:pointer;transition:0.3s;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;">
                    <div style="font-size:50px;margin-bottom:12px;">${esc(cat.icon || '📚')}</div>
                    <h3 style="margin:0 0 8px;">${esc(cat.title)}</h3>
                    <div style="color:#64748b;font-size:13px;">${catCount} دورة</div>
                    <div style="margin-top:12px;color:#2563eb;font-size:14px;font-weight:bold;">عرض الدورات ←</div>
                </div>
            `;
        });
        html += `</div>`;
    }
    html += `</div>`;
    app.innerHTML = html;
    setupInstallButton();
}

// ================================
// عرض دورات تصنيف معين
// ================================
function renderCategoryCourses(categoryId) {
    const cat = categoriesData.find(c => c.id === categoryId);
    if (!cat) {
        app.innerHTML = `<div style="text-align:center;padding:40px;">التصنيف غير موجود</div>`;
        return;
    }
    const courses = coursesData.filter(c => c.category === categoryId && c.visible !== false);

    let html = `<div style="max-width:900px;margin:auto;padding:20px;">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:20px;">
            <button onclick="location.hash='#courses'" style="border:0;background:#fff;width:42px;height:42px;border-radius:10px;cursor:pointer;font-size:22px;">←</button>
            <h1 style="font-size:25px;margin:0;">${esc(cat.icon || '')} ${esc(cat.title)}</h1>
        </div>
        <div style="font-size:14px;color:#64748b;margin-bottom:15px;">عدد الدورات: ${courses.length}</div>`;

    if (!courses.length) {
        html += `<div style="text-align:center;padding:40px;background:#fff;border-radius:12px;">لا توجد دورات في هذا التصنيف</div>`;
    } else {
        html += `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:15px;">`;
        courses.forEach(course => {
            const url = course.drive_url || course.url || '';
            const features = course.features || [];
            html += `
                <div style="background:#fff;border:1px solid #e0e0e0;border-radius:12px;padding:20px;display:flex;flex-direction:column;justify-content:space-between;">
                    <div>
                        <div style="font-size:36px;">${esc(course.icon)}</div>
                        <h3>${esc(course.title)}</h3>
                        <p style="color:#666;font-size:14px;">${esc(course.description || '')}</p>
                        <ul style="color:#475569;font-size:13px;padding-left:20px;">${features.map(f => `<li>${esc(f)}</li>`).join('')}</ul>
                    </div>
                    <a href="${esc(url)}" target="_blank" rel="noopener" style="display:block;text-align:center;background:#2563eb;color:#fff;text-decoration:none;padding:10px;border-radius:8px;font-weight:bold;margin-top:15px;">📥 تحميل الدورة</a>
                </div>
            `;
        });
        html += `</div>`;
    }
    html += `</div>`;
    app.innerHTML = html;
    setupInstallButton();
}

// ================================
// عن الأكاديمية (تُستبدل بواجهة hero-ui.js)
// ================================
function renderAbout() {
    app.innerHTML = `<div style="max-width:700px;margin:auto;padding:25px;text-align:center;">
        <button onclick="location.hash='#home'" style="border:0;background:#fff;padding:9px 18px;border-radius:9px;cursor:pointer;margin-bottom:25px;">← الرئيسية</button>
        <div style="font-size:65px;">🎓</div><h1>أكاديمية هيرو</h1>
        <p style="color:#64748b;">منصة تعليمية تساعدك على الوصول إلى الدورات.</p>
    </div>`;
}

// ================================
// التوجيه
// ================================
function route() {
    const h = location.hash.slice(1) || 'home';
    if (h === 'courses') renderHome();
    else if (h.startsWith('category/')) {
        const catId = h.split('/')[1];
        renderCategoryCourses(catId);
    }
    else if (h === 'about') renderAbout();
    else renderAcademy();
}

// ================================
// زر التثبيت
// ================================
window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredInstallPrompt = e;
    setupInstallButton();
});

function setupInstallButton() {
    const btn = document.getElementById('installAppBtn');
    if (!btn) return;
    if (deferredInstallPrompt) {
        btn.style.display = 'inline-block';
        btn.onclick = async () => {
            deferredInstallPrompt.prompt();
            await deferredInstallPrompt.userChoice;
            deferredInstallPrompt = null;
        };
    }
}

// ================================
// التشغيل
// ================================
window.addEventListener('hashchange', route);
document.addEventListener('DOMContentLoaded', loadCourses);
