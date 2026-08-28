// js/router.js
// ================================
// Hero Academy Router
// ================================

function route() {
    const hash = window.location.hash.replace(/^#/, '');

    // ================================
    // الصفحة الرئيسية / الأكاديمية
    // ================================
    if (!hash || hash === 'home') {
        // الصفحة الرئيسية يتم رسمها بواسطة app.js
        if (typeof renderAcademy === 'function') {
            renderAcademy();
        }
        return;
    }

    // ================================
    // صفحة الدورة: #course/ID
    // ================================
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
            window.location.hash = 'home';
            return;
        }

        if (!course.url) {
            console.error('رابط الدورة غير موجود:', course);
            return;
        }

        loadPageIntoApp(course.url);
        return;
    }

    // ================================
    // مسار غير معروف
    // ================================
    console.warn('مسار غير معروف:', hash);
    window.location.hash = 'home';
}

// إتاحة Router لباقي ملفات التطبيق
window.route = route;

// ================================
// مراقبة تغيير المسار
// ================================
window.addEventListener('hashchange', route);
