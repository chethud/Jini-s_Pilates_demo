(() => {
  const TAB_ORDER = ["Reformer Pilates", "Mat Pilates", "Strength", "Zumba"];

  const classMeta = (tab, classes) => {
    const match = (classes || []).find((item) => {
      const name = String(item.name || "");
      if (tab === "Strength") return /strength/i.test(name);
      return name.toLowerCase() === tab.toLowerCase();
    });
    const blurb = String(match?.blurb || "");
    const split = blurb.match(/^(.*?)\s+[—–]\s+([\s\S]+)$/);
    const level = (split ? split[1] : "All levels").trim();
    const line = (split ? split[2] : blurb).trim();
    return {
      title: match?.name || tab,
      level,
      line,
      image:
        match?.image ||
        (tab === "Reformer Pilates" ? "assets/hero-home.jpg" : tab === "Strength" ? "assets/class-strength.png" : ""),
    };
  };

  const escapeHtml = (value) =>
    String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const tabOf = (plan) => {
    if (plan.tab) return plan.tab;
    const period = String(plan.period || "");
    if (/strength/i.test(period)) return "Strength";
    if (/zumba/i.test(period)) return "Zumba";
    if (/mat/i.test(period)) return "Mat Pilates";
    if (/reformer/i.test(period)) return "Reformer Pilates";
    return period || "Other";
  };

  const validityOf = (plan) => String(plan.validity || plan.note || plan.cadence || "").trim();

  const validityCopy = (plan) => {
    const raw = validityOf(plan);
    if (!raw || raw === "—") return "";
    if (/days/i.test(raw)) return `Valid for ${raw.replace(/^valid( for)?\s*/i, "")}`;
    if (/month/i.test(raw)) return `${raw.replace(/s$/i, "")} membership`;
    return raw;
  };

  const groupByTab = (plans) => {
    const groups = {};
    (plans || []).forEach((plan) => {
      const tab = tabOf(plan);
      if (!groups[tab]) groups[tab] = [];
      groups[tab].push(plan);
    });
    const tabs = TAB_ORDER.filter((tab) => groups[tab]?.length);
    Object.keys(groups).forEach((tab) => {
      if (!tabs.includes(tab)) tabs.push(tab);
    });
    return { tabs, groups };
  };

  const classImage = (tab, classes, resolveSrc) => resolveSrc(classMeta(tab, classes).image);

  const hrefFor = (tab, options) => {
    if (typeof options.cardHref === "function") return options.cardHref(tab) || "";
    return options.cardHref || `/plans?class=${encodeURIComponent(tab)}`;
  };

  const matchTab = (raw, tabs) => {
    const q = decodeURIComponent(String(raw || "")).trim().toLowerCase();
    if (!q) return "";
    return (
      tabs.find((tab) => tab.toLowerCase() === q) ||
      tabs.find((tab) => tab.toLowerCase().includes(q) || q.includes(tab.toLowerCase())) ||
      ""
    );
  };

  const defaultResolve = (src) => {
    if (!src) return "";
    if (src.startsWith("data:") || src.startsWith("http") || src.startsWith("/") || src.startsWith("../")) return src;
    return src.replace(/^\//, "");
  };

  const cardMarkup = (tab, options) => {
    const meta = classMeta(tab, options.classes);
    const img = classImage(tab, options.classes, options.resolveSrc);
    const href = hrefFor(tab, options);
    return `<a class="pkg-card" href="${escapeHtml(href)}">
      <div class="pkg-card-media">
        <img src="${escapeHtml(img)}" alt="${escapeHtml(meta.title)}" width="1200" height="800" loading="lazy">
      </div>
      <div class="pkg-card-body">
        <p class="pkg-kicker">${escapeHtml(meta.level)}</p>
        <h3 class="pkg-title">${escapeHtml(meta.title)}</h3>
        ${meta.line ? `<p class="pkg-line">${escapeHtml(meta.line)}</p>` : ""}
        <p class="pkg-cta">
          <span class="pkg-cta-rest">View Class <span aria-hidden="true">→</span></span>
          <span class="pkg-cta-more">View Class Details <span aria-hidden="true">→</span></span>
        </p>
      </div>
    </a>`;
  };

  const bookPlan = (plan, tab, options) => {
    const className = plan.period || classMeta(tab, options.classes).title || tab;
    try {
      sessionStorage.setItem(
        "jinis_pending_package",
        JSON.stringify({ className, package: plan.name, price: plan.price })
      );
    } catch {
      /* ignore */
    }
    window.location.href = options.contactHref || "/#contact";
  };

  const planCta = (plan) => (/session/i.test(String(plan.name || "")) ? "Book Session" : "Choose Plan");

  const renderDetail = (root, tab, groups, opts) => {
    const meta = classMeta(tab, opts.classes);
    const packages = groups[tab] || [];
    root.dataset.activeTab = tab;
    root.innerHTML = `<section class="pkg-choose">
      <p class="pkg-choose-back"><a href="/plans">← All classes</a></p>
      <p class="pkg-choose-kicker">Choose your plan</p>
      <h1 class="pkg-choose-title">${escapeHtml(meta.title)}</h1>
      ${meta.line ? `<p class="pkg-choose-line">${escapeHtml(meta.line)}</p>` : ""}
      <div class="pkg-plan-grid">
        ${packages
          .map((plan, i) => {
            const metaLine = validityCopy(plan);
            return `<article class="pkg-plan">
              <h2 class="pkg-plan-name">${escapeHtml(plan.name || "")}</h2>
              <p class="pkg-plan-price">${escapeHtml(plan.price || "")}</p>
              ${metaLine ? `<p class="pkg-plan-meta">${escapeHtml(metaLine)}</p>` : ""}
              <button type="button" class="pkg-plan-book" data-pkg-book="${i}">${planCta(plan)} <span aria-hidden="true">→</span></button>
            </article>`;
          })
          .join("")}
      </div>
    </section>`;
    root.querySelectorAll("[data-pkg-book]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const plan = packages[Number(btn.getAttribute("data-pkg-book"))];
        if (plan) bookPlan(plan, tab, opts);
      });
    });
    const hero = document.querySelector(".page-hero");
    if (hero) hero.hidden = true;
    document.title = `Choose a plan · ${meta.title} · Jini's Pilates Studio`;
  };

  const render = (root, plans, options = {}) => {
    if (!root) return;
    const opts = {
      contactHref: options.contactHref || "/#contact",
      classes: options.classes || window.JinisContent?.getContent?.().classes || [],
      resolveSrc: options.resolveSrc || defaultResolve,
      cardHref: options.cardHref,
    };
    const { tabs, groups } = groupByTab(plans);
    if (!tabs.length) {
      root.innerHTML = "";
      return;
    }
    const detailTab = matchTab(options.detailTab, tabs);
    if (detailTab) {
      renderDetail(root, detailTab, groups, opts);
      return;
    }
    root.innerHTML = `<div class="pkg-layout">${tabs.map((tab) => cardMarkup(tab, opts)).join("")}</div>`;
  };

  window.JinisPlans = { render, tabOf, TAB_ORDER };
})();
