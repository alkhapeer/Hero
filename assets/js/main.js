/**
 * Hero Academy - Frontend JavaScript
 * بيانات الدورات وهمية (Mock Data) للتسويق والعرض
 * يمكن تعديلها لاحقاً لجلب البيانات من API
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
        contents: [
            'الميكانيكا الكلاسيكية',
            'الكهرباء الساكنة',
            'التيار الكهربائي',
            'المغناطيسية',
            'الفيزياء الحديثة'
        ]
    },
    {
        id: 2,
        title: 'اللغة الإنجليزية - المستوى المتقدم',
        description: 'دورة متكاملة لتعلم اللغة الإنجليزية من الصفر حتى الاحتراف تشمل المحادثة والقواعد والمفردات.',
        price: 149,
        image: 'assets/images/course-2.jpg',
        icon: 'fa-language',
        contents: [
            'قواعد اللغة الأساسية',
            'المحادثة اليومية',
            'المفردات المتقدمة',
            'الاستماع والفهم',
            'الكتابة الأكاديمية'
        ]
    },
    {
        id: 3,
        title: 'البرمجة للمبتدئين',
        description: 'دورة تدريبية في أساسيات البرمجة بلغات Python و JavaScript و PHP مع مشاريع عملية.',
        price: 199,
        image: 'assets/images/course-3.jpg',
        icon: 'fa-code',
        contents: [
            'مقدمة في البرمجة',
            'Python الأساسيات',
            'JavaScript للواجهات',
            'PHP للخوادم',
            'مشروع متكامل'
        ]
    },
    {
        id: 4,
        title: 'الكيمياء العضوية',
        description: 'فهم شامل للكيمياء العضوية مع شرح تفصيلي للمركبات والتفاعلات الكيميائية.',
        price: 79,
        image: 'assets/images/course-4.jpg',
        icon: 'fa-flask',
        contents: [
            'مقدمة في الكيمياء العضوية',
            'الهيدروكربونات',
            'المجموعات الوظيفية',
            'تفاعلات الاستبدال والإضافة',
            'البوليمرات'
        ]
    },
    {
        id: 5,
        title: 'الرياضيات التطبيقية',
        description: 'دورة في الرياضيات التطبيقية تغطي الجبر، التفاضل، التكامل، والإحصاء مع تطبيقات عملية.',
        price: 89,
        image: 'assets/images/course-5.jpg',
        icon: 'fa-calculator',
        contents: [
            'الجبر الخطي',
            'التفاضل والتكامل',
            'الإحصاء والاحتمالات',
            'المعادلات التفاضلية',
            'تطبيقات في العلوم'
        ]
    },
    {
        id: 6,
        title: 'التصميم الجرافيكي',
        description: 'تعلم أساسيات التصميم الجرافيكي باستخدام أدوات مثل Photoshop و Illustrator و Figma.',
        price: 159,
        image: 'assets/images/course-6.jpg',
        icon: 'fa-paint-brush',
        contents: [
            'مبادئ التصميم',
            'Adobe Photoshop',
            'Adobe Illustrator',
            'Figma للواجهات',
            'مشاريع عملية'
        ]
    }
];

// ===== دالة عرض الدورات =====
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
        html += `
            <div class="course-card">
                <div class="card-image">
                    <img src="${course.image}" alt="${course.title}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                    <i class="fas ${course.icon}" style="display:none;"></i>
                </div>
                <div class="card-body">
                    <h3>${course.title}</h3>
                    <p>${course.description}</p>
                </div>
                <div class="card-footer">
                    <span class="price ${priceClass}">${priceText}</span>
                    <a href="course-details.html?id=${course.id}" class="btn-card">تفاصيل</a>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

// ===== دالة عرض تفاصيل الدورة =====
function renderCourseDetail() {
    const container = document.getElementById('courseDetail');
    if (!container) return;

    // الحصول على ID من رابط الصفحة
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = parseInt(urlParams.get('id'));

    if (!courseId) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-circle"></i>
                <h3>لم يتم تحديد دورة</h3>
                <p>يرجى اختيار دورة من <a href="courses.html">صفحة الدورات</a></p>
            </div>
        `;
        return;
    }

    const course = coursesData.find(c => c.id === courseId);

    if (!course) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <h3>الدورة غير موجودة</h3>
                <p>عذراً، لم نجد الدورة المطلوبة. <a href="courses.html">عرض جميع الدورات</a></p>
            </div>
        `;
        return;
    }

    const priceText = course.price > 0 ? `${course.price} ريال` : 'مجاني';
    const priceClass = course.price === 0 ? 'free' : '';

    let contentsHtml = '';
    if (course.contents && course.contents.length > 0) {
        contentsHtml = `
            <div class="contents">
                <h3><i class="fas fa-list"></i> محتويات الدورة</h3>
                <ul>
                    ${course.contents.map(item => `<li><i class="fas fa-check-circle"></i> ${item}</li>`).join('')}
                </ul>
            </div>
        `;
    }

    container.innerHTML = `
        <div class="detail-card">
            <div class="detail-image">
                <img src="${course.image}" alt="${course.title}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                <i class="fas ${course.icon}" style="display:none;"></i>
            </div>
            <div class="detail-body">
                <h1>${course.title}</h1>
                <div class="meta">
                    <span><i class="fas fa-tag"></i> ${priceText}</span>
                    <span><i class="fas fa-book"></i> ${course.contents ? course.contents.length : 0} درس</span>
                </div>
                <div class="description">
                    <p>${course.description}</p>
                </div>
                ${contentsHtml}
                <div class="price-box">
                    <span class="price ${priceClass}">${priceText}</span>
                    <a href="https://hero.kesug.com/Academy/buy.php?course_id=${course.id}" class="btn-buy">
                        <i class="fas fa-shopping-cart"></i> ابدأ الاشتراك
                    </a>
                </div>
            </div>
        </div>
    `;
}

// ===== تابع القائمة المتنقلة =====
function initMobileMenu() {
    const toggle = document.getElementById('menuToggle');
    const nav = document.querySelector('.main-nav ul');

    if (toggle && nav) {
        toggle.addEventListener('click', function() {
            nav.classList.toggle('open');
        });
    }
}

// ===== تحميل الصفحة =====
document.addEventListener('DOMContentLoaded', function() {
    // الصفحة الرئيسية: عرض 3 دورات مميزة
    const featuredContainer = document.getElementById('featuredCourses');
    if (featuredContainer) {
        renderCourses('featuredCourses', coursesData, 3);
    }

    // صفحة الدورات: عرض جميع الدورات
    const allContainer = document.getElementById('allCourses');
    if (allContainer) {
        renderCourses('allCourses', coursesData);
    }

    // صفحة تفاصيل الدورة
    const detailContainer = document.getElementById('courseDetail');
    if (detailContainer) {
        renderCourseDetail();
    }

    // تفعيل القائمة المتنقلة
    initMobileMenu();
});