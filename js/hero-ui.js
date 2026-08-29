// ============================================================
// hero-ui.js  -  إعادة تعريف واجهات التطبيق
// الهدف: تطبيق تصميم الصفحة الرئيسية (Hero Projects) 
// دون تعديل أي سطر في app.js أو style.css
// ============================================================

// ---- دالة مساعدة لإنشاء شريط التنقل السفلي ----
function renderNav(activeTab) {
    return `
    <nav class="nav" style="position:fixed; bottom:0; left:0; right:0; z-index:10;">
        <a href="#home" style="${activeTab === 'home' ? 'color:#a78bfa;' : ''}">
            <i class="fas fa-home"></i>
            <span>الرئيسية</span>
        </a>
        <a href="#courses" style="${activeTab === 'courses' ? 'color:#a78bfa;' : ''}">
            <i class="fas fa-book"></i>
            <span>الدورات</span>
        </a>
        <a href="#mycourses" style="${activeTab === 'mycourses' ? 'color:#a78bfa;' : ''}">
            <i class="fas fa-star"></i>
            <span>دوراتي</span>
        </a>
        <a href="#about" style="${activeTab === 'about' ? 'color:#a78bfa;' : ''}">
            <i class="fas fa-info-circle"></i>
            <span>عن</span>
        </a>
    </nav>
    `;
}

// ============================================================
// 1. إعادة تعريف الصفحة الرئيسية (Academy)
// ============================================================
window.renderAcademy = function() {
    const myCount = getMyCourses ? getMyCourses().length : 0;

    let html = `
    <div style="min-height:100vh; background:transparent; box-sizing:border-box; padding:20px 15px 100px;">

        <!-- شارة Hero Projects -->
        <div style="text-align:center; margin-bottom:18px;">
            <span style="display:inline-block; background:rgba(108,92,231,0.2); border:1px solid rgba(108,92,231,0.3); border-radius:100px; padding:6px 24px; font-size:14px; font-weight:600; color:#a78bfa; backdrop-filter:blur(4px);">
                <i class="fas fa-rocket" style="margin-left:8px;"></i> Hero Projects
            </span>
        </div>

        <!-- العنوان الرئيسي -->
        <div style="text-align:center; max-width:700px; margin:0 auto 30px;">
            <h1 style="font-size:clamp(2.4rem, 8vw, 4.2rem); font-weight:900; line-height:1.1; margin:0 0 10px; background:linear-gradient(135deg, #ffffff 0%, #c4b5fd 50%, #7c3aed 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;">
                نحو مستقبل <span style="background:linear-gradient(135deg,#fcd34d,#f59e0b); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;">رقمي</span> أفضل
            </h1>
            <p style="color:#b9c4d9; font-size:clamp(1rem, 2vw, 1.3rem); line-height:1.8; max-width:600px; margin:0 auto;">
                Hero هي علامة تجارية رقمية تهدف إلى بناء مشاريع ومنتجات تعليمية وتقنية مبتكرة تصنع فرقاً حقيقياً.
            </p>
            <a href="#courses" class="btn-primary" style="display:inline-flex; align-items:center; gap:12px; background:linear-gradient(135deg,#7c3aed,#6d28d9); color:#fff; padding:14px 44px; border-radius:60px; font-size:1.05rem; font-weight:700; border:none; cursor:pointer; transition:0.3s ease; box-shadow:0 8px 32px rgba(124,58,237,0.35); margin-top:18px; text-decoration:none;">
                <i class="fas fa-arrow-left"></i> اكششف مشاريعنا
            </a>
        </div>

                <!-- قسم: تصفح الدورات (بدلاً من مشاريعنا) -->
        <div style="max-width:1100px; margin:50px auto 0; text-align:center;">
            <div style="background:rgba(255,255,255,0.04); backdrop-filter:blur(12px); border:1px solid rgba(255,255,255,0.06); border-radius:32px; padding:60px 30px; transition:0.3s ease;">
                <div style="font-size:72px; margin-bottom:20px;">📚</div>
                <h2 style="color:#fff; font-size:clamp(1.8rem, 4vw, 2.8rem); margin:0 0 15px;">استكشف دوراتنا</h2>
                <p style="color:#b0bedb; font-size:1.1rem; max-width:500px; margin:0 auto 30px; line-height:1.8;">
                    انطلق في رحلة تعليمية مع منصتنا التفاعلية وتعلم مهارات جديدة تناسبك.
                </p>
                <a href="#courses" style="display:inline-block; background:linear-gradient(135deg,#7c3aed,#6d28d9); color:#fff; padding:16px 50px; border-radius:60px; font-size:1.2rem; font-weight:700; text-decoration:none; box-shadow:0 8px 32px rgba(124,58,237,0.4); transition:0.3s ease;">
                    🚀 تصفح الدورات
                </a>
            </div>
        </div>
        <!-- قسم: لماذا؟ -->
        <div style="max-width:1100px; margin:60px auto 0; background:rgba(255,255,255,0.02); border-top:1px solid rgba(255,255,255,0.04); border-bottom:1px solid rgba(255,255,255,0.04); padding:40px 0;">
            <div style="text-align:center; margin-bottom:30px;">
                <h2 style="display:inline; color:#fff; font-size:clamp(1.8rem, 4vw, 2.6rem); font-weight:800; margin:0;">لماذا؟</h2>
                <span style="font-size:clamp(1.8rem, 4vw, 2.6rem); font-weight:900; background:linear-gradient(135deg,#fcd34d,#f59e0b); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; margin-right:16px;">$Hero</span>
            </div>
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px,1fr)); gap:24px;">
                <div style="background:rgba(255,255,255,0.03); border-radius:20px; padding:28px 22px 24px; border:1px solid rgba(255,255,255,0.05); text-align:center;">
                    <span style="font-size:2rem; color:#a78bfa; display:block; margin-bottom:12px;"><i class="fas fa-shield-alt"></i></span>
                    <h4 style="color:#fff; font-size:1.05rem; margin:0 0 6px;">موثوقية وأمان</h4>
                    <p style="color:#94a3b8; font-size:0.9rem; line-height:1.7; margin:0;">للتزام بتقديم تجارب آمنة وموثوقة للمستخدمين.</p>
                </div>
                <div style="background:rgba(255,255,255,0.03); border-radius:20px; padding:28px 22px 24px; border:1px solid rgba(255,255,255,0.05); text-align:center;">
                    <span style="font-size:2rem; color:#a78bfa; display:block; margin-bottom:12px;"><i class="fas fa-user-circle"></i></span>
                    <h4 style="color:#fff; font-size:1.05rem; margin:0 0 6px;">تركيز على المستخدم</h4>
                    <p style="color:#94a3b8; font-size:0.9rem; line-height:1.7; margin:0;">تصميم وتجربة مستخدم في قلب كل ما تعمل عليه.</p>
                </div>
                <div style="background:rgba(255,255,255,0.03); border-radius:20px; padding:28px 22px 24px; border:1px solid rgba(255,255,255,0.05); text-align:center;">
                    <span style="font-size:2rem; color:#a78bfa; display:block; margin-bottom:12px;"><i class="fas fa-brain"></i></span>
                    <h4 style="color:#fff; font-size:1.05rem; margin:0 0 6px;">ابتكار مستمر</h4>
                    <p style="color:#94a3b8; font-size:0.9rem; line-height:1.7; margin:0;">نسعى دائماً لتقديم أفكار وحلول مبتكرة.</p>
                </div>
                <div style="background:rgba(255,255,255,0.03); border-radius:20px; padding:28px 22px 24px; border:1px solid rgba(255,255,255,0.05); text-align:center;">
                    <span style="font-size:2rem; color:#a78bfa; display:block; margin-bottom:12px;"><i class="fas fa-eye"></i></span>
                    <h4 style="color:#fff; font-size:1.05rem; margin:0 0 6px;">روبة واضحة</h4>
                    <p style="color:#94a3b8; font-size:0.9rem; line-height:1.7; margin:0;">تبني مشاريع ذات هدف وقيمة حقيقية.</p>
                </div>
            </div>
        </div>

        <!-- تابعنا -->
        <div style="max-width:1100px; margin:40px auto 0; text-align:center;">
            <h3 style="color:#fff; font-size:1.2rem; margin:0 0 14px;">تابعنا</h3>
            <p style="color:#94a3b8; font-size:0.95rem; margin-bottom:18px;">كن على اطلاع دائم بآخر الأخبار والتحديثات</p>
            <div style="display:flex; justify-content:center; gap:28px; flex-wrap:wrap;">
                <a href="#" style="font-weight:600; color:#b0bedb; transition:0.3s; display:inline-flex; align-items:center; gap:8px; text-decoration:none;"><i class="fas fa-comment-dots"></i> التواصل</a>
                <a href="#" style="font-weight:600; color:#b0bedb; transition:0.3s; display:inline-flex; align-items:center; gap:8px; text-decoration:none;"><i class="fas fa-question-circle"></i> إستفسار</a>
                <a href="#" style="font-weight:600; color:#b0bedb; transition:0.3s; display:inline-flex; align-items:center; gap:8px; text-decoration:none;"><i class="fab fa-youtube"></i> يوتبوب</a>
            </div>
        </div>

        <!-- عن Hero + روابط سريعة -->
        <div style="max-width:1100px; margin:40px auto 0; display:grid; grid-template-columns:1fr 1fr; gap:40px; align-items:start; border-top:1px solid rgba(255,255,255,0.04); padding-top:30px;">
            <div>
                <h3 style="color:#fff; font-size:1.3rem; margin:0 0 10px;">عن Hero</h3>
                <p style="color:#b0bedb; font-size:0.98rem; line-height:1.9; max-width:480px; margin:0;">نحن فريق مهم بيناء مشاريع رقمية تعليمية وتقنية تهدف إلى إحداث أثر إيجابي وسعادة الناس على التعلم والتطور.</p>
            </div>
            <div>
                <h4 style="color:#fff; font-size:1.1rem; margin:0 0 12px;">روابط سريعة</h4>
                <ul style="list-style:none; padding:0; margin:0; display:flex; flex-wrap:wrap; gap:16px 32px;">
                    <li><a href="#home" style="color:#b0bedb; font-size:0.95rem; font-weight:500; text-decoration:none; transition:0.3s; position:relative;">الرئيسية</a></li>
                    <li><a href="#courses" style="color:#b0bedb; font-size:0.95rem; font-weight:500; text-decoration:none; transition:0.3s; position:relative;">مشاريعنا</a></li>
                    <li><a href="#about" style="color:#b0bedb; font-size:0.95rem; font-weight:500; text-decoration:none; transition:0.3s; position:relative;">من نحن</a></li>
                    <li><a href="#about" style="color:#b0bedb; font-size:0.95rem; font-weight:500; text-decoration:none; transition:0.3s; position:relative;">تواصل معنا</a></li>
                </ul>
            </div>
        </div>

        <!-- التواصل + السودان -->
        <div style="max-width:1100px; margin:30px auto 0; display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:20px; border-top:1px solid rgba(255,255,255,0.04); padding-top:30px;">
            <div>
                <h4 style="color:#fff; font-size:1.1rem; margin:0 0 4px;"><i class="fas fa-envelope" style="margin-left:10px; color:#7c8db0;"></i> التواصل معنا</h4>
                <p style="color:#94a3b8; font-size:0.9rem; margin:0 0 4px;">نحن هنا للإجابة على استفساراتك واقتراحاتك.</p>
                <span style="font-size:1rem; color:#a78bfa; font-weight:600; direction:ltr; display:inline-block;"><i class="fas fa-at"></i> info@hero1.vip</span>
            </div>
            <!--<a href="#" style="display:inline-flex; align-items:center; gap:6px; background:rgba(255,255,255,0.04); padding:6px 20px; border-radius:100px; border:1px solid rgba(255,255,255,0.06); color:#b0bedb; font-weight:500; font-size:0.95rem; text-decoration:none;">
                <i class="fas fa-map-marker-alt" style="color:#fbbf24;"></i> السودان
            </a>-->
        </div>

        <!-- مساحة للتثبيت (تحت المحتوى) -->
        <div id="installArea" style="max-width:1100px; margin:30px auto 0;"></div>
    </div>
    `;

    app.innerHTML = html + renderNav('home');

    // استدعاء زر التثبيت (دالة موجودة في app.js)
    if (typeof setupInstallButton === 'function') {
        setTimeout(setupInstallButton, 50);
    }
};

// ============================================================
// 2. إعادة تعريف صفحة الدورات (Courses)
// ============================================================
window.renderHome = function() {
    let html = `
    <div style="max-width:1100px; margin:auto; padding:20px 18px 100px;">
        <div style="display:flex; align-items:center; gap:10px; margin-bottom:25px;">
            <button onclick="location.hash='#home'" style="border:0; background:rgba(255,255,255,0.06); color:#fff; width:42px; height:42px; border-radius:12px; cursor:pointer; font-size:22px; backdrop-filter:blur(4px); border:1px solid rgba(255,255,255,0.08);">
                ←
            </button>
            <h1 style="margin:0; font-size:25px; color:#fff;">📚 الدورات المتاحة</h1>
        </div>
    `;

    // عرض التصنيفات والدورات (نفس منطق app.js)
    const visibleCourses = coursesData.filter(c => c.visible !== false);

    if (categoriesData.length) {
        categoriesData.forEach(category => {
            const catCourses = visibleCourses.filter(c => c.category === category.id);
            if (!catCourses.length) return;

            html += `
            <section style="margin-bottom:40px;">
                <h2 style="color:#fff; margin-bottom:15px; padding-bottom:8px; border-bottom:2px solid rgba(255,255,255,0.06);">
                    ${esc(category.icon || '📚')} ${esc(category.title)}
                </h2>
                <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(250px,1fr)); gap:16px;">
            `;

            catCourses.forEach(course => {
                html += `
                <div style="background:rgba(255,255,255,0.04); backdrop-filter:blur(12px); border:1px solid rgba(255,255,255,0.06); border-radius:20px; padding:22px; transition:0.3s ease;">
                    <div style="font-size:40px; margin-bottom:10px;">${esc(course.icon)}</div>
                    <h3 style="color:#fff; margin:8px 0;">${esc(course.title)}</h3>
                    <p style="color:#b0bedb; font-size:14px; line-height:1.7;">${esc(course.description)}</p>
                    <a href="#course/${course.id}" onclick="saveMyCourse(${course.id})" style="display:block; text-align:center; background:linear-gradient(135deg,#7c3aed,#6d28d9); color:#fff; text-decoration:none; padding:10px; border-radius:60px; font-weight:bold; margin-top:15px; transition:0.3s;">▶ ابدأ التجربة</a>
                </div>
                `;
            });

            html += `</div></section>`;
        });
    } else {
        // وضع قديم بدون تصنيفات
        html += `<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(250px,1fr)); gap:16px;">`;
        visibleCourses.forEach(course => {
            html += `
            <div style="background:rgba(255,255,255,0.04); backdrop-filter:blur(12px); border:1px solid rgba(255,255,255,0.06); border-radius:20px; padding:22px;">
                <div style="font-size:40px;">${esc(course.icon)}</div>
                <h3 style="color:#fff;">${esc(course.title)}</h3>
                <p style="color:#b0bedb;">${esc(course.description)}</p>
                <a href="#course/${course.id}" onclick="saveMyCourse(${course.id})" style="display:block; text-align:center; background:linear-gradient(135deg,#7c3aed,#6d28d9); color:#fff; text-decoration:none; padding:10px; border-radius:60px; font-weight:bold;">▶ ابدأ التجربة</a>
            </div>
            `;
        });
        html += `</div>`;
    }

    html += `</div>`;
    app.innerHTML = html + renderNav('courses');

    if (typeof setupInstallButton === 'function') {
        setTimeout(setupInstallButton, 50);
    }
};

// ============================================================
// 3. إعادة تعريف صفحة دوراتي (My Courses)
// ============================================================
window.renderMyCourses = function() {
    const myIds = getMyCourses ? getMyCourses() : [];
    const myCourses = coursesData.filter(c => myIds.includes(Number(c.id)));

    let html = `
    <div style="max-width:1100px; margin:auto; padding:20px 18px 100px;">
        <div style="display:flex; align-items:center; gap:10px; margin-bottom:25px;">
            <button onclick="location.hash='#home'" style="border:0; background:rgba(255,255,255,0.06); color:#fff; width:42px; height:42px; border-radius:12px; cursor:pointer; font-size:22px; backdrop-filter:blur(4px); border:1px solid rgba(255,255,255,0.08);">
                ←
            </button>
            <h1 style="margin:0; font-size:25px; color:#fff;">⭐ دوراتي</h1>
        </div>
    `;

    if (!myCourses.length) {
        html += `
        <div style="text-align:center; padding:60px 20px; background:rgba(255,255,255,0.04); border-radius:24px; backdrop-filter:blur(8px); border:1px solid rgba(255,255,255,0.06);">
            <div style="font-size:55px; margin-bottom:15px;">📚</div>
            <h2 style="color:#fff;">لا توجد دورات بعد</h2>
            <p style="color:#94a3b8; line-height:1.7;">عندما تبدأ تجربة أي دورة ستظهر هنا لتستطيع العودة إليها بسرعة.</p>
            <button onclick="location.hash='#courses'" style="background:linear-gradient(135deg,#7c3aed,#6d28d9); color:#fff; border:0; padding:11px 25px; border-radius:60px; cursor:pointer; font-weight:bold; margin-top:10px;">📚 استعراض الدورات</button>
        </div>
        `;
    } else {
        html += `<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(250px,1fr)); gap:16px;">`;
        myCourses.forEach(course => {
            html += `
            <div style="background:rgba(255,255,255,0.04); backdrop-filter:blur(12px); border:1px solid rgba(255,255,255,0.06); border-radius:20px; padding:22px;">
                <div style="font-size:40px; margin-bottom:10px;">${esc(course.icon)}</div>
                <h3 style="color:#fff;">${esc(course.title)}</h3>
                <p style="color:#b0bedb; line-height:1.7;">${esc(course.description)}</p>
                <a href="#course/${course.id}" style="display:block; text-align:center; background:linear-gradient(135deg,#7c3aed,#6d28d9); color:#fff; text-decoration:none; padding:10px; border-radius:60px; font-weight:bold; margin-top:15px;">▶ متابعة الدورة</a>
            </div>
            `;
        });
        html += `</div>`;
    }

    html += `</div>`;
    app.innerHTML = html + renderNav('mycourses');
};

// ============================================================
// 4. إعادة تعريف صفحة عن الأكاديمية
// ============================================================
window.renderAbout = function() {
    let html = `
    <div style="max-width:700px; margin:auto; padding:25px 20px 100px; text-align:center;">
        <button onclick="location.hash='#home'" style="border:0; background:rgba(255,255,255,0.06); color:#fff; padding:9px 18px; border-radius:12px; cursor:pointer; margin-bottom:25px; backdrop-filter:blur(4px); border:1px solid rgba(255,255,255,0.08);">
            ← الرئيسية
        </button>
        <div style="font-size:65px;">🎓</div>
        <h1 style="color:#fff; background:linear-gradient(135deg,#ffffff,#c4b5fd,#7c3aed); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;">أكاديمية هيرو</h1>
        <p style="color:#b0bedb; line-height:1.9; font-size:16px;">منصة تعليمية تساعدك على الوصول إلى الدورات والمواد التعليمية بطريقة بسيطة ومنظمة.</p>
        
        <div style="display:flex; flex-wrap:wrap; justify-content:center; gap:10px; margin-top:25px;">
            <a href="https://Academy.hero1.vip" target="_blank" rel="noopener" style="display:inline-block; padding:11px 20px; border-radius:60px; background:linear-gradient(135deg,#7c3aed,#6d28d9); color:#fff; text-decoration:none; font-weight:bold;">🎓 موقع الأكاديمية</a>
            <a href="https://web.facebook.com/Heropwa" target="_blank" rel="noopener" style="display:inline-block; padding:11px 20px; border-radius:60px; background:#1877f2; color:#fff; text-decoration:none; font-weight:bold;">📘 فيسبوك</a>
            <a href="https://t.me/Herocourses" target="_blank" rel="noopener" style="display:inline-block; padding:11px 20px; border-radius:60px; background:#0088cc; color:#fff; text-decoration:none; font-weight:bold;">📘 تيليجرام</a>
            <a href="https://wa.me/249915886600" target="_blank" rel="noopener" style="display:inline-block; padding:11px 20px; border-radius:60px; background:#25D366; color:#fff; text-decoration:none; font-weight:bold;">📘 واتساب</a>
            <a href="https://t.me/+kJNKpuOP-jQwZTM0" target="_blank" rel="noopener" style="display:inline-block; padding:11px 20px; border-radius:60px; background:#0088cc; color:#fff; text-decoration:none; font-weight:bold;">📘 قناة تيليجرام</a>
            <a href="https://www.youtube.com/@Hero1vip" target="_blank" rel="noopener" style="display:inline-block; padding:11px 20px; border-radius:60px; background:#FF0000; color:#fff; text-decoration:none; font-weight:bold;">📘 يوتيوب</a>
        </div>
    </div>
    `;
    app.innerHTML = html + renderNav('about');
};
