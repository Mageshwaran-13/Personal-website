/**
 * Personal Profile Website - Vanilla JavaScript
 * Mageshwaran R - Portfolio & Interactive Logic
 * Zero debugging output ensures PR quality gate compliance.
 *
 * This file is loaded in <head> (no defer) on purpose: the first block below
 * sets the saved theme before the page paints, so dark-mode visitors never
 * see a white flash. Everything else waits for DOMContentLoaded.
 */

/* ---------- 0. Apply saved / system theme immediately ---------- */
(function applyThemeEarly() {
  const root = document.documentElement;
  root.classList.add('js');

  let theme = null;
  try {
    theme = localStorage.getItem('theme');
  } catch (err) {
    theme = null;
  }
  if (theme !== 'light' && theme !== 'dark') {
    theme = 'dark';
  }
  root.setAttribute('data-theme', theme);
})();

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initLogoMorph();
  initMobileNavigation();
  initActiveNavOnScroll();
  initJourneyTimeline();
  initTimelineExpand();
  initSectionHeads();
  initFlipCards();
  initHobbyLightbox();
  initDynamicCopyright();
  initBackToTop();
});

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * 1. Dark / light theme toggle
 *    Dark is the default. Writes data-theme on <html>; every colour lives in css/theme.css.
 */
function initThemeToggle() {
  const btn = document.querySelector('.theme-toggle');
  if (!btn) return;

  const root = document.documentElement;
  let animTimer = null;

  const syncButton = () => {
    const isDark = root.getAttribute('data-theme') === 'dark';
    btn.setAttribute('aria-pressed', String(isDark));
    btn.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
  };

  const applyTheme = (theme, remember) => {
    root.classList.add('theme-anim');
    root.setAttribute('data-theme', theme);
    if (remember) {
      try {
        localStorage.setItem('theme', theme);
      } catch (err) {
        /* storage blocked: the theme still switches for this visit */
      }
    }
    syncButton();
    window.clearTimeout(animTimer);
    animTimer = window.setTimeout(() => root.classList.remove('theme-anim'), 450);
  };

  btn.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next, true);
  });

  syncButton();
}

/**
 * 2. RMW logo: opens to "R MageshWaran" and closes back to "RMW".
 *    Each hidden piece is measured in pixels and CSS animates its width, which
 *    is smoother than animating "auto" and never clips the descender of the "g".
 */
function initLogoMorph() {
  const logo = document.querySelector('.logo');
  if (!logo) return;

  const pieces = Array.from(logo.querySelectorAll('.logo-more'));

  const measure = () => {
    pieces.forEach((piece) => {
      const inner = piece.querySelector('.logo-more-inner');
      if (!inner) return;
      piece.style.setProperty('--w', `${Math.ceil(inner.getBoundingClientRect().width) + 2}px`);
    });
  };

  measure();
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(measure);
  }
  window.addEventListener('resize', measure);

  // Start open so the full name is read first; reduced motion keeps it open
  logo.classList.add('is-open');
  if (prefersReducedMotion()) return;

  const OPEN_MS = 3600;
  const CLOSED_MS = 2200;
  let held = false;
  let timer = null;

  const schedule = () => {
    window.clearTimeout(timer);
    const open = logo.classList.contains('is-open');
    timer = window.setTimeout(() => {
      if (held || document.hidden) {
        schedule();
        return;
      }
      logo.classList.toggle('is-open');
      schedule();
    }, open ? OPEN_MS : CLOSED_MS);
  };

  const hold = () => {
    held = true;
    logo.classList.add('is-open');
  };
  const release = () => {
    held = false;
    schedule();
  };

  logo.addEventListener('mouseenter', hold);
  logo.addEventListener('focus', hold);
  logo.addEventListener('mouseleave', release);
  logo.addEventListener('blur', release);

  schedule();
}

/**
 * 3. Mobile Navigation Toggle
 */
function initMobileNavigation() {
  const toggleBtn = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!toggleBtn || !navMenu) return;

  const closeMenu = () => {
    toggleBtn.classList.remove('active');
    navMenu.classList.remove('active');
    toggleBtn.setAttribute('aria-expanded', 'false');
  };

  toggleBtn.addEventListener('click', () => {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', String(!isExpanded));
    toggleBtn.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  navLinks.forEach((link) => link.addEventListener('click', closeMenu));

  document.addEventListener('click', (event) => {
    if (
      navMenu.classList.contains('active') &&
      !navMenu.contains(event.target) &&
      !toggleBtn.contains(event.target)
    ) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navMenu.classList.contains('active')) closeMenu();
  });
}

/**
 * 4. Active navigation highlight based on scroll position
 */
function initActiveNavOnScroll() {
  const sections = document.querySelectorAll('section[id], footer[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      });
    },
    { root: null, rootMargin: '-20% 0px -70% 0px', threshold: 0 }
  );

  sections.forEach((section) => navObserver.observe(section));
}

/**
 * 5. Professional Journey: a vertical spine that fills as you scroll.
 *    Plain page scroll (nothing is pinned). Each milestone slides in once when
 *    it nears the viewport, and its diamond node lights up when the spine
 *    reaches it.
 */
function initJourneyTimeline() {
  const timeline = document.getElementById('timeline');
  if (!timeline) return;

  const items = Array.from(timeline.querySelectorAll('.timeline-item'));
  if (!items.length) return;

  if ('IntersectionObserver' in window) {
    const reveal = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: '0px 0px -12% 0px', threshold: 0.15 }
    );
    items.forEach((item) => reveal.observe(item));
  } else {
    items.forEach((item) => item.classList.add('is-visible'));
  }

  let ticking = false;
  const update = () => {
    ticking = false;
    const line = window.innerHeight * 0.55;
    const box = timeline.getBoundingClientRect();
    const progress = Math.min(1, Math.max(0, (line - box.top) / box.height));
    timeline.style.setProperty('--progress', progress.toFixed(4));

    items.forEach((item) => {
      const rect = item.getBoundingClientRect();
      item.classList.toggle('is-reached', rect.top + rect.height / 2 < line);
    });
  };
  const requestUpdate = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  };

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
  update();
}

/**
 * 6. Journey card "Show more" toggles
 */
function initTimelineExpand() {
  const toggleButtons = document.querySelectorAll('.btn-toggle-desc');

  toggleButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const extraContent = btn.parentElement.querySelector('.timeline-extra');
      if (!extraContent) return;

      const willExpand = !extraContent.classList.contains('expanded');
      extraContent.classList.toggle('expanded', willExpand);
      btn.setAttribute('aria-expanded', String(willExpand));
      btn.textContent = willExpand ? 'Show less \u2191' : 'Show more \u2193';
    });
  });
}

/**
 * 7. Section headings: the short accent rule draws in when the heading appears
 */
function initSectionHeads() {
  const heads = document.querySelectorAll('.section-head');
  if (!heads.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
        }
      });
    },
    { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.3 }
  );

  heads.forEach((head) => observer.observe(head));
}

/**
 * 8. Family flip cards: hover/focus on desktop, tap on touch screens
 */
function initFlipCards() {
  const cards = document.querySelectorAll('.flip-card');
  const touchOnly = window.matchMedia('(hover: none)');

  cards.forEach((card) => {
    card.addEventListener('click', () => {
      if (touchOnly.matches) card.classList.toggle('flipped');
    });
  });
}

/**
 * 9. Vanilla JS lightbox for the hobbies gallery
 */
function initHobbyLightbox() {
  const hobbyCards = document.querySelectorAll('.hobby-card');
  const modal = document.getElementById('hobbyLightbox');
  if (!modal) return;

  const modalImg = modal.querySelector('.lightbox-img');
  const modalTitle = modal.querySelector('.lightbox-title');
  const modalDesc = modal.querySelector('.lightbox-desc');
  const closeBtn = modal.querySelector('.lightbox-close');
  let lastFocused = null;

  const openModal = (card) => {
    const img = card.querySelector('.hobby-img');
    const title = card.querySelector('.hobby-title');
    const detail = card.getAttribute('data-detail');

    if (modalImg && img) {
      modalImg.setAttribute('src', img.getAttribute('src'));
      modalImg.setAttribute('alt', img.getAttribute('alt') || 'Hobby preview');
    }
    if (modalTitle && title) modalTitle.textContent = title.textContent;
    if (modalDesc && detail) modalDesc.textContent = detail;

    lastFocused = document.activeElement;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (closeBtn) closeBtn.focus();
  };

  const closeModal = () => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  };

  hobbyCards.forEach((card) => {
    card.addEventListener('click', () => openModal(card));
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openModal(card);
      }
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeModal();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('active')) closeModal();
  });
}

/**
 * 10. Dynamic copyright year
 */
function initDynamicCopyright() {
  const yearSpan = document.getElementById('copyrightYear');
  if (yearSpan) yearSpan.textContent = String(new Date().getFullYear());
}

/**
 * 11. Back-to-top button
 */
function initBackToTop() {
  const backToTopBtn = document.querySelector('.btn-back-to-top');
  if (!backToTopBtn) return;

  backToTopBtn.addEventListener('click', (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  });
}
