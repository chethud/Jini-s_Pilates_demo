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
  const syncTestimonialMarquee = () => {
    const track = qs("#testimonials .testimonials-track");
    if (!track) return;
    qsa("[data-marquee-clone]", track).forEach((el) => el.remove());
    delete track.dataset.marquee;
    if (!phoneMarquee.matches) return;
    track.dataset.marquee = "1";
    [...track.children].forEach((item) => {
      const clone = item.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      clone.dataset.marqueeClone = "1";
      track.appendChild(clone);
    });
  };

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

  const renderTestimonialsGrid = (items) => {
    const grid = qs("[data-cms-testimonials-grid]");
    if (!grid || !Array.isArray(items)) return;
    const quoteIcon =
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-quote text-primary/60" aria-hidden="true"><path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"></path><path d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"></path></svg>';
    const star =
      '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star fill-primary text-primary" aria-hidden="true"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg>';
    grid.innerHTML = items
      .map((item) => {
        const rating = Math.min(5, Math.max(1, Number(item.rating) || 5));
        const stars = Array.from({ length: rating }, () => `<span>${star}</span>`).join("");
        const img = asset(item.image || "assets/gallery_members_cyis7hte.jpg");
        const name = escapeHtml(item.name || "Member");
        return `<div class="testimonials-slide"><article class="glass flex h-full flex-col rounded-3xl p-7">
          ${quoteIcon}
          <p class="mt-4 grow text-sm leading-relaxed text-muted-foreground">${escapeHtml(item.quote || "")}</p>
          <div class="mt-6 flex items-center gap-1" aria-label="${rating} out of 5 stars">${stars}</div>
          <div class="mt-5 flex min-w-0 items-center gap-3">
            <img src="${img}" alt="${name}" width="80" height="80" loading="lazy" class="h-11 w-11 shrink-0 rounded-full object-cover object-top">
            <p class="truncate font-display text-base text-foreground">${name}</p>
          </div>
        </article></div>`;
      })
      .join("");
    syncTestimonialMarquee();
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
    select.innerHTML =
      '<option value="" disabled selected>Select a class</option>' +
      classes
        .map(
          (item) =>
            `<option value="${escapeHtml(item.name)}">${escapeHtml(item.name)}</option>`
        )
        .join("");
    if (current && classes.some((c) => c.name === current)) select.value = current;
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

      if (!name || !email || !phone || !preferredClass || !message) {
        alert("Please fill all fields before submitting.");
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
    });
  });

  /* ---------- Why Pilates: seamless horizontal marquee ---------- */
  const setupWhyMarquee = () => {
    const list = qs("#why-pilates ul");
    if (!list || list.dataset.marquee) return;
    list.dataset.marquee = "1";
    list.className = "why-marquee-track";
    // A second copy is what makes the -50% loop seamless.
    [...list.children].forEach((item) => {
      const clone = item.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      list.appendChild(clone);
    });
    const wrap = document.createElement("div");
    wrap.className = "why-marquee";
    list.parentNode.insertBefore(wrap, list);
    wrap.appendChild(list);
  };
  setupWhyMarquee();

  const why = qs("#why-pilates");
  const testimonials = qs("#testimonials");
  if (why && testimonials) why.insertAdjacentElement("afterend", testimonials);
  setText(qs("#membership .pkg-section-head .eyebrow"), "Plan");

  applyContent(content);
  phoneMarquee.addEventListener("change", syncTestimonialMarquee);
})();
