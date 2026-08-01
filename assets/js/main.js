/**
 * Hero Academy - Frontend JavaScript
 * تصميم متقدم مع تأثيرات تفاعلية
 */

// ===== بيانات الدورات =====
const coursesData = [
    {
        id: 1,
        title: 'الفيزياء - الثانوية العامة',
        description: 'دورة شاملة في الفيزياء تغطي الميكانيكا، الكهرباء، والمغناطيسية مع تطبيقات عملية.',
        price: 99,
        image: 'assets/images/course-1.jpg',
        icon: 'fa-atom',
        badge: 'الأكثر طلباً',
        contents: ['الميكانيكا الكلاسيكية', 'الكهرباء الساكنة', 'التيار الكهربائي', 'المغناطيسية', 'الفيزياء الحديثة']
    },
    {
        id: 2,
        title: 'اللغة الإنجليزية - المستوى المتقدم',
        description: 'دورة متكاملة لتعلم اللغة الإنجليزية من الصفر حتى الاحتراف تشمل المحادثة والقواعد والمفردات.',
        price: 149,
        image: 'assets/images/course-2.jpg',
        icon: 'fa-language',
        badge: 'شهادة معتمدة',
        contents: ['قواعد اللغة الأساسية', 'المحادثة اليومية', 'المفردات المتقدمة', 'الاستماع والفهم', 'الكتابة الأكاديمية']
    },
    {
        id: 3,
        title: 'البرمجة للمبتدئين',
        description: 'دورة تدريبية في أساسيات البرمجة بلغات Python و JavaScript و PHP مع مشاريع عملية.',
        price: 199,
        image: 'assets/images/course-3.jpg',
        icon: 'fa-code',
        badge: 'مشاريع عملية',
        contents: ['مقدمة في البرمجة', 'Python الأساسيات', 'JavaScript للواجهات', 'PHP للخوادم', 'مشروع متكامل']
    },
    {
        id: 4,
        title: 'الكيمياء العضوية',
        description: 'فهم شامل للكيمياء العضوية مع شرح تفصيلي للمركبات والتفاعلات الكيميائية.',
        price: 79,
        image: 'assets/images/course-4.jpg',
        icon: 'fa-flask',
        badge: 'تخفيض 20%',
        contents: ['مقدمة في الكيمياء العضوية', 'الهيدروكربونات', 'المجموعات الوظيفية', 'تفاعلات الاستبدال والإضافة', 'البوليمرات']
    },
    {
        id: 5,
        title: 'الرياضيات التطبيقية',
        description: 'دورة في الرياضيات التطبيقية تغطي الجبر، التفاضل، التكامل، والإحصاء مع تطبيقات عملية.',
        price: 89,
        image: 'assets/images/course-5.jpg',
        icon: 'fa-calculator',
        badge: '',
        contents: ['الجبر الخطي', 'التفاضل والتكامل', 'الإحصاء والاحتمالات', 'المعادلات التفاضلية', 'تطبيقات في العلوم']
    },
    {
        id: 6,
        title: 'التصميم الجرافيكي',
        description: 'تعلم أساسيات التصميم الجرافيكي باستخدام أدوات مثل Photoshop و Illustrator و Figma.',
        price: 159,
        image: 'assets/images/course-6.jpg',
        icon: 'fa-paint-brush',
        badge: 'أحدث دورة',
        contents: ['مبادئ التصميم', 'Adobe Photoshop', 'Adobe Illustrator', 'Figma للواجهات', 'مشاريع عملية']
    }
];

// ===== عرض الدورات =====
function renderCourses(containerId, courses, limit = null) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let displayCourses = courses;
    if (limit && courses.length > limit) {
        displayCourses = courses.slice(0, limit);
    }

    let html = '';
    displayCourses.forEach(course => {
        const priceText = course.price > 0 ? `${course.price} ريال` : 'مجاني';
        const priceClass = course.price === 0 ? 'free' : '';
        const badgeHtml = course.badge ? `<span class="card-badge">${course.badge}</span>` : '';

        html += `
            <div class="course-card">
                <div class="card-image">
                    <img src="${course.image}" alt="${course.title}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                    <i class="fas ${course.icon}" style="display:none; font-size:50px; color:var(--primary);"></i>
                    ${badgeHtml}
                </div>
                <div class="card-body">
                    <h3>${course.title}</h3>
                    <p>${course.description}</p>
                </div>
                <div class="card-footer">
                    <span class="price ${priceClass}">${priceText}</span>
                    <a href="course-details.html?id=${course.id}" class="btn-card">
                        <i class="fas fa-eye"></i> تفاصيل
                    </a>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

// ===== عرض تفاصيل الدورة =====
function renderCourseDetail() {
    const container = document.getElementById('courseDetail');
    if (!container) return;

    const urlParams = new URLSearchParams(window.location.search);
    const courseId = parseInt(urlParams.get('id'));

    if (!courseId) {
        container.innerHTML = `
            <div class="empty-state" style="text-align:center;padding:60px 20px;">
                <i class="fas fa-exclamation-circle" style="font-size:48px;color:var(--gray-300);"></i>
                <h3 style="margin:16px 0 8px;">لم يتم تحديد دورة</h3>
                <p style="color:var(--gray-500);"><a href="courses.html" style="color:var(--primary);">عرض جميع الدورات</a></p>
            </div>
        `;
        return;
    }

    const course = coursesData.find(c => c.id === courseId);
    if (!course) {
        container.innerHTML = `
            <div class="empty-state" style="text-align:center;padding:60px 20px;">
                <i class="fas fa-search" style="font-size:48px;color:var(--gray-300);"></i>
                <h3 style="margin:16px 0 8px;">الدورة غير موجودة</h3>
                <p style="color:var(--gray-500);"><a href="courses.html" style="color:var(--primary);">عرض جميع الدورات</a></p>
            </div>
        `;
        return;
    }

    const priceText = course.price > 0 ? `${course.price} ريال` : 'مجاني';
    const priceClass = course.price === 0 ? 'free' : '';
    const contentsHtml = course.contents && course.contents.length > 0 ? `
        <div class="contents" style="margin:24px 0;">
            <h3 style="font-size:20px;font-weight:800;margin-bottom:12px;">
                <i class="fas fa-list" style="color:var(--primary);"></i> محتويات الدورة
            </h3>
            <ul style="list-style:none;padding:0;">
                ${course.contents.map(item => `<li style="padding:8px 0;border-bottom:1px solid var(--gray-100);display:flex;align-items:center;gap:12px;"><i class="fas fa-check-circle" style="color:var(--secondary);"></i> ${item}</li>`).join('')}
            </ul>
        </div>
    ` : '';

    container.innerHTML = `
        <div style="background:var(--white);border-radius:var(--radius-md);overflow:hidden;box-shadow:var(--shadow-md);">
            <div style="height:300px;background:linear-gradient(135deg,var(--gray-100),var(--gray-300));display:flex;align-items:center;justify-content:center;overflow:hidden;">
                <img src="${course.image}" alt="${course.title}" style="width:100%;height:100%;object-fit:cover;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                <i class="fas ${course.icon}" style="display:none;font-size:80px;color:var(--primary);"></i>
            </div>
            <div style="padding:40px;">
                <h1 style="font-size:32px;font-weight:900;margin-bottom:12px;">${course.title}</h1>
                <div style="display:flex;gap:24px;flex-wrap:wrap;margin-bottom:20px;color:var(--gray-500);">
                    <span><i class="fas fa-tag" style="color:var(--primary);"></i> ${priceText}</span>
                    <span><i class="fas fa-book" style="color:var(--primary);"></i> ${course.contents ? course.contents.length : 0} دروس</span>
                </div>
                <p style="font-size:17px;color:var(--gray-700);margin-bottom:24px;line-height:1.8;">${course.description}</p>
                ${contentsHtml}
                <div style="background:var(--gray-100);padding:20px;border-radius:var(--radius-sm);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;">
                    <span style="font-size:28px;font-weight:900;color:var(--primary);${course.price === 0 ? 'color:var(--success);' : ''}">${priceText}</span>
                    <a href="https://hero.kesug.com/Academy/buy.php?course_id=${course.id}" style="background:var(--secondary);color:var(--dark);padding:14px 40px;border-radius:30px;font-weight:800;font-size:18px;transition:var(--transition);display:inline-flex;align-items:center;gap:10px;">
                        <i class="fas fa-shopping-cart"></i> ابدأ الاشتراك
                    </a>
                </div>
            </div>
        </div>
    `;
}

// ===== عد تنازلي =====
function startCountdown() {
    const counter = document.getElementById('offerCounter');
    if (!counter) return;

    let totalSeconds = 3 * 24 * 60 * 60 + 12 * 60 * 60 + 45 * 60;

    setInterval(() => {
        if (totalSeconds <= 0) {
            counter.textContent = 'انتهى العرض!';
            return;
        }
        totalSeconds--;
        const days = Math.floor(totalSeconds / (24 * 60 * 60));
        const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
        const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
        counter.textContent = `${days}d ${hours}h ${minutes}m`;
    }, 1000);
}

// ===== عدادات الأرقام المتحركة =====
function animateNumbers() {
    const numbers = document.querySelectorAll('.hero-stats .number');
    numbers.forEach(el => {
        const target = parseInt(el.getAttribute('data-count'));
        if (!target) return;
        let current = 0;
        const increment = Math.ceil(target / 60);
        const duration = 2000;
        const stepTime = duration / 60;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                el.textContent = target + '+';
                clearInterval(timer);
            } else {
                el.textContent = current + '+';
            }
        }, stepTime);
    });
}

// ===== إغلاق البنرات =====
function closeTopBanner() {
    document.getElementById('topBanner').style.display = 'none';
}

function closeBottomBanner() {
    document.getElementById('bottomBanner').style.display = 'none';
}

// ===== القائمة المتنقلة =====
function initMobileMenu() {
    const toggle = document.getElementById('menuToggle');
    const nav = document.querySelector('.main-nav ul');
    if (toggle && nav) {
        toggle.addEventListener('click', () => {
            nav.classList.toggle('open');
            toggle.querySelector('i').classList.toggle('fa-bars');
            toggle.querySelector('i').classList.toggle('fa-times');
        });
    }
}

// ===== تحميل الصفحة =====
document.addEventListener('DOMContentLoaded', function() {
    // عرض الدورات في الصفحة الرئيسية
    const featuredContainer = document.getElementById('featuredCourses');
    if (featuredContainer) {
        renderCourses('featuredCourses', coursesData, 3);
    }

    // عرض جميع الدورات في صفحة الدورات
    const allContainer = document.getElementById('allCourses');
    if (allContainer) {
        renderCourses('allCourses', coursesData);
    }

    // عرض تفاصيل الدورة
    const detailContainer = document.getElementById('courseDetail');
    if (detailContainer) {
        renderCourseDetail();
    }

    // تشغيل العد التنازلي
    startCountdown();

    // تشغيل عدادات الأرقام
    setTimeout(animateNumbers, 300);

    // تفعيل القائمة المتنقلة
    initMobileMenu();

    // إغلاق البنر العلوي تلقائياً بعد 10 ثوانٍ (اختياري)
    // setTimeout(closeTopBanner, 10000);
});
