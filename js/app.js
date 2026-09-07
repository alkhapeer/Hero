const app = document.getElementById('app');
let coursesData = [];
let categoriesData = [];
let helperData = { categories: [], items: [] };
let deferredInstallPrompt = null;

function esc(s) {
    if (!s) return '';
    return String(s).replace(/[&<>"']/g, m => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    }[m]));
}

function getBasePath() {
    let path = window.location.pathname;
    return path.substring(0, path.lastIndexOf('/') + 1);
}

function getMyCourses() { return []; }
function saveMyCourse(courseId) { /* لا تفعل شيئاً */ }
function isMyCourse(courseId) { return false; }

async function loadCourses() {
    try {
        const base = getBasePath();
        const response = await fetch(base + 'courses.json', { cache: 'no-store' });
        if (!response.ok) throw new Error('تعذر تحميل بيانات الدورات');
        const data = await response.json();
        coursesData = data.courses || [];
        categoriesData = data.categories || [];
        helperData = data.helper || { categories: [], items: [] };
        route();
    } catch (e) {
        app.innerHTML = `<div style="padding:40px;text-align:center;">❌ ${esc(e.message)}</div>`;
    }
}

// زر التثبيت
function setupInstallButton() {
    const btn = document.getElementById('installAppBtn');
    if (!btn) return;
    btn.style.display = 'inline-block';
    btn.onclick = async () => {
        if (deferredInstallPrompt) {
            deferredInstallPrompt.prompt();
            const result = await deferredInstallPrompt.userChoice;
            if (result.outcome === 'accepted') {
                btn.style.display = 'none';
            }
            deferredInstallPrompt = null;
        } else {
            alert('لإضافة التطبيق إلى شاشتك الرئيسية، افتح قائمة المتصفح واختر "إضافة إلى الشاشة الرئيسية".');
        }
    };
}

window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredInstallPrompt = e;
    setupInstallButton();
});

// دالة مساعدة لإضافة زر التثبيت في أي صفحة
function attachInstallButton(html) {
    return html + `<div style="text-align:center; margin-top:20px;">
        <button id="installAppBtn" style="background:#2563eb;color:#fff;border:0;padding:12px 28px;border-radius:50px;font-weight:bold;cursor:pointer;display:none;">
            📲 تثبيت تطبيق Hero
        </button>
    </div>`;
}

// عرض التصنيفات (الدورات)
function renderHome() {
    let html = `<div style="max-width:900px;margin:auto;padding:20px;">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:20px;">
            <button onclick="location.hash='#home'" style="border:0;background:#fff;width:42px;height:42px;border-radius:10px;cursor:pointer;font-size:22px;">←</button>
            <h1 style="font-size:25px;margin:0;color:#172033;">📚 التصنيفات</h1>
        </div>`;
    if (!categoriesData.length) {
        html += `<div style="text-align:center;padding:40px;background:#fff;border-radius:12px;color:#64748b;">لا توجد تصنيفات متاحة</div>`;
    } else {
        html += `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:15px;">`;
        categoriesData.forEach(cat => {
            const catCount = coursesData.filter(c => c.category === cat.id && c.visible !== false).length;
            html += `
                <div onclick="location.hash='#category/${cat.id}'" style="background:#fff;border:1px solid #e0e0e0;border-radius:16px;padding:24px;cursor:pointer;transition:0.3s;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;">
                    <div style="font-size:50px;margin-bottom:12px;">${esc(cat.icon || '📚')}</div>
                    <h3 style="margin:0 0 8px;color:#172033;">${esc(cat.title)}</h3>
                    <div style="color:#64748b;font-size:13px;">${catCount} دورة</div>
                    <div style="margin-top:12px;color:#2563eb;font-size:14px;font-weight:bold;">عرض الدورات ←</div>
                </div>
            `;
        });
        html += `</div>`;
    }
    html += `</div>`;
    // إضافة القائمة السفلية
    html += renderNav('courses');
    app.innerHTML = attachInstallButton(html);
    setupInstallButton();
}

// عرض دورات تصنيف معين
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
            <h1 style="font-size:25px;margin:0;color:#172033;">${esc(cat.icon || '')} ${esc(cat.title)}</h1>
        </div>
        <div style="font-size:14px;color:#64748b;margin-bottom:15px;">عدد الدورات: ${courses.length}</div>`;
    if (!courses.length) {
        html += `<div style="text-align:center;padding:40px;background:#fff;border-radius:12px;color:#64748b;">لا توجد دورات في هذا التصنيف</div>`;
    } else {
        html += `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:15px;">`;
        courses.forEach(course => {
            const url = course.drive_url || course.url || '';
            const features = course.features || [];
            html += `
                <div style="background:#fff;border:1px solid #e0e0e0;border-radius:12px;padding:20px;display:flex;flex-direction:column;justify-content:space-between;">
                    <div>
                        <div style="font-size:36px;">${esc(course.icon)}</div>
                        <h3 style="margin-top:0;color:#172033;">${esc(course.title)}</h3>
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
    // إضافة القائمة السفلية
    html += renderNav('courses');
    app.innerHTML = attachInstallButton(html);
    setupInstallButton();
}

// عرض التصنيفات (مساعد الطالب)
function renderHelper() {
    let html = `<div style="max-width:900px;margin:auto;padding:20px;">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:20px;">
            <button onclick="location.hash='#home'" style="border:0;background:#fff;width:42px;height:42px;border-radius:10px;cursor:pointer;font-size:22px;">←</button>
            <h1 style="font-size:25px;margin:0;color:#172033;">📘 مساعد الطالب</h1>
        </div>`;
    if (!helperData.categories.length) {
        html += `<div style="text-align:center;padding:40px;background:#fff;border-radius:12px;color:#64748b;">لا توجد تصنيفات</div>`;
    } else {
        html += `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:15px;">`;
        helperData.categories.forEach(cat => {
            const count = helperData.items.filter(i => i.category === cat.id).length;
            html += `
                <div onclick="location.hash='#helper/category/${cat.id}'" style="background:#fff;border:1px solid #e0e0e0;border-radius:16px;padding:24px;cursor:pointer;transition:0.3s;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;">
                    <div style="font-size:50px;margin-bottom:12px;">${esc(cat.icon || '📘')}</div>
                    <h3 style="margin:0 0 8px;color:#172033;">${esc(cat.title)}</h3>
                    <div style="color:#64748b;font-size:13px;">${count} عنصر</div>
                    <div style="margin-top:12px;color:#2563eb;font-size:14px;font-weight:bold;">عرض العناصر ←</div>
                </div>
            `;
        });
        html += `</div>`;
    }
    html += `</div>`;
    // إضافة القائمة السفلية
    html += renderNav('helper');
    app.innerHTML = attachInstallButton(html);
    setupInstallButton();
}

// عرض عناصر تصنيف معين (مساعد الطالب)
function renderHelperCategory(catId) {
    const cat = helperData.categories.find(c => c.id === catId);
    if (!cat) {
        app.innerHTML = `<div style="text-align:center;padding:40px;">التصنيف غير موجود</div>`;
        return;
    }
    const items = helperData.items.filter(i => i.category === catId);
    let html = `<div style="max-width:900px;margin:auto;padding:20px;">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:20px;">
            <button onclick="location.hash='#helper'" style="border:0;background:#fff;width:42px;height:42px;border-radius:10px;cursor:pointer;font-size:22px;">←</button>
            <h1 style="font-size:25px;margin:0;color:#172033;">${esc(cat.icon || '')} ${esc(cat.title)}</h1>
        </div>
        <div style="font-size:14px;color:#64748b;margin-bottom:15px;">${esc(cat.description || '')}</div>`;
    if (!items.length) {
        html += `<div style="text-align:center;padding:40px;background:#fff;border-radius:12px;color:#64748b;">لا توجد عناصر في هذا التصنيف</div>`;
    } else {
        html += `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:15px;">`;
        items.forEach(item => {
            html += `
                <div style="background:#fff;border:1px solid #e0e0e0;border-radius:12px;padding:20px;display:flex;flex-direction:column;justify-content:space-between;">
                    <div>
                        <h3 style="margin-top:0;color:#172033;">${esc(item.title)}</h3>
                        <p style="color:#666;font-size:14px;">${esc(item.description || '')}</p>
                    </div>
                    <a href="#helper/item/${item.id}" style="display:block;text-align:center;background:#2563eb;color:#fff;text-decoration:none;padding:10px;border-radius:8px;font-weight:bold;margin-top:15px;">📖 فتح الصفحة</a>
                </div>
            `;
        });
        html += `</div>`;
    }
    html += `</div>`;
    // إضافة القائمة السفلية
    html += renderNav('helper');
    app.innerHTML = attachInstallButton(html);
    setupInstallButton();
}
function renderHelperItem(itemId) {
    const item = helperData.items.find(i => i.id === parseInt(itemId));
    if (!item) {
        app.innerHTML = `<div style="text-align:center;padding:40px;">العنصر غير موجود</div>`;
        return;
    }
    app.innerHTML = `
        <div style="position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:9999;background:#fff;">
            <!-- شريط علوي ثابت -->
            <div style="position:fixed;top:0;left:0;right:0;height:55px;background:#2563eb;display:flex;align-items:center;justify-content:space-between;padding:0 15px;z-index:10001;box-shadow:0 2px 10px rgba(0,0,0,0.2);">
                <button onclick="location.hash='#helper/category/${item.category}'" style="background:transparent;border:none;color:#fff;font-size:18px;cursor:pointer;font-weight:bold;">✕ رجوع</button>
                <span style="color:#fff;font-weight:bold;font-size:16px;">${esc(item.title)}</span>
            </div>
            <!-- المحتوى داخل iframe مع بداية أسفل الشريط -->
            <iframe src="${esc(item.url)}" style="position:absolute;top:55px;left:0;width:100%;height:calc(100% - 55px);border:none;" allowfullscreen></iframe>
        </div>
    `;
    // إضافة القائمة السفلية
    html += renderNav('about');
    app.innerHTML = attachInstallButton(html);
    setupInstallButton();
}

function renderAbout() {
    let html = `<div style="max-width:700px;margin:auto;padding:25px;text-align:center;">
        <button onclick="location.hash='#home'" style="border:0;background:#fff;padding:9px 18px;border-radius:9px;cursor:pointer;margin-bottom:25px;">← الرئيسية</button>
        <div style="font-size:65px;">🎓</div>
        <h1 style="color:#172033;">أكاديمية هيرو</h1>
        <p style="color:#64748b;">منصة تعليمية تساعدك على الوصول إلى الدورات.</p>
    </div>`;
    // إضافة القائمة السفلية
    html += renderNav('about');
    app.innerHTML = attachInstallButton(html);
    setupInstallButton();
}

// التوجيه
function route() {
    const h = location.hash.slice(1) || 'home';
    if (h === 'courses') renderHome();
    else if (h.startsWith('category/')) renderCategoryCourses(h.split('/')[1]);
    else if (h === 'helper') renderHelper();
    else if (h.startsWith('helper/category/')) renderHelperCategory(h.split('/')[2]);
    else if (h.startsWith('helper/item/')) renderHelperItem(h.split('/')[2]);
    else if (h === 'about') renderAbout();
    else renderAcademy(); // سيتم استبدالها بـ hero-ui.js
}

window.addEventListener('hashchange', route);
document.addEventListener('DOMContentLoaded', loadCourses);
