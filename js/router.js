// js/router.js
// الاستماع لأي تغيير في الرابط (Hash)
window.addEventListener('hashchange', handleNavigation);

// معالجة توجيه الصفحات
function handleNavigation() {
    const hash = window.location.hash.slice(1); // إزالة علامة #
    
    if (!hash || hash === 'home') {
        // تنظيف الأنماط المضافة عند العودة للرئيسية
        document.querySelectorAll('style[data-loader-src]').forEach(el => el.remove());
        document.querySelectorAll('link[data-loader-src]').forEach(el => el.remove());
        
        document.getElementById('app').innerHTML = ''; // تنظيف حاوية المحتوى
        renderHomePage(); // إعادة رسم القائمة
    } else if (hash.startsWith('course/')) {
        const courseId = parseInt(hash.split('/')[1]);
        const course = window.coursesData.find(c => c.id === courseId);
        if (course) {
            // استدعاء الـ Loader لتحميل صفحة الدورة
            loadPageIntoApp(course.url);
        } else {
            document.getElementById('app').innerHTML = `<div class="empty">⚠️ الدورة غير موجودة في قاعدة البيانات.</div>`;
        }
    }
}
