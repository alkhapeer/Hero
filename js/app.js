const app = document.getElementById('app');
let coursesData = [];

function esc(s) {
    if (!s) return '';
    return String(s).replace(/[&<>"']/g, m => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
}

// الصفحة الرئيسية
function home() {
    app.innerHTML = `
        <section class="hero">
            <h1>أكاديمية هيرو</h1>
            <p>واجهة لتصفح الدورات.</p>
            <div class="actions"><a class="btn primary" href="#courses">📚 تصفح الدورات</a></div>
        </section>`;
}

// عرض قائمة الدورات
function renderCourses() {
    let html = `<section class="section"><h1>📚 جميع الدورات</h1><div class="grid">`;
    if (!coursesData || coursesData.length === 0) {
        html += `<div class="empty">لا توجد دورات متاحة.</div>`;
    } else {
        for (let c of coursesData) {
            // ربط النقر بفتح الدورة في إطار كامل
            html += `
                <div class="card course" onclick="openCourseFull('${esc(c.url)}')" style="cursor:pointer;">
                    <span class="icon">${esc(c.icon)}</span>
                    <h3>${esc(c.title)}</h3>
                    <p style="color:#687386;">${esc(c.description)}</p>
                    <span style="color:#2563eb;">افتح الدورة ➜</span>
                </div>
            `;
        }
    }
    html += `</div></section>`;
    app.innerHTML = html;
}

// 🔥 الدالة السحرية لفتح الدورة في إطار كامل (بدون رأس ولا ذيل)
window.openCourseFull = function(url) {
    // بناء الرابط الكامل بناءً على موقع التطبيق الحالي
    let base = window.location.pathname.replace(/\/$/, '');
    let fullUrl = (base ? base + '/' : '') + url;

    // نغير محتوى #app ليصبح عبارة عن إطار شاشة كاملة
    app.innerHTML = `
        <div style="position:fixed; top:0; left:0; width:100vw; height:100vh; z-index:9999; background:#fff;">
            <div style="position:absolute; top:10px; right:15px; z-index:10000; background:#fff; padding:8px 15px; border-radius:8px; box-shadow:0 2px 10px rgba(0,0,0,0.1);">
                <a href="#courses" style="color:#2563eb; text-decoration:none; font-weight:bold; font-size:18px;">✕ رجوع</a>
            </div>
            <iframe src="${esc(fullUrl)}" style="width:100%; height:100%; border:none; display:block;"></iframe>
        </div>
    `;
};

// التوجيه
function route() {
    let h = location.hash.slice(1) || 'home';
    if (h === 'home') home();
    else if (h === 'courses') renderCourses();
    else home();
}

// التحميل والبدء
function initApp() {
    // تأكد من مسار ملف JSON (بدون / لأن الاستضافة المجانية حساسة)
    fetch('courses.json').then(r => {
        if(!r.ok) throw new Error('courses.json غير موجود');
        return r.json();
    }).then(json => {
        coursesData = json.courses || [];
        route();
    }).catch(() => {
        app.innerHTML = `<div class="empty">❌ تأكد من وجود ملف courses.json في نفس المجلد.</div>`;
    });
}

window.addEventListener('hashchange', route);
document.addEventListener('DOMContentLoaded', initApp);
