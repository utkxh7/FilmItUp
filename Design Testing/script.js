/* ==========================================================================
   FILMITUP — Studio Interaction Engine
   Lightweight, performant interactions for filters, modals, and cursor.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ── Project Data Store for Case Study Modals ──────────────────────────
  const PROJECTS_DATA = {
    'pizza-don': {
      title: 'PIZZA DON: ARTISANAL FIRE',
      category: 'COMMERCIAL & TVC',
      year: '2024',
      spec: '16:9 4K DCI // HIGH-SPEED TABLETOP',
      metric: '● 2.4M ORGANIC VIEWS • 180% FOOTFALL SPIKE',
      brief: 'Position Pizza Don away from fast-food commoditization into an authentic, fire-roasted artisanal culinary institution.',
      made: 'High-speed Phantom capture of woodfire embers, macro cheese stretches, ambient dining soundscapes, and native 9:16 reels.',
      img: 'images/work-commercial.jpg'
    },
    'yagaana': {
      title: 'YAGAANA: ROYAL SILHOUETTES',
      category: 'HAUTE COUTURE BRAND FILM',
      year: '2024',
      spec: '9:16 + 16:9 4K // DAVINCI LUXURY GRADE',
      metric: '● 4.1M CAMPAIGN REACH • HIGH-TICKET VIRALITY',
      brief: 'Capture the heirloom craftsmanship of royal Indian couture against ancient architectural stone geometry.',
      made: 'Slow-motion natural sunlight flares, texture tracking on heritage silks, bespoke classical-ambient score, and cinematic reel cutdowns.',
      img: 'images/reel-fashion.jpg'
    },
    'hiranandani': {
      title: 'HIRANANDANI: SKY LIVING',
      category: 'ARCHITECTURE & LAUNCH FILM',
      year: '2024',
      spec: 'DRONE 4K DCI // DOLBY ATMOS MIX',
      metric: '● 1.8M DIGITAL REACH • VIP INVESTOR KEYNOTE',
      brief: 'Launch ultra-luxury residential towers with an architectural film that communicates scale, lifestyle, and investment pedigree.',
      made: 'Multi-cam high-altitude drone tracking, twilight architectural framing, and keynote video engineering for live developer summits.',
      img: 'images/work-event.jpg'
    },
    'nazara': {
      title: 'NAZARA: LIGHT & REFRACTION',
      category: 'MACRO LUXURY COMMERCIAL',
      year: '2024',
      spec: 'OPTICAL MACRO PROBE 4K',
      metric: '● 3.6M VIEWS RECORD • HIGH CONVERSION LEADS',
      brief: 'Create stop-scroll visual retention for solitaire diamond jewelry without generic white-background stock video clichés.',
      made: 'Precision optical probe lens cinematography, laser reflection capture, and high-frequency Instagram hook deployment.',
      img: 'images/reel-jewelry.jpg'
    },
    'wedding-pulao': {
      title: 'THE WEDDING PULAV: THE FEAST',
      category: 'BRAND NARRATIVE CAMPAIGN',
      year: '2024',
      spec: 'DIRECTORIAL NARRATIVE // CINEMA PRIME',
      metric: '● 1.5M VIRAL VIEWS • NATIONAL REPUTATION',
      brief: 'Prove that a wedding catering company can have the emotional resonance, visual prestige, and pacing of a Bollywood feature.',
      made: 'Documentary-style culinary preparation, cinematic night lighting, Foley steam audio, and founder narrative spotlight.',
      img: 'images/work-brand.jpg'
    },
    'colors-packaging': {
      title: 'COLORS PACKAGING: PRECISION',
      category: 'COMMERCIAL & B2B',
      year: '2024',
      spec: 'INDUSTRIAL 4K // GLOBAL B2B',
      metric: '● GLOBAL B2B REPUTATION • DUBAI & INDIA EXPORT',
      brief: 'Elevate automated industrial packaging and box manufacturing into a sleek, high-precision engineering showcase.',
      made: 'Dynamic machinery tracking, factory macro optics, corporate narrative pacing, and Dubai trade expo cuts.',
      img: 'images/work-product.jpg'
    }
  };

  // ── 1. Cursor Follower (Desktop only) ─────────────────────────────────
  const cursorGlow = document.getElementById('cursorGlow');
  if (cursorGlow && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let mouseX = 0, mouseY = 0;
    let currentX = 0, currentY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });

    function animateCursor() {
      currentX += (mouseX - currentX) * 0.15;
      currentY += (mouseY - currentY) * 0.15;
      cursorGlow.style.left = `${currentX}px`;
      cursorGlow.style.top = `${currentY}px`;
      requestAnimationFrame(animateCursor);
    }
    requestAnimationFrame(animateCursor);
  }

  // ── 2. Sticky Header Scroll Treatment ────────────────────────────────
  const siteHeader = document.getElementById('siteHeader');
  if (siteHeader) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        siteHeader.style.background = 'rgba(13, 14, 17, 0.96)';
        siteHeader.style.borderBottomColor = 'rgba(255, 255, 255, 0.12)';
      } else {
        siteHeader.style.background = 'rgba(13, 14, 17, 0.88)';
        siteHeader.style.borderBottomColor = 'rgba(255, 255, 255, 0.08)';
      }
    }, { passive: true });
  }

  // ── 3. Category Filter Tabs ──────────────────────────────────────────
  const filterPills = document.querySelectorAll('.filter-pill');
  const workCards = document.querySelectorAll('.work-card');

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filterValue = pill.getAttribute('data-filter');

      workCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ── 4. Case Study Expanded Modal ─────────────────────────────────────
  const caseModal = document.getElementById('caseModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalInquireBtn = document.getElementById('modalInquireBtn');

  const modalImg = document.getElementById('modalImg');
  const modalSpecBadge = document.getElementById('modalSpecBadge');
  const modalYear = document.getElementById('modalYear');
  const modalCategory = document.getElementById('modalCategory');
  const modalTitle = document.getElementById('modalTitle');
  const modalMetric = document.getElementById('modalMetric');
  const modalBrief = document.getElementById('modalBrief');
  const modalMade = document.getElementById('modalMade');

  function openCaseModal(projectId) {
    const data = PROJECTS_DATA[projectId];
    if (!data) return;

    modalImg.src = data.img;
    modalImg.alt = data.title;
    modalSpecBadge.textContent = data.spec;
    modalYear.textContent = data.year;
    modalCategory.textContent = data.category;
    modalTitle.textContent = data.title;
    modalMetric.textContent = data.metric;
    modalBrief.textContent = data.brief;
    modalMade.textContent = data.made;

    caseModal.classList.add('is-open');
    caseModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeCaseModal() {
    if (!caseModal) return;
    caseModal.classList.remove('is-open');
    caseModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  workCards.forEach(card => {
    card.addEventListener('click', () => {
      const projectId = card.getAttribute('data-id');
      openCaseModal(projectId);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeCaseModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeCaseModal);
  if (modalInquireBtn) {
    modalInquireBtn.addEventListener('click', () => {
      closeCaseModal();
    });
  }

  // ── 5. Studio Showreel Video Modal ───────────────────────────────────
  const reelModal = document.getElementById('reelModal');
  const reelCloseBtn = document.getElementById('reelCloseBtn');
  const reelBackdrop = document.getElementById('reelBackdrop');
  const showreelMonitor = document.getElementById('showreelMonitor');
  const heroPlayShowreelBtn = document.getElementById('heroPlayShowreelBtn');

  function openReelModal() {
    if (!reelModal) return;
    reelModal.classList.add('is-open');
    reelModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeReelModal() {
    if (!reelModal) return;
    reelModal.classList.remove('is-open');
    reelModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (showreelMonitor) showreelMonitor.addEventListener('click', openReelModal);
  if (heroPlayShowreelBtn) heroPlayShowreelBtn.addEventListener('click', openReelModal);
  if (reelCloseBtn) reelCloseBtn.addEventListener('click', closeReelModal);
  if (reelBackdrop) reelBackdrop.addEventListener('click', closeReelModal);

  // ── 6. Mobile Drawer Navigation ──────────────────────────────────────
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerClose = document.getElementById('drawerClose');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  function openDrawer() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.add('is-open');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    mobileToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.remove('is-open');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    mobileToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (mobileToggle) mobileToggle.addEventListener('click', openDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  drawerLinks.forEach(link => link.addEventListener('click', closeDrawer));

  // ── 7. Global Keyboard Esc Handlers ──────────────────────────────────
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCaseModal();
      closeReelModal();
      closeDrawer();
    }
  });

});
