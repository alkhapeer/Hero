// js/router.js
// ================================
// Hero Academy Router
// ================================

function route() {
    const hash = window.location.hash.replace(/^#/, '');

    // ================================
    // الرئيسية
    // ================================
    if (!hash || hash === 'home') {
        if (typeof renderAcademy === 'function') {
            renderAcademy();
        }
        return;
    }

    // ================================
    // الدورات المتاحة
    // ================================
    if (
        hash === 'courses' ||
        hash === 'available-courses'
    ) {
        if (typeof renderHomePage === 'function') {
            renderHomePage();
        }
        return;
    }

    // ================================
    // دوراتي
    // ================================
    if (
        hash === 'my-courses' ||
        hash === 'mycourses'
    ) {
        if (typeof renderMyCourses === 'function') {
            renderMyCourses();
        }
        return;
    }

    // ================================
    // عن الأكاديمية
    // ================================
    if (
        hash === 'about' ||
        hash === 'academy-about'
    ) {
        if (typeof renderAbout === 'function') {
            renderAbout();
        }
        return;
    }

    // ================================
    // صفحة الدورة
    // #course/ID
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

// إتاحة Router لباقي التطبيق
window.route = route;

// مراقبة تغيير المسار
window.addEventListener('hashchange', route);
