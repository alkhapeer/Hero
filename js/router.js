// ============================================================
// Router Module - التنقل بين الأقسام
// ============================================================

const Router = (() => {
    let currentPage = 'home';
    let pages = {};

    // تسجيل الصفحات
    function registerPage(name, renderFn) {
        pages[name] = renderFn;
    }

    // التوجيه إلى صفحة
    function navigate(page, params = {}) {
        if (!pages[page]) {
            console.warn(`Page "${page}" not registered`);
            return;
        }

        currentPage = page;
        const content = document.getElementById('main-content');
        if (!content) return;

        // عرض الصفحة
        content.innerHTML = '';
        const pageElement = document.createElement('div');
        pageElement.className = 'page active';
        pageElement.id = `page-${page}`;
        content.appendChild(pageElement);

        // استدعاء دالة العرض
        pages[page](pageElement, params);

        // تحديث التنقل السفلي
        updateNav(page);

        // تحديث العنوان
        const titles = {
            home: 'Hero Academy | الرئيسية',
            apps: 'التطبيقات',
            courses: 'الدورات',
            'my-courses': 'دوراتي',
            settings: 'الإعدادات'
        };
        document.title = titles[page] || 'Hero Academy';
    }

    // تحديث شريط التنقل السفلي
    function updateNav(activePage) {
        const items = document.querySelectorAll('#bottom-nav li');
        items.forEach(item => {
            const page = item.dataset.page;
            item.classList.toggle('active', page === activePage);
        });
    }

    // تهيئة أحداث التنقل
    function init() {
        // أحداث شريط التنقل السفلي
        document.querySelectorAll('#bottom-nav li').forEach(item => {
            item.addEventListener('click', () => {
                const page = item.dataset.page;
                if (page) navigate(page);
            });
        });

        // أحداث المودال
        const modal = document.getElementById('activation-modal');
        if (modal) {
            const closeBtn = modal.querySelector('.modal-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => UI.hideModal('activation-modal'));
            }
            window.addEventListener('click', (e) => {
                if (e.target === modal) UI.hideModal('activation-modal');
            });
        }

        // زر التثبيت
        const installBtn = document.getElementById('install-btn');
        if (installBtn) {
            let deferredPrompt;
            window.addEventListener('beforeinstallprompt', (e) => {
                e.preventDefault();
                deferredPrompt = e;
                installBtn.style.display = 'inline-block';
            });
            installBtn.addEventListener('click', () => {
                if (deferredPrompt) {
                    deferredPrompt.prompt();
                    deferredPrompt.userChoice.then(() => {
                        installBtn.style.display = 'none';
                    });
                } else {
                    alert('يمكنك تثبيت التطبيق من قائمة المتصفح (اختر "تثبيت التطبيق" أو "Add to Home Screen")');
                }
            });
        }

        // زر تبديل الثيم
        document.getElementById('theme-toggle')?.addEventListener('click', UI.toggleTheme);

        // التنقل الافتراضي
        navigate('home');
    }

    // واجهة عامة
    return {
        registerPage,
        navigate,
        init,
        currentPage: () => currentPage
    };
})();

window.Router = Router;