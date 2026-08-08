(() => {
  const content = window.JinisContent ? window.JinisContent.getContent() : null;

  /* ---------- helpers ---------- */
  const qs = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => [...root.querySelectorAll(sel)];
  const setText = (el, value) => {
    if (el && value != null) el.textContent = value;
  };
  const escapeHtml = (s) =>
    String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  const asset = (src) =>
    window.JinisContent ? window.JinisContent.assetUrl(src || "", "") : src || "";

  const parseClassBlurb = (blurb) => {
    const text = String(blurb || "").trim();
    const m = text.match(/^(.+?)\s*[·•]\s*(.+?)\s*[—–-]\s*(.+)$/);
    if (m) return { duration: m[1].trim(), level: m[2].trim(), desc: m[3].trim() };
    return { duration: "", level: "", desc: text };
  };

  const renderClassesGrid = (classes) => {
    const grid = qs("[data-cms-classes-grid]");
    if (!grid || !Array.isArray(classes)) return;
    grid.innerHTML = classes
      .map((item) => {
        const { duration, level, desc } = parseClassBlurb(item.blurb);
        const img = asset(item.image || "assets/class_mat_dkcnn3u_.jpg");
        const badges =
          duration || level
            ? `<div class="mt-3 flex flex-wrap items-center gap-2">
            ${duration ? `<span class="inline-flex items-center gap-1.5 rounded-full bg-primary/12 px-3 py-1 text-[11px] font-medium text-primary">${escapeHtml(duration)}</span>` : ""}
            ${level ? `<span class="inline-flex items-center gap-1.5 rounded-full bg-sage/12 px-3 py-1 text-[11px] font-medium text-sage">${escapeHtml(level)}</span>` : ""}
          </div>`
            : "";
        return `<div><article class="group glass h-full overflow-hidden rounded-3xl transition-all duration-500 hover:-translate-y-2 hover:shadow-lift">
          <div class="overflow-hidden"><img src="${img}" alt="${escapeHtml(item.name)}" width="900" height="700" loading="lazy" class="h-52 w-full object-cover transition-transform duration-700 group-hover:scale-110"></div>
          <div class="p-6">
            <h3 class="text-xl text-foreground">${escapeHtml(item.name)}</h3>
            ${badges}
            <p class="mt-4 text-sm leading-relaxed text-muted-foreground">${escapeHtml(desc)}</p>
            <a href="#contact" class="mt-6 inline-flex w-full items-center justify-center rounded-full border border-primary/40 px-5 py-3 text-xs font-medium text-foreground transition-colors hover:bg-primary hover:text-primary-foreground">Book Now</a>
          </div>
        </article></div>`;
      })
      .join("");
  };

  const renderTrainersGrid = (trainers) => {
    const grid = qs("[data-cms-trainers-grid]");
    if (!grid || !Array.isArray(trainers)) return;
    grid.innerHTML = trainers
      .map((item) => {
        const img = asset(item.image || "assets/trainer_1_cex1xk_w.jpg");
        const parts = String(item.detail || "")
          .split("·")
          .map((s) => s.trim())
          .filter(Boolean);
        const detailHtml = parts.length
          ? parts.map((p) => `<p class="mt-3 text-sm text-muted-foreground">${escapeHtml(p)}</p>`).join("")
          : "";
        return `<div><article class="group glass h-full overflow-hidden rounded-3xl">
          <div class="overflow-hidden"><img src="${img}" alt="${escapeHtml(item.name)}" width="700" height="900" loading="lazy" class="h-80 w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"></div>
          <div class="p-6">
            <h3 class="text-xl text-foreground">${escapeHtml(item.name)}</h3>
            <p class="mt-1 text-xs tracking-[0.16em] uppercase text-primary">${escapeHtml(item.role || "")}</p>
            ${detailHtml}
          </div>
        </article></div>`;
      })
      .join("");
  };

  const PLAN_FEATURE_CATALOG = [
    "Unlimited Classes",
    "Personal Trainer",
    "Diet Consultation",
    "Progress Tracking",
    "Priority Booking",
  ];

  const renderPlansGrid = (plans) => {
    const grid = qs("[data-cms-plans-grid]");
    if (!grid || !Array.isArray(plans)) return;
    const checkSvg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg>';

    grid.innerHTML = plans
      .map((plan) => {
        const features = Array.isArray(plan.features) ? plan.features : [];
        const catalog = [
          ...PLAN_FEATURE_CATALOG,
          ...features.filter((f) => !PLAN_FEATURE_CATALOG.includes(f)),
        ];
        const rows = catalog
          .map((f) => {
            const on = features.includes(f);
            return `<li class="flex items-center gap-3 text-sm ${
              on ? "text-foreground" : "text-muted-foreground/60 line-through"
            }"><span class="grid h-5 w-5 shrink-0 place-items-center rounded-full ${
              on ? "bg-sage/20 text-sage" : "bg-secondary text-muted-foreground"
            }">${checkSvg}</span>${escapeHtml(f)}</li>`;
          })
          .join("");
        const popular = !!plan.popular;
        return `<div><article class="glass relative flex h-full flex-col rounded-3xl p-8 transition-all duration-500 hover:-translate-y-2 ${
          popular ? "ring-1 ring-primary/30" : ""
        }">
          ${
            popular
              ? '<span class="absolute right-6 top-6 rounded-full bg-primary px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">Popular</span>'
              : ""
          }
          <p class="text-xs tracking-[0.24em] uppercase text-muted-foreground">${escapeHtml(
            plan.period || ""
          )}</p>
          <h3 class="mt-2 text-2xl text-foreground">${escapeHtml(plan.name || "")}</h3>
          <p class="mt-5 font-display text-4xl text-foreground">${escapeHtml(
            plan.price || ""
          )}<span class="ml-1 font-sans text-xs text-muted-foreground">/ ${escapeHtml(
            plan.cadence || ""
          )}</span></p>
          <ul class="mt-7 grid gap-3">${rows}</ul>
          <p class="mt-6 text-xs text-muted-foreground">${escapeHtml(plan.note || "")}</p>
          <a href="#contact" class="mt-7 inline-flex items-center justify-center rounded-full px-6 py-3.5 text-xs font-medium transition-all hover:-translate-y-0.5 ${
            popular
              ? "bg-primary text-primary-foreground"
              : "border border-primary/40 text-foreground hover:bg-primary hover:text-primary-foreground"
          }">Choose ${escapeHtml(plan.name || "Plan")}</a>
        </article></div>`;
      })
      .join("");
  };

  const renderCafeStage = (images) => {
    const stage = qs("[data-cms-cafe-stage]");
    const carousel = qs("[data-cafe-carousel]");
    if (!stage || !Array.isArray(images) || !images.length) return;
    stage.innerHTML = images
      .map((item, i) => {
        const src = asset(item.src);
        return `<article class="cafe-card" data-cafe-slide="${i}">
          <img src="${src}" alt="${escapeHtml(item.alt || "Cafe")}" width="800" height="1000" loading="lazy">
        </article>`;
      })
      .join("");
    if (carousel && typeof window.JinisInitCafeCarousel === "function") {
      window.JinisInitCafeCarousel(true);
    }
  };

  const HOME_GALLERY_LIMIT = 7;

  const bindHomeGalleryLightbox = () => {
    let lightbox = qs("#cms-lightbox");
    if (!lightbox) {
      lightbox = document.createElement("div");
      lightbox.id = "cms-lightbox";
      lightbox.className = "cms-lightbox";
      lightbox.innerHTML =
        '<button type="button" class="cms-lightbox-close" aria-label="Close">×</button><img alt="">';
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
  };

  const renderHomeGallery = (gallery) => {
    const grid = qs("[data-cms-gallery-grid]");
    if (!grid || !Array.isArray(gallery)) return;
    const items = gallery.slice(0, HOME_GALLERY_LIMIT);
    grid.innerHTML = items
      .map((item) => {
        const src = asset(item.src);
        const alt = item.alt || "Gallery photo";
        const cat = String(item.category || "").toLowerCase();
        return `<div><button type="button" class="group block w-full overflow-hidden rounded-3xl shadow-soft" aria-label="Open larger view: ${escapeHtml(
          alt
        )}" data-category="${escapeHtml(cat)}"><img src="${src}" alt="${escapeHtml(
          alt
        )}" loading="lazy" class="w-full object-cover transition-transform duration-700 group-hover:scale-110"></button></div>`;
      })
      .join("");
    bindHomeGalleryLightbox();
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

    renderClassesGrid(data.classes);
    renderTrainersGrid(data.trainers);
    renderPlansGrid(data.plans);
    renderCafeStage(data.cafeImages);
    renderHomeGallery(data.gallery);
    renderFaqs(data.faqs);
  };

  const chevronSvg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" aria-hidden="true"><path d="m6 9 6 6 6-6"></path></svg>';

  const bindFaqAccordion = () => {
    qsa("#faq [data-faq-item]").forEach((item) => {
      const btn = qs("button", item);
      const panel = qs("[data-faq-a]", item);
      if (!btn || !panel || btn.dataset.faqBound === "1") return;
      btn.dataset.faqBound = "1";
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
  };

  const renderFaqs = (faqs) => {
    const list = qs("[data-cms-faq-list]");
    if (!list || !Array.isArray(faqs)) return;
    list.innerHTML = faqs
      .map(
        (faq) => `<div data-faq-item data-state="closed" data-orientation="vertical" class="border-b glass rounded-3xl border-none px-6">
<h3 data-orientation="vertical" data-state="closed" class="flex">
<button type="button" aria-expanded="false" data-state="closed" data-faq-q class="flex flex-1 items-center justify-between font-medium cursor-pointer transition-all py-5 text-left font-display text-base text-foreground hover:no-underline sm:text-lg">${escapeHtml(
          faq.q || ""
        )}${chevronSvg}</button>
</h3>
<div data-faq-a data-state="closed" hidden role="region" class="overflow-hidden text-sm"><p class="pb-5 text-muted-foreground leading-relaxed">${escapeHtml(
          faq.a || ""
        )}</p></div>
</div>`
      )
      .join("");
    bindFaqAccordion();
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
  const menuBtn = qs('#menu-toggle, button[aria-label="Open menu"], button[aria-label="Close menu"]');
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

  /* FAQ accordion bound in renderFaqs / bindFaqAccordion */

  /* gallery preview is rendered from CMS in applyContent (7 photos); full set on gallery pages */

  /* cafe carousel moved to js/cafe.js */

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

      const data = new FormData(form);
      const name = String(data.get("name") || "").trim();
      const email = String(data.get("email") || "").trim();
      const phone = String(data.get("phone") || "").trim();
      const preferredClass = String(data.get("preferred_class") || "").trim();
      const message = String(data.get("message") || "").trim();

      const contentData = window.JinisContent ? window.JinisContent.getContent() : null;
      const whatsapp = String(contentData?.whatsapp || "919686868697").replace(/\D/g, "");
      const studioEmail = String(contentData?.email || "info@jinispilatesstudio.com").trim();

      const lines = [
        "New enquiry from Jini's Pilates website",
        "",
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone}`,
        preferredClass ? `Preferred class: ${preferredClass}` : "",
        message ? `Message: ${message}` : "",
      ].filter(Boolean);
      const body = lines.join("\n");

      // Primary: WhatsApp to studio number. Fallback: email compose.
      let opened = false;
      if (whatsapp) {
        const waUrl = `https://wa.me/${whatsapp}?text=${encodeURIComponent(body)}`;
        const win = window.open(waUrl, "_blank", "noopener,noreferrer");
        opened = !!win;
      }
      if (!opened && studioEmail) {
        const mailUrl = `mailto:${encodeURIComponent(studioEmail)}?subject=${encodeURIComponent(
          "Website enquiry — " + (name || "New lead")
        )}&body=${encodeURIComponent(body)}`;
        window.location.href = mailUrl;
      }

      const btn = qs('button[type="submit"]', form);
      const original = btn ? btn.textContent : "";
      if (btn) {
        btn.disabled = true;
        btn.textContent = "Opening…";
      }
      setTimeout(() => {
        form.reset();
        if (btn) {
          btn.disabled = false;
          btn.textContent = original;
        }
        alert("Thanks! Your details will open in WhatsApp to send to the studio.");
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
