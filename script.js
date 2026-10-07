/* ==========================================================================
   FILMITUP — Studio Script (Design Testing Sandbox)
   Interactions, Work Filtering, Case Lightbox & Metrics Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ---------- 1. Mobile Drawer Navigation ----------
  const menuToggle = document.getElementById('menuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerClose = document.getElementById('drawerClose');
  const drawerLinks = document.querySelectorAll('.drawer-item');

  function openDrawer() {
    if (mobileDrawer) {
      mobileDrawer.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeDrawer() {
    if (mobileDrawer) {
      mobileDrawer.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  if (menuToggle) menuToggle.addEventListener('click', openDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  drawerLinks.forEach(link => link.addEventListener('click', closeDrawer));

  // ---------- 2. Gallery Category Filters ----------
  const filterBtns = document.querySelectorAll('.gal-filter');
  const workItems = document.querySelectorAll('.work-monolith');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      workItems.forEach(item => {
        const itemCat = item.dataset.category;
        if (filter === 'all' || itemCat === filter) {
          item.style.display = 'flex';
          requestAnimationFrame(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          });
        } else {
          item.style.opacity = '0';
          item.style.transform = 'translateY(10px)';
          setTimeout(() => {
            if (item.style.opacity === '0') {
              item.style.display = 'none';
            }
          }, 200);
        }
      });
    });
  });

  // ---------- 3. Case Study Lightbox Modal ----------
  const lightbox = document.getElementById('caseLightbox');
  const lightboxBackdrop = document.getElementById('lightboxBackdrop');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxBody = document.getElementById('lightboxBody');

  function openCaseLightbox(item) {
    if (!lightbox || !lightboxBody) return;

    const title = item.dataset.title || 'COMMERCIAL PRODUCTION';
    const client = item.dataset.client || 'Client Commission';
    const type = item.dataset.type || 'Commercial Film';
    const metric = item.dataset.metric || 'National Campaign Impact';
    const year = item.dataset.year || '2024';
    const img = item.dataset.img || 'images/hero.jpg';
    const desc = item.dataset.desc || 'Directorial commercial film engineered for cinema aesthetics and audience retention.';

    lightboxBody.innerHTML = `
      <div class="lb-media">
        <img src="${img}" alt="${title}" />
      </div>
      <div class="lb-content">
        <div class="lb-tag-row">
          <span>// ${type.toUpperCase()}</span>
          <span>YEAR: ${year} &bull; CLIENT: ${client.toUpperCase()}</span>
        </div>
        <h3 class="lb-title">${title}</h3>
        <p class="lb-desc">${desc}</p>
        <div class="lb-metric-strip">
          <span>CAMPAIGN OUTCOME:</span>
          <span>${metric}</span>
        </div>
        <div style="margin-top: 10px;">
          <a href="#contact" class="btn-brutal primary" id="lbInquireBtn" style="width: 100%; justify-content: center;">
            <span>START A SIMILAR PROJECT &rarr;</span>
          </a>
        </div>
      </div>
    `;

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Hook up internal inquire button
    const inquireBtn = document.getElementById('lbInquireBtn');
    if (inquireBtn) {
      inquireBtn.addEventListener('click', () => {
        closeLightbox();
        const scopeSelect = document.getElementById('commissionType');
        if (scopeSelect) {
          scopeSelect.value = 'commercial';
        }
      });
    }
  }

  function closeLightbox() {
    if (lightbox) {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  workItems.forEach(item => {
    item.addEventListener('click', () => openCaseLightbox(item));
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);

  // Esc key closes modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  // ---------- 4. Showreel Lightbox Trigger ----------
  const heroReelBtn = document.getElementById('heroReelBtn');
  const showreelScreen = document.getElementById('showreelScreen');

  function openShowreelLightbox() {
    openCaseLightbox({
      dataset: {
        title: 'FILMITUP 2025 SHOWREEL',
        client: 'Studio Retrospective',
        type: 'Commercial Film Master',
        metric: '14M+ TOTAL VIEWS DELIVERED ACROSS 45+ COMMISSIONS',
        year: '2025',
        img: 'images/hero.jpg',
        desc: 'Selected cinematography highlights across commercial food TVCs, luxury couture brand films, real estate launches, and industrial manufacturing.'
      }
    });
  }

  if (heroReelBtn) heroReelBtn.addEventListener('click', openShowreelLightbox);
  if (showreelScreen) showreelScreen.addEventListener('click', openShowreelLightbox);

  // ---------- 5. Metric Live Counter Engine ----------
  const metricValues = document.querySelectorAll('.m-val[data-target]');
  let metricsAnimated = false;

  function runCounterAnimation() {
    if (metricsAnimated) return;

    metricValues.forEach(counter => {
      const target = parseInt(counter.dataset.target, 10);
      const duration = 1600;
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        counter.textContent = Math.floor(target * ease);

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          counter.textContent = target;
        }
      }
      requestAnimationFrame(update);
    });

    metricsAnimated = true;
  }

  const metricsSection = document.getElementById('impact');
  if (metricsSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          runCounterAnimation();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    observer.observe(metricsSection);
  }

  // ---------- 6. Commission Form Submission ----------
  const commissionForm = document.getElementById('commissionForm');
  const formStatus = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');

  if (commissionForm) {
    commissionForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const origText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span class="btn-text">SENDING INQUIRY...</span>';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = '<span class="btn-text" style="color: #22c55e;">INQUIRY RECEIVED &check;</span>';
        if (formStatus) {
          formStatus.innerHTML = '<span style="color: #EDEDED;">Thank you. Studio direction will respond within 24 hours.</span>';
        }

        setTimeout(() => {
          submitBtn.innerHTML = origText;
          submitBtn.disabled = false;
          commissionForm.reset();
        }, 4000);
      }, 800);
    });
  }

  // ---------- 7. Header Scroll Behavior ----------
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.style.padding = '10px 0';
      header.style.background = 'rgba(9, 10, 12, 0.95)';
    } else {
      header.style.padding = '18px 0';
      header.style.background = 'rgba(9, 10, 12, 0.85)';
    }
  }, { passive: true });

});
