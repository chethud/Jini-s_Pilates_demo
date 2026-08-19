(() => {
  if (!window.JinisCMS.isAuthed()) {
    location.replace("/cms/");
    return;
  }

  const signedIn = document.getElementById("cms-user-name");
  if (signedIn && window.JinisCMS.currentUser) {
    signedIn.textContent = window.JinisCMS.currentUser();
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

  const MIN_CLASSES = 4;
  const MAX_CLASSES = 6;
  const MAX_GALLERY = 10;
  const CAFE_PHOTO_COUNT = 4;
  const MIN_TESTIMONIALS = 2;
  const MAX_TESTIMONIALS = 8;
  const DEFAULT_CAFE_IMAGES = (window.JinisContent?.DEFAULT_CONTENT?.cafeImages || []).slice(
    0,
    CAFE_PHOTO_COUNT
  );

  const ensureCafeImages = () => {
    draft.cafeImages = Array.isArray(draft.cafeImages) ? draft.cafeImages.slice() : [];
    while (draft.cafeImages.length < CAFE_PHOTO_COUNT) {
      const fallback =
        DEFAULT_CAFE_IMAGES[draft.cafeImages.length] ||
        DEFAULT_CAFE_IMAGES[0] || {
          src: "assets/food_1_bce_p0_t.jpg",
          alt: "Cafe photo",
        };
      draft.cafeImages.push({ ...fallback });
    }
    if (draft.cafeImages.length > CAFE_PHOTO_COUNT) {
      draft.cafeImages = draft.cafeImages.slice(0, CAFE_PHOTO_COUNT);
    }
  };

  const renderClasses = () => {
    const root = document.getElementById("classes-fields");
    const items = draft.classes || [];
    const canDelete = items.length > MIN_CLASSES;
    root.innerHTML = items
      .map((item, i) => {
        const src = resolveSrc(item.image || "assets/class_mat_dkcnn3u_.jpg");
        return `<div class="subcard" data-class-index="${i}">
        <div class="subcard-head">
          <strong>Class ${i + 1}</strong>
          ${
            canDelete
              ? `<button type="button" class="btn-ghost danger" data-class-remove="${i}">Delete</button>`
              : `<span class="hint">Min ${MIN_CLASSES}</span>`
          }
        </div>
        <div class="upload-block">
          <img class="upload-preview is-visible" src="${src}" alt="">
          <input type="hidden" data-class="image" value="${escapeAttr(item.image || "assets/class_mat_dkcnn3u_.jpg")}">
          <div class="upload-row">
            <input data-class-file="${i}" type="file" accept="image/*">
          </div>
        </div>
        <label>Class name<input data-class="name" type="text" value="${escapeAttr(item.name)}"></label>
        <label>Blurb<textarea data-class="blurb" rows="2">${escapeHtml(item.blurb)}</textarea></label>
      </div>`;
      })
      .join("");
    document.getElementById("stat-classes").textContent = String(items.length);
  };

  const renderTrainers = () => {
    const root = document.getElementById("trainers-fields");
    root.innerHTML = (draft.trainers || [])
      .map((item, i) => {
        const src = resolveSrc(item.image || "assets/trainer_1_cex1xk_w.jpg");
        return `<div class="subcard" data-trainer-index="${i}">
        <div class="subcard-head">
          <strong>Trainer ${i + 1}</strong>
          <button type="button" class="btn-ghost danger" data-trainer-remove="${i}">Delete</button>
        </div>
        <div class="upload-block">
          <img class="upload-preview is-visible" src="${src}" alt="">
          <input type="hidden" data-trainer="image" value="${escapeAttr(item.image || "assets/trainer_1_cex1xk_w.jpg")}">
          <div class="upload-row">
            <input data-trainer-file="${i}" type="file" accept="image/*">
          </div>
        </div>
        <label>Name<input data-trainer="name" type="text" value="${escapeAttr(item.name)}"></label>
        <label>Role<input data-trainer="role" type="text" value="${escapeAttr(item.role)}"></label>
        <label>Detail<input data-trainer="detail" type="text" value="${escapeAttr(item.detail || "")}"></label>
      </div>`;
      })
      .join("");
    document.getElementById("stat-trainers").textContent = String((draft.trainers || []).length);
  };

  const renderCafeImages = () => {
    const root = document.getElementById("cafe-images-fields");
    if (!root) return;
    ensureCafeImages();
    const items = draft.cafeImages;
    const countEl = document.getElementById("cafe-image-count");
    if (countEl) countEl.textContent = `(${items.length}/${CAFE_PHOTO_COUNT})`;
    root.innerHTML = items
      .map((item, i) => {
        const src = resolveSrc(item.src);
        return `<div class="gallery-admin-card" data-cafe-image-index="${i}">
          <img src="${src}" alt="">
          <input type="hidden" data-cafe-image="src" value="${escapeAttr(item.src || "")}">
          <label>Caption / alt<input data-cafe-image="alt" type="text" value="${escapeAttr(item.alt || "")}"></label>
          <div class="upload-row">
            <input data-cafe-image-file="${i}" type="file" accept="image/*">
          </div>
          <p class="hint">Replace photo ${i + 1} of ${CAFE_PHOTO_COUNT}</p>
        </div>`;
      })
      .join("");
  };

  const renderPlans = () => {
    const root = document.getElementById("plans-fields");
    root.innerHTML = (draft.plans || [])
      .map(
        (item, i) => `<div class="subcard" data-plan-index="${i}">
        <div class="subcard-head">
          <strong>Plan ${i + 1}</strong>
          <button type="button" class="btn-ghost danger" data-plan-remove="${i}">Delete</button>
        </div>
        <label>Class tab<input data-plan="tab" type="text" value="${escapeAttr(item.tab || item.period || "")}" placeholder="Reformer Pilates, Mat Pilates, Strength, Zumba"></label>
        <label>Package<input data-plan="name" type="text" value="${escapeAttr(item.name)}"></label>
        <label>Price<input data-plan="price" type="text" value="${escapeAttr(item.price)}"></label>
        <label>Sessions<input data-plan="sessions" type="text" value="${escapeAttr(item.sessions || "")}"></label>
        <label>Validity<input data-plan="validity" type="text" value="${escapeAttr(item.validity || item.note || "")}"></label>
      </div>`
      )
      .join("");
    document.getElementById("stat-plans").textContent = String((draft.plans || []).length);
  };

  const renderTestimonials = () => {
    const root = document.getElementById("testimonials-fields");
    if (!root) return;
    const items = draft.testimonials || [];
    const canDelete = items.length > MIN_TESTIMONIALS;
    const countEl = document.getElementById("stat-testimonials");
    if (countEl) countEl.textContent = String(items.length);
    root.innerHTML = items
      .map((item, i) => {
        const src = resolveSrc(item.image || "assets/gallery_members_cyis7hte.jpg");
        const rating = Math.min(5, Math.max(1, Number(item.rating) || 5));
        return `<div class="subcard" data-testimonial-index="${i}">
        <div class="subcard-head">
          <strong>Testimonial ${i + 1}</strong>
          ${
            canDelete
              ? `<button type="button" class="btn-ghost danger" data-testimonial-remove="${i}">Delete</button>`
              : `<span class="hint">Min ${MIN_TESTIMONIALS}</span>`
          }
        </div>
        <div class="upload-block">
          <img class="upload-preview is-visible" src="${src}" alt="">
          <input type="hidden" data-testimonial="image" value="${escapeAttr(item.image || "assets/gallery_members_cyis7hte.jpg")}">
          <div class="upload-row">
            <input data-testimonial-file="${i}" type="file" accept="image/*">
          </div>
        </div>
        <label>Name<input data-testimonial="name" type="text" value="${escapeAttr(item.name || "")}"></label>
        <label>Quote<textarea data-testimonial="quote" rows="4">${escapeHtml(item.quote || "")}</textarea></label>
        <label>Stars
          <select data-testimonial="rating">
            ${[5, 4, 3, 2, 1]
              .map(
                (n) =>
                  `<option value="${n}" ${rating === n ? "selected" : ""}>${n} star${n === 1 ? "" : "s"}</option>`
              )
              .join("")}
          </select>
        </label>
      </div>`;
      })
      .join("");
  };

  const renderGallery = () => {
    const root = document.getElementById("gallery-fields");
    let items = draft.gallery || [];
    if (items.length > MAX_GALLERY) {
      draft.gallery = items.slice(0, MAX_GALLERY);
      items = draft.gallery;
    }
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

    next.classes = [...document.querySelectorAll("[data-class-index]")].map((row) => ({
      name: row.querySelector('[data-class="name"]').value.trim(),
      blurb: row.querySelector('[data-class="blurb"]').value.trim(),
      image:
        row.querySelector('[data-class="image"]')?.value.trim() ||
        "assets/class_mat_dkcnn3u_.jpg",
    }));

    next.trainers = [...document.querySelectorAll("[data-trainer-index]")].map((row) => ({
      name: row.querySelector('[data-trainer="name"]').value.trim(),
      role: row.querySelector('[data-trainer="role"]').value.trim(),
      detail: row.querySelector('[data-trainer="detail"]').value.trim(),
      image:
        row.querySelector('[data-trainer="image"]')?.value.trim() ||
        "assets/trainer_1_cex1xk_w.jpg",
    }));

    next.cafeImages = [...document.querySelectorAll("[data-cafe-image-index]")]
      .map((row) => ({
        src: row.querySelector('[data-cafe-image="src"]')?.value.trim() || "",
        alt: row.querySelector('[data-cafe-image="alt"]')?.value.trim() || "",
      }))
      .slice(0, CAFE_PHOTO_COUNT);
    while (next.cafeImages.length < CAFE_PHOTO_COUNT) {
      const fallback =
        DEFAULT_CAFE_IMAGES[next.cafeImages.length] ||
        DEFAULT_CAFE_IMAGES[0] || {
          src: "assets/food_1_bce_p0_t.jpg",
          alt: "Cafe photo",
        };
      next.cafeImages.push({ ...fallback });
    }

    next.plans = [...document.querySelectorAll("[data-plan-index]")].map((row) => {
      const tab = row.querySelector('[data-plan="tab"]').value.trim();
      return {
        tab,
        period: tab === "Strength" ? "Strength Training" : tab,
        name: row.querySelector('[data-plan="name"]').value.trim(),
        price: row.querySelector('[data-plan="price"]').value.trim(),
        sessions: row.querySelector('[data-plan="sessions"]').value.trim(),
        validity: row.querySelector('[data-plan="validity"]').value.trim(),
      };
    });

    next.testimonials = [...document.querySelectorAll("[data-testimonial-index]")].map((row) => ({
      name: row.querySelector('[data-testimonial="name"]').value.trim(),
      quote: row.querySelector('[data-testimonial="quote"]').value.trim(),
      rating: Number(row.querySelector('[data-testimonial="rating"]').value) || 5,
      image:
        row.querySelector('[data-testimonial="image"]')?.value.trim() ||
        "assets/gallery_members_cyis7hte.jpg",
    }));

    // Keep existing FAQs in storage (FAQ panel removed from CMS UI)
    next.faqs = Array.isArray(draft.faqs) ? draft.faqs : [];

    next.gallery = [...document.querySelectorAll("[data-gallery-index]")]
      .map((row, i) => ({
        ...(draft.gallery[i] || {}),
        alt: row.querySelector('[data-gallery="alt"]').value.trim(),
        category: row.querySelector('[data-gallery="category"]').value,
      }))
      .slice(0, MAX_GALLERY);

    if (draft.heroImage) next.heroImage = draft.heroImage;
    draft = next;
    return next;
  };

  const refresh = () => {
    fillSimpleFields();
    renderStats();
    renderClasses();
    renderTrainers();
    renderCafeImages();
    renderPlans();
    renderTestimonials();
    renderGallery();
  };

  refresh();

  const classesRoot = document.getElementById("classes-fields");
  const trainersRoot = document.getElementById("trainers-fields");
  const cafeImagesRoot = document.getElementById("cafe-images-fields");
  const plansRoot = document.getElementById("plans-fields");
  const testimonialsRoot = document.getElementById("testimonials-fields");

  document.getElementById("class-add-btn")?.addEventListener("click", () => {
    collectDraft();
    draft.classes = draft.classes || [];
    if (draft.classes.length >= MAX_CLASSES) {
      alert(`Maximum ${MAX_CLASSES} classes reached — delete one to add another`);
      setStatus(`Maximum ${MAX_CLASSES} classes reached — delete one to add another`);
      return;
    }
    draft.classes.push({
      name: "New Class",
      blurb: "50 min · All levels — Describe this class.",
      image: "assets/class_mat_dkcnn3u_.jpg",
    });
    renderClasses();
    setStatus("Class added — edit details, then Save changes");
  });

  document.getElementById("trainer-add-btn")?.addEventListener("click", () => {
    collectDraft();
    draft.trainers = draft.trainers || [];
    draft.trainers.push({
      name: "New Trainer",
      role: "Certified Instructor",
      detail: "Experience · Specialty",
      image: "assets/trainer_1_cex1xk_w.jpg",
    });
    renderTrainers();
    setStatus("Trainer added — edit details, then Save changes");
  });

  document.getElementById("plan-add-btn")?.addEventListener("click", () => {
    collectDraft();
    draft.plans = draft.plans || [];
    draft.plans.push({
      tab: "Reformer Pilates",
      period: "Reformer Pilates",
      name: "New package",
      price: "₹0",
      sessions: "",
      validity: "",
    });
    renderPlans();
    setStatus("Plan added — edit details, then Save changes");
  });

  document.getElementById("testimonial-add-btn")?.addEventListener("click", () => {
    collectDraft();
    draft.testimonials = draft.testimonials || [];
    if (draft.testimonials.length >= MAX_TESTIMONIALS) {
      alert(`Maximum ${MAX_TESTIMONIALS} testimonials reached — delete one to add another`);
      setStatus(`Maximum ${MAX_TESTIMONIALS} testimonials reached — delete one to add another`);
      return;
    }
    draft.testimonials.push({
      name: "New member",
      quote: "Share what you loved about the studio.",
      image: "assets/gallery_members_cyis7hte.jpg",
      rating: 5,
    });
    renderTestimonials();
    setStatus("Testimonial added — edit details, then Save changes");
  });

  classesRoot?.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-class-remove]");
    if (!btn) return;
    const i = Number(btn.getAttribute("data-class-remove"));
    collectDraft();
    if ((draft.classes || []).length <= MIN_CLASSES) {
      setStatus(`Keep at least ${MIN_CLASSES} classes`);
      return;
    }
    if (!confirm("Delete this class?")) return;
    draft.classes.splice(i, 1);
    renderClasses();
    setStatus("Class deleted — click Save changes");
  });

  trainersRoot?.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-trainer-remove]");
    if (!btn) return;
    const i = Number(btn.getAttribute("data-trainer-remove"));
    collectDraft();
    if (!confirm("Delete this trainer?")) return;
    draft.trainers.splice(i, 1);
    renderTrainers();
    setStatus("Trainer deleted — click Save changes");
  });

  plansRoot?.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-plan-remove]");
    if (!btn) return;
    const i = Number(btn.getAttribute("data-plan-remove"));
    collectDraft();
    if (!confirm("Delete this plan?")) return;
    draft.plans.splice(i, 1);
    renderPlans();
    setStatus("Plan deleted — click Save changes");
  });

  testimonialsRoot?.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-testimonial-remove]");
    if (!btn) return;
    const i = Number(btn.getAttribute("data-testimonial-remove"));
    collectDraft();
    if ((draft.testimonials || []).length <= MIN_TESTIMONIALS) {
      setStatus(`Keep at least ${MIN_TESTIMONIALS} testimonials`);
      return;
    }
    if (!confirm("Delete this testimonial?")) return;
    draft.testimonials.splice(i, 1);
    renderTestimonials();
    setStatus("Testimonial deleted — click Save changes");
  });

  classesRoot?.addEventListener("change", async (event) => {
    const input = event.target.closest("[data-class-file]");
    if (!input || !input.files?.[0]) return;
    const i = Number(input.getAttribute("data-class-file"));
    try {
      setStatus("Processing class photo…");
      collectDraft();
      draft.classes[i].image = await compressImage(input.files[0], 1400, 0.8);
      renderClasses();
      setStatus("Class photo ready — Save changes");
    } catch {
      setStatus("Class photo upload failed");
    }
  });

  trainersRoot?.addEventListener("change", async (event) => {
    const input = event.target.closest("[data-trainer-file]");
    if (!input || !input.files?.[0]) return;
    const i = Number(input.getAttribute("data-trainer-file"));
    try {
      setStatus("Processing trainer photo…");
      collectDraft();
      draft.trainers[i].image = await compressImage(input.files[0], 1200, 0.8);
      renderTrainers();
      setStatus("Trainer photo ready — Save changes");
    } catch {
      setStatus("Trainer photo upload failed");
    }
  });

  testimonialsRoot?.addEventListener("change", async (event) => {
    const input = event.target.closest("[data-testimonial-file]");
    if (!input || !input.files?.[0]) return;
    const i = Number(input.getAttribute("data-testimonial-file"));
    try {
      setStatus("Processing testimonial photo…");
      collectDraft();
      draft.testimonials[i].image = await compressImage(input.files[0], 800, 0.8);
      renderTestimonials();
      setStatus("Testimonial photo ready — Save changes");
    } catch {
      setStatus("Testimonial photo upload failed");
    }
  });

  cafeImagesRoot?.addEventListener("change", async (event) => {
    const input = event.target.closest("[data-cafe-image-file]");
    if (!input || !input.files?.[0]) return;
    const i = Number(input.getAttribute("data-cafe-image-file"));
    try {
      setStatus("Processing cafe photo…");
      collectDraft();
      draft.cafeImages[i].src = await compressImage(input.files[0], 1400, 0.8);
      if (!draft.cafeImages[i].alt) draft.cafeImages[i].alt = input.files[0].name;
      renderCafeImages();
      setStatus("Cafe photo ready — Save changes");
    } catch {
      setStatus("Cafe photo upload failed");
    }
  });

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
      collectDraft();
      if ((draft.gallery || []).length >= MAX_GALLERY) {
        alert(`Maximum ${MAX_GALLERY} gallery photos reached — delete one to add another`);
        setStatus(`Maximum ${MAX_GALLERY} gallery photos reached — delete one to add another`);
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
        if (draft.gallery.length > MAX_GALLERY) {
          draft.gallery = draft.gallery.slice(0, MAX_GALLERY);
        }
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
    if ((data.classes || []).length < MIN_CLASSES) {
      setStatus(`Keep at least ${MIN_CLASSES} classes`);
      return;
    }
    if ((data.classes || []).length > MAX_CLASSES) {
      alert(`Maximum ${MAX_CLASSES} classes reached — delete one to add another`);
      setStatus(`Maximum ${MAX_CLASSES} classes reached — delete one to add another`);
      return;
    }
    if ((data.cafeImages || []).length !== CAFE_PHOTO_COUNT) {
      setStatus(`Cafe needs exactly ${CAFE_PHOTO_COUNT} photos`);
      return;
    }
    if ((data.gallery || []).length > MAX_GALLERY) {
      data.gallery = data.gallery.slice(0, MAX_GALLERY);
    }
    if ((data.testimonials || []).length < MIN_TESTIMONIALS) {
      setStatus(`Keep at least ${MIN_TESTIMONIALS} testimonials`);
      return;
    }
    if ((data.testimonials || []).length > MAX_TESTIMONIALS) {
      alert(`Maximum ${MAX_TESTIMONIALS} testimonials reached — delete one to add another`);
      setStatus(`Maximum ${MAX_TESTIMONIALS} testimonials reached — delete one to add another`);
      return;
    }
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
    location.replace("/cms/");
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
