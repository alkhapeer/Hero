const appContainer = document.getElementById('app');

function cleanupPreviousPage(url) {
    // إزالة أنماط الصفحة السابقة
    document.querySelectorAll('style[data-loader-src]').forEach(el => el.remove());
    document.querySelectorAll('link[data-loader-src]').forEach(el => el.remove());
    // يمكننا إزالة البرامج النصية، لكن حذفها قد يسبب مشاكل، لذا سنترك البرامج النصية تعمل بمفردها.
    // ملاحظة: قد تترك البرامج النصية مستمعي الأحداث العالقين، لكن هذا خارج نطاق هذا الحل البسيط.
}

async function loadPageIntoApp(url) {
    try {
        cleanupPreviousPage(url);
        const response = await fetch(url);
        if (!response.ok) throw new Error('فشل تحميل الصفحة');
        const htmlText = await response.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');

        // 1. حقن المحتوى الرئيسي
        appContainer.innerHTML = doc.body.innerHTML;

        // 2. حقن أنماط الرأس
        doc.head.querySelectorAll('style, link[rel="stylesheet"]').forEach(el => {
            const newEl = document.createElement(el.tagName);
            // نسخ السمات
            Array.from(el.attributes).forEach(attr => newEl.setAttribute(attr.name, attr.value));
            newEl.setAttribute('data-loader-src', url); // وضع علامة للتنظيف
            
            if (el.tagName === 'STYLE') {
                newEl.textContent = el.textContent;
            }
            document.head.appendChild(newEl);
        });

        // 3. حقن وتنفيذ البرامج النصية
        doc.body.querySelectorAll('script').forEach(oldScript => {
            const newScript = document.createElement('script');
            Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
            if (oldScript.textContent) {
                newScript.textContent = oldScript.textContent;
            }
            // إضافة إلى الجسم لضمان تنفيذه
            document.body.appendChild(newScript);
        });

        if (window.onCourseLoaded) {
            window.onCourseLoaded();
        }

    } catch (error) {
        appContainer.innerHTML = `<div class="empty" style="padding:40px;">❌ عذرًا، حدث خطأ أثناء تحميل الدورة:<br><br><code>${error.message}</code></div>`;
    }
}
