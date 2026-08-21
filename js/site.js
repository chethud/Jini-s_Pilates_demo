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

  const phoneMarquee = window.matchMedia("(max-width: 720px)");

  const cloneWhyMarquee = () => {
    const grid = qs("#why-pilates .why-grid");
    if (!grid || grid.dataset.marquee === "1") return;
    grid.dataset.marquee = "1";
    [...grid.children].forEach((card) => {
      const clone = card.cloneNode(true);
      clone.classList.add("why-card-clone");
      clone.setAttribute("aria-hidden", "true");
      grid.appendChild(clone);
    });
  };

  const clampPct = (n) => Math.min(100, Math.max(0, n));

  const parseFaceCrop = (item, img) => {
    const raw = item?.faceCrop ?? item?.faceFocus;
    // faceCrop: [cx, cy, w, h, zoom?, targetX?, targetY?]
    // cx/cy = face focus in the source image; targetX/Y = where that point lands in the circular frame
    // (frames hang off the top-left, so the visible arc is lower-right ≈ 60%, 52%)
    if (Array.isArray(raw)) {
      if (raw.length >= 2) {
        return {
          cx: +raw[0] || 50,
          cy: +raw[1] || 16,
          w: +raw[2] || 20,
          h: +raw[3] || 24,
          zoom: +raw[4] || 0,
          targetX: raw.length >= 6 ? +raw[5] : 70,
          targetY: raw.length >= 7 ? +raw[6] : 64,
        };
      }
    }
    if (raw && typeof raw === "object" && !Array.isArray(raw)) {
      return {
        cx: Number(raw.cx) || 50,
        cy: Number(raw.cy) || 16,
        w: Number(raw.w) || 20,
        h: Number(raw.h) || 24,
        zoom: Number(raw.zoom) || 0,
        targetX: Number(raw.targetX) || 70,
        targetY: Number(raw.targetY) || 64,
      };
    }
    const { naturalWidth: w, naturalHeight: h } = img;
    if (!w || !h) return { cx: 50, cy: 16, w: 20, h: 24, zoom: 0, targetX: 70, targetY: 64 };
    const ratio = h / w;
    return ratio > 1.1
      ? { cx: 50, cy: 14, w: 22, h: 28, zoom: 0, targetX: 70, targetY: 64 }
      : { cx: 50, cy: 22, w: 20, h: 22, zoom: 0, targetX: 70, targetY: 64 };
  };

  const detectCardFace = async (img, item) => {
    const base = parseFaceCrop(item, img);
    if ("FaceDetector" in window) {
      try {
        const faces = await new FaceDetector({ fastMode: true, maxDetectedFaces: 1 }).detect(img);
        const face = faces[0];
        if (face) {
          const b = face.boundingBox;
          const nw = img.naturalWidth;
          const nh = img.naturalHeight;
          return {
            ...base,
            cx: ((b.x + b.width / 2) / nw) * 100,
            cy: ((b.y + b.height * 0.42) / nh) * 100,
            w: Math.min(100, (b.width / nw) * 100 * 1.45),
            h: Math.min(100, (b.height / nh) * 100 * 1.6),
          };
        }
      } catch (_) {}
    }
    return base;
  };

  const fitCardFaceInArc = (img, face) => {
    const frame = img.parentElement;
    if (!frame) return;

    const fx = clampPct(face.cx);
    const fy = clampPct(face.cy);
    const targetX = clampPct(face.targetX ?? 70);
    const targetY = clampPct(face.targetY ?? 64);
    const zoom =
      face.zoom > 0
        ? Math.min(240, Math.max(120, face.zoom))
        : Math.min(220, Math.max(150, Math.round(2800 / Math.max(face.w || 20, 10))));

    // Pin the face point inside the img box, then shift the box so that point
    // lands in the visible lower-right arc of the clipped circular frame.
    img.style.position = "absolute";
    img.style.inset = "auto";
    img.style.margin = "0";
    img.style.width = `${zoom}%`;
    img.style.height = `${zoom}%`;
    img.style.maxWidth = "none";
    img.style.objectFit = "cover";
    img.style.objectPosition = `${fx}% ${fy}%`;
    img.style.left = `${targetX - (fx / 100) * zoom}%`;
    img.style.top = `${targetY - (fy / 100) * zoom}%`;
    img.style.transform = "none";
  };

  const alignTestimonialCardFace = (img, item) => {
    if (!img || img.dataset.faceAligned === "1") return;
    const apply = async () => {
      const face = await detectCardFace(img, item);
      const frame = img.parentElement;
      if (!frame) return;
      const runFit = () => {
        if (!frame.clientWidth) {
          requestAnimationFrame(runFit);
          return;
        }
        fitCardFaceInArc(img, face);
        img.dataset.faceAligned = "1";
      };
      runFit();
    };
    if (img.complete && img.naturalWidth) apply();
    else img.addEventListener("load", () => apply(), { once: true });
  };

  const alignTestimonialFaces = (grid, items) => {
    if (!grid || !Array.isArray(items)) return;
    qsa(".t-hero .t-avatar-img, .t-mini .t-avatar-img", grid).forEach((img, i) => {
      alignTestimonialCardFace(img, items[i]);
    });
  };

  const syncTestimonialMarquee = (grid) => {
    const track = grid || qs("[data-cms-testimonials-grid]");
    if (!track) return;
    qsa("[data-marquee-clone]", track).forEach((el) => el.remove());
    delete track.dataset.marquee;
    if (!phoneMarquee.matches) return;
    track.dataset.marquee = "1";
    const slides = [
      track.querySelector(":scope > .t-hero"),
      ...track.querySelectorAll(":scope > .t-minis > .t-mini"),
    ].filter(Boolean);
    slides.forEach((slide) => {
      const clone = slide.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      clone.dataset.marqueeClone = "1";
      track.appendChild(clone);
    });
  };

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
    const starSvg = `<svg class="t-star-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;
    return `<div class="t-stars" aria-label="${rating} out of 5 stars">${starSvg.repeat(rating)}</div>`;
  };

  const personHtml = (item) => {
    const img = asset(item.image || "assets/gallery_members_cyis7hte.jpg");
    const name = escapeHtml(item.name || "Member");
    return `<div class="t-person">
      <img src="${img}" alt="${name}" width="80" height="80" loading="lazy" class="t-photo">
      <div>
        <p class="t-name">${name}</p>
        <p class="t-role">PILATES MEMBER</p>
      </div>
    </div>`;
  };

  const testimonialDecoSvg = `<svg class="t-quote-deco-svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>`;

  const testimonialCardHtml = (item, { featured = false, index = 0 } = {}) => {
    const itemImg = asset(item.image || "assets/gallery_members_cyis7hte.jpg");
    const itemName = escapeHtml(item.name || "Member");
    const tag = featured ? "h3" : "h4";
    const cls = featured ? "t-hero" : "t-mini";
    const interactive = featured
      ? ""
      : ` tabindex="0" role="button" aria-label="Show ${itemName}'s review" onclick="window.JinisPromoteTestimonial&&window.JinisPromoteTestimonial(+this.dataset.tIndex)"`;
    return `<article class="${cls}" data-t-index="${index}"${interactive}>
        <div class="t-avatar-frame">
          <img src="${itemImg}" alt="${itemName}" width="320" height="320" loading="lazy" class="t-avatar-img">
        </div>
        <div class="t-author-box">
          <${tag} class="t-name">${itemName}</${tag}>
          <p class="t-role">PILATES MEMBER</p>
        </div>
        <div class="t-top-row">
          <div class="t-rating-box">
            ${starsHtml(item.rating)}
          </div>
        </div>
        <p class="t-quote">${escapeHtml(item.quote || "")}</p>
        <div class="t-quote-deco" aria-hidden="true">${testimonialDecoSvg}</div>
      </article>`;
  };

  let testimonialOrder = [];

  const promoteTestimonial = (fromIndex) => {
    if (!Array.isArray(testimonialOrder) || fromIndex <= 0 || fromIndex >= testimonialOrder.length) return false;
    const next = testimonialOrder.slice();
    const featured = next[0];
    next[0] = next[fromIndex];
    next[fromIndex] = featured;
    renderTestimonialsGrid(next);
    const hero = qs("#testimonials .t-hero");
    hero?.classList.remove("t-hero-swap");
    void hero?.offsetWidth;
    hero?.classList.add("t-hero-swap");
    return true;
  };

  const wireTestimonialPromote = (grid) => {
    qsa(".t-mini", grid).forEach((row) => {
      if (row.dataset.promoteWired === "1") return;
      row.dataset.promoteWired = "1";
      row.addEventListener("keydown", (e) => {
        if (e.key !== "Enter" && e.key !== " ") return;
        e.preventDefault();
        const idx = Number(row.dataset.tIndex);
        if (!Number.isFinite(idx) || idx <= 0) return;
        promoteTestimonial(idx);
      });
    });
  };

  const renderTestimonialsGrid = (items) => {
    const grid = qs("[data-cms-testimonials-grid]");
    if (!grid || !Array.isArray(items) || !items.length) return;
    testimonialOrder = items.slice();
    const [hero, ...rest] = testimonialOrder;

    const minis = rest.map((item, i) => testimonialCardHtml(item, { index: i + 1 })).join("");

    grid.innerHTML = `${testimonialCardHtml(hero, { featured: true, index: 0 })}
      <div class="t-minis">
        ${minis}
      </div>`;
    alignTestimonialFaces(grid, testimonialOrder);
    syncTestimonialMarquee(grid);
    wireTestimonialPromote(grid);
  };

  window.JinisPromoteTestimonial = promoteTestimonial;


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
    cloneWhyMarquee();
  };

  cloneWhyMarquee();

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
    if (panel) {
      panel.hidden = !open;
      panel.setAttribute("data-state", open ? "open" : "closed");
    }
  };

  let faqMqBound = false;

  const closeAllFaqs = () => {
    qsa("#faq [data-faq-item]").forEach((item) => setFaqOpen(item, false));
  };

  const applyFaqDefaults = () => {
    // Never expand an FAQ by default on mobile/tablet. Desktop keeps the first open.
    const desktop =
      window.matchMedia("(min-width: 900px)").matches &&
      Math.min(window.innerWidth, document.documentElement.clientWidth) >= 900;
    if (desktop) {
      qsa("#faq [data-faq-item]").forEach((item, i) => setFaqOpen(item, i === 0));
    } else {
      closeAllFaqs();
    }
  };

  const bindFaqAccordion = () => {
    qsa("#faq [data-faq-item]").forEach((item) => {
      const btn = qs("[data-faq-q]", item);
      if (!btn || btn.dataset.faqBound === "1") return;
      btn.dataset.faqBound = "1";
      btn.addEventListener("click", () => {
        const open = item.getAttribute("data-state") === "open";
        closeAllFaqs();
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
          <div data-faq-a data-state="closed" hidden role="region">
            <p>${escapeHtml(faq.a || "")}</p>
          </div>
        </article>`)
      .join("");
    bindFaqAccordion();
    applyFaqDefaults();
    if (!faqMqBound) {
      faqMqBound = true;
      const mq = window.matchMedia("(min-width: 900px)");
      const onFaqMq = () => applyFaqDefaults();
      if (mq.addEventListener) mq.addEventListener("change", onFaqMq);
      else mq.addListener(onFaqMq);
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
  phoneMarquee.addEventListener("change", () => syncTestimonialMarquee());
  applyContent(content);
})();
