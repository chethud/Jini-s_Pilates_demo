(() => {
  const header = document.getElementById('site-header');
  const progress = document.querySelector('div[aria-hidden="true"].fixed.inset-x-0.top-0');

  const onScroll = () => {
    const y = window.scrollY || document.documentElement.scrollTop || 0;
    if (header) header.classList.toggle('is-scrolled', y > 24);

    if (progress) {
      const doc = document.documentElement;
      const max = Math.max(1, doc.scrollHeight - window.innerHeight);
      const p = Math.min(1, Math.max(0, y / max));
      progress.style.transform = `scaleX(${p})`;
    }
  };

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      }
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-visible'));
  }
})();
