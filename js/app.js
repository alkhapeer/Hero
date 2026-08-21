const app = document.getElementById('app');
let coursesData = [];

function esc(s) {
    if (!s) return '';
    return String(s).replace(/[&<>"']/g, m => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
}

// دالة لاستخراج مجلد التطبيق الحالي (تدعم المجلدات الفرعية مثل /Hero/)
function getBasePath() {
    let path = window.location.pathname;
    return path.substring(0, path.lastIndexOf('/') + 1);
}

// تحميل الدورات
async function loadCourses() {
    try {
        const base = getBasePath();
        const response = await fetch(base + 'courses.json', { cache: 'no-store' });
        if (!response.ok) throw new Error('HTTP ' + response.status);
        coursesData = (await response.json()).courses || [];
        renderList();
    } catch (e) {
        app.innerHTML = `<div class="empty">❌ فشل تحميل الدورات: ${e.message}</div>`;
    }
}

// عرض قائمة الدورات
function renderList() {
    let html = `<section class="section" style="max-width:800px;margin:auto;padding:20px;">
        <h1>📚 الدورات المتاحة</h1>
        <p style="color:#687386;line-height:1.6;">اضغط على "ابدأ التجربة" لفتح الدورة داخل التطبيق.</p>
        <div class="grid" style="grid-template-columns:repeat(auto-fit, minmax(250px, 1fr));">`;
    if (coursesData.length === 0) {
        html += `<div class="empty">لا توجد دورات متاحة حالياً.</div>`;
    } else {
        coursesData.forEach(course => {
            html += `
                <div class="card course" style="display:flex;flex-direction:column;justify-content:space-between;">
                    <div>
                        <div class="icon" style="font-size:40px;">${esc(course.icon)}</div>
                        <h3>${esc(course.title)}</h3>
                        <p style="color:#687386;font-size:14px;line-height:1.6;">${esc(course.description)}</p>
                    </div>
                    <div style="margin-top:15px;">
                        <button class="btn primary" style="width:100%;background:#2563eb;color:#fff;border:none;padding:12px;border-radius:10px;font-weight:bold;cursor:pointer;" onclick="startCourse('${esc(course.url)}')">▶ ابدأ التجربة</button>
                    </div>
                </div>
            `;
        });
    }
    html += `</div></section>`;
    app.innerHTML = html;
}

// فتح الدورة داخل إطار كامل
window.startCourse = function(url) {
    const base = getBasePath();
    const fullUrl = base + url;
    app.innerHTML = `
        <div style="position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:9999;background:#fff;">
            <div style="position:absolute;top:10px;right:15px;z-index:10000;">
                <button onclick="backToList()" style="background:#fff;border:1px solid #ddd;padding:8px 15px;border-radius:8px;cursor:pointer;font-weight:bold;color:#2563eb;">✕ رجوع</button>
            </div>
            <iframe src="${esc(fullUrl)}" style="width:100%;height:100%;border:none;display:block;"></iframe>
        </div>
    `;
};

// العودة للقائمة
window.backToList = function() {
    renderList();
};

// تشغيل التطبيق
document.addEventListener('DOMContentLoaded', loadCourses);
