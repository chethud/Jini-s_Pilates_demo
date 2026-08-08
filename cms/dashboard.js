(() => {
  if (!window.JinisCMS.isAuthed()) {
    location.replace("index.html");
    return;
  }

  const panelTitle = document.getElementById("panel-title");
  const logoutBtn = document.getElementById("logout-btn");
  const saveBtn = document.getElementById("save-btn");
  const resetBtn = document.getElementById("reset-btn");
  const saveStatus = document.getElementById("save-status");
  let draft = window.JinisContent.getContent();

  const setStatus = (text) => {
    saveStatus.textContent = text;
  };

  const escapeHtml = (s) =>
    String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  const escapeAttr = (s) => escapeHtml(s).replace(/"/g, "&quot;");

  const compressImage = (file, maxWidth = 1600, quality = 0.8) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("Could not read image"));
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const scale = Math.min(1, maxWidth / img.width);
          const canvas = document.createElement("canvas");
          canvas.width = Math.max(1, Math.round(img.width * scale));
          canvas.height = Math.max(1, Math.round(img.height * scale));
          canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg", quality));
        };
        img.onerror = () => reject(new Error("Invalid image"));
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });

  const resolveSrc = (value) => {
    if (!value) return "";
    if (value.startsWith("data:") || value.startsWith("http") || value.startsWith("blob:")) return value;
    return value.startsWith("../") ? value : "../" + value.replace(/^\//, "");
  };

  const heroFileInput = document.getElementById("hero-image-file");
  const heroClearBtn = document.getElementById("hero-image-clear");
  const heroPreview = document.getElementById("hero-image-preview");
  const heroHidden = document.querySelector('input[name="heroImage"]');

  const updateHeroPreview = (value) => {
    if (!heroPreview) return;
    heroPreview.src = resolveSrc(value || "assets/hero-home.jpg");
    heroPreview.classList.add("is-visible");
    if (heroHidden) heroHidden.value = value || "assets/hero-home.jpg";
  };

  const fillSimpleFields = () => {
    document.querySelectorAll("input[name], textarea[name]").forEach((el) => {
      if (typeof draft[el.name] === "string") el.value = draft[el.name];
    });
    updateHeroPreview(draft.heroImage);
    if (heroFileInput) heroFileInput.value = "";
  };

  const renderStats = () => {
    const root = document.getElementById("stats-fields");
    root.innerHTML = (draft.stats || [])
      .map(
        (item, i) => `<div class="subcard" data-stat-index="${i}">
        <label>Value<input data-stat="value" type="text" value="${escapeAttr(item.value)}"></label>
        <label>Label<input data-stat="label" type="text" value="${escapeAttr(item.label)}"></label>
      </div>`
      )
      .join("");
  };

  const renderClasses = () => {
    const root = document.getElementById("classes-fields");
    root.innerHTML = (draft.classes || [])
      .map(
        (item, i) => `<div class="subcard" data-class-index="${i}">
        <label>Class name<input data-class="name" type="text" value="${escapeAttr(item.name)}"></label>
        <label>Blurb<textarea data-class="blurb" rows="2">${escapeHtml(item.blurb)}</textarea></label>
      </div>`
      )
      .join("");
    document.getElementById("stat-classes").textContent = String((draft.classes || []).length);
  };

  const renderTrainers = () => {
    const root = document.getElementById("trainers-fields");
    root.innerHTML = (draft.trainers || [])
      .map(
        (item, i) => `<div class="subcard" data-trainer-index="${i}">
        <label>Name<input data-trainer="name" type="text" value="${escapeAttr(item.name)}"></label>
        <label>Role<input data-trainer="role" type="text" value="${escapeAttr(item.role)}"></label>
        <label>Detail<input data-trainer="detail" type="text" value="${escapeAttr(item.detail || "")}"></label>
      </div>`
      )
      .join("");
    document.getElementById("stat-trainers").textContent = String((draft.trainers || []).length);
  };

  const renderPlans = () => {
    const root = document.getElementById("plans-fields");
    root.innerHTML = (draft.plans || [])
      .map(
        (item, i) => `<div class="subcard" data-plan-index="${i}">
        <label>Name<input data-plan="name" type="text" value="${escapeAttr(item.name)}"></label>
        <label>Period<input data-plan="period" type="text" value="${escapeAttr(item.period)}"></label>
        <label>Price<input data-plan="price" type="text" value="${escapeAttr(item.price)}"></label>
        <label>Cadence<input data-plan="cadence" type="text" value="${escapeAttr(item.cadence)}"></label>
        <label>Note<input data-plan="note" type="text" value="${escapeAttr(item.note || "")}"></label>
        <label>Features (comma separated)<input data-plan="features" type="text" value="${escapeAttr((item.features || []).join(", "))}"></label>
        <label class="check"><input data-plan="popular" type="checkbox" ${item.popular ? "checked" : ""}> Popular plan</label>
      </div>`
      )
      .join("");
    document.getElementById("stat-plans").textContent = String((draft.plans || []).length);
  };

  const renderFaqs = () => {
    const root = document.getElementById("faq-fields");
    root.innerHTML = (draft.faqs || [])
      .map(
        (item, i) => `<div class="subcard" data-faq-index="${i}">
        <label>Question<input data-faq="q" type="text" value="${escapeAttr(item.q)}"></label>
        <label>Answer<textarea data-faq="a" rows="3">${escapeHtml(item.a)}</textarea></label>
      </div>`
      )
      .join("");
  };

  const renderGallery = () => {
    const root = document.getElementById("gallery-fields");
    const items = draft.gallery || [];
    document.getElementById("gallery-list-count").textContent = String(items.length);
    document.getElementById("stat-gallery").textContent = String(items.length);
    root.innerHTML = items
      .map((item, i) => {
        const src = resolveSrc(item.src);
        return `<div class="gallery-admin-card" data-gallery-index="${i}">
          <img src="${src}" alt="">
          <label>Alt<input data-gallery="alt" type="text" value="${escapeAttr(item.alt || "")}"></label>
          <label>Category
            <select data-gallery="category">
              ${["studio", "classes", "equipment", "cafe", "members", "events"]
                .map(
                  (c) =>
                    `<option value="${c}" ${item.category === c ? "selected" : ""}>${c}</option>`
                )
                .join("")}
            </select>
          </label>
          <button type="button" class="btn-ghost" data-gallery-remove="${i}">Remove</button>
        </div>`;
      })
      .join("");

    root.querySelectorAll("[data-gallery-remove]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const i = Number(btn.getAttribute("data-gallery-remove"));
        draft.gallery.splice(i, 1);
        renderGallery();
        setStatus("Photo removed — click Save changes");
      });
    });
  };

  const collectDraft = () => {
    const next = { ...draft };
    document.querySelectorAll("input[name], textarea[name]").forEach((el) => {
      if (typeof next[el.name] === "string" || next[el.name] == null) next[el.name] = el.value;
    });

    next.stats = [...document.querySelectorAll("[data-stat-index]")].map((row) => ({
      value: row.querySelector('[data-stat="value"]').value.trim(),
      label: row.querySelector('[data-stat="label"]').value.trim(),
    }));

    next.classes = [...document.querySelectorAll("[data-class-index]")].map((row, i) => ({
      ...(draft.classes[i] || {}),
      name: row.querySelector('[data-class="name"]').value.trim(),
      blurb: row.querySelector('[data-class="blurb"]').value.trim(),
    }));

    next.trainers = [...document.querySelectorAll("[data-trainer-index]")].map((row, i) => ({
      ...(draft.trainers[i] || {}),
      name: row.querySelector('[data-trainer="name"]').value.trim(),
      role: row.querySelector('[data-trainer="role"]').value.trim(),
      detail: row.querySelector('[data-trainer="detail"]').value.trim(),
    }));

    next.plans = [...document.querySelectorAll("[data-plan-index]")].map((row, i) => ({
      ...(draft.plans[i] || {}),
      name: row.querySelector('[data-plan="name"]').value.trim(),
      period: row.querySelector('[data-plan="period"]').value.trim(),
      price: row.querySelector('[data-plan="price"]').value.trim(),
      cadence: row.querySelector('[data-plan="cadence"]').value.trim(),
      note: row.querySelector('[data-plan="note"]').value.trim(),
      popular: row.querySelector('[data-plan="popular"]').checked,
      features: row
        .querySelector('[data-plan="features"]')
        .value.split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    }));

    next.faqs = [...document.querySelectorAll("[data-faq-index]")].map((row) => ({
      q: row.querySelector('[data-faq="q"]').value.trim(),
      a: row.querySelector('[data-faq="a"]').value.trim(),
    }));

    next.gallery = [...document.querySelectorAll("[data-gallery-index]")].map((row, i) => ({
      ...(draft.gallery[i] || {}),
      alt: row.querySelector('[data-gallery="alt"]').value.trim(),
      category: row.querySelector('[data-gallery="category"]').value,
    }));

    if (draft.heroImage) next.heroImage = draft.heroImage;
    draft = next;
    return next;
  };

  const refresh = () => {
    fillSimpleFields();
    renderStats();
    renderClasses();
    renderTrainers();
    renderPlans();
    renderFaqs();
    renderGallery();
  };

  refresh();

  if (heroFileInput) {
    heroFileInput.addEventListener("change", async () => {
      const file = heroFileInput.files && heroFileInput.files[0];
      if (!file) return;
      try {
        setStatus("Processing hero image…");
        draft.heroImage = await compressImage(file, 1920, 0.82);
        updateHeroPreview(draft.heroImage);
        setStatus("Hero image ready — Save changes");
      } catch {
        setStatus("Hero upload failed");
      }
    });
  }

  if (heroClearBtn) {
    heroClearBtn.addEventListener("click", () => {
      draft.heroImage = "assets/hero-home.jpg";
      updateHeroPreview(draft.heroImage);
      setStatus("Default hero selected — Save changes");
    });
  }

  const galleryAddBtn = document.getElementById("gallery-add-btn");
  const galleryFile = document.getElementById("gallery-image-file");
  if (galleryAddBtn) {
    galleryAddBtn.addEventListener("click", async () => {
      const file = galleryFile.files && galleryFile.files[0];
      if (!file) {
        setStatus("Choose a photo first");
        return;
      }
      try {
        setStatus("Processing gallery photo…");
        const src = await compressImage(file, 1400, 0.8);
        draft.gallery = draft.gallery || [];
        draft.gallery.unshift({
          id: "g" + Date.now(),
          src,
          alt: document.getElementById("gallery-alt").value.trim() || file.name,
          category: document.getElementById("gallery-category").value,
        });
        galleryFile.value = "";
        document.getElementById("gallery-alt").value = "";
        renderGallery();
        setStatus("Photo added — click Save changes");
      } catch {
        setStatus("Gallery upload failed");
      }
    });
  }

  saveBtn.addEventListener("click", () => {
    const data = collectDraft();
    const saved = window.JinisContent.saveContent(data);
    if (!saved) {
      setStatus("Save failed — storage may be full (try fewer/smaller photos)");
      return;
    }
    draft = saved;
    refresh();
    setStatus("Saved ✓");
    setTimeout(() => setStatus("Ready"), 1600);
  });

  resetBtn.addEventListener("click", () => {
    if (!confirm("Reset all CMS content to defaults?")) return;
    draft = window.JinisContent.resetContent();
    refresh();
    setStatus("Reset to defaults");
  });

  logoutBtn.addEventListener("click", () => {
    window.JinisCMS.setAuthed(false);
    location.replace("index.html");
  });

  document.querySelectorAll(".nav-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      collectDraft();
      document.querySelectorAll(".nav-item").forEach((el) => el.classList.remove("is-active"));
      document.querySelectorAll(".panel").forEach((el) => el.classList.remove("is-active"));
      btn.classList.add("is-active");
      document.getElementById(`panel-${btn.dataset.panel}`)?.classList.add("is-active");
      panelTitle.textContent = btn.textContent.trim();
    });
  });
})();
