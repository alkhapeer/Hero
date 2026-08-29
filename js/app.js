const app = document.getElementById('app');

let coursesData = [];
let categoriesData = [];

// تخزين زر تثبيت التطبيق
let deferredInstallPrompt = null;

// ================================
// تأمين النصوص
// ================================
function esc(s) {
    if (!s) return '';
    return String(s).replace(/[&<>"']/g, m => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    }[m]));
}

// ================================
// تحديد مسار التطبيق
// ================================
function getBasePath() {
    let path = window.location.pathname;
    return path.substring(0, path.lastIndexOf('/') + 1);
}

// ================================
// الدورات التي بدأ المستخدم تجربتها
// ================================
function getMyCourses() {
    try {
        return JSON.parse(localStorage.getItem('heroMyCourses') || '[]');
    } catch (e) {
        return [];
    }
}

function saveMyCourse(courseId) {
    let myCourses = getMyCourses();

    courseId = Number(courseId);

    if (!myCourses.includes(courseId)) {
        myCourses.push(courseId);
        localStorage.setItem('heroMyCourses', JSON.stringify(myCourses));
    }
}

function isMyCourse(courseId) {
    return getMyCourses().includes(Number(courseId));
}

// ================================
// تحميل بيانات الدورات
// ================================
async function loadCourses() {
    try {
        const base = getBasePath();

        const response = await fetch(
            base + 'courses.json',
            { cache: 'no-store' }
        );

        if (!response.ok) {
            throw new Error('تعذر تحميل بيانات الدورات');
        }

        const data = await response.json();

        coursesData = data.courses || [];
        categoriesData = data.categories || [];

        route();

    } catch (e) {

        app.innerHTML = `
            <div class="empty" style="padding:40px;text-align:center;">
                ❌ خطأ في تحميل البيانات:
                ${esc(e.message)}
            </div>
        `;
    }
}

// ================================
// الواجهة الرئيسية للأكاديمية
// ================================
function renderAcademy() {

    const myCount = getMyCourses().length;

    app.innerHTML = `
        <div style="
            min-height:100vh;
            background:#f8fafc;
            box-sizing:border-box;
            padding:25px 15px 35px;
        ">

            <div style="
                max-width:850px;
                margin:auto;
            ">

                <!-- رأس الأكاديمية -->
                <div style="
                    text-align:center;
                    padding:25px 15px 20px;
                ">

                    <div style="
                        font-size:58px;
                        margin-bottom:8px;
                    ">
                        🎓
                    </div>

                    <h1 style="
                        margin:0;
                        font-size:30px;
                        color:#172033;
                    ">
                        أكاديمية هيرو
                    </h1>

                    <p style="
                        margin:10px 0 0;
                        color:#64748b;
                        font-size:15px;
                    ">
                        تعلم بطريقة أبسط وأذكى
                    </p>

                </div>

                <!-- بطاقة الدورات -->
                <button
                    onclick="location.hash='#courses'"
                    style="
                        width:100%;
                        border:0;
                        background:#fff;
                        border-radius:18px;
                        padding:22px;
                        margin-bottom:15px;
                        text-align:right;
                        cursor:pointer;
                        box-shadow:0 3px 15px rgba(0,0,0,.07);
                        display:flex;
                        align-items:center;
                        gap:18px;
                    "
                >

                    <div style="
                        width:58px;
                        height:58px;
                        border-radius:15px;
                        background:#eff6ff;
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        font-size:30px;
                        flex-shrink:0;
                    ">
                        📚
                    </div>

                    <div style="flex:1;">

                        <div style="
                            font-size:19px;
                            font-weight:bold;
                            color:#172033;
                        ">
                            الدورات المتاحة
                        </div>

                        <div style="
                            color:#64748b;
                            margin-top:5px;
                            font-size:14px;
                        ">
                            تصفح جميع الدورات والمواد التعليمية
                        </div>

                    </div>

                    <div style="
                        font-size:25px;
                        color:#94a3b8;
                    ">
                        ‹
                    </div>

                </button>


                <!-- بطاقة دوراتي -->
                <button
                    onclick="location.hash='#mycourses'"
                    style="
                        width:100%;
                        border:0;
                        background:#fff;
                        border-radius:18px;
                        padding:22px;
                        margin-bottom:15px;
                        text-align:right;
                        cursor:pointer;
                        box-shadow:0 3px 15px rgba(0,0,0,.07);
                        display:flex;
                        align-items:center;
                        gap:18px;
                    "
                >

                    <div style="
                        width:58px;
                        height:58px;
                        border-radius:15px;
                        background:#fef3c7;
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        font-size:30px;
                        flex-shrink:0;
                    ">
                        ⭐
                    </div>

                    <div style="flex:1;">

                        <div style="
                            font-size:19px;
                            font-weight:bold;
                            color:#172033;
                        ">
                            دوراتي
                        </div>

                        <div style="
                            color:#64748b;
                            margin-top:5px;
                            font-size:14px;
                        ">
                            الدورات التي بدأت تجربتها
                            ${myCount ? `(${myCount})` : ''}
                        </div>

                    </div>

                    <div style="
                        font-size:25px;
                        color:#94a3b8;
                    ">
                        ‹
                    </div>

                </button>


                <!-- عن الأكاديمية -->
                <button
                    onclick="location.hash='#about'"
                    style="
                        width:100%;
                        border:0;
                        background:#fff;
                        border-radius:18px;
                        padding:22px;
                        margin-bottom:25px;
                        text-align:right;
                        cursor:pointer;
                        box-shadow:0 3px 15px rgba(0,0,0,.07);
                        display:flex;
                        align-items:center;
                        gap:18px;
                    "
                >

                    <div style="
                        width:58px;
                        height:58px;
                        border-radius:15px;
                        background:#f1f5f9;
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        font-size:30px;
                        flex-shrink:0;
                    ">
                        ℹ️
                    </div>

                    <div style="flex:1;">

                        <div style="
                            font-size:19px;
                            font-weight:bold;
                            color:#172033;
                        ">
                            عن الأكاديمية
                        </div>

                        <div style="
                            color:#64748b;
                            margin-top:5px;
                            font-size:14px;
                        ">
                            تعرف على أكاديمية هيرو
                        </div>

                    </div>

                    <div style="
                        font-size:25px;
                        color:#94a3b8;
                    ">
                        ‹
                    </div>

                </button>


                <div style="
    margin:20px 0;
    padding:14px 16px;
    border-radius:14px;
    background:#eff6ff;
    border:1px solid #bfdbfe;
    overflow:hidden;
">
    <div style="
        white-space:nowrap;
        animation:heroInstallMove 18s linear infinite;
        font-weight:bold;
        color:#1e40af;
    ">
        📱 ثبّت أكاديمية هيرو على جهازك — أضفها إلى الشاشة الرئيسية للوصول السريع إلى دوراتك
    </div>

    <div style="
        text-align:center;
        margin-top:10px;
    ">
        <button id="installAppBtn"
            style="
                display:none;
                background:#2563eb;
                color:#fff;
                border:0;
                padding:9px 22px;
                border-radius:8px;
                cursor:pointer;
                font-weight:bold;
            ">
            📲 تثبيت التطبيق
        </button>
    </div>
</div>

<style>
@keyframes heroInstallMove {
    from {
        transform:translateX(100%);
    }
    to {
        transform:translateX(-100%);
    }
}
</style>


            </div>
        </div>
    `;
    setupInstallButton();
}
window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();

    deferredInstallPrompt = e;

    const btn = document.getElementById('installAppBtn');

    if (btn) {
        btn.style.display = 'inline-block';
    }
});


function setupInstallButton() {
    const btn = document.getElementById('installAppBtn');

    if (!btn) return;

    if (deferredInstallPrompt) {
        btn.style.display = 'inline-block';

        btn.onclick = async () => {
            deferredInstallPrompt.prompt();

            const result =
                await deferredInstallPrompt.userChoice;

            if (result.outcome === 'accepted') {
                btn.style.display = 'none';
            }

            deferredInstallPrompt = null;
        };
    }
}
// ================================
// صفحة الدورات المتاحة
// ================================
function renderHome() {

    let html = `
        <div style="
            max-width:900px;
            margin:auto;
            padding:20px;
        ">

            <div style="
                display:flex;
                align-items:center;
                gap:10px;
                margin-bottom:20px;
            ">

                <button
                    onclick="location.hash='#home'"
                    style="
                        border:0;
                        background:#fff;
                        width:42px;
                        height:42px;
                        border-radius:10px;
                        cursor:pointer;
                        font-size:22px;
                    "
                >
                    ←
                </button>

                <h1 style="
                    margin:0;
                    font-size:25px;
                ">
                    📚 الدورات المتاحة
                </h1>

            </div>


            <!-- رسالة التثبيت -->
            <div style="
                margin-bottom:25px;
                padding:14px 16px;
                border-radius:14px;
                background:#eff6ff;
                border:1px solid #bfdbfe;
                overflow:hidden;
            ">

                <div style="
                    white-space:nowrap;
                    animation:heroInstallMove 18s linear infinite;
                    font-weight:bold;
                    color:#1e40af;
                ">
                    📱 ثبّت أكاديمية هيرو على جهازك — أضفها إلى الشاشة الرئيسية للوصول السريع إلى دوراتك
                </div>

                <div style="
                    text-align:center;
                    margin-top:10px;
                ">
                    <button
                        id="installAppBtn"
                        style="
                            display:none;
                            background:#2563eb;
                            color:#fff;
                            border:0;
                            padding:9px 22px;
                            border-radius:8px;
                            cursor:pointer;
                            font-weight:bold;
                        "
                    >
                        📲 تثبيت التطبيق
                    </button>
                </div>

            </div>

            <style>
                @keyframes heroInstallMove {
                    from {
                        transform:translateX(100%);
                    }

                    to {
                        transform:translateX(-100%);
                    }
                }
            </style>
    `;


    const visibleCourses =
        coursesData.filter(course => course.visible !== false);


    // ================================
    // عرض التصنيفات
    // ================================

    if (categoriesData.length) {

        categoriesData.forEach(category => {

            const categoryCourses =
                visibleCourses.filter(
                    course => course.category === category.id
                );

            if (!categoryCourses.length) return;


            html += `
                <section style="
                    margin-bottom:35px;
                ">

                    <h2 style="
                        margin-bottom:15px;
                        padding-bottom:8px;
                        border-bottom:2px solid #e5e7eb;
                    ">
                        ${esc(category.icon || '📚')}
                        ${esc(category.title)}
                    </h2>

                    <div style="
                        display:grid;
                        grid-template-columns:
                            repeat(auto-fit,minmax(250px,1fr));
                        gap:15px;
                    ">
            `;


            categoryCourses.forEach(course => {

                html += `
                    <div style="
                        display:flex;
                        flex-direction:column;
                        justify-content:space-between;
                        border:1px solid #e0e0e0;
                        border-radius:12px;
                        padding:20px;
                        background:#fff;
                        box-shadow:
                            0 2px 8px rgba(0,0,0,.05);
                    ">

                        <div>

                            <div style="
                                font-size:36px;
                                margin-bottom:10px;
                            ">
                                ${esc(course.icon)}
                            </div>

                            <h3 style="
                                margin-top:0;
                            ">
                                ${esc(course.title)}
                            </h3>

                            <p style="
                                color:#666;
                                font-size:14px;
                                line-height:1.6;
                            ">
                                ${esc(course.description)}
                            </p>

                        </div>

                        <div style="
                            margin-top:15px;
                        ">

                            <a
                                href="#course/${course.id}"
                                onclick="saveMyCourse(${course.id})"
                                style="
                                    display:block;
                                    text-align:center;
                                    background:#2563eb;
                                    color:#fff;
                                    text-decoration:none;
                                    padding:10px;
                                    border-radius:8px;
                                    font-weight:bold;
                                "
                            >
                                ▶ ابدأ التجربة
                            </a>

                        </div>

                    </div>
                `;
            });


            html += `
                    </div>
                </section>
            `;
        });

    } else {

        // توافق مع JSON القديم

        html += `
            <div style="
                display:grid;
                grid-template-columns:
                    repeat(auto-fit,minmax(250px,1fr));
                gap:15px;
            ">
        `;

        visibleCourses.forEach(course => {

            html += `
                <div style="
                    background:#fff;
                    border:1px solid #e0e0e0;
                    border-radius:12px;
                    padding:20px;
                ">

                    <div style="font-size:36px;">
                        ${esc(course.icon)}
                    </div>

                    <h3>
                        ${esc(course.title)}
                    </h3>

                    <p>
                        ${esc(course.description)}
                    </p>

                    <a
                        href="#course/${course.id}"
                        onclick="saveMyCourse(${course.id})"
                    >
                        ▶ ابدأ التجربة
                    </a>

                </div>
            `;
        });

        html += `</div>`;
    }


    html += `</div>`;

    app.innerHTML = html;

    setupInstallButton();
}

// ================================
// دوراتي
// ================================
function renderMyCourses() {

    const myIds = getMyCourses();

    const myCourses =
        coursesData.filter(course =>
            myIds.includes(Number(course.id))
        );


    let html = `
        <div style="
            max-width:900px;
            margin:auto;
            padding:20px;
        ">

            <div style="
                display:flex;
                align-items:center;
                gap:10px;
                margin-bottom:25px;
            ">

                <button
                    onclick="location.hash='#home'"
                    style="
                        border:0;
                        background:#fff;
                        width:42px;
                        height:42px;
                        border-radius:10px;
                        cursor:pointer;
                        font-size:22px;
                    "
                >
                    ←
                </button>

                <h1 style="
                    margin:0;
                    font-size:25px;
                ">
                    ⭐ دوراتي
                </h1>

            </div>
    `;


    if (!myCourses.length) {

        html += `
            <div style="
                text-align:center;
                padding:60px 20px;
                background:#fff;
                border-radius:18px;
            ">

                <div style="
                    font-size:55px;
                    margin-bottom:15px;
                ">
                    📚
                </div>

                <h2>
                    لا توجد دورات بعد
                </h2>

                <p style="
                    color:#64748b;
                    line-height:1.7;
                ">
                    عندما تبدأ تجربة أي دورة ستظهر هنا
                    لتستطيع العودة إليها بسرعة.
                </p>

                <button
                    onclick="location.hash='#courses'"
                    style="
                        background:#2563eb;
                        color:#fff;
                        border:0;
                        padding:11px 25px;
                        border-radius:9px;
                        cursor:pointer;
                        font-weight:bold;
                    "
                >
                    📚 استعراض الدورات
                </button>

            </div>
        `;

    } else {

        html += `
            <div style="
                display:grid;
                grid-template-columns:
                    repeat(auto-fit,minmax(250px,1fr));
                gap:15px;
            ">
        `;


        myCourses.forEach(course => {

            html += `
                <div style="
                    background:#fff;
                    border:1px solid #e0e0e0;
                    border-radius:14px;
                    padding:20px;
                    box-shadow:
                        0 2px 8px rgba(0,0,0,.05);
                ">

                    <div style="
                        font-size:38px;
                        margin-bottom:10px;
                    ">
                        ${esc(course.icon)}
                    </div>

                    <h3>
                        ${esc(course.title)}
                    </h3>

                    <p style="
                        color:#64748b;
                        line-height:1.6;
                    ">
                        ${esc(course.description)}
                    </p>

                    <a
                        href="#course/${course.id}"
                        style="
                            display:block;
                            text-align:center;
                            background:#2563eb;
                            color:#fff;
                            text-decoration:none;
                            padding:10px;
                            border-radius:8px;
                            font-weight:bold;
                            margin-top:15px;
                        "
                    >
                        ▶ متابعة الدورة
                    </a>

                </div>
            `;
        });


        html += `</div>`;
    }


    html += `</div>`;

    app.innerHTML = html;
}

// ================================
// عن الأكاديمية
// ================================
function renderAbout() {

    app.innerHTML = `
        <div style="
            max-width:700px;
            margin:auto;
            padding:25px 20px;
            text-align:center;
        ">

            <button
                onclick="location.hash='#home'"
                style="
                    border:0;
                    background:#fff;
                    padding:9px 18px;
                    border-radius:9px;
                    cursor:pointer;
                    margin-bottom:25px;
                "
            >
                ← الرئيسية
            </button>

            <div style="
                font-size:65px;
            ">
                🎓
            </div>

            <h1>
                أكاديمية هيرو
            </h1>

            <p style="
                color:#64748b;
                line-height:1.9;
                font-size:16px;
            ">
                منصة تعليمية تساعدك على الوصول إلى
                الدورات والمواد التعليمية بطريقة بسيطة
                ومنظمة.
            </p>
                <!-- أزرار الروابط -->
            <div style="
                display:flex;
                flex-wrap:wrap;
                justify-content:center;
                gap:10px;
                margin-top:25px;
            ">

                <a href="
                https://Academy.hero1.vip"
                   target="_blank"
                   rel="noopener"
                   style="
                       display:inline-block;
                       padding:11px 20px;
                       border-radius:10px;
                       background:#2563eb;
                       color:#fff;
                       text-decoration:none;
                       font-weight:bold;
                   ">
                    🎓 موقع الأكاديمية
                </a>

                <a href="https://web.facebook.com/Heropwa"
                   target="_blank"
                   rel="noopener"
                   style="
                       display:inline-block;
                       padding:11px 20px;
                       border-radius:10px;
                       background:#1877f2;
                       color:#fff;
                       text-decoration:none;
                       font-weight:bold;
                   ">
                    📘 فيسبوك
                </a>
                <a href="https://t.me/Herocourses"
                   target="_blank"
                   rel="noopener"
                   style="
                       display:inline-block;
                       padding:11px 20px;
                       border-radius:10px;
                       background:#1877f2;
                       color:#fff;
                       text-decoration:none;
                       font-weight:bold;
                   ">
                    📘 للتواصل عبر تيليجرام
                </a>

                                <a href="https://wa.me/249915886600"
                   target="_blank"
                   rel="noopener"
                   style="
                       display:inline-block;
                       padding:11px 20px;
                       border-radius:10px;
                       background:#1877f2;
                       color:#fff;
                       text-decoration:none;
                       font-weight:bold;
                   ">
                    📘 للتواصل عبر واتساب
                </a>
                
                <a href="https://t.me/+kJNKpuOP-jQwZTM0"
                   target="_blank"
                   rel="noopener"
                   style="
                       display:inline-block;
                       padding:11px 20px;
                       border-radius:10px;
                       background:#1877f2;
                       color:#fff;
                       text-decoration:none;
                       font-weight:bold;
                   ">
                    📘 قناة تيليجرام
                </a>

                <a href="https://www.youtube.com/@Hero1vip"
                   target="_blank"
                   rel="noopener"
                   style="
                       display:inline-block;
                       padding:11px 20px;
                       border-radius:10px;
                       background:#1877f2;
                       color:#fff;
                       text-decoration:none;
                       font-weight:bold;
                   ">
                    📘 قناة اليوتيوب
                </a>

            </div>
        </div>
    `;
}

// ================================
// صفحة الدورة - لا نغير منطقها
// ================================
function renderCourse(course) {

    const base = getBasePath();
    const fullUrl = base + course.url;

    app.innerHTML = `
        <div style="
            position:fixed;
            top:0;
            left:0;
            width:100vw;
            height:100vh;
            z-index:9999;
            background:#fff;
        ">

            <div style="
                position:absolute;
                top:15px;
                right:15px;
                z-index:10000;
            ">

                <button
                    onclick="window.location.hash='#home'"
                    style="
                        background:#fff;
                        border:1px solid #ddd;
                        padding:8px 20px;
                        border-radius:8px;
                        cursor:pointer;
                        font-size:14px;
                        font-weight:bold;
                        color:#2563eb;
                        box-shadow:
                            0 2px 6px rgba(0,0,0,.1);
                    "
                >
                    ✕ رجوع
                </button>

            </div>

            <iframe
                src="${esc(fullUrl)}"
                style="
                    width:100%;
                    height:100%;
                    border:none;
                    display:block;
                "
                allowfullscreen>
            </iframe>

        </div>
    `;
const frame = document.querySelector('iframe');

frame.addEventListener('load', function () {

    const doc = frame.contentDocument;
    if (!doc) return;

    function checkBuyButton() {

        const elements = doc.querySelectorAll('a, button');

        elements.forEach(el => {

            const text = (el.innerText || el.textContent || '').trim();

            if (
                text.includes('💰 شراء التطبيق') ||
                text.includes('تفعيل / شراء الآن')
            ) {

                // منع تكرار المعالجة
                if (el.dataset.heroExternalBuy === '1') return;

                el.dataset.heroExternalBuy = '1';

                el.addEventListener('click', function (e) {

                    e.preventDefault();
                    e.stopImmediatePropagation();

                    let courseId = course.id;

                    // نحاول أخذ course_id الحقيقي من الدورة
                    try {
                        if (
                            frame.contentWindow.getLicensePayload &&
                            typeof frame.contentWindow.getLicensePayload === 'function'
                        ) {
                            const payload =
                                frame.contentWindow.getLicensePayload();

                            if (payload && payload.course_id) {
                                courseId = payload.course_id;
                            }
                        }
                    } catch (err) {
                        console.log('تعذر قراءة بيانات الترخيص');
                    }

                    window.top.location.href =
                        'https://hero.kesug.com/Academy/payment.php?course_id=' +
                        encodeURIComponent(courseId);

                }, true);
            }

        });
    }

    // فحص فوري
    checkBuyButton();

    // مراقبة أي زر يتم إنشاؤه لاحقًا
    const observer = new MutationObserver(() => {
        checkBuyButton();
    });

    observer.observe(doc.body, {
        childList: true,
        subtree: true
    });

});
}

// ================================
// التوجيه
// ================================
function route() {

    const hash =
        location.hash.slice(1) || 'home';


    if (hash.startsWith('course/')) {

        const id =
            parseInt(hash.split('/')[1]);

        const course =
            coursesData.find(c => c.id === id);


        if (course) {

            // تسجيل الدورة كمجربة
            saveMyCourse(course.id);

            renderCourse(course);

        } else {

            app.innerHTML = `
                <div class="empty">
                    ⚠️ الدورة غير موجودة.
                </div>
            `;
        }


    } else if (hash === 'courses') {

        renderHome();


    } else if (hash === 'mycourses') {

        renderMyCourses();


    } else if (hash === 'about') {

        renderAbout();


    } else {

        renderAcademy();
    }
}

// ================================
// زر تثبيت التطبيق
// ================================
window.addEventListener(
    'beforeinstallprompt',
    e => {

        e.preventDefault();

        deferredInstallPrompt = e;

        setupInstallButton();
        renderInstallArea();
    }
);


function setupInstallButton() {
    const btn = document.getElementById('installAppBtn');

    if (!btn) return;

    if (deferredInstallPrompt) {
        btn.style.display = 'inline-block';

        btn.onclick = async () => {
            deferredInstallPrompt.prompt();

            const result = await deferredInstallPrompt.userChoice;

            if (result.outcome === 'accepted') {
                btn.style.display = 'none';
            }

            deferredInstallPrompt = null;
        };
    }
}


function renderInstallArea() {

    const area =
        document.getElementById('installArea');

    if (!area || !deferredInstallPrompt) return;


    area.innerHTML = `
        <div style="
            background:#eff6ff;
            border:1px solid #bfdbfe;
            border-radius:16px;
            padding:16px;
            text-align:center;
        ">

            <div style="
                font-weight:bold;
                color:#1e40af;
                margin-bottom:10px;
            ">
                📱 ثبّت أكاديمية هيرو
            </div>

            <div style="
                color:#475569;
                font-size:13px;
                line-height:1.6;
                margin-bottom:12px;
            ">
                أضف الأكاديمية إلى الشاشة الرئيسية
                للوصول إليها مثل أي تطبيق.
            </div>

            <button
                id="installAppBtn"
                style="
                    background:#2563eb;
                    color:#fff;
                    border:0;
                    padding:10px 25px;
                    border-radius:9px;
                    cursor:pointer;
                    font-weight:bold;
                "
            >
                📲 تثبيت التطبيق
            </button>

        </div>
    `;

    setupInstallButton();
}


window.addEventListener(
    'appinstalled',
    () => {

        deferredInstallPrompt = null;

        const btn =
            document.getElementById('installAppBtn');

        if (btn) {
            btn.style.display = 'none';
        }
    }
);

// ================================
// التشغيل
// ================================
window.addEventListener(
    'hashchange',
    route
);

document.addEventListener(
    'DOMContentLoaded',
    loadCourses
);
