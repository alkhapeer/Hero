// ============================================================
// Router Module – التنقل بين الأقسام
// ============================================================

const Router = (() => {
    let currentPage = 'home';
    let pages = {};

    function registerPage(name, renderFn) {
        pages[name] = renderFn;
    }

    function navigate(page, params = {}) {
        if (!pages[page]) {
            console.warn(`Page "${page}" not registered`);
            return;
        }
        currentPage = page;
        const content = document.getElementById('main-content');
        if (!content) return;

        // مسح المحتوى
        content.innerHTML = '';
        const pageElement = document.createElement('div');
        pageElement.className = 'page active';
        pageElement.id = `page-${page}`;
        content.appendChild(pageElement);

        // استدعاء دالة العرض
        pages[page](pageElement, params);

        // تحديث شريط التنقل
        updateNav(page);

        // تحديث عنوان الصفحة
        const titles = {
            home: 'Hero Academy | الرئيسية',
            apps: 'التطبيقات',
            courses: 'الدورات',
            'my-courses': 'دوراتي',
            settings: 'الإعدادات'
        };
        document.title = titles[page] || 'Hero Academy';
    }

    function updateNav(activePage) {
        document.querySelectorAll('#bottom-nav li').forEach(item => {
            const page = item.dataset.page;
            item.classList.toggle('active', page === activePage);
        });
    }

    function init() {
        // ربط أحداث التنقل
        document.querySelectorAll('#bottom-nav li').forEach(item => {
            item.addEventListener('click', () => {
                const page = item.dataset.page;
                if (page) navigate(page);
            });
        });

        // زر تبديل الثيم
        const themeBtn = document.getElementById('theme-toggle');
        if (themeBtn) {
            themeBtn.addEventListener('click', () => {
                document.body.classList.toggle('dark');
                const isDark = document.body.classList.contains('dark');
                themeBtn.textContent = isDark ? '☀️' : '🌙';
                // حفظ الحالة
                const settings = Storage.getSettings();
                settings.theme = isDark ? 'dark' : 'light';
                Storage.setSettings(settings);
            });
        }

        // تهيئة المودال
        const modal = document.getElementById('activation-modal');
        if (modal) {
            const closeBtn = modal.querySelector('.modal-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    modal.style.display = 'none';
                });
            }
            window.addEventListener('click', (e) => {
                if (e.target === modal) modal.style.display = 'none';
            });

            const submitBtn = document.getElementById('activation-submit-btn');
            const input = document.getElementById('activation-code-input');
            const msg = document.getElementById('activation-message');

            submitBtn.addEventListener('click', () => {
                const code = input.value.trim();
                const courseId = parseInt(modal.dataset.courseId);
                if (!courseId) {
                    msg.textContent = 'معرف الدورة غير موجود.';
                    return;
                }
                if (!code) {
                    msg.textContent = 'الرجاء إدخال كود التفعيل.';
                    return;
                }
                const result = Activation.activateCourse(courseId, code);
                if (result.success) {
                    msg.style.color = '#16a34a';
                    msg.textContent = result.message;
                    setTimeout(() => {
                        modal.style.display = 'none';
                        // إعادة تحميل الصفحة الحالية (سيتم تحديث المحتوى)
                        navigate(currentPage);
                    }, 1500);
                } else {
                    msg.style.color = '#b00020';
                    msg.textContent = result.message;
                }
            });

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') submitBtn.click();
            });
        }

        // تهيئة الثيم من الإعدادات
        const settings = Storage.getSettings();
        if (settings.theme === 'dark') {
            document.body.classList.add('dark');
            const themeBtn = document.getElementById('theme-toggle');
            if (themeBtn) themeBtn.textContent = '☀️';
        }

        console.log('Router initialized');
    }

    return {
        registerPage,
        navigate,
        init,
        currentPage: () => currentPage
    };
})();

window.Router = Router;
