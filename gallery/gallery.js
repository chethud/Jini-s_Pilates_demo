(() => {
  const CATS = ["studio", "classes", "equipment", "cafe", "members", "events"];
  const labels = {
    all: "All",
    studio: "Studio",
    classes: "Classes",
    equipment: "Equipment",
    cafe: "Cafe",
    members: "Members",
    events: "Events",
  };
  const seg = location.pathname.replace(/\/+$/, "").split("/").pop();
  const page = CATS.includes(seg) ? seg : "all";

  document.querySelectorAll(".filters a").forEach((a) => {
    const href = a.getAttribute("href") || "";
    a.classList.toggle("is-active", page === "all" ? href === "/gallery" : href.endsWith("/" + page));
  });
  const eyebrow = document.querySelector(".page-hero .eyebrow");
  if (eyebrow) eyebrow.textContent = "Gallery · " + labels[page];
  document.title = `${labels[page]} Gallery · Jini's Pilates Studio`;

  const content = window.JinisContent.getContent();
  const prefix = "/";
  const grid = document.getElementById("gallery-grid");
  const empty = document.getElementById("gallery-empty");
  const countEl = document.getElementById("gallery-count");

  const items = (content.gallery || []).filter((item) =>
    page === "all" ? true : String(item.category || "").toLowerCase() === page
  );

  if (countEl) countEl.textContent = String(items.length);

  if (!items.length) {
    if (grid) grid.innerHTML = "";
    if (empty) empty.hidden = false;
    return;
  }

  if (empty) empty.hidden = true;
  grid.innerHTML = items
    .map((item, i) => {
      const src = window.JinisContent.assetUrl(item.src, prefix);
      const alt = item.alt || "Gallery photo";
      return `<button type="button" class="gallery-card" data-index="${i}" aria-label="Open ${alt}">
        <img src="${src}" alt="${alt.replace(/"/g, "&quot;")}" loading="lazy">
      </button>`;
    })
    .join("");

  let lightbox = document.getElementById("gallery-lightbox");
  if (!lightbox) {
    lightbox = document.createElement("div");
    lightbox.id = "gallery-lightbox";
    lightbox.className = "lightbox";
    lightbox.innerHTML = '<button type="button" class="lightbox-close" aria-label="Close">×</button><img alt="">';
    document.body.appendChild(lightbox);
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox || e.target.classList.contains("lightbox-close")) {
        lightbox.classList.remove("is-open");
      }
    });
  }

  grid.querySelectorAll(".gallery-card").forEach((btn) => {
    btn.addEventListener("click", () => {
      const i = Number(btn.dataset.index || 0);
      const item = items[i];
      if (!item) return;
      const img = lightbox.querySelector("img");
      img.src = window.JinisContent.assetUrl(item.src, prefix);
      img.alt = item.alt || "";
      lightbox.classList.add("is-open");
    });
  });
})();
