function handleNavigation() {
    const hash = window.location.hash.slice(1);
    
    if (!hash || hash === 'home') {
        // عند العودة للرئيسية، قد نرغب في تنظيف الـ CSS الخاص بالصفحة السابقة
        document.querySelectorAll('style[data-loader-src]').forEach(el => el.remove());
        document.querySelectorAll('link[data-loader-src]').forEach(el => el.remove());
        document.getElementById('app').innerHTML = ''; // تنظيف قبل إعادة التصيير
        renderHomePage();
    } else if (hash.startsWith('course/')) {
        const courseId = parseInt(hash.split('/')[1]);
        const course = window.coursesData.find(c => c.id === courseId);
        if (course) {
            loadPageIntoApp(course.url);
        } else {
            document.getElementById('app').innerHTML = `<div class="empty">الدورة غير موجودة</div>`;
        }
    }
}

window.addEventListener('hashchange', handleNavigation);
