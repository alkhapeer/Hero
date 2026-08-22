const app = document.getElementById('app');
let coursesData = [];
let categoriesData = [];
let deferredInstallPrompt = null;
// تأمين النصوص
function esc(s) {
    if (!s) return '';
    return String(s).replace(/[&<>"']/g, m => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    }[m]));
}

// تحديد مسار التطبيق الحالي (يدعم المجلدات الفرعية مثل /Hero/)
function getBasePath() {
    let path = window.location.pathname;
    return path.substring(0, path.lastIndexOf('/') + 1);
}

// تحميل بيانات الدورات
async function loadCourses() {
    try {
        const base = getBasePath();
        const response = await fetch(base + 'courses.json', { cache: 'no-store' });
        if (!response.ok) throw new Error('تعذر تحميل بيانات الدورات');
        const data = await response.json();
        coursesData = data.courses || [];
        categoriesData = data.categories || [];
        route();// عرض الصفحة المناسبة بعد التحميل
    } catch (e) {
        app.innerHTML = `<div class="empty" style="padding:40px;">❌ خطأ في تحميل البيانات: ${esc(e.message)}</div>`;
    }
}

// الصفحة الرئيسية: قائمة الدورات
function renderHome() {
    let html = `
        <div style="max-width:900px;margin:auto;padding:20px;">

            <div style="
                margin-bottom:25px;
                padding:14px 16px;
                border-radius:14px;
                background:#eff6ff;
                border:1px solid #bfdbfe;
                overflow:hidden;
            ">
                <div style="
                    white-space:nowrap;
                    animation:heroInstallMove 18s linear infinite;
                    font-weight:bold;
                    color:#1e40af;
                ">
                    📱 ثبّت أكاديمية هيرو على جهازك — أضفها إلى الشاشة الرئيسية للوصول السريع إلى دوراتك
                </div>

                <div style="text-align:center;margin-top:10px;">
                    <button id="installAppBtn"
                        style="
                            display:none;
                            background:#2563eb;
                            color:#fff;
                            border:0;
                            padding:9px 22px;
                            border-radius:8px;
                            cursor:pointer;
                            font-weight:bold;
                        ">
                        📲 تثبيت التطبيق
                    </button>
                </div>
            </div>

            <style>
                @keyframes heroInstallMove {
                    from { transform:translateX(100%); }
                    to { transform:translateX(-100%); }
                }
            </style>

            <h1 style="text-align:center;margin-bottom:30px;">
                📚 الدورات المتاحة
            </h1>
    `;

    const visibleCourses = coursesData.filter(c => c.visible !== false);

    categoriesData.forEach(category => {

        const categoryCourses = visibleCourses.filter(
            course => course.category === category.id
        );

        if (!categoryCourses.length) return;

        html += `
            <section style="margin-bottom:35px;">

                <h2 style="
                    margin-bottom:15px;
                    padding-bottom:8px;
                    border-bottom:2px solid #e5e7eb;
                ">
                    ${esc(category.icon)} ${esc(category.title)}
                </h2>

                <div style="
                    display:grid;
                    grid-template-columns:repeat(auto-fit,minmax(250px,1fr));
                    gap:15px;
                ">
        `;

        categoryCourses.forEach(course => {

            html += `
                <div class="card course"
                    style="
                        display:flex;
                        flex-direction:column;
                        justify-content:space-between;
                        border:1px solid #e0e0e0;
                        border-radius:12px;
                        padding:20px;
                        box-shadow:0 2px 8px rgba(0,0,0,0.05);
                        background:#fff;
                    ">

                    <div>
                        <div style="font-size:36px;margin-bottom:10px;">
                            ${esc(course.icon)}
                        </div>

                        <h3 style="margin-top:0;">
                            ${esc(course.title)}
                        </h3>

                        <p style="
                            color:#666;
                            font-size:14px;
                            line-height:1.6;
                        ">
                            ${esc(course.description)}
                        </p>
                    </div>

                    <div style="margin-top:15px;">
                        <a href="#course/${course.id}"
                            style="
                                display:block;
                                text-align:center;
                                background:#2563eb;
                                color:#fff;
                                text-decoration:none;
                                padding:10px;
                                border-radius:8px;
                                font-weight:bold;
                            ">
                            ▶ ابدأ التجربة
                        </a>
                    </div>

                </div>
            `;
        });

        html += `
                </div>
            </section>
        `;
    });

    html += `</div>`;

    app.innerHTML = html;

    setupInstallButton();
}

// صفحة الدورة (iframe كامل)
function renderCourse(course) {
    const base = getBasePath();
    const fullUrl = base + course.url;
    
    app.innerHTML = `
        <div style="position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:9999;background:#fff;">
            <div style="position:absolute;top:15px;right:15px;z-index:10000;">
                <button onclick="window.location.hash='#home'"
                        style="background:#fff;border:1px solid #ddd;padding:8px 20px;border-radius:8px;cursor:pointer;font-size:14px;font-weight:bold;color:#2563eb;box-shadow:0 2px 6px rgba(0,0,0,0.1);">
                    ✕ رجوع
                </button>
            </div>
            <iframe src="${esc(fullUrl)}" 
                    style="width:100%;height:100%;border:none;display:block;"
                    allowfullscreen>
            </iframe>
        </div>
    `;
}

// التوجيه الرئيسي
function route() {
    const hash = location.hash.slice(1) || 'home';
    
    if (hash.startsWith('course/')) {
        const id = parseInt(hash.split('/')[1]);
        const course = coursesData.find(c => c.id === id);
        if (course) {
            renderCourse(course);
        } else {
            app.innerHTML = `<div class="empty">⚠️ الدورة غير موجودة.</div>`;
        }
    } else {
        renderHome();
    }
}
window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredInstallPrompt = e;
    setupInstallButton();
});

function setupInstallButton() {
    const btn = document.getElementById('installAppBtn');

    if (!btn || !deferredInstallPrompt) return;

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

window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;

    const btn = document.getElementById('installAppBtn');

    if (btn) {
        btn.style.display = 'none';
    }
});
// تشغيل التطبيق
window.addEventListener('hashchange', route);
document.addEventListener('DOMContentLoaded', loadCourses);
