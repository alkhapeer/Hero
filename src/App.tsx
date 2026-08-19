import "./App.css";
function App() {
  return (
    <div dir="rtl">

      {/* البنر العلوي */}
      <div className="top-banner">
        <div className="banner-content">
          <span className="banner-text">
            🎁 عرض خاص: خصم 30% على جميع الدورات حتى نهاية الشهر!
          </span>

          <span className="banner-counter">
            3d 12h 45m
          </span>
        </div>
      </div>

      {/* HEADER */}
      <header className="main-header">
        <div className="container">

          <div className="logo-area">
            <img
              src="/assets/images/logo.png"
              alt="Hero Academy"
              className="logo"
            />

            <h1>
              Hero <span>Academy</span>
            </h1>
          </div>

          <nav className="main-nav">
            <ul>
              <li>
                <a href="/" className="active">
                  🏠 مساعدك الذكي
                </a>
              </li>

              <li>
                <a href="#">
                  ℹ️ عن الأكاديمية
                </a>
              </li>

              <li>
                <a href="#">
                  ⭐ المميزات
                </a>
              </li>

              <li>
                <a href="#">
                  📚 نموذج المحتوى
                </a>
              </li>

              <li>
                <a href="#">
                  🔎 استكشف المحتوى
                </a>
              </li>
            </ul>
          </nav>

        </div>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="container">

          <div className="hero-content">

            <div className="hero-badge">
              🏆 مساعدك الذكي للدراسة
            </div>

            <h1>
              تعلم <span>بذكاء</span>
              <br />
              مع <span>مساعد الطالب</span>
            </h1>

            <p className="hero-desc">
              أدوات تعليمية متكاملة: خرائط ذهنية، فلاش كاردز،
              نصائح مذاكرة، حاسبات، جداول، ومحتوى صوتي ومرئي قصير.
              اكتشف نماذج مجانية وتوجه للأكاديمية للمحتوى الكامل.
            </p>

            <div className="hero-buttons">

              <a
                href="#"
                className="btn-primary btn-large"
              >
                ▶ استكشف المحتوى المجاني
              </a>

              <a
                href="https://hero.kesug.com/Academy/courses.php"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary btn-large"
              >
                👁 جميع الدورات
              </a>

            </div>

            <div className="hero-stats">

              <div className="stat">
                <span className="number">15</span>
                <span className="label">أداة مساعدة</span>
              </div>

              <div className="stat">
                <span className="number">50</span>
                <span className="label">خريطة ذهنية</span>
              </div>

              <div className="stat">
                <span className="number">200</span>
                <span className="label">بطاقة فلاش</span>
              </div>

              <div className="stat">
                <span className="number">100</span>
                <span className="label">نصيحة مذاكرة</span>
              </div>

            </div>

          </div>

          <div className="hero-image">
            <h2>🎓</h2>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="container">

          <div className="cta-content">

            <h2>
              جهز نفسك <span>للنجاح</span> مع{" "}
              <span>مساعد الطالب</span>
            </h2>

            <p>
              استخدم الأدوات المجانية يومياً، واستكشف المعاينات،
              وعندما تصبح جاهزاً، انطلق إلى الأكاديمية للحصول
              على الدورات الكاملة والشهادات المعتمدة.
            </p>

            <div className="cta-buttons">

              <a
                href="https://hero.kesug.com/Academy/courses.php"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary btn-large"
              >
                🚀 ابدأ رحلتك الآن
              </a>

              <a
                href="https://hero.kesug.com/Academy/login.php"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary btn-large"
              >
                🔐 تسجيل الدخول للأكاديمية
              </a>

            </div>

          </div>

        </div>
      </section>

      {/* العرض السفلي */}
      <div className="bottom-banner">

        <div className="banner-content">

          <div className="banner-icon">
            🎓
          </div>

          <div className="banner-text">
            <h4>عرض خاص للطلاب الجدد</h4>

            <p>
              احصل على دورة مجانية عند الاشتراك في أي دورة مدفوعة
            </p>
          </div>

          <a
            href="https://hero.kesug.com/Academy/register.php"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            🎁 احصل على العرض
          </a>

        </div>

      </div>

      {/* FOOTER */}
      <footer className="main-footer">
        <p>
          © 2026 Hero Academy - جميع الحقوق محفوظة
        </p>
      </footer>

    </div>
  )
}

export default App