const app = document.getElementById('app');

let coursesData = [];
let categoriesData = [];

let deferredInstallPrompt = null;

// ================================
// تأمين النصوص
// ================================
function esc(s) {
    if (!s) return '';
    return String(s).replace(/[&<>"']/g, m => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    }[m]));
}

// ================================
// تحديد مسار التطبيق
// ================================
function getBasePath() {
    let path = window.location.pathname;
    return path.substring(0, path.lastIndexOf('/') + 1);
}

// ================================
// الدورات التي بدأ المستخدم تجربتها
// (أعدنا هذه الدوال لاستخدامها في نقاط أخرى من الكود الأصلي)
// ================================
function getMyCourses() {
    try {
        return JSON.parse(localStorage.getItem('heroMyCourses') || '[]');
    } catch (e) {
        return [];
    }
}

function saveMyCourse(courseId) {
    let myCourses = getMyCourses();
    courseId = Number(courseId);
    if (!myCourses.includes(courseId)) {
        myCourses.push(courseId);
        localStorage.setItem('heroMyCourses', JSON.stringify(myCourses));
    }
}

function isMyCourse(courseId) {
    return getMyCourses().includes(Number(courseId));
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
        app.innerHTML = `<div class="empty" style="padding:40px;text-align:center;">❌ خطأ في تحميل البيانات: ${esc(e.message)}</div>`;
    }
}

// ================================
// الواجهة الرئيسية للأكاديمية
// ================================
function renderAcademy() {
    app.innerHTML = `
        <div style="min-height:100vh; background:#f8fafc; box-sizing:border-box; padding:25px 15px 35px;">
            <div style="max-width:850px; margin:auto;">
                <div style="text-align:center; padding:25px 15px 20px;">
                    <div style="font-size:58px; margin-bottom:8px;">🎓</div>
                    <h1 style="margin:0; font-size:30px; color:#172033;">أكاديمية هيرو</h1>
                    <p style="margin:10px 0 0; color:#64748b; font-size:15px;">تعلم بطريقة أبسط وأذكى</p>
                </div>

                <!-- بطاقة الدورات -->
                <button onclick="location.hash='#courses'" style="width:100%; border:0; background:#fff; border-radius:18px; padding:22px; margin-bottom:15px; text-align:right; cursor:pointer; box-shadow:0 3px 15px rgba(0,0,0,.07); display:flex; align-items:center; gap:18px;">
                    <div style="width:58px; height:58px; border-radius:15px; background:#eff6ff; display:flex; align-items:center; justify-content:center; font-size:30px; flex-shrink:0;">📚</div>
                    <div style="flex:1;">
                        <div style="font-size:19px; font-weight:bold; color:#172033;">الدورات المتاحة</div>
                        <div style="color:#64748b; margin-top:5px; font-size:14px;">تصفح جميع الدورات والمواد التعليمية</div>
                    </div>
                    <div style="font-size:25px; color:#94a3b8;">‹</div>
                </button>

                <!-- عن الأكاديمية -->
                <button onclick="location.hash='#about'" style="width:100%; border:0; background:#fff; border-radius:18px; padding:22px; margin-bottom:25px; text-align:right; cursor:pointer; box-shadow:0 3px 15px rgba(0,0,0,.07); display:flex; align-items:center; gap:18px;">
                    <div style="width:58px; height:58px; border-radius:15px; background:#f1f5f9; display:flex; align-items:center; justify-content:center; font-size:30px; flex-shrink:0;">ℹ️</div>
                    <div style="flex:1;">
                        <div style="font-size:19px; font-weight:bold; color:#172033;">عن الأكاديمية</div>
                        <div style="color:#64748b; margin-top:5px; font-size:14px;">تعرف على أكاديمية هيرو</div>
                    </div>
                    <div style="font-size:25px; color:#94a3b8;">‹</div>
                </button>

                <!-- شريط التثبيت -->
                <div style="margin:20px 0; padding:14px 16px; border-radius:14px; background:#eff6ff; border:1px solid #bfdbfe; overflow:hidden;">
                    <div style="white-space:nowrap; animation:heroInstallMove 18s linear infinite; font-weight:bold; color:#1e40af;">📱 ثبّت أكاديمية هيرو على جهازك — أضفها إلى الشاشة الرئيسية للوصول السريع إلى دوراتك</div>
                    <div style="text-align:center; margin-top:10px;">
                        <button id="installAppBtn" style="display:none; background:#2563eb; color:#fff; border:0; padding:9px 22px; border-radius:8px; cursor:pointer; font-weight:bold;">📲 تثبيت التطبيق</button>
                    </div>
                </div>
                <style>@keyframes heroInstallMove { from { transform:translateX(100%); } to { transform:translateX(-100%); } }</style>
            </div>
        </div>
    `;
    setupInstallButton();
}

// ================================
// صفحة الدورات المتاحة (بطاقات جديدة)
// ================================
function renderHome() {
    let html = `
        <div style="max-width:900px; margin:auto; padding:20px;">
            <div style="display:flex; align-items:center; gap:10px; margin-bottom:20px;">
                <button onclick="location.hash='#home'" style="border:0; background:#fff; width:42px; height:42px; border-radius:10px; cursor:pointer; font-size:22px;">←</button>
                <h1 style="margin:0; font-size:25px;">📚 الدورات المتاحة</h1>
            </div>
            <div style="margin-bottom:25px; padding:14px 16px; border-radius:14px; background:#eff6ff; border:1px solid #bfdbfe; overflow:hidden;">
                <div style="white-space:nowrap; animation:heroInstallMove 18s linear infinite; font-weight:bold; color:#1e40af;">📱 ثبّت أكاديمية هيرو على جهازك — أضفها إلى الشاشة الرئيسية للوصول السريع إلى دوراتك</div>
                <div style="text-align:center; margin-top:10px;">
                    <button id="installAppBtn" style="display:none; background:#2563eb; color:#fff; border:0; padding:9px 22px; border-radius:8px; cursor:pointer; font-weight:bold;">📲 تثبيت التطبيق</button>
                </div>
            </div>
            <style>@keyframes heroInstallMove { from { transform:translateX(100%); } to { transform:translateX(-100%); } }</style>
    `;

    const visibleCourses = coursesData.filter(course => course.visible !== false);

    if (categoriesData.length) {
        categoriesData.forEach(category => {
            const categoryCourses = visibleCourses.filter(course => course.category === category.id);
            if (!categoryCourses.length) return;
            html += `
                <section style="margin-bottom:35px;">
                    <h2 style="margin-bottom:15px; padding-bottom:8px; border-bottom:2px solid #e5e7eb;">
                        ${esc(category.icon || '📚')} ${esc(category.title)}
                    </h2>
                    <div style="display:grid; grid-template-columns: repeat(auto-fit,minmax(250px,1fr)); gap:15px;">
            `;
            categoryCourses.forEach(course => {
                const features = course.features || ['شرح مبسط', 'أمثلة تطبيقية', 'ملخصات جاهزة'];
                const downloadUrl = course.drive_url || course.url;
                html += `
                    <div style="display:flex; flex-direction:column; justify-content:space-between; border:1px solid #e0e0e0; border-radius:12px; padding:20px; background:#fff; box-shadow:0 2px 8px rgba(0,0,0,.05);">
                        <div>
                            <div style="font-size:36px; margin-bottom:10px;">${esc(course.icon)}</div>
                            <h3 style="margin-top:0;">${esc(course.title)}</h3>
                            <p style="color:#666; font-size:14px; line-height:1.6;">${esc(course.description)}</p>
                            
                            <!-- عرض المميزات -->
                            <ul style="padding-left:20px; margin-top:10px; color:#475569; font-size:13px;">
                                ${features.map(f => `<li style="margin-bottom:5px;">${esc(f)}</li>`).join('')}
                            </ul>
                        </div>
                        <div style="margin-top:15px;">
                            <a href="${esc(downloadUrl)}" target="_blank" rel="noopener" style="display:block; text-align:center; background:#2563eb; color:#fff; text-decoration:none; padding:10px; border-radius:8px; font-weight:bold;">
                                📥 تحميل الدورة
                            </a>
                        </div>
                    </div>
                `;
            });
            html += `</div></section>`;
        });
    } else {
        html += `<div style="display:grid; grid-template-columns: repeat(auto-fit,minmax(250px,1fr)); gap:15px;">`;
        visibleCourses.forEach(course => {
            const features = course.features || ['شرح مبسط', 'أمثلة تطبيقية', 'ملخصات جاهزة'];
            const downloadUrl = course.drive_url || course.url;
            html += `
                <div style="background:#fff; border:1px solid #e0e0e0; border-radius:12px; padding:20px;">
                    <div style="font-size:36px;">${esc(course.icon)}</div>
                    <h3>${esc(course.title)}</h3>
                    <p>${esc(course.description)}</p>
                    <ul style="padding-left:20px; margin-top:10px; color:#475569; font-size:13px;">
                        ${features.map(f => `<li style="margin-bottom:5px;">${esc(f)}</li>`).join('')}
                    </ul>
                    <a href="${esc(downloadUrl)}" target="_blank" rel="noopener" style="display:block; text-align:center; background:#2563eb; color:#fff; text-decoration:none; padding:10px; border-radius:8px; font-weight:bold; margin-top:15px;">
                        📥 تحميل الدورة
                    </a>
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
// عن الأكاديمية
// ================================
function renderAbout() {
    app.innerHTML = `
        <div style="max-width:700px; margin:auto; padding:25px 20px; text-align:center;">
            <button onclick="location.hash='#home'" style="border:0; background:#fff; padding:9px 18px; border-radius:9px; cursor:pointer; margin-bottom:25px;">← الرئيسية</button>
            <div style="font-size:65px;">🎓</div>
            <h1>أكاديمية هيرو</h1>
            <p style="color:#64748b; line-height:1.9; font-size:16px;">منصة تعليمية تساعدك على الوصول إلى الدورات والمواد التعليمية بطريقة بسيطة ومنظمة.</p>
            <div style="display:flex; flex-wrap:wrap; justify-content:center; gap:10px; margin-top:25px;">
                <a href="https://Academy.hero1.vip" target="_blank" rel="noopener" style="display:inline-block; padding:11px 20px; border-radius:10px; background:#2563eb; color:#fff; text-decoration:none; font-weight:bold;">🎓 موقع الأكاديمية</a>
                <a href="https://web.facebook.com/Heropwa" target="_blank" rel="noopener" style="display:inline-block; padding:11px 20px; border-radius:10px; background:#1877f2; color:#fff; text-decoration:none; font-weight:bold;">📘 فيسبوك</a>
                <a href="https://t.me/Herocourses" target="_blank" rel="noopener" style="display:inline-block; padding:11px 20px; border-radius:10px; background:#1877f2; color:#fff; text-decoration:none; font-weight:bold;">📘 تيليجرام</a>
                <a href="https://wa.me/249915886600" target="_blank" rel="noopener" style="display:inline-block; padding:11px 20px; border-radius:10px; background:#1877f2; color:#fff; text-decoration:none; font-weight:bold;">📘 واتساب</a>
                <a href="https://t.me/+kJNKpuOP-jQwZTM0" target="_blank" rel="noopener" style="display:inline-block; padding:11px 20px; border-radius:10px; background:#1877f2; color:#fff; text-decoration:none; font-weight:bold;">📘 قناة التليجرام</a>
                <a href="https://www.youtube.com/@Hero1vip" target="_blank" rel="noopener" style="display:inline-block; padding:11px 20px; border-radius:10px; background:#1877f2; color:#fff; text-decoration:none; font-weight:bold;">📘 اليوتيوب</a>
            </div>
        </div>
    `;
}

// ================================
// التوجيه
// ================================
function route() {
    const hash = location.hash.slice(1) || 'home';
    if (hash === 'courses') {
        renderHome();
    } else if (hash === 'about') {
        renderAbout();
    } else {
        renderAcademy();
    }
}

// ================================
// زر تثبيت التطبيق
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
            const result = await deferredInstallPrompt.userChoice;
            if (result.outcome === 'accepted') {
                btn.style.display = 'none';
            }
            deferredInstallPrompt = null;
        };
    }
}

window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    const btn = document.getElementById('installAppBtn');
    if (btn) btn.style.display = 'none';
});

// ================================
// التشغيل
// ================================
window.addEventListener('hashchange', route);
document.addEventListener('DOMContentLoaded', loadCourses);
