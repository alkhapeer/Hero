
function renderHomePage() {
    let html = `<section class="section"><h1 style="margin-bottom:20px;">📚 جميع الدورات</h1><div class="grid">`;
    
    // التحقق من وجود coursesData
    if (!window.coursesData || window.coursesData.length === 0) {
        html += `<div class="empty">لا توجد دورات متاحة حاليًا. تأكد من وجود courses.json.</div>`;
    } else {
        window.coursesData.forEach(course => {
            html += `
                <div class="card course" onclick="navigateToCourse('${course.id}')" style="cursor:pointer;">
                    <div class="icon" style="font-size:40px;">${escapeHtml(course.icon)}</div>
                    <h3>${escapeHtml(course.title)}</h3>
                    <p style="color:#687386;">${escapeHtml(course.description)}</p>
                    <span style="color:#2563eb; font-size:14px;">افتح الدورة ➜</span>
                </div>
            `;
        });
    }
    html += `</div></section>`;
    document.getElementById('app').innerHTML = html;
}

window.navigateToCourse = function(id) {
    const course = window.coursesData.find(c => c.id == id);
    if (course) {
        window.location.hash = `course/${id}`;
        // يتم تنفيذ التحميل بواسطة router.js
    }
};

function escapeHtml(text) {
    if (!text) return '';
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return text.replace(/[&<>"']/g, m => map[m]);
}
