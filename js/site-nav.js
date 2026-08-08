(() => {
  const header = document.getElementById("site-header");
  if (!header) return;

  const onScroll = () => {
    const y = window.scrollY || document.documentElement.scrollTop || 0;
    header.classList.toggle("is-scrolled", y > 24);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const menuBtn = document.querySelector(".site-menu-toggle");
  const mobileNav = document.getElementById("mobile-nav");
  const setMenu = (open) => {
    if (!menuBtn || !mobileNav) return;
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    mobileNav.classList.toggle("is-open", open);
    mobileNav.hidden = !open;
    document.body.classList.toggle("menu-open", open);
  };

  if (menuBtn && mobileNav) {
    menuBtn.addEventListener("click", () => {
      const open = menuBtn.getAttribute("aria-expanded") !== "true";
      setMenu(open);
    });
    mobileNav.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => setMenu(false));
    });
  }
})();
