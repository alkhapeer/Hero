// js/router.js
// ================================
// Hero Academy Router
// ================================

function route() {
    const hash = window.location.hash.replace(/^#/, '');

    // الصفحة الرئيسية
    if (!hash || hash === 'home') {
        renderHomePage();
        return;
    }

    // مسار الدورة: #course/ID
    if (hash.startsWith('course/')) {
        const courseId = hash.split('/')[1];

        if (!window.coursesData || !Array.isArray(window.coursesData)) {
            console.error('coursesData غير متاحة');
            return;
        }

        const course = window.coursesData.find(
            c => String(c.id) === String(courseId)
        );

        if (!course) {
            console.error('الدورة غير موجودة:', courseId);
            renderHomePage();
            return;
        }

        if (!course.url) {
            console.error('رابط الدورة غير موجود:', course);
            return;
        }

        loadPageIntoApp(course.url);
        return;
    }

    // أي مسار غير معروف
    console.warn('مسار غير معروف:', hash);
    renderHomePage();
}

// جعل الدالة متاحة للملفات الأخرى
window.route = route;

// تشغيل Router عند تغيير hash
window.addEventListener('hashchange', route);

// تشغيل Router عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', route);
