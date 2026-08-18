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

  const classIcon = (name) => {
    const n = String(name || "").toLowerCase();
    const svg = (d) =>
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
    if (n.includes("reformer")) return svg('<rect x="3" y="7" width="18" height="11" rx="1.5"/><path d="M8 7v11M16 7v11"/>');
    if (n.includes("strength")) return svg('<path d="M6 12h12"/><rect x="2" y="8" width="4" height="8" rx="1"/><rect x="18" y="8" width="4" height="8" rx="1"/>');
    if (n.includes("zumba")) return svg('<path d="M9 18V5l10-2v13"/><circle cx="7" cy="18" r="2.4"/><circle cx="17" cy="16" r="2.4"/>');
    if (n.includes("mat")) return svg('<rect x="4" y="6" width="16" height="12" rx="2"/><path d="M8 10h8"/>');
    return svg('<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>');
  };

  const renderClassesGrid = (classes) => {
    const grid = qs("[data-cms-classes-grid]");
    if (!grid || !Array.isArray(classes)) return;
    grid.innerHTML = classes
      .map((item) => {
        const img = asset(item.image || "assets/class_mat_dkcnn3u_.jpg");
        const name = escapeHtml(item.name || "Session");
        return `<article class="s-card">
          <div class="s-photo">
            <img src="${img}" alt="${name}" width="900" height="700" loading="lazy">
            <span class="s-icon" aria-hidden="true">${classIcon(item.name)}</span>
          </div>
          <div class="s-body">
            <h3>${name}</h3>
            <p>${escapeHtml(item.blurb || "")}</p>
            <a href="/plans?class=${encodeURIComponent(window.JinisPlans ? window.JinisPlans.tabOf({ period: item.name }) : item.name)}">View Class <span aria-hidden="true">→</span></a>
          </div>
        </article>`;
      })
      .join("");
  };

  const renderTrainersGrid = (trainers) => {
    const grid = qs("[data-cms-trainers-grid]");
    if (!grid || !Array.isArray(trainers)) return;
    const icon = (d) =>
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
    const pip = icon('<circle cx="12" cy="12" r="5.5"/>');
    grid.innerHTML = trainers
      .map((item) => {
        const img = asset(item.image || "assets/trainer_1_cex1xk_w.jpg");
        const [years, specialty] = String(item.detail || "")
          .split("·")
          .map((s) => s.trim());
        const name = escapeHtml(item.name || "Instructor");
        return `<article class="why-coach">
          <div class="why-coach-photo"><img src="${img}" alt="${name}" width="700" height="900" loading="lazy"></div>
          <div class="why-coach-info">
            <h4>${name}</h4>
            <p class="why-coach-role">${escapeHtml(item.role || "")}</p>
            ${years ? `<p class="why-coach-meta">${pip}<span>${escapeHtml(years)}</span></p>` : ""}
            ${specialty ? `<p class="why-coach-meta">${pip}<span>${escapeHtml(specialty)}</span></p>` : ""}
          </div>
        </article>`;
      })
      .join("");
  };

  const starsHtml = (n) => {
    const rating = Math.min(5, Math.max(1, Number(n) || 5));
    return `<span class="t-stars" aria-label="${rating} out of 5 stars">${"★".repeat(rating)}</span>`;
  };

  const personHtml = (item) => {
    const img = asset(item.image || "assets/gallery_members_cyis7hte.jpg");
    const name = escapeHtml(item.name || "Member");
    return `<div class="t-person">
      <img src="${img}" alt="" width="80" height="80" loading="lazy" class="t-photo">
      <div>
        <p class="t-name">${name}</p>
        <p class="t-role">Pilates Member</p>
      </div>
    </div>`;
  };

  const renderTestimonialsGrid = (items) => {
    const grid = qs("[data-cms-testimonials-grid]");
    if (!grid || !Array.isArray(items) || !items.length) return;
    const [hero, ...rest] = items;
    const avg = items.reduce((sum, item) => sum + (Number(item.rating) || 5), 0) / items.length;
    const minis = rest
      .map(
        (item) => `<article class="t-mini">
        <p class="t-quote">${escapeHtml(item.quote || "")}</p>
        ${starsHtml(item.rating)}
        ${personHtml(item)}
      </article>`
      )
      .join("");
    grid.innerHTML = `<article class="t-hero">
        <p class="t-quote">${escapeHtml(hero.quote || "")}</p>
        ${starsHtml(hero.rating)}
        ${personHtml(hero)}
      </article>
      <div class="t-minis">
        ${minis}
        <article class="t-trust">
          <div class="t-trust-avg">
            <p class="t-trust-score">${avg.toFixed(1)}</p>
            ${starsHtml(Math.round(avg))}
            <p class="t-trust-label">Average rating</p>
          </div>
          <div class="t-trust-members">
            <p class="t-trust-score">500+</p>
            <p class="t-trust-label">Happy members</p>
          </div>
        </article>
      </div>`;
    if (grid.dataset.tBound !== "1") {
      grid.dataset.tBound = "1";
      grid.addEventListener("click", (e) => {
        if (!window.matchMedia("(max-width: 720px)").matches) return;
        const row = e.target.closest(".t-mini");
        if (!row) return;
        grid.querySelectorAll(".t-mini.is-open").forEach((el) => {
          if (el !== row) el.classList.remove("is-open");
        });
        row.classList.toggle("is-open");
      });
    }
  };

  const renderPlansGrid = (plans, classes) => {
    const grid = qs("[data-cms-plans-grid]");
    if (!grid || !window.JinisPlans) return;
    window.JinisPlans.render(grid, plans, {
      contactHref: "#contact",
      classes,
      resolveSrc: asset,
      cardHref: (tab) => `/plans?class=${encodeURIComponent(tab)}`,
    });
  };

  const renderCafeStage = (images) => {
    const stage = qs("[data-cms-cafe-stage]");
    if (!stage || !Array.isArray(images) || !images.length) return;
    stage.innerHTML = images
      .map((item, i) => {
        const src = asset(item.src);
        return `<article class="cafe-card${i === 0 ? " is-active" : ""}">
          <img src="${src}" alt="${escapeHtml(item.alt || "Cafe")}" width="800" height="1000" loading="lazy">
        </article>`;
      })
      .join("");
    bindCafeSwitch();
  };

  const bindCafeSwitch = () => {
    const root = qs("[data-cafe-carousel]");
    if (!root) return;
    const cards = () => qsa(".cafe-card", root);
    let index = Math.max(0, cards().findIndex((el) => el.classList.contains("is-active")));
    const show = (n) => {
      const list = cards();
      if (!list.length) return;
      index = (n + list.length) % list.length;
      list.forEach((el, i) => el.classList.toggle("is-active", i === index));
    };
    show(index);
    if (root.dataset.switchBound === "1") return;
    root.dataset.switchBound = "1";
    root.addEventListener("click", (event) => {
      if (event.target.closest("[data-cafe-prev]")) show(index - 1);
      if (event.target.closest("[data-cafe-next]")) show(index + 1);
    });
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
    renderTestimonialsGrid(data.testimonials);
    renderPlansGrid(data.plans, data.classes);
    renderCafeStage(data.cafeImages);
    renderFaqs(data.faqs);
    renderContactClasses(data.classes);
    applyPendingPackage();
  };

  const applyPendingPackage = () => {
    try {
      const raw = sessionStorage.getItem("jinis_pending_package");
      if (!raw) return;
      const pending = JSON.parse(raw);
      const select = qs("#class");
      if (select && pending.className) {
        const match = [...select.options].find(
          (opt) => opt.value.toLowerCase() === String(pending.className).toLowerCase()
        );
        if (match) select.value = match.value;
      }
      const message = qs("#message");
      if (message && pending.package && !message.value.trim()) {
        message.value = `I'd like the ${pending.package} package${pending.price ? ` (${pending.price})` : ""}.`;
      }
    } catch {
      /* ignore */
    }
  };

  const renderContactClasses = (classes) => {
    const select = qs("#class");
    if (!select || !Array.isArray(classes) || !classes.length) return;
    const current = select.value;
    const extras = [
      "Wellness Cafe",
      "Cafe events",
      "Healthy meal prep",
      "Nutritional plans",
    ];
    select.innerHTML =
      '<option value="" disabled selected>Select an option</option>' +
      classes
        .map(
          (item) =>
            `<option value="${escapeHtml(item.name)}">${escapeHtml(item.name)}</option>`
        )
        .join("") +
      extras.map((item) => `<option value="${item}">${item}</option>`).join("");
    if (current && (classes.some((c) => c.name === current) || extras.includes(current))) {
      select.value = current;
    }
  };

  const plusIcon = '<span class="faq-icon" aria-hidden="true"></span>';

  const setFaqOpen = (item, open) => {
    const btn = qs("[data-faq-q]", item);
    const panel = qs("[data-faq-a]", item);
    item.setAttribute("data-state", open ? "open" : "closed");
    if (btn) {
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      btn.setAttribute("data-state", open ? "open" : "closed");
    }
    if (panel) panel.setAttribute("data-state", open ? "open" : "closed");
  };

  const bindFaqAccordion = () => {
    qsa("#faq [data-faq-item]").forEach((item) => {
      const btn = qs("[data-faq-q]", item);
      if (!btn || btn.dataset.faqBound === "1") return;
      btn.dataset.faqBound = "1";
      btn.addEventListener("click", () => {
        const open = item.getAttribute("data-state") === "open";
        qsa("#faq [data-faq-item]").forEach((other) => setFaqOpen(other, false));
        if (!open) setFaqOpen(item, true);
      });
    });
  };

  const renderFaqs = (faqs) => {
    const list = qs("[data-cms-faq-list]");
    if (!list || !Array.isArray(faqs)) return;
    list.innerHTML = faqs
      .map((faq) => `<article class="faq-item" data-faq-item data-state="closed">
          <h3>
            <button type="button" data-faq-q aria-expanded="false" data-state="closed">
              <span class="faq-num"></span>
              <span class="faq-q">${escapeHtml(faq.q || "")}</span>
              ${plusIcon}
            </button>
          </h3>
          <div data-faq-a data-state="closed" role="region">
            <p>${escapeHtml(faq.a || "")}</p>
          </div>
        </article>`)
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
      { threshold: 0, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  /* FAQ accordion bound in renderFaqs / bindFaqAccordion */

  /* gallery preview is rendered from CMS in applyContent (7 photos); full set on gallery pages */

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
  const phoneInput = qs("#contact #phone, #phone");
  if (phoneInput) {
    phoneInput.addEventListener("input", () => {
      phoneInput.value = phoneInput.value.replace(/\D/g, "").slice(0, 10);
    });
  }

  qsa("form").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const data = new FormData(form);
      const name = String(data.get("name") || "").trim();
      const email = String(data.get("email") || "").trim();
      const phone = String(data.get("phone") || "").replace(/\D/g, "");
      const preferredClass = String(data.get("preferred_class") || "").trim();
      const message = String(data.get("message") || "").trim();

      if (phoneInput) phoneInput.value = phone;

      if (!name || !email || !phone || !preferredClass) {
        alert("Please fill your name, email, phone and preferred class.");
        form.reportValidity();
        return;
      }
      if (!/^\d{10}$/.test(phone)) {
        alert("Phone number must be exactly 10 digits.");
        phoneInput?.focus();
        phoneInput?.reportValidity();
        return;
      }
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const contentData = window.JinisContent ? window.JinisContent.getContent() : null;
      const whatsapp = String(contentData?.whatsapp || "919686868697").replace(/\D/g, "");
      const studioEmail = String(contentData?.email || "info@jinispilatesstudio.com").trim();

      const lines = [
        "New enquiry from Jini's Pilates website",
        "",
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone}`,
        preferredClass ? `Interest: ${preferredClass}` : "",
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
    });
  });

  const why = qs("#why-pilates");
  const testimonials = qs("#testimonials");
  if (why && testimonials) why.insertAdjacentElement("afterend", testimonials);
  applyContent(content);
})();
