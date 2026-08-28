// js/loader.js
const appContainer = document.getElementById('app');

// تنظيف الموارد (CSS/الأنماط) الخاصة بالصفحة السابقة لمنع التداخل
function cleanupPreviousPage() {
    document.querySelectorAll('style[data-loader-src]').forEach(el => el.remove());
    document.querySelectorAll('link[data-loader-src]').forEach(el => el.remove());
}

// الدالة المسؤولة عن جلب وتحليل صفحة الدورة وحقنها داخل #app
async function loadPageIntoApp(url) {
    try {
        // 1. تنظيف آثار الصفحة السابقة
        cleanupPreviousPage();

        // 2. جلب محتوى الصفحة (ملف HTML المستقل الخاص بالدورة)
        const response = await fetch(url);
        if (!response.ok) throw new Error('فشل تحميل ملف الدورة');
        const htmlText = await response.text();

        // 3. تحليل النص إلى DOM (بدون تشغيل الموارد تلقائياً)
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');

        // 4. حقن محتوى الـ Body الخاص بالدورة في حاوية #app
        appContainer.innerHTML = doc.body.innerHTML;

        // 5. استخراج وحقن أنماط CSS (الداخلية والخارجية) في الـ Head الرئيسي
        const styles = doc.head.querySelectorAll('style, link[rel="stylesheet"]');
        styles.forEach(el => {
            const newEl = document.createElement(el.tagName);
            // نسخ جميع السمات
            Array.from(el.attributes).forEach(attr => {
                newEl.setAttribute(attr.name, attr.value);
            });
            // وضع علامة لتمييزها لغرض التنظيف لاحقاً
            newEl.setAttribute('data-loader-src', url);
            
            if (el.tagName === 'STYLE') {
                newEl.textContent = el.textContent;
            }
            // إضافة إلى رأس الموقع
            document.head.appendChild(newEl);
        });

        // 6. استخراج وتنفيذ كود JavaScript الخاص بالدورة
        const scripts = doc.body.querySelectorAll('script');
        scripts.forEach(oldScript => {
            const newScript = document.createElement('script');
            // نسخ السمات (مثل src, async, defer)
            Array.from(oldScript.attributes).forEach(attr => {
                newScript.setAttribute(attr.name, attr.value);
            });
            // نسخ المحتوى (للسكربتات المدمجة)
            if (oldScript.textContent) {
                newScript.textContent = oldScript.textContent;
            }
            // إضافة السكربت للجسم لتنفيذه فوراً
            document.body.appendChild(newScript);
        });

        // 7. استدعاء دالة التهيئة الخاصة بالصفحة إن وجدت
        if (window.onCourseLoaded) {
            window.onCourseLoaded();
        }

    } catch (error) {
        appContainer.innerHTML = `
            <div class="empty" style="padding:40px;">
                ❌ عذرًا، حدث خطأ أثناء تحميل الدورة:<br><br>
                <code style="background:#f0f0f0;padding:5px;border-radius:4px;">${error.message}</code>
            </div>`;
    }
}
