
function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  function hideLoader() {
    setTimeout(() => {
      loader.classList.add('loader--hidden');

      loader.addEventListener('transitionend', () => {
        loader.remove();
      }, { once: true });

      triggerHeroAnimations();
    }, 600);
  }

  if (document.readyState === 'complete') {
    hideLoader();
  } else {
    window.addEventListener('load', hideLoader);
  }
}


function initNavbar() {
  const navbar  = document.getElementById('navbar');
  const links   = document.querySelectorAll('.navbar__link');
  const sections = document.querySelectorAll('section[id]');

  if (!navbar) return;

  function handleScroll() {
    const scrolled = window.scrollY > 20;
    navbar.classList.toggle('navbar--scrolled', scrolled);
  }

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const id = entry.target.getAttribute('id');

        links.forEach((link) => link.classList.remove('navbar__link--active'));

        const activeLink = document.querySelector(
          `.navbar__link[data-section="${id}"]`
        );
        if (activeLink) activeLink.classList.add('navbar__link--active');
      });
    },
    {
      threshold: 0.4,
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); 
}


function initMobileMenu() {
  const toggle = document.getElementById('navToggle');
  const menu   = document.getElementById('navMenu');

  if (!toggle || !menu) return;

  function openMenu() {
    menu.classList.add('navbar__menu--open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Fechar menu');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    menu.classList.remove('navbar__menu--open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menu');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  const links = menu.querySelectorAll('.navbar__link');
  links.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('click', (e) => {
    const clickedInsideNav = toggle.contains(e.target) || menu.contains(e.target);
    if (!clickedInsideNav && menu.classList.contains('navbar__menu--open')) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('navbar__menu--open')) {
      closeMenu();
      toggle.focus();
    }
  });
}


function initSmoothScroll() {
  const navbarHeight = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--navbar-height'),
    10
  ) || 68;

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      const target   = document.querySelector(targetId);

      if (!target) return;

      e.preventDefault();

      const targetTop =
        target.getBoundingClientRect().top +
        window.scrollY -
        navbarHeight;

      window.scrollTo({
        top:      targetTop,
        behavior: 'smooth',
      });
    });
  });
}


function initRevealAnimations() {
  const animatedElements = document.querySelectorAll('.reveal, .fade-up');

  if (!animatedElements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add('is-visible');

        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -60px 0px',
    }
  );

  animatedElements.forEach((el) => observer.observe(el));
}

function triggerHeroAnimations() {
  const heroElements = document.querySelectorAll('.hero__content .fade-up');

  heroElements.forEach((el) => {
    requestAnimationFrame(() => {
      el.classList.add('is-visible');
    });
  });
}


function initFooterYear() {
  const yearEl = document.getElementById('footerYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}


function init() {
  initFooterYear();
  initLoader();
  initNavbar();
  initMobileMenu();
  initSmoothScroll();
  initRevealAnimations();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
