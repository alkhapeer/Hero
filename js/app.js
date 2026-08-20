/* ------------------ الثوابت والدوال الأساسية ------------------ */
const ACADEMY = 'https://hero.kesug.com/Academy/';
const app = document.getElementById('app');

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
function apps() { app.innerHTML = `<section class="section"><h1>التطبيقات</h1><div class="empty">قسم التطبيقات جاهز لإضافة التطبيقات التعليمية مستقبلًا.</div></section>`; }
function active() { app.innerHTML = `<section class="section"><h1>دوراتي</h1><div class="notice">يتم الحصول على الدورات المملوكة وروابطها من نظام الأكاديمية.</div><div class="actions">${btn(`${ACADEMY}home.php`,'فتح دوراتي في الأكاديمية ↗')}</div></section>`; }
function settings() { app.innerHTML = `<section class="section"><h1>الإعدادات</h1><div class="card"><b>Hero Academy</b><p class="muted">نسخة Static — بدون نظام دفع أو تسجيل أو تفعيل داخل الواجهة العامة.</p></div></section>`; }

/* ------------------ الـ Loader للدورات ------------------ */
let coursesData = [];

function renderHomePage() {
    let html = `<section class="section"><h1 style="margin-bottom:20px;">📚 جميع الدورات</h1><div class="grid">`;
    if (!coursesData || coursesData.length === 0) {
        html += `<div class="empty">لا توجد دورات متاحة حاليًا.</div>`;
    } else {
        coursesData.forEach(course => {
            html += `
                <div class="card course" onclick="navigateToCourse('${course.id}')" style="cursor:pointer;">
                    <span class="icon">${esc(course.icon)}</span>
                    <h3>${esc(course.title)}</h3>
                    <p style="color:#687386;">${esc(course.description)}</p>
                    <span style="color:#2563eb;">افتح الدورة ➜</span>
                </div>
            `;
        });
    }
    html += `</div></section>`;
    app.innerHTML = html;
}

/* الدالة المسؤولة عن جلب الدورة وعرضها */
function loadPageIntoApp(url) {
    // بناء المسار الكامل بشكل آمن
    const fullUrl = new URL(url, window.location.origin).href;
    console.log("🔍 المسار الذي يحاول التطبيق تحميله:", fullUrl); // افحص هذا الرابط في الـ Console

    async function load() {
        try {
            const response = await fetch(fullUrl);
            if (!response.ok) {
                throw new Error(`فشل التحميل (خطأ HTTP ${response.status}). تأكد من وجود الملف في: ${fullUrl}`);
            }
            const htmlText = await response.text();

            // تحليل HTML لاستخراج CSS و JS وتنفيذه (تقنية الـ Loader)
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlText, 'text/html');

            app.innerHTML = doc.body.innerHTML;

            // جلب وتنفيذ الـ CSS الخاص بالصفحة
            const styles = doc.head.querySelectorAll('style, link[rel="stylesheet"]');
            styles.forEach(el => {
                const newEl = document.createElement(el.tagName);
                Array.from(el.attributes).forEach(attr => newEl.setAttribute(attr.name, attr.value));
                if (el.tagName === 'STYLE') newEl.textContent = el.textContent;
                document.head.appendChild(newEl);
            });

            // جلب وتنفيذ الـ JS الخاص بالصفحة
            const scripts = doc.body.querySelectorAll('script');
            scripts.forEach(oldScript => {
                const newScript = document.createElement('script');
                Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
                if (oldScript.textContent) newScript.textContent = oldScript.textContent;
                document.body.appendChild(newScript);
            });
        } catch (error) {
            console.error("❌ حدث خطأ أثناء تحميل الدورة:", error);
            app.innerHTML = `<div class="empty" style="padding:40px;">❌ خطأ: ${error.message}</div>`;
        }
    }
    load();
}

window.navigateToCourse = function(id) {
    const course = coursesData.find(c => c.id == id);
    if (course) window.location.hash = `course/${id}`;
};

/* ------------------ التوجيه ------------------ */
async function initApp() {
    try {
        // جلب ملف JSON
        const response = await fetch('/courses.json', { cache: 'no-store' });
        if (!response.ok) throw new Error('لم يتم العثور على courses.json في جذر التطبيق');
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
        else app.innerHTML = `<div class="empty">⚠️ الدورة غير موجودة في قاعدة البيانات.</div>`;
    }
    else if (h === 'active') active();
    else if (h === 'settings') settings();
    else if (h === 'courses') renderHomePage();
    else home();
}

window.addEventListener('hashchange', route);
document.addEventListener('DOMContentLoaded', initApp);

// تسجيل السيرفر ووركر (لن يمنع ظهور الدورة)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(console.error));
}
