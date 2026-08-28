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

    // صفحة دورة
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

    // أي مسار غير معروف
    console.warn('مسار غير معروف:', hash);
    window.location.hash = 'home';
}

// إتاحة Router للملفات الأخرى
window.route = route;

// مراقبة تغيير الـ hash
window.addEventListener('hashchange', route);
