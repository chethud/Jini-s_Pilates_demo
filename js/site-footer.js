(() => {
  const year = new Date().getFullYear();
  const html = `<footer class="site-footer">
  <div class="site-footer-inner">
    <div>
      <a class="site-footer-brand" href="/">
        <img src="/assets/logo.png" alt="Jini's Pilates Studio logo" width="44" height="44">
        <span>Jini's Pilates Studio</span>
      </a>
      <p class="site-footer-copy">A luxury Pilates studio and wellness cafe built for strength, balance and calm — for every body, at every level.</p>
      <div class="site-footer-social">
        <a href="https://www.instagram.com/jinispilatesstudio/" target="_blank" rel="noreferrer noopener" aria-label="Follow us on Instagram">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
        </a>
        <a href="https://www.facebook.com/JinisPilatesStudio" target="_blank" rel="noreferrer noopener" aria-label="Follow us on Facebook">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
        </a>
      </div>
    </div>
    <nav aria-label="Quick links">
      <h2>Quick Links</h2>
      <ul>
        <li><a href="/classes">Classes</a></li>
        <li><a href="/cafe">Cafe</a></li>
        <li><a href="/gallery">Gallery</a></li>
        <li><a href="/#contact">Contact</a></li>
      </ul>
    </nav>
    <div>
      <h2>Reach Us</h2>
      <ul class="site-footer-reach">
        <li>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path><circle cx="12" cy="10" r="3"></circle></svg>
          Vani Vilas Mohalla, Mysuru 570002
        </li>
        <li>
          <a href="tel:+919686868697">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"></path></svg>
            +91 96868 68697
          </a>
        </li>
        <li>
          <a href="mailto:info@jinispilatesstudio.com">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"></path><rect x="2" y="4" width="20" height="16" rx="2"></rect></svg>
            info@jinispilatesstudio.com
          </a>
        </li>
      </ul>
    </div>
  </div>
  <div class="site-footer-bottom">
    <p>© ${year} Jini's Pilates Studio & Wellness Cafe. All rights reserved.</p>
  </div>
</footer>`;

  const existing = document.querySelector("footer");
  if (existing) {
    existing.outerHTML = html;
    return;
  }
  document.body.insertAdjacentHTML("beforeend", html);
})();
