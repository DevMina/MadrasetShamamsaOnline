/**
 * Shared layout: injects navbar + footer and sets active nav link.
 * Call initLayout(title) at the top of each page's inline script.
 */
function initLayout(title) {
  // Compute relative root from current path depth
  const depth = (location.pathname.match(/\//g) || []).length - 1;
  const root = depth <= 0 ? '.' : Array(depth).fill('..').join('/');

  // Coptic date (simple JS implementation)
  const copticDate = getCopticDate(new Date());

  const navbar = `
  <header>
    <div class="beta-banner bg-primary text-white fw-bold fs-5">
      🚀 تشغيل تجريبي الموقع مازال قيد التطوير 🚀
    </div>
    <nav class="navbar navbar-expand-sm navbar-toggleable-sm navbar-light bg-white border-bottom box-shadow mb-3">
      <div class="container-fluid">
        <a class="navbar-brand" href="${root}/index.html">مدرسة شمامسة أونلاين</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target=".navbar-collapse"
                aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="navbar-collapse collapse d-sm-inline-flex justify-content-between">
          <ul class="navbar-nav flex-grow-1">
            <li class="nav-item">
              <a class="nav-link text-dark" href="${root}/Alhan/AlhanList.html">
                <i class="fas fa-lg fa-headphones text-primary"></i> ألحان
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link text-dark" href="${root}/EilomElKanesa/EilomElKanesa.html">
                <i class="fas fa-lg fa-church text-primary"></i> علوم كنسية
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>`;

  const footer = `
  <footer class="border-top footer text-muted position-relative">
    <div class="position-relative">
      &copy; 2025 - مدرسة شمامسة أونلاين
    </div>
  </footer>`;

  // Set page title
  document.title = (title ? title + ' - ' : '') + 'مدرسة شمامسة أونلاين';

  // Inject navbar before body content
  document.body.insertAdjacentHTML('afterbegin', navbar);
  document.body.insertAdjacentHTML('beforeend', footer);

  // Expose coptic date for index page
  window._copticDate = copticDate;
  window._rootPath = root;

  // Active nav link highlighting
  document.addEventListener('DOMContentLoaded', function() {
    const path = location.pathname;
    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
      const href = link.getAttribute('href') || '';
      // Match /Alhan/ or /EilomElKanesa/ segments
      if (href && href !== '#') {
        const segment = href.split('/').filter(Boolean)[0];
        if (segment && (path.includes('/' + segment + '/') || path.includes('/' + segment + '.html'))) {
          link.classList.add('active', 'fw-bold');
          link.style.color = '#0d6efd';
        }
      }
    });
  });
}

/* -----------------------------------------------
   Minimal Coptic calendar conversion
----------------------------------------------- */
function getCopticDate(date) {
  // Gregorian to Coptic
  const arabicMonths = [
    'توت','بابه','هاتور','كيهك','طوبه','أمشير',
    'برمهات','برموده','بشنس','بؤونه','أبيب','مسرى','النسئ'
  ];

  const jdn = gregorianToJDN(date.getFullYear(), date.getMonth() + 1, date.getDate());
  const { day, month, year } = jdnToCoptic(jdn);

  return `${day} ${arabicMonths[month - 1]} ${year} ش`;
}

function gregorianToJDN(y, m, d) {
  // Standard Gregorian to JDN (Richards 2013)
  const a = Math.floor((14 - m) / 12);
  const y2 = y + 4800 - a;
  const m2 = m + 12 * a - 3;
  return d + Math.floor((153 * m2 + 2) / 5) + 365 * y2
    + Math.floor(y2 / 4) - Math.floor(y2 / 100) + Math.floor(y2 / 400) - 32045;
}

function jdnToCoptic(jdn) {
  const r = jdn - 1824665; // Coptic epoch: 29 Aug 284 CE
  const n = 4 * r + 3;
  const year = Math.floor(n / 1461);
  const day_of_year = Math.floor((n % 1461) / 4);
  const month = Math.floor(day_of_year / 30) + 1;
  const day = (day_of_year % 30) + 1;
  return { day, month: Math.min(month, 13), year };
}

// Accordion auto-scroll
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.accordion').forEach(acc => {
    acc.addEventListener('shown.bs.collapse', function (e) {
      setTimeout(() => {
        const item = e.target.closest('.accordion-item');
        if (item) {
          const top = item.getBoundingClientRect().top + window.scrollY - 100;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }, 50);
    });
  });
});
