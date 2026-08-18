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

  const sessionsCopy = (plan) => {
    if (plan.sessions) return plan.sessions;
    const name = String(plan.name || "");
    if (/single/i.test(name)) return "1 class";
    const count = name.match(/(\d+)\s*session/i);
    return count ? `${count[1]} classes` : "";
  };

  const benefitCopy = (plan) => plan.benefit || "";

  const kindCopy = (plan) => {
    const name = String(plan.name || "");
    if (/12\s*months|yearly/i.test(name)) return "Yearly";
    if (/6\s*months/i.test(name)) return "6 months";
    if (/3\s*months/i.test(name)) return "3 months";
    if (/1\s*month|^monthly$/i.test(name)) return "Monthly";
    if (/session/i.test(name)) return "Session pack";
    return "";
  };

  const isFeatured = (plan) => plan.popular === true || /12\s*months/i.test(String(plan.name || ""));

  const idleCta = (plan) =>
    /session/i.test(String(plan.name || "")) ? "Book Session" : "Choose Plan";

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

  const planCard = (plan, i) => {
    const featured = isFeatured(plan);
    const kind = kindCopy(plan);
    const sessions = sessionsCopy(plan);
    const valid = validityCopy(plan);
    const benefit = benefitCopy(plan);
    return `<article class="pkg-plan${featured ? " is-featured" : ""}" role="listitem" tabindex="0" data-pkg-index="${i}">
      ${featured ? `<p class="pkg-plan-badge">Yearly</p>` : kind ? `<p class="pkg-plan-kind">${escapeHtml(kind)}</p>` : ""}
      <h3 class="pkg-plan-name"><span class="pkg-plan-check" aria-hidden="true"></span>${escapeHtml(plan.name || "")}</h3>
      <p class="pkg-plan-price">${escapeHtml(plan.price || "")}</p>
      ${sessions ? `<p class="pkg-plan-sessions">${escapeHtml(sessions)}</p>` : ""}
      ${valid ? `<p class="pkg-plan-meta">${escapeHtml(valid)}</p>` : ""}
      ${benefit ? `<p class="pkg-plan-benefit">${escapeHtml(benefit)}</p>` : ""}
      <button type="button" class="pkg-plan-book" data-pkg-book="${i}">${idleCta(plan)} <span aria-hidden="true">→</span></button>
    </article>`;
  };

  const bindPlanSelect = (root, packages, tab, opts) => {
    const select = (card) => {
      root.querySelectorAll(".pkg-plan").forEach((el) => {
        const on = el === card;
        el.classList.toggle("is-selected", on);
        const btn = el.querySelector(".pkg-plan-book");
        const plan = packages[Number(el.getAttribute("data-pkg-index"))];
        if (!btn || !plan) return;
        btn.innerHTML = on
          ? `Continue <span aria-hidden="true">→</span>`
          : `${idleCta(plan)} <span aria-hidden="true">→</span>`;
      });
    };

    root.onclick = (event) => {
      const card = event.target.closest(".pkg-plan");
      if (!card) return;
      const plan = packages[Number(card.getAttribute("data-pkg-index"))];
      if (!plan) return;
      if (event.target.closest("[data-pkg-book]") && card.classList.contains("is-selected")) {
        bookPlan(plan, tab, opts);
        return;
      }
      select(card);
    };

    root.onkeydown = (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      const card = event.target.closest(".pkg-plan");
      if (!card || event.target.closest("a")) return;
      event.preventDefault();
      const plan = packages[Number(card.getAttribute("data-pkg-index"))];
      if (!plan) return;
      if (card.classList.contains("is-selected") && event.target.closest("[data-pkg-book]")) {
        bookPlan(plan, tab, opts);
        return;
      }
      select(card);
    };
  };

  const renderDetail = (root, tab, groups, opts, tabs) => {
    const meta = classMeta(tab, opts.classes);
    const packages = groups[tab] || [];
    const backHref = opts.backHref || "/#classes";
    const tabList = Array.isArray(tabs) && tabs.length ? tabs : Object.keys(groups);
    root.dataset.activeTab = tab;
    root.innerHTML = `<section class="pkg-choose">
      <header class="pkg-choose-head">
        <p class="pkg-choose-kicker">${escapeHtml(meta.title)}</p>
        <h2 class="pkg-choose-title">Choose your way to move.</h2>
        <p class="pkg-choose-line">Flexible plans designed around your schedule and goals.</p>
      </header>
      ${
        tabList.length > 1
          ? `<div class="pkg-tabs" role="tablist" aria-label="Classes">${tabList
              .map(
                (item) =>
                  `<button type="button" class="pkg-tab${item === tab ? " is-active" : ""}" role="tab" aria-selected="${item === tab ? "true" : "false"}" data-pkg-tab="${escapeHtml(item)}">${escapeHtml(item)}</button>`
              )
              .join("")}</div>`
          : ""
      }
      <div class="pkg-plan-grid" role="list">
        ${packages.map((plan, i) => planCard(plan, i)).join("")}
      </div>
      <p class="pkg-choose-note">No hidden fees · Flexible booking · Expert guidance</p>
      <p class="pkg-choose-back"><a href="${escapeHtml(backHref)}">← Back to classes</a></p>
    </section>`;
    bindPlanSelect(root, packages, tab, opts);
    root.querySelectorAll("[data-pkg-tab]").forEach((btn) => {
      btn.addEventListener("click", (event) => {
        event.stopPropagation();
        renderDetail(root, btn.getAttribute("data-pkg-tab"), groups, opts, tabList);
      });
    });
    const hero = document.querySelector(".page-hero");
    if (hero) hero.hidden = true;
    if (!opts.keepTitle) document.title = `Choose a plan · ${meta.title} · Jini's Pilates Studio`;
  };

  const render = (root, plans, options = {}) => {
    if (!root) return;
    const opts = {
      contactHref: options.contactHref || "/#contact",
      classes: options.classes || window.JinisContent?.getContent?.().classes || [],
      resolveSrc: options.resolveSrc || defaultResolve,
      cardHref: options.cardHref,
      backHref: options.backHref,
      keepTitle: options.keepTitle,
    };
    const { tabs, groups } = groupByTab(plans);
    if (!tabs.length) {
      root.innerHTML = "";
      return;
    }
    const detailTab = matchTab(options.detailTab, tabs);
    if (detailTab) {
      renderDetail(root, detailTab, groups, opts, tabs);
      return;
    }
    root.innerHTML = `<div class="pkg-layout">${tabs.map((tab) => cardMarkup(tab, opts)).join("")}</div>`;
  };

  window.JinisPlans = { render, tabOf, TAB_ORDER };
})();
