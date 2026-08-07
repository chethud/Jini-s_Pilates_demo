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

  const heroFileInput = document.getElementById("hero-image-file");
  const heroClearBtn = document.getElementById("hero-image-clear");
  const heroPreview = document.getElementById("hero-image-preview");
  const heroHidden = document.querySelector('input[name="heroImage"]');
  const DEFAULT_HERO = "assets/hero-home.jpg";

  const resolveHeroSrc = (value) => {
    if (!value) return "../" + DEFAULT_HERO;
    if (value.startsWith("data:") || value.startsWith("http") || value.startsWith("blob:")) return value;
    return value.startsWith("../") ? value : "../" + value.replace(/^\//, "");
  };

  const updateHeroPreview = (value) => {
    const src = resolveHeroSrc(value || DEFAULT_HERO);
    heroPreview.src = src;
    heroPreview.classList.add("is-visible");
    if (heroHidden) heroHidden.value = value || DEFAULT_HERO;
  };

  const compressImage = (file, maxWidth = 1920, quality = 0.82) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("Could not read image"));
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const scale = Math.min(1, maxWidth / img.width);
          const width = Math.max(1, Math.round(img.width * scale));
          const height = Math.max(1, Math.round(img.height * scale));
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", quality));
        };
        img.onerror = () => reject(new Error("Invalid image"));
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });

  const fillSimpleFields = () => {
    document.querySelectorAll("input[name], textarea[name]").forEach((el) => {
      const key = el.name;
      if (Object.prototype.hasOwnProperty.call(draft, key) && typeof draft[key] === "string") {
        el.value = draft[key];
      }
    });
    updateHeroPreview(draft.heroImage);
    if (heroFileInput) heroFileInput.value = "";
  };

  const renderClasses = () => {
    const root = document.getElementById("classes-fields");
    root.innerHTML = draft.classes
      .map(
        (item, i) => `
      <div class="subcard" data-class-index="${i}">
        <label>Class name<input data-class="name" type="text" value="${escapeAttr(item.name)}"></label>
        <label>Blurb<textarea data-class="blurb" rows="2">${escapeHtml(item.blurb)}</textarea></label>
      </div>`
      )
      .join("");
    document.getElementById("stat-classes").textContent = String(draft.classes.length);
  };

  const renderTrainers = () => {
    const root = document.getElementById("trainers-fields");
    root.innerHTML = draft.trainers
      .map(
        (item, i) => `
      <div class="subcard" data-trainer-index="${i}">
        <label>Name<input data-trainer="name" type="text" value="${escapeAttr(item.name)}"></label>
        <label>Role<input data-trainer="role" type="text" value="${escapeAttr(item.role)}"></label>
      </div>`
      )
      .join("");
  };

  const renderFaqs = () => {
    const root = document.getElementById("faq-fields");
    root.innerHTML = draft.faqs
      .map(
        (item, i) => `
      <div class="subcard" data-faq-index="${i}">
        <label>Question<input data-faq="q" type="text" value="${escapeAttr(item.q)}"></label>
        <label>Answer<textarea data-faq="a" rows="3">${escapeHtml(item.a)}</textarea></label>
      </div>`
      )
      .join("");
    document.getElementById("stat-faqs").textContent = String(draft.faqs.length);
  };

  const escapeHtml = (s) =>
    String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

  const escapeAttr = (s) =>
    escapeHtml(s).replace(/"/g, "&quot;");

  const collectDraft = () => {
    const next = { ...draft };

    document.querySelectorAll("input[name], textarea[name]").forEach((el) => {
      const key = el.name;
      if (typeof next[key] === "string" || next[key] == null) {
        next[key] = el.value;
      }
    });

    next.classes = [...document.querySelectorAll("[data-class-index]")].map((row) => ({
      name: row.querySelector('[data-class="name"]').value.trim(),
      blurb: row.querySelector('[data-class="blurb"]').value.trim(),
    }));

    next.trainers = [...document.querySelectorAll("[data-trainer-index]")].map((row) => ({
      name: row.querySelector('[data-trainer="name"]').value.trim(),
      role: row.querySelector('[data-trainer="role"]').value.trim(),
    }));

    next.faqs = [...document.querySelectorAll("[data-faq-index]")].map((row) => ({
      q: row.querySelector('[data-faq="q"]').value.trim(),
      a: row.querySelector('[data-faq="a"]').value.trim(),
    }));

    draft = next;
    return next;
  };

  const refresh = () => {
    fillSimpleFields();
    renderClasses();
    renderTrainers();
    renderFaqs();
  };

  refresh();

  if (heroFileInput) {
    heroFileInput.addEventListener("change", async () => {
      const file = heroFileInput.files && heroFileInput.files[0];
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        setStatus("Please choose an image file");
        return;
      }
      if (file.size > 12 * 1024 * 1024) {
        setStatus("Image too large (max 12MB)");
        return;
      }
      try {
        setStatus("Processing image…");
        const dataUrl = await compressImage(file);
        draft.heroImage = dataUrl;
        updateHeroPreview(dataUrl);
        setStatus("Image ready — click Save changes");
      } catch (err) {
        console.error(err);
        setStatus("Image upload failed");
      }
    });
  }

  if (heroClearBtn) {
    heroClearBtn.addEventListener("click", () => {
      draft.heroImage = DEFAULT_HERO;
      updateHeroPreview(DEFAULT_HERO);
      if (heroFileInput) heroFileInput.value = "";
      setStatus("Default image selected — click Save changes");
    });
  }

  saveBtn.addEventListener("click", () => {
    const data = collectDraft();
    // keep uploaded data URL even if hidden input is huge / truncated in some browsers
    if (draft.heroImage) data.heroImage = draft.heroImage;
    const ok = window.JinisContent.saveContent(data);
    if (!ok) {
      setStatus("Save failed — image may be too large for browser storage");
      return;
    }
    draft = data;
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
      // keep typed values when switching panels
      collectDraft();
      const panel = btn.dataset.panel;
      document.querySelectorAll(".nav-item").forEach((el) => el.classList.remove("is-active"));
      document.querySelectorAll(".panel").forEach((el) => el.classList.remove("is-active"));
      btn.classList.add("is-active");
      const active = document.getElementById(`panel-${panel}`);
      if (active) active.classList.add("is-active");
      panelTitle.textContent = btn.textContent.trim();
    });
  });
})();
