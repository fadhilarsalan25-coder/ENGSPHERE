export function initLandingScrollAnimations() {
  const landing = document.getElementById('landing');
  if (!landing) return;

  const progressBar = document.getElementById('progress-bar');
  let ticking = false;
  const updateScrollProgress = () => {
    if (!progressBar) return;
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0) {
      const scrolled = (window.scrollY / totalHeight) * 100;
      progressBar.style.width = Math.min(Math.max(scrolled, 0), 100) + '%';
    }
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateScrollProgress);
      ticking = true;
    }
  }, { passive: true });

  let countersStarted = false;
  const startCounterAnimation = () => {
    if (countersStarted) return;
    countersStarted = true;
    const items = [
      { selector: '.ls-item:nth-child(1) .ls-n', end: 12, duration: 1600 },
      { selector: '.ls-item:nth-child(2) .ls-n', end: 3, duration: 1200 }
    ];

    items.forEach(cfg => {
      const el = landing.querySelector(cfg.selector);
      if (!el) return;
      const startTime = performance.now();
      const tick = now => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / cfg.duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round((cfg.end) * ease);
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = cfg.end;
      };
      requestAnimationFrame(tick);
    });
  };

  const revealTargets = landing.querySelectorAll('.landing-strip, .lsec-head, .about-text, .about-card, .lf-item, .moat-row, .method-card, .final-cta');
  const staggerGroups = [
    landing.querySelectorAll('.landing-strip .ls-item'),
    landing.querySelectorAll('.landing-features .lf-item'),
    landing.querySelectorAll('.moat-list .moat-row'),
    landing.querySelectorAll('.method-grid .method-card')
  ];

  staggerGroups.forEach(group => {
    group.forEach((item, idx) => {
      const delay = (idx % 3) * 160;
      if (delay > 0) item.style.transitionDelay = delay + 'ms';
    });
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          if (entry.target.classList.contains('landing-strip') || entry.target.closest('.landing-strip')) startCounterAnimation();
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

    revealTargets.forEach(el => {
      el.classList.add('reveal-init');
      observer.observe(el);
    });
  } else {
    revealTargets.forEach(el => el.classList.add('revealed'));
    startCounterAnimation();
  }
}
