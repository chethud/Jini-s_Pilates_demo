(() => {
  const content = window.JinisContent ? window.JinisContent.getContent() : null;

  /* ---------- helpers ---------- */
  const qs = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => [...root.querySelectorAll(sel)];
  const setText = (el, value) => {
    if (el && value != null) el.textContent = value;
  };

  /* ---------- apply CMS content ---------- */
  const applyContent = (data) => {
    if (!data) return;

    qsa("[data-cms='brandName']").forEach((el) => setText(el, data.brandName));
    qsa("[data-cms='heroEyebrow']").forEach((el) => setText(el, data.heroEyebrow));
    qsa("[data-cms='heroTitleBefore']").forEach((el) => {
      const value = String(data.heroTitleBefore || "").trim();
      setText(el, value ? value + " " : "");
    });
    qsa("[data-cms='heroTitleAccent']").forEach((el) => setText(el, data.heroTitleAccent));
    qsa("[data-cms='heroSubtitle']").forEach((el) => setText(el, data.heroSubtitle));
    qsa("[data-cms='heroBody']").forEach((el) => setText(el, data.heroBody));
    qsa("[data-cms='aboutTitle']").forEach((el) => setText(el, data.aboutTitle));
    qsa("[data-cms='aboutBody']").forEach((el) => setText(el, data.aboutBody));
    qsa("[data-cms='cafeBlurb']").forEach((el) => setText(el, data.cafeBlurb));
    qsa("[data-cms='phone']").forEach((el) => {
      setText(el, data.phone);
      const link = el.tagName === "A" ? el : el.closest("a");
      if (link) link.href = "tel:" + String(data.phone).replace(/\s+/g, "");
    });
    qsa("[data-cms='email']").forEach((el) => {
      setText(el, data.email);
      const link = el.tagName === "A" ? el : el.closest("a");
      if (link) link.href = "mailto:" + data.email;
    });
    qsa("[data-cms='address']").forEach((el) => setText(el, data.address));
    qsa("[data-cms='hours']").forEach((el) => setText(el, data.hours));

    const heroImg = qs("#hero img");
    if (heroImg && data.heroImage) {
      heroImg.src = data.heroImage;
      heroImg.alt = data.heroEyebrow || heroImg.alt;
    }

    const wa = qs('a[aria-label*="WhatsApp"]');
    if (wa && data.whatsapp) wa.href = "https://wa.me/" + data.whatsapp;

    if (Array.isArray(data.classes)) {
      data.classes.forEach((item, i) => {
        setText(qs(`[data-cms-class-name="${i}"]`), item.name);
        setText(qs(`[data-cms-class-blurb="${i}"]`), item.blurb);
      });
    }

    if (Array.isArray(data.trainers)) {
      data.trainers.forEach((item, i) => {
        setText(qs(`[data-cms-trainer-name="${i}"]`), item.name);
        setText(qs(`[data-cms-trainer-role="${i}"]`), item.role);
      });
    }

    // FAQ answers if empty / sync from content
    if (Array.isArray(data.faqs)) {
      const items = qsa("#faq [data-faq-item]");
      data.faqs.forEach((faq, i) => {
        const item = items[i];
        if (!item) return;
        const qBtn = qs("[data-faq-q]", item);
        const aEl = qs("[data-faq-a]", item);
        if (qBtn) setText(qBtn.childNodes[0].nodeType === 3 ? null : qBtn, null);
        // set question text preserving chevron svg
        if (qBtn) {
          const svg = qBtn.querySelector("svg");
          qBtn.textContent = faq.q;
          if (svg) qBtn.appendChild(svg);
        }
        if (aEl) aEl.innerHTML = `<p class="pb-5 text-muted-foreground leading-relaxed">${faq.a}</p>`;
      });
    }
  };

  /* ---------- scroll header + progress + reveals ---------- */
  const header = qs("#site-header");
  const progress = qs('div[aria-hidden="true"].fixed.inset-x-0.top-0');
  const onScroll = () => {
    const y = window.scrollY || document.documentElement.scrollTop || 0;
    if (header) header.classList.toggle("is-scrolled", y > 24);
    if (progress) {
      const doc = document.documentElement;
      const max = Math.max(1, doc.scrollHeight - window.innerHeight);
      progress.style.transform = `scaleX(${Math.min(1, Math.max(0, y / max))})`;
    }
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const reveals = qsa(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- theme toggle ---------- */
  const themeBtn = qs('button[aria-label="Switch to dark mode"], button[aria-label="Switch to light mode"]');
  const applyTheme = (dark) => {
    document.documentElement.classList.toggle("dark", dark);
    if (themeBtn) {
      themeBtn.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
    }
    try {
      localStorage.setItem("jinis_theme", dark ? "dark" : "light");
    } catch {
      /* ignore */
    }
  };
  try {
    const saved = localStorage.getItem("jinis_theme");
    if (saved === "dark") applyTheme(true);
  } catch {
    /* ignore */
  }
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      applyTheme(!document.documentElement.classList.contains("dark"));
    });
  }

  /* ---------- mobile menu ---------- */
  const menuBtn = qs('button[aria-label="Open menu"], button[aria-label="Close menu"]');
  const mobileNav = qs("#mobile-nav");
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
    qsa("a", mobileNav).forEach((a) => a.addEventListener("click", () => setMenu(false)));
  }

  /* ---------- FAQ accordion ---------- */
  qsa("#faq [data-faq-item]").forEach((item) => {
    const btn = qs("button", item);
    const panel = qs("[data-faq-a]", item);
    if (!btn || !panel) return;
    btn.addEventListener("click", () => {
      const open = item.getAttribute("data-state") === "open";
      qsa("#faq [data-faq-item]").forEach((other) => {
        other.setAttribute("data-state", "closed");
        const ob = qs("button", other);
        const op = qs("[data-faq-a]", other);
        if (ob) {
          ob.setAttribute("aria-expanded", "false");
          ob.setAttribute("data-state", "closed");
        }
        if (op) {
          op.hidden = true;
          op.setAttribute("data-state", "closed");
        }
      });
      if (!open) {
        item.setAttribute("data-state", "open");
        btn.setAttribute("aria-expanded", "true");
        btn.setAttribute("data-state", "open");
        panel.hidden = false;
        panel.setAttribute("data-state", "open");
      }
    });
  });

  /* ---------- gallery filters ---------- */
  const filterBtns = qsa("#gallery button[aria-pressed]");
  const galleryItems = qsa("#gallery [data-category]");
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const label = btn.textContent.trim().toLowerCase();
      filterBtns.forEach((b) => {
        const on = b === btn;
        b.setAttribute("aria-pressed", on ? "true" : "false");
        b.classList.toggle("bg-primary", on);
        b.classList.toggle("text-primary-foreground", on);
        b.classList.toggle("shadow-gold", on);
        b.classList.toggle("glass", !on);
        b.classList.toggle("text-muted-foreground", !on);
      });
      galleryItems.forEach((item) => {
        const cat = (item.getAttribute("data-category") || "").toLowerCase();
        const show = label === "all" || cat === label;
        item.style.display = show ? "" : "none";
      });
    });
  });

  /* ---------- gallery lightbox ---------- */
  let lightbox = qs("#cms-lightbox");
  if (!lightbox) {
    lightbox = document.createElement("div");
    lightbox.id = "cms-lightbox";
    lightbox.className = "cms-lightbox";
    lightbox.innerHTML = '<button type="button" class="cms-lightbox-close" aria-label="Close">×</button><img alt="">';
    document.body.appendChild(lightbox);
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox || e.target.classList.contains("cms-lightbox-close")) {
        lightbox.classList.remove("is-open");
      }
    });
  }
  qsa('#gallery button[aria-label^="Open larger view"]').forEach((btn) => {
    btn.addEventListener("click", () => {
      const img = qs("img", btn);
      if (!img) return;
      const big = qs("img", lightbox);
      big.src = img.src;
      big.alt = img.alt || "";
      lightbox.classList.add("is-open");
    });
  });

  /* ---------- cafe carousel ---------- */
  const cafeSection = qs("#cafe");
  if (cafeSection) {
    const slides = qsa("img", cafeSection).filter((img) => /food_|cafe_/.test(img.src));
    let idx = 0;
    const showSlide = (i) => {
      if (!slides.length) return;
      idx = (i + slides.length) % slides.length;
      slides.forEach((img, n) => {
        const wrap = img.closest("div") || img;
        wrap.style.display = n === idx ? "" : "none";
      });
    };
    // Only hide extras if multiple in a carousel-like group
    const prev = qs('button[aria-label="Previous cafe photo"]', cafeSection);
    const next = qs('button[aria-label="Next cafe photo"]', cafeSection);
    if (prev && next && slides.length > 1) {
      // keep first visible structure; cycle src on main visible image instead
      const main = slides[0];
      const sources = slides.map((s) => s.src);
      let c = 0;
      const paint = () => {
        main.src = sources[c];
      };
      prev.addEventListener("click", () => {
        c = (c - 1 + sources.length) % sources.length;
        paint();
      });
      next.addEventListener("click", () => {
        c = (c + 1) % sources.length;
        paint();
      });
    }
  }

  /* ---------- review dots ---------- */
  const reviewBtns = qsa('button[aria-label^="Show review by"]');
  if (reviewBtns.length) {
    // find sibling review cards near dots
    const wrap = reviewBtns[0].parentElement;
    const section = reviewBtns[0].closest("section") || document;
    const cards = qsa("[data-review], .review-card", section);
    // fallback: previous sibling group of articles
    const group = wrap ? wrap.previousElementSibling : null;
    const items = cards.length
      ? cards
      : group
        ? qsa(":scope > *", group)
        : [];
    const activate = (i) => {
      reviewBtns.forEach((b, n) => {
        const on = n === i;
        b.classList.toggle("w-7", on);
        b.classList.toggle("bg-primary", on);
        b.classList.toggle("w-2", !on);
        b.classList.toggle("bg-border", !on);
      });
      if (items.length) {
        items.forEach((card, n) => {
          card.style.display = n === i ? "" : "none";
        });
      }
    };
    reviewBtns.forEach((btn, i) => btn.addEventListener("click", () => activate(i)));
    activate(Math.max(0, reviewBtns.findIndex((b) => b.classList.contains("bg-primary"))));
  }

  /* ---------- forms ---------- */
  qsa("form").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      const btn = qs('button[type="submit"]', form);
      const original = btn ? btn.textContent : "";
      if (btn) {
        btn.disabled = true;
        btn.textContent = "Sent ✓";
      }
      setTimeout(() => {
        form.reset();
        if (btn) {
          btn.disabled = false;
          btn.textContent = original;
        }
        alert("Thanks! We’ll get back to you soon.");
      }, 400);
    });
  });

  /* ---------- smooth in-page nav offset for fixed header ---------- */
  qsa('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const target = qs(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 88;
      window.scrollTo({ top, behavior: "smooth" });
      setMenu(false);
    });
  });

  applyContent(content);
})();
