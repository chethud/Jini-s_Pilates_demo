(() => {
  const TAB_ORDER = ["Reformer Pilates", "Mat Pilates", "Strength", "Zumba"];

  const classMeta = (tab, classes) => {
    const match = (classes || []).find((item) => {
      const name = String(item.name || "");
      if (tab === "Strength") return /strength/i.test(name);
      return name.toLowerCase() === tab.toLowerCase();
    });
    return {
      title: match?.name || tab,
      line: String(match?.blurb || "").replace(/^[^-—]+[—–-]\s*/, ""),
      image: match?.image || (tab === "Reformer Pilates" ? "assets/hero-home.jpg" : ""),
      featured: tab === "Reformer Pilates",
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

  const rupees = (price) => Number(String(price || "").replace(/[^\d]/g, "")) || 0;

  const startingPrice = (packages) => {
    if (!packages?.length) return "";
    const cheapest = packages.slice().sort((a, b) => rupees(a.price) - rupees(b.price))[0];
    const label = String(cheapest.price || "").replace(/\s+/g, "");
    return packages.length > 1 ? `From ${label}` : label;
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

  const classImage = (tab, classes, resolveSrc) => {
    const meta = classMeta(tab, classes);
    return resolveSrc(meta.image);
  };

  const cardMarkup = (tab, packages, options) => {
    const meta = classMeta(tab, options.classes);
    const featured = !!meta.featured;
    const img = classImage(tab, options.classes, options.resolveSrc);
    const price = startingPrice(packages);
    const cta = packages.length > 1 ? "Explore packages" : "Explore package";
    const role = featured ? "pkg-card pkg-hero" : "pkg-card pkg-side";
    return `<button type="button" class="${role}" data-open-packages="${escapeHtml(tab)}">
      <div class="pkg-card-media">
        <img src="${escapeHtml(img)}" alt="${escapeHtml(meta.title)}" width="1200" height="800" loading="lazy">
      </div>
      <div class="pkg-card-body">
        <p class="pkg-kicker">${featured ? "Signature class" : "Class"}</p>
        <h3 class="pkg-title">${escapeHtml(meta.title)}</h3>
        <p class="pkg-line">${escapeHtml(meta.line)}</p>
        <p class="pkg-price">${escapeHtml(price)}</p>
        <p class="pkg-cta">${escapeHtml(cta)} <span aria-hidden="true">→</span></p>
      </div>
    </button>`;
  };

  const closeModal = (root) => {
    const modal = root.querySelector("[data-pkg-modal]");
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = "";
  };

  const openModal = (root, tab, groups, options) => {
    const modal = root.querySelector("[data-pkg-modal]");
    const titleEl = root.querySelector("[data-pkg-modal-title]");
    const list = root.querySelector("[data-pkg-options]");
    if (!modal || !list) return;
    const packages = groups[tab] || [];
    const meta = classMeta(tab, options.classes);
    titleEl.textContent = `${meta.title} Packages`;
    list.innerHTML = packages
      .map((plan, i) => {
        const metaLine = validityCopy(plan);
        return `<button type="button" class="pkg-option${i === 0 ? " is-selected" : ""}" data-pkg-index="${i}">
          <span class="pkg-radio" aria-hidden="true"></span>
          <span>
            <span class="pkg-option-name">${escapeHtml(plan.name || "")}</span>
            ${metaLine ? `<span class="pkg-option-meta">${escapeHtml(metaLine)}</span>` : ""}
          </span>
          <span class="pkg-option-price">${escapeHtml(plan.price || "")}</span>
        </button>`;
      })
      .join("");
    modal.hidden = false;
    modal.setAttribute("data-active-tab", tab);
    document.body.style.overflow = "hidden";
    list.querySelector(".pkg-option")?.focus();
  };

  const continueBooking = (root, groups, options) => {
    const modal = root.querySelector("[data-pkg-modal]");
    const tab = modal?.getAttribute("data-active-tab");
    const selected = root.querySelector(".pkg-option.is-selected");
    const index = Number(selected?.getAttribute("data-pkg-index") || 0);
    const plan = (groups[tab] || [])[index];
    if (!plan) return;
    const className = plan.period || classMeta(tab, options.classes).title || tab;
    try {
      sessionStorage.setItem(
        "jinis_pending_package",
        JSON.stringify({
          className,
          package: plan.name,
          price: plan.price,
        })
      );
    } catch {
      /* ignore */
    }
    closeModal(root);
    window.location.href = options.contactHref || "/#contact";
  };

  const defaultResolve = (src) => {
    if (!src) return "";
    if (src.startsWith("data:") || src.startsWith("http") || src.startsWith("/") || src.startsWith("../")) {
      return src;
    }
    return src.replace(/^\//, "");
  };

  const render = (root, plans, options = {}) => {
    if (!root) return;
    const opts = {
      contactHref: options.contactHref || "/#contact",
      classes: options.classes || window.JinisContent?.getContent?.().classes || [],
      resolveSrc: options.resolveSrc || defaultResolve,
    };
    const { tabs, groups } = groupByTab(plans);
    if (!tabs.length) {
      root.innerHTML = "";
      return;
    }

    const hero = tabs.includes("Reformer Pilates") ? "Reformer Pilates" : tabs[0];
    const rest = tabs.filter((tab) => tab !== hero);
    const pair = rest.slice(0, 2);
    const solo = rest.slice(2);

    root.innerHTML = `<div class="pkg-layout">
      ${cardMarkup(hero, groups[hero], opts)}
      ${pair.length ? `<div class="pkg-pair">${pair.map((tab) => cardMarkup(tab, groups[tab], opts)).join("")}</div>` : ""}
      ${solo.map((tab) => `<div class="pkg-solo">${cardMarkup(tab, groups[tab], opts)}</div>`).join("")}
    </div>
    <div class="pkg-modal" data-pkg-modal hidden>
      <div class="pkg-modal-backdrop" data-pkg-close></div>
      <div class="pkg-modal-panel" role="dialog" aria-modal="true" aria-labelledby="pkg-modal-title">
        <button type="button" class="pkg-modal-close" data-pkg-close aria-label="Close">×</button>
        <p class="pkg-modal-kicker">Choose a package</p>
        <h3 class="pkg-modal-title" id="pkg-modal-title" data-pkg-modal-title></h3>
        <div class="pkg-options" data-pkg-options></div>
        <button type="button" class="pkg-continue" data-pkg-continue>Continue to Booking →</button>
      </div>
    </div>`;

    root.querySelectorAll("[data-open-packages]").forEach((btn) => {
      btn.addEventListener("click", () => openModal(root, btn.getAttribute("data-open-packages"), groups, opts));
    });
    root.querySelectorAll("[data-pkg-close]").forEach((el) => {
      el.addEventListener("click", () => closeModal(root));
    });
    root.querySelector("[data-pkg-options]")?.addEventListener("click", (event) => {
      const option = event.target.closest(".pkg-option");
      if (!option) return;
      root.querySelectorAll(".pkg-option").forEach((el) => el.classList.remove("is-selected"));
      option.classList.add("is-selected");
    });
    root.querySelector("[data-pkg-continue]")?.addEventListener("click", () => continueBooking(root, groups, opts));
    if (!root.dataset.escBound) {
      root.dataset.escBound = "1";
      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeModal(root);
      });
    }
  };

  window.JinisPlans = { render, tabOf, TAB_ORDER };
})();
