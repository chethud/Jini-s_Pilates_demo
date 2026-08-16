(() => {
  const LINKS = [
    { href: "/about", label: "About" },
    { href: "/#why-pilates", label: "Why Pilates" },
    { href: "/classes", label: "Classes" },
    { href: "/cafe", label: "Cafe" },
    { href: "/plans", label: "Plans" },
    { href: "/gallery", label: "Gallery" },
    { href: "/#contact", label: "Contact" },
  ];

  const header = document.getElementById("site-header");
  if (!header) return;

  const moon =
    '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"></path></svg>';
  const menuIcon =
    '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5h16"/><path d="M4 12h16"/><path d="M4 19h16"/></svg>';

  const desktopLinks = LINKS.map((item) => `<li><a href="${item.href}">${item.label}</a></li>`).join("");
  const mobileLinks = LINKS.map((item) => `<a href="${item.href}">${item.label}</a>`).join("");

  header.innerHTML = `<div class="nav-wrap">
    <div class="nav-shell">
      <a class="nav-brand" href="/">
        <img src="/assets/logo.png" alt="Jini's Pilates Studio logo" width="40" height="40">
        <span>Jini's Pilates Studio</span>
      </a>
      <div class="nav-right">
        <nav aria-label="Main" class="site-nav-desktop">
          <ul>${desktopLinks}</ul>
        </nav>
        <button type="button" class="nav-theme" aria-label="Switch to dark mode">${moon}</button>
        <a class="nav-cta" href="/#contact">Book a Trial</a>
        <button type="button" class="site-menu-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-nav">${menuIcon}</button>
      </div>
    </div>
  </div>`;

  let mobileNav = document.getElementById("mobile-nav");
  if (!mobileNav) {
    mobileNav = document.createElement("div");
    header.insertAdjacentElement("afterend", mobileNav);
  }
  mobileNav.id = "mobile-nav";
  mobileNav.className = "mobile-nav";
  mobileNav.hidden = true;
  mobileNav.innerHTML = `<nav aria-label="Mobile">${mobileLinks}<a class="mobile-nav-cta" href="/#contact">Book a Trial</a></nav>`;

  const onScroll = () => {
    header.classList.toggle("is-scrolled", (window.scrollY || 0) > 24);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const menuBtn = header.querySelector(".site-menu-toggle");
  const setMenu = (open) => {
    if (!menuBtn) return;
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    mobileNav.classList.toggle("is-open", open);
    mobileNav.hidden = !open;
    document.body.classList.toggle("menu-open", open);
  };
  menuBtn?.addEventListener("click", () => setMenu(menuBtn.getAttribute("aria-expanded") !== "true"));
  mobileNav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));

  const themeBtn = header.querySelector(".nav-theme");
  const applyTheme = (dark) => {
    document.documentElement.classList.toggle("dark", dark);
    themeBtn?.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
    try {
      localStorage.setItem("jinis_theme", dark ? "dark" : "light");
    } catch {
      /* ignore */
    }
  };
  try {
    if (localStorage.getItem("jinis_theme") === "dark") applyTheme(true);
  } catch {
    /* ignore */
  }
  themeBtn?.addEventListener("click", () => applyTheme(!document.documentElement.classList.contains("dark")));
})();
