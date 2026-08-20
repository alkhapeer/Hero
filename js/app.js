/* ------------------ الثوابت والدوال الأساسية ------------------ */
const ACADEMY = 'https://hero.kesug.com/Academy/';
const app = document.getElementById('app');

// دالة تنسيق النصوص (تمت كتابتها بشكل مبسط لتجنب أي أخطاء نحوية)
function esc(s) {
    if (!s) return '';
    return String(s).replace(/[&<>"']/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        if (m === '"') return '&quot;';
        return '&#039;';
    });
}

// دالة إنشاء الأزرار
function btn(href, text, cls) {
    cls = cls || 'primary';
    return `<a class="btn ${cls}" href="${esc(href)}"> ${text}</a>`;
}

/* ------------------ الصفحات الثابتة ------------------ */
function home() {
    app.innerHTML = `<section class="hero"><span>HERO ACADEMY</span><h1>أكاديمية هيرو</h1>
        <p>واجهة واحدة لتصفح التطبيقات والدورات وتشغيل الدورات التي يوجهك إليها نظام الأكاديمية.</p>
        <div class="actions">${btn('#courses','📚 الدورات')}${btn('#apps','📱 التطبيقات','ghost')}</div></section>
        <section class="section"><h2>الأكاديمية</h2><div class="grid">
        <a class="card" href="${ACADEMY}courses.php" target="_blank" rel="noopener"><b>📚 الدورات</b><small>استعرض الدورات والتجارب والشراء.</small></a>
        <a class="card" href="${ACADEMY}home.php" target="_blank" rel="noopener"><b>🎓 دوراتي</b><small>ادخل إلى دوراتك وروابطها بعد الاعتماد.</small></a>
        </div></section>`;
}
function apps() { app.innerHTML = `<section class="section"><h1>التطبيقات</h1><div class="empty">قسم التطبيقات جاهز لإضافة التطبيقات التعليمية مستقبلًا.</div></section>`; }
function active() { app.innerHTML = `<section class="section"><h1>دوراتي</h1><div class="notice">يتم الحصول على الدورات المملوكة وروابطها من نظام الأكاديمية.</div><div class="actions">${btn(`${ACADEMY}home.php`,'فتح دوراتي في الأكاديمية ↗')}</div></section>`; }
function settings() { app.innerHTML = `<section class="section"><h1>الإعدادات</h1><div class="card"><b>Hero Academy</b><p class="muted">نسخة Static — بدون نظام دفع أو تسجيل أو تفعيل داخل الواجهة العامة.</p></div></section>`; }

/* ------------------ النظام الجديد: عرض الدورات كبطاقات ------------------ */
var coursesData = [];

function renderHomePage() {
    var html = `<section class="section"><h1 style="margin-bottom:20px;">📚 جميع الدورات</h1><div class="grid">`;
    if (!coursesData || coursesData.length === 0) {
        html += `<div class="empty">لا توجد دورات متاحة حاليًا.</div>`;
    } else {
        for (var i = 0; i < coursesData.length; i++) {
            var course = coursesData[i];
            html += `
                <a href="#course/${course.id}" class="card course" style="cursor:pointer; display:block; text-decoration:none;">
                    <span class="icon">${esc(course.icon)}</span>
                    <h3>${esc(course.title)}</h3>
                    <p style="color:#687386;line-height:1.6;font-size:14px;">${esc(course.description)}</p>
                    <span style="color:#2563eb;font-size:14px;margin-top:10px;display:inline-block;">افتح الدورة ➜</span>
                </a>
            `;
        }
    }
    html += `</div></section>`;
    app.innerHTML = html;
}

function loadPageIntoApp(url) {
    // استخدام window.location.href لبناء المسار الكامل بشكل صحيح
    var fullUrl = new URL(url, window.location.href).href;
    console.log("🔍 جاري تحميل الدورة من:", fullUrl);

    // دالة داخلية لتحميل الصفحة
    function load() {
        fetch(fullUrl).then(function(response) {
            if (!response.ok) {
                throw new Error('خطأ HTTP ' + response.status);
            }
            return response.text();
        }).then(function(htmlText) {
            var parser = new DOMParser();
            var doc = parser.parseFromString(htmlText, 'text/html');

            app.innerHTML = doc.body.innerHTML;

            // دمج CSS
            var styles = doc.head.querySelectorAll('style, link[rel="stylesheet"]');
            for (var i = 0; i < styles.length; i++) {
                var el = styles[i];
                var newEl = document.createElement(el.tagName);
                var attrs = el.attributes;
                for (var j = 0; j < attrs.length; j++) {
                    newEl.setAttribute(attrs[j].name, attrs[j].value);
                }
                if (el.tagName === 'STYLE') {
                    newEl.textContent = el.textContent;
                }
                document.head.appendChild(newEl);
            }

            // دمج وتنفيذ JS
            var scripts = doc.body.querySelectorAll('script');
            for (var k = 0; k < scripts.length; k++) {
                var oldScript = scripts[k];
                var newScript = document.createElement('script');
                var attrs2 = oldScript.attributes;
                for (var l = 0; l < attrs2.length; l++) {
                    newScript.setAttribute(attrs2[l].name, attrs2[l].value);
                }
                if (oldScript.textContent) {
                    newScript.textContent = oldScript.textContent;
                }
                document.body.appendChild(newScript);
            }

            if (window.onCourseLoaded) {
                window.onCourseLoaded();
            }
        }).catch(function(error) {
            console.error(error);
            app.innerHTML = `<div class="empty">❌ فشل تحميل الدورة: ${error.message}<br><br>المسار الذي تم البحث عنه: <code style="background:#eee;padding:4px;border-radius:4px;">${fullUrl}</code></div>`;
        });
    }
    load();
}

/* ------------------ التوجيه (Route) ------------------ */
function initApp() {
    fetch('courses.json', { cache: 'no-store' }).then(function(response) {
        if (!response.ok) {
            throw new Error('لم يتم العثور على courses.json');
        }
        return response.json();
    }).then(function(json) {
        coursesData = json.courses || [];
        route();
    }).catch(function(error) {
        app.innerHTML = `<div class="empty">❌ خطأ: ${error.message}. تأكد من وجود courses.json في الجذر.</div>`;
    });
}

function route() {
    var h = location.hash.slice(1) || 'home';
    
    if (h === 'home') { home(); }
    else if (h === 'apps') { apps(); }
    else if (h === 'courses') { renderHomePage(); }
    else if (h.startsWith('course/')) {
        var id = parseInt(h.split('/')[1]);
        var course = null;
        for (var i = 0; i < coursesData.length; i++) {
            if (coursesData[i].id === id) {
                course = coursesData[i];
                break;
            }
        }
        if (course) {
            loadPageIntoApp(course.url);
        } else {
            app.innerHTML = `<div class="empty">⚠️ الدورة غير موجودة.</div>`;
        }
    }
    else if (h === 'active') { active(); }
    else if (h === 'settings') { settings(); }
    else { home(); }
}

// تشغيل التطبيق
window.addEventListener('hashchange', route);
document.addEventListener('DOMContentLoaded', initApp);

// تسجيل السيرفر ووركر
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('./sw.js').catch(console.error);
    });
}
