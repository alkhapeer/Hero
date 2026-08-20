/* ------------------ الثوابت والدوال الأساسية ------------------ */
const ACADEMY = 'https://hero.kesug.com/Academy/';
const app = document.getElementById('app');
let deferredInstall = null;

const esc = s => String(s ?? '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m]));
const btn = (href, text, cls = 'primary') => `<a class="btn ${cls}" href="${esc(href)}"> ${text}</a>`;

/* ------------------ الصفحات الثابتة ------------------ */
function home() {
    app.innerHTML = `<section class="hero"><span>HERO ACADEMY</span><h1>أكاديمية هيرو</h1>
        <p>واجهة واحدة لتصفح التطبيقات والدورات وتشغيل الدورات التي يوجهك إليها نظام الأكاديمية.</p>
        <div class="actions">${btn('#courses','📚 الدورات')}${btn('#apps','📱 التطبيقات','ghost')}</div></section>
        <section class="section"><h2>الأكاديمية</h2><div class="grid">
        <a class="card" href="${ACADEMY}courses.php" target="_blank" rel="noopener"><b>📚 الدورات</b><small>استعرض الدورات والتجارب والشراء.</small></a>
        <a class="card" href="${ACADEMY}home.php" target="_blank" rel="noopener"><b>🎓 دوراتي</b><small>ادخل إلى دوراتك وروابطها بعد الاعتماد.</small></a>
        </div></section>`;
}
function apps() {
    app.innerHTML = `<section class="section"><h1>التطبيقات</h1><div class="empty">قسم التطبيقات جاهز لإضافة التطبيقات التعليمية مستقبلًا.</div></section>`;
}
function active() {
    app.innerHTML = `<section class="section"><h1>دوراتي</h1>
        <div class="notice">يتم الحصول على الدورات المملوكة وروابطها من نظام الأكاديمية.</div>
        <div class="actions">${btn(`${ACADEMY}home.php`,'فتح دوراتي في الأكاديمية ↗')}</div>
        <p class="muted">عند اختيار دورة مفعلة من الأكاديمية، يتم توجيهك إلى رابط الدورة المحمية ليتم عرضها داخل هذا التطبيق.</p></section>`;
}
function settings() {
    app.innerHTML = `<section class="section"><h1>الإعدادات</h1><div class="card"><b>Hero Academy</b><p class="muted">نسخة Static — بدون نظام دفع أو تسجيل أو تفعيل داخل الواجهة العامة.</p></div></section>`;
}

/* ------------------ الـ Loader للدورات ------------------ */
let coursesData = [];

function renderHomePage() {
    let html = `<section class="section"><h1 style="margin-bottom:20px;">📚 جميع الدورات</h1><div class="grid">`;
    if (!coursesData || coursesData.length === 0) {
        html += `<div class="empty">لا توجد دورات متاحة حاليًا.</div>`;
    } else {
        coursesData.forEach(course => {
            html += `
                <div class="card course" onclick="navigateToCourse('${course.id}')" style="cursor:pointer; transition:0.2s;">
                    <span class="icon">${esc(course.icon)}</span>
                    <h3>${esc(course.title)}</h3>
                    <p style="color:#687386;line-height:1.6;font-size:14px;">${esc(course.description)}</p>
                    <span style="color:#2563eb;font-size:14px;margin-top:10px;display:inline-block;">افتح الدورة ➜</span>
                </div>
            `;
        });
    }
    html += `</div></section>`;
    app.innerHTML = html;
}

function loadPageIntoApp(url) {
    async function load() {
        try {
            document.querySelectorAll('style[data-loader-src]').forEach(el => el.remove());
            document.querySelectorAll('link[data-loader-src]').forEach(el => el.remove());

            const response = await fetch(url);
            if (!response.ok) throw new Error(`فشل تحميل الدورة (HTTP ${response.status})`);
            const htmlText = await response.text();

            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlText, 'text/html');

            app.innerHTML = doc.body.innerHTML;

            const styles = doc.head.querySelectorAll('style, link[rel="stylesheet"]');
            styles.forEach(el => {
                const newEl = document.createElement(el.tagName);
                Array.from(el.attributes).forEach(attr => newEl.setAttribute(attr.name, attr.value));
                newEl.setAttribute('data-loader-src', url);
                if (el.tagName === 'STYLE') newEl.textContent = el.textContent;
                document.head.appendChild(newEl);
            });

            const scripts = doc.body.querySelectorAll('script');
            scripts.forEach(oldScript => {
                const newScript = document.createElement('script');
                Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
                if (oldScript.textContent) newScript.textContent = oldScript.textContent;
                document.body.appendChild(newScript);
            });
            if (window.onCourseLoaded) window.onCourseLoaded();
        } catch (error) {
            app.innerHTML = `<div class="empty">❌ خطأ: ${error.message}</div>`;
        }
    }
    load();
}

window.navigateToCourse = function(id) {
    const course = coursesData.find(c => c.id == id);
    if (course) window.location.hash = `course/${id}`;
};

/* ------------------ التهيئة والتوجيه ------------------ */
async function initApp() {
    try {
        const response = await fetch('/courses.json', { cache: 'no-store' });
        if (!response.ok) throw new Error(`courses.json غير موجود (HTTP ${response.status})`);
        const json = await response.json();
        coursesData = json.courses || [];
        route(); 
    } catch (error) {
        app.innerHTML = `<div class="empty">❌ خطأ في تحميل الدورات: ${error.message}</div>`;
    }
}

function route() {
    const h = location.hash.slice(1) || 'home';
    if (h === 'home') home();
    else if (h === 'apps') apps();
    else if (h.startsWith('course/')) {
        const id = parseInt(h.split('/')[1]);
        const course = coursesData.find(c => c.id === id);
        if (course) loadPageIntoApp(course.url);
        else app.innerHTML = `<div class="empty">⚠️ الدورة غير موجودة</div>`;
    }
    else if (h === 'active') active();
    else if (h === 'settings') settings();
    else if (h === 'courses') renderHomePage();
    else home();
}

window.addEventListener('hashchange', route);
document.addEventListener('DOMContentLoaded', initApp);

/* ------------------ معالجة التثبيت (PWA) بدون أخطاء ------------------ */
// التعديل هنا: إذا لم نجد زرًا مخصصًا، نسمح للشريط بالظهور تلقائياً.
window.addEventListener('beforeinstallprompt', e => {
    deferredInstall = e;
    // البحث عن زر التثبيت المخصص (إن وجد)
    const btnInstall = document.getElementById('installBtn');
    if (btnInstall) {
        e.preventDefault(); // إذا كان الزر موجودًا، نمنع الشريط التلقائي ونستخدم الزر المخصص
        btnInstall.classList.remove('hidden');
        btnInstall.onclick = async () => {
            if (deferredInstall) {
                deferredInstall.prompt();
                await deferredInstall.userChoice;
                deferredInstall = null;
            }
        };
    }
    // إذا لم يكن الزر موجودًا، لا نستخدم preventDefault()، وسيظهر شريط التثبيت التلقائي، وبذلك يختفي الخطأ!
});

// تسجيل السيرفر ووركر
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(console.error));
}
