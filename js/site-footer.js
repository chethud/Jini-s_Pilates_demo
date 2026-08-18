(() => {
  const year = new Date().getFullYear();
  const leaf =
    '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>';
  const html = `<footer class="site-footer">
  <svg class="site-footer-botany site-footer-botany--bl" viewBox="0 0 24 24" aria-hidden="true">${leaf}</svg>
  <svg class="site-footer-botany site-footer-botany--tr" viewBox="0 0 24 24" aria-hidden="true">${leaf}</svg>
  <div class="site-footer-inner">
    <div>
      <a class="site-footer-brand" href="/">Jini's Pilates Studio</a>
      <p class="site-footer-copy">A luxury Pilates studio and wellness cafe built for strength, balance and calm — for every body, at every level.</p>
      <div class="site-footer-social">
        <a href="https://www.instagram.com/jinispilatesstudio/" target="_blank" rel="noreferrer noopener" aria-label="Follow us on Instagram">
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
        </a>
        <a href="https://www.facebook.com/JinisPilatesStudio" target="_blank" rel="noreferrer noopener" aria-label="Follow us on Facebook">
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
        </a>
      </div>
    </div>
    <div>
      <h2 class="site-footer-reach-title">Reach us</h2>
      <ul class="site-footer-reach">
        <li>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path><circle cx="12" cy="10" r="3"></circle></svg>
          Vani Vilas Mohalla, Mysuru 570002
        </li>
        <li>
          <a href="tel:+919686868697">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            +91 96868 68697
          </a>
        </li>
        <li>
          <a href="mailto:info@jinispilatesstudio.com">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"></path><rect x="2" y="4" width="20" height="16" rx="2"></rect></svg>
            info@jinispilatesstudio.com
          </a>
        </li>
      </ul>
    </div>
  </div>
  <div class="site-footer-bottom">
    <div class="site-footer-bottom-inner">
      <p>© ${year} Admark Digitals</p>
      <nav class="site-footer-legal" aria-label="Legal">
        <a href="/privacy">Privacy Policy</a>
        <span class="site-footer-dot" aria-hidden="true">•</span>
        <a href="/terms">Terms &amp; Conditions</a>
      </nav>
    </div>
  </div>
</footer>`;

  const mount = () => {
    if (document.documentElement.dataset.siteFooter === "1") return;
    document.documentElement.dataset.siteFooter = "1";
    const footers = Array.from(document.querySelectorAll("footer"));
    if (footers.length) {
      footers[0].outerHTML = html;
      footers.slice(1).forEach((el) => el.remove());
      return;
    }
    document.body.insertAdjacentHTML("beforeend", html);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount, { once: true });
  } else {
    mount();
  }
})();
