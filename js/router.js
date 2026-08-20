// js/ui.js
// عرض صفحة الدورات (القائمة)
function renderHomePage() {
    let html = `<section class="section"><h1 style="margin-bottom:20px;">📚 جميع الدورات</h1><div class="grid">`;
    
    if (!window.coursesData || window.coursesData.length === 0) {
        html += `<div class="empty">لا توجد دورات متاحة حاليًا.</div>`;
    } else {
        window.coursesData.forEach(course => {
            html += `
                <div class="card course" onclick="navigateToCourse('${course.id}')" style="cursor:pointer;">
                    <span class="icon">${escapeHtml(course.icon)}</span>
                    <h3>${escapeHtml(course.title)}</h3>
                    <p style="color:#687386;line-height:1.6;font-size:14px;">${escapeHtml(course.description)}</p>
                    <span style="color:#2563eb;font-size:14px;margin-top:10px;display:inline-block;">افتح الدورة ➜</span>
                </div>
            `;
        });
    }
    html += `</div></section>`;
    document.getElementById('app').innerHTML = html;
}

// دالة التنقل عند النقر على بطاقة الدورة
window.navigateToCourse = function(id) {
    const course = window.coursesData.find(c => c.id == id);
    if (course) {
        // تغيير رابط المتصفح لتمكين زر الرجوع
        window.location.hash = `course/${id}`;
        // يتم استدعاء الـ Loader تلقائياً عبر ملف router.js
    }
};

// أداة بسيطة للهروب من النصوص الخاصة لتفادي ثغرات XSS
function escapeHtml(text) {
    if (!text) return '';
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return text.replace(/[&<>"']/g, m => map[m]);
}
