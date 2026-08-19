// ============================================================
// App Module – المنطق الرئيسي
// ============================================================

(function() {
    "use strict";

    // ===== دوال عرض الصفحات =====

    function renderHome(container) {
        container.innerHTML = `
            <div class="page-title"><span>🏠</span> الرئيسية</div>
            <div style="text-align:center;padding:20px 0;">
                <h1 style="font-size:32px;color:var(--primary);">تعلم بذكاء</h1>
                <p style="font-size:18px;color:var(--gray-500);max-width:500px;margin:10px auto;">
                    تطبيقات تعليمية تساعدك على الفهم والمراجعة والتدريب.
                </p>
                <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:20px;">
                    <button class="btn btn-primary" data-nav="apps">📱 استكشف التطبيقات</button>
                    <button class="btn btn-primary" data-nav="courses">📚 استكشف الدورات</button>
                    <button class="btn btn-success" data-nav="my-courses">🎓 دوراتي</button>
                </div>
            </div>
            <hr style="margin:30px 0;border-color:var(--gray-200);">
            <div style="margin-top:20px;">
                <h2 class="page-title" style="font-size:22px;">📱 التطبيقات التعليمية</h2>
                <div id="home-apps-grid" class="card-grid"></div>
            </div>
            <div style="margin-top:40px;">
                <h2 class="page-title" style="font-size:22px;">📚 الدورات المميزة</h2>
                <div id="home-courses-grid" class="card-grid"></div>
            </div>
        `;

        // تحميل البيانات
        loadApps('home-apps-grid', 3);
        loadCourses('home-courses-grid', 3);
    }

    function renderApps(container) {
        container.innerHTML = `
            <div class="page-title"><span>📱</span> التطبيقات التعليمية</div>
            <div id="apps-grid" class="card-grid"></div>
        `;
        loadApps('apps-grid');
    }

    function renderCourses(container) {
        container.innerHTML = `
            <div class="page-title"><span>📚</span> الدورات المتاحة</div>
            <div id="courses-grid" class="card-grid"></div>
        `;
        loadCourses('courses-grid');
    }

    function renderMyCourses(container) {
        container.innerHTML = `
            <div class="page-title"><span>🎓</span> دوراتي</div>
            <div id="my-courses-grid" class="card-grid"></div>
        `;
        loadMyCourses();
    }

    function renderSettings(container) {
        const settings = Storage.getSettings();
        container.innerHTML = `
            <div class="page-title"><span>⚙️</span> الإعدادات</div>
            <div style="background:var(--card-bg);border-radius:var(--radius);padding:25px;box-shadow:var(--shadow);">
                <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--gray-200);">
                    <span style="font-weight:600;">الوضع الداكن</span>
                    <button id="settings-theme-toggle" class="btn btn-outline">${settings.theme === 'dark' ? '☀️ فاتح' : '🌙 داكن'}</button>
                </div>
                <div style="padding:10px 0;border-bottom:1px solid var(--gray-200);">
                    <span style="font-weight:600;">الدورات المفعلة</span>
                    <span style="display:block;color:var(--gray-500);">${Object.keys(Storage.getActivatedCourses()).length} دورات</span>
                </div>
                <div style="padding:10px 0;">
                    <button class="btn btn-danger" id="clear-all-data">🗑 مسح جميع البيانات</button>
                </div>
                <div style="padding:10px 0;color:var(--gray-400);font-size:13px;">
                    الإصدار 1.0.0
                </div>
            </div>
        `;

        document.getElementById('settings-theme-toggle')?.addEventListener('click', () => {
            document.body.classList.toggle('dark');
            const isDark = document.body.classList.contains('dark');
            const btn = document.getElementById('settings-theme-toggle');
            btn.textContent = isDark ? '☀️ فاتح' : '🌙 داكن';
            const settings = Storage.getSettings();
            settings.theme = isDark ? 'dark' : 'light';
            Storage.setSettings(settings);
            // تحديث زر الثيم في الهيدر
            const headerThemeBtn = document.getElementById('theme-toggle');
            if (headerThemeBtn) headerThemeBtn.textContent = isDark ? '☀️' : '🌙';
        });

        document.getElementById('clear-all-data')?.addEventListener('click', () => {
            if (confirm('هل أنت متأكد من مسح جميع البيانات المخزنة محلياً؟')) {
                localStorage.clear();
                alert('تم مسح البيانات. سيتم إعادة تحميل الصفحة.');
                window.location.reload();
            }
        });
    }

    // ===== دوال تحميل البيانات =====

    function loadApps(containerId, limit = 0) {
        const container = document.getElementById(containerId);
        if (!container) return;
        fetch('/data/apps.json')
            .then(res => res.json())
            .then(apps => {
                let items = apps;
                if (limit > 0) items = items.slice(0, limit);
                if (items.length === 0) {
                    container.innerHTML = `<div class="empty-state"><p>لا توجد تطبيقات</p></div>`;
                    return;
                }
                container.innerHTML = '';
                items.forEach(app => {
                    const card = document.createElement('div');
                    card.className = 'card';
                    card.innerHTML = `
                        <div class="card-header">
                            <div class="icon">${app.icon || '📱'}</div>
                            <h3>${app.title}</h3>
                        </div>
                        <div class="card-body">
                            <p class="description">${app.description || ''}</p>
                            <div class="meta">
                                ${app.subject ? `<span>📖 ${app.subject}</span>` : ''}
                                ${app.grade ? `<span>🎓 ${app.grade}</span>` : ''}
                            </div>
                        </div>
                        <div class="card-footer">
                            <button class="btn btn-primary" data-action="open-app" data-id="${app.id}">🚀 تجربة التطبيق</button>
                            <button class="btn btn-outline" data-action="app-details" data-id="${app.id}">ℹ️ معرفة المزيد</button>
                        </div>
                    `;
                    container.appendChild(card);
                });
            })
            .catch(err => {
                container.innerHTML = `<div class="empty-state"><p>⚠️ تعذر تحميل التطبيقات</p></div>`;
                console.error(err);
            });
    }

    function loadCourses(containerId, limit = 0) {
        const container = document.getElementById(containerId);
        if (!container) return;
        fetch('/data/courses.json')
            .then(res => res.json())
            .then(courses => {
                let items = courses;
                if (limit > 0) items = items.slice(0, limit);
                if (items.length === 0) {
                    container.innerHTML = `<div class="empty-state"><p>لا توجد دورات</p></div>`;
                    return;
                }
                container.innerHTML = '';
                items.forEach(course => {
                    const isActivated = Activation.isActivated(course.id);
                    const hasTrial = Trial.hasActiveTrial(course.id);
                    const card = document.createElement('div');
                    card.className = 'card';
                    let statusBadge = '';
                    if (isActivated) statusBadge = '<span class="badge success">✅ مفعل</span>';
                    else if (hasTrial) statusBadge = '<span class="badge warning">🎁 تجربة</span>';
                    card.innerHTML = `
                        <div class="card-header">
                            <div class="icon">${course.icon || '📚'}</div>
                            <h3>${course.title}</h3>
                            ${statusBadge}
                        </div>
                        <div class="card-body">
                            <p class="description">${course.description || ''}</p>
                            <div class="meta">
                                ${course.subject ? `<span>📖 ${course.subject}</span>` : ''}
                                ${course.grade ? `<span>🎓 ${course.grade}</span>` : ''}
                                ${course.price ? `<span>💰 ${course.price}</span>` : ''}
                            </div>
                        </div>
                        <div class="card-footer">
                            ${isActivated ? `<button class="btn btn-success" data-action="open-course" data-id="${course.id}">📖 فتح الدورة</button>` :
                              hasTrial ? `<button class="btn btn-warning" data-action="continue-trial" data-id="${course.id}">⏳ متابعة التجربة</button>` :
                              `<button class="btn btn-primary" data-action="start-trial" data-id="${course.id}">🎁 تجربة مجانية</button>`}
                            <button class="btn btn-outline" data-action="buy-course" data-id="${course.id}">🛒 شراء</button>
                        </div>
                    `;
                    container.appendChild(card);
                });
            })
            .catch(err => {
                container.innerHTML = `<div class="empty-state"><p>⚠️ تعذر تحميل الدورات</p></div>`;
                console.error(err);
            });
    }

    function loadMyCourses() {
        const container = document.getElementById('my-courses-grid');
        if (!container) return;
        const activated = Storage.getActivatedCourses();
        const courseIds = Object.keys(activated);
        if (courseIds.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="icon">📭</div>
                    <h3>لا توجد دورات مفعلة</h3>
                    <p>قم بشراء دورة أو إدخال كود التفعيل للحصول على الدورات.</p>
                    <button class="btn btn-primary" data-nav="courses" style="margin-top:15px;">استكشف الدورات</button>
                </div>
            `;
            return;
        }
        fetch('/data/courses.json')
            .then(res => res.json())
            .then(courses => {
                const activatedCourses = courses.filter(c => activated[c.id]);
                if (activatedCourses.length === 0) {
                    container.innerHTML = `<div class="empty-state"><p>لا توجد دورات مفعلة</p></div>`;
                    return;
                }
                container.innerHTML = '';
                activatedCourses.forEach(course => {
                    const card = document.createElement('div');
                    card.className = 'card';
                    card.innerHTML = `
                        <div class="card-header">
                            <div class="icon">${course.icon || '🎓'}</div>
                            <h3>${course.title}</h3>
                            <span class="badge success">✅ مفعل</span>
                        </div>
                        <div class="card-body">
                            <p class="description">${course.description || ''}</p>
                        </div>
                        <div class="card-footer">
                            <button class="btn btn-success" data-action="open-course" data-id="${course.id}">📖 فتح الدورة</button>
                            <button class="btn btn-danger" data-action="deactivate-course" data-id="${course.id}">🗑 إلغاء التفعيل</button>
                        </div>
                    `;
                    container.appendChild(card);
                });
            })
            .catch(err => {
                container.innerHTML = `<div class="empty-state"><p>⚠️ تعذر تحميل البيانات</p></div>`;
                console.error(err);
            });
    }

    // ===== معالجات الأحداث =====

    function handleAction(e) {
        const target = e.target.closest('[data-action]');
        if (!target) return;
        const action = target.dataset.action;
        const id = target.dataset.id;
        if (!id) return;

        switch (action) {
            case 'start-trial':
            case 'continue-trial':
                openCourse(id, action === 'continue-trial');
                break;
            case 'open-course':
                openCourse(id, false);
                break;
            case 'buy-course':
                window.location.href = `https://hero.kesug.com/Academy/buy.php?course_id=${id}`;
                break;
            case 'deactivate-course':
                if (confirm('هل أنت متأكد من إلغاء تفعيل هذه الدورة؟')) {
                    Activation.deactivateCourse(parseInt(id));
                    Router.navigate('my-courses');
                }
                break;
            case 'open-app':
                alert(`سيتم فتح التطبيق: ${id} (قيد التطوير)`);
                break;
            case 'app-details':
                alert(`تفاصيل التطبيق: ${id} (قيد التطوير)`);
                break;
            default:
                console.warn('Unknown action:', action);
        }
    }

    function openCourse(courseId, isTrial = false) {
        const idNum = parseInt(courseId);
        if (!idNum) return;

        // التحقق من التفعيل
        const activated = Activation.isActivated(idNum);
        if (activated) {
            loadCourseContent(idNum, false);
            return;
        }

        // التحقق من التجربة النشطة
        if (Trial.hasActiveTrial(idNum)) {
            loadCourseContent(idNum, true);
            return;
        }

        // إذا كانت طلب متابعة تجربة ولكن لا توجد تجربة نشطة
        if (isTrial) {
            // بدء تجربة جديدة
            Trial.startTrial(idNum);
            loadCourseContent(idNum, true);
            return;
        }

        // لا تفعيل ولا تجربة: عرض شاشة الخيارات
        const container = document.getElementById('main-content');
        container.innerHTML = `
            <div style="text-align:center;padding:40px 20px;">
                <div style="font-size:60px;margin-bottom:20px;">🔒</div>
                <h2>هذه الدورة غير مفعلة</h2>
                <p style="color:var(--gray-500);margin:15px 0;">يمكنك:</p>
                <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
                    <button class="btn btn-warning" onclick="window.startTrialHandler(${idNum})">🎁 تجربة مجانية</button>
                    <button class="btn btn-primary" onclick="window.showActivationModal(${idNum})">🔑 لدي كود تفعيل</button>
                    <button class="btn btn-outline" onclick="Router.navigate('courses')">📚 العودة للدورات</button>
                </div>
            </div>
        `;
    }

    window.startTrialHandler = function(courseId) {
        Trial.startTrial(courseId);
        Router.navigate('my-courses');
        setTimeout(() => {
            openCourse(courseId, true);
        }, 300);
    };

    window.showActivationModal = function(courseId) {
        const modal = document.getElementById('activation-modal');
        modal.dataset.courseId = courseId;
        modal.style.display = 'flex';
        document.getElementById('activation-code-input').value = '';
        document.getElementById('activation-message').textContent = '';
        document.getElementById('activation-message').style.color = '#b00020';
    };

    function loadCourseContent(courseId, isTrial) {
        const container = document.getElementById('main-content');
        container.innerHTML = `<div style="text-align:center;padding:40px;">جاري تحميل الدورة...</div>`;

        const path = `/courses/course-${courseId}/content.json`;
        fetch(path)
            .then(res => {
                if (!res.ok) throw new Error('Content not found');
                return res.json();
            })
            .then(content => {
                container.innerHTML = `
                    <button class="btn btn-outline" onclick="Router.navigate('my-courses')" style="margin-bottom:15px;">⬅ العودة</button>
                    <div id="course-player"></div>
                `;
                renderCourseContent(courseId, content, isTrial);
            })
            .catch(err => {
                container.innerHTML = `<div class="empty-state"><div class="icon">❌</div><h3>تعذر تحميل المحتوى</h3><p>تأكد من اتصالك بالإنترنت.</p></div>`;
                console.error(err);
            });
    }

    function renderCourseContent(courseId, content, isTrial) {
        const container = document.getElementById('course-player');
        if (!container) return;

        let html = `
            <div class="course-player">
                <h2>${content.title || 'الدورة'}</h2>
                ${isTrial ? `<div class="trial-bar">🎁 تجربة مجانية <span class="timer" id="trial-timer"></span></div>` : ''}
                <div class="content-body">
        `;

        if (content.content && Array.isArray(content.content)) {
            content.content.forEach(section => {
                html += `<div class="section">`;
                html += `<h3>${section.title || ''}</h3>`;
                if (section.type === 'text') {
                    html += `<p>${section.text || ''}</p>`;
                } else if (section.type === 'image' && section.src) {
                    html += `<img src="${section.src}" alt="${section.title || ''}" loading="lazy">`;
                } else if (section.type === 'audio' && section.src) {
                    html += `<audio controls><source src="${section.src}" type="audio/mpeg"></audio>`;
                } else if (section.type === 'video' && section.src) {
                    html += `<video controls><source src="${section.src}" type="video/mp4"></video>`;
                } else if (section.type === 'list' && section.items) {
                    html += `<ul>${section.items.map(item => `<li>${item}</li>`).join('')}</ul>`;
                }
                html += `</div>`;
            });
        } else {
            html += `<p>لا يوجد محتوى معروض.</p>`;
        }

        html += `
                </div>
                ${isTrial ? `<div style="text-align:center;margin-top:20px;"><button class="btn btn-primary" id="activate-from-trial">🔑 لدي كود تفعيل</button></div>` : ''}
            </div>
        `;

        container.innerHTML = html;

        if (isTrial) {
            // بدء العداد
            Trial.updateTimer('trial-timer', courseId);

            // زر التفعيل أثناء التجربة
            document.getElementById('activate-from-trial')?.addEventListener('click', () => {
                window.showActivationModal(courseId);
            });

            // التحقق من انتهاء التجربة
            const checkExpiry = setInterval(() => {
                const status = Trial.getTrialStatus(courseId);
                if (!status.active || status.expired) {
                    clearInterval(checkExpiry);
                    const bar = document.querySelector('.trial-bar');
                    if (bar) {
                        bar.innerHTML = '⏰ انتهت التجربة! <button class="btn btn-primary" onclick="window.showActivationModal(' + courseId + ')">🔑 تفعيل</button>';
                    }
                }
            }, 1000);
        }
    }

    // ===== تهيئة التطبيق =====

    function initApp() {
        // تسجيل الصفحات
        Router.registerPage('home', renderHome);
        Router.registerPage('apps', renderApps);
        Router.registerPage('courses', renderCourses);
        Router.registerPage('my-courses', renderMyCourses);
        Router.registerPage('settings', renderSettings);

        // بدء Router
        Router.init();

        // أحداث الأزرار الديناميكية (delegation)
        document.addEventListener('click', handleAction);

        // التعامل مع أزرار التنقل من data-nav
        document.addEventListener('click', (e) => {
            const target = e.target.closest('[data-nav]');
            if (target) {
                e.preventDefault();
                const page = target.dataset.nav;
                if (page) Router.navigate(page);
            }
        });

        console.log('App initialized');
    }

    // تشغيل التطبيق عند تحميل الصفحة
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initApp);
    } else {
        initApp();
    }

})();
