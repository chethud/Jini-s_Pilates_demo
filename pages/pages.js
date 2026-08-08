(() => {
  const type = document.body.dataset.page;
  const c = window.JinisContent.getContent();
  const prefix = '/';
  const root = document.getElementById('page-root');
  if (!root) return;

  if (type === 'classes') {
    root.innerHTML = `<div class="card-grid">${c.classes.map(item => `
      <article class="card">
        <img src="${window.JinisContent.assetUrl(item.image || 'assets/class_mat_dkcnn3u_.jpg', prefix)}" alt="${item.name}">
        <div class="card-body">
          <h3>${item.name}</h3>
          <p class="badge">${item.blurb}</p>
          <a class="btn outline" href="../index.html#contact">Book Now</a>
        </div>
      </article>`).join('')}</div>`;
  }

  if (type === 'trainers') {
    root.innerHTML = `<div class="card-grid cols-3">${c.trainers.map(item => `
      <article class="card">
        <img src="${window.JinisContent.assetUrl(item.image || 'assets/trainer_1_cex1xk_w.jpg', prefix)}" alt="${item.name}">
        <div class="card-body">
          <h3>${item.name}</h3>
          <p class="role">${item.role}</p>
          <p>${item.detail || ''}</p>
        </div>
      </article>`).join('')}</div>`;
  }

  if (type === 'plans') {
    const baseFeatures = ['Unlimited Classes','Personal Trainer','Diet Consultation','Progress Tracking','Priority Booking'];
    root.innerHTML = `<div class="card-grid cols-3">${(c.plans || []).map(plan => {
      const features = plan.features || [];
      const allFeatures = [...baseFeatures, ...features.filter(f => !baseFeatures.includes(f))];
      return `
      <article class="card plan ${plan.popular ? 'popular' : ''}">
        ${plan.popular ? '<span class="pill">Popular</span>' : ''}
        <p class="eyebrow">${plan.period}</p>
        <h3>${plan.name}</h3>
        <p class="price">${plan.price} <span>/ ${plan.cadence}</span></p>
        <ul>${allFeatures.map(f => `<li class="${features.includes(f) ? 'on' : 'off'}">${f}</li>`).join('')}</ul>
        <p class="note">${plan.note || ''}</p>
        <a class="btn ${plan.popular ? 'btn-primary' : 'outline'}" href="../index.html#contact">Choose ${plan.name}</a>
      </article>`;
    }).join('')}</div>`;
  }

  if (type === 'cafe') {
    const photos = Array.isArray(c.cafeImages) && c.cafeImages.length
      ? c.cafeImages
      : [
          { src: 'assets/food_1_bce_p0_t.jpg', alt: 'Cafe' },
          { src: 'assets/food_2_bb_dr2jh.jpg', alt: 'Cafe' },
          { src: 'assets/food_3_cmezi_2r.jpg', alt: 'Cafe' },
          { src: 'assets/cafe_b_nzqt9u.jpg', alt: 'Cafe' },
        ];
    root.innerHTML = `<div class="cafe-layout">
      <div>
        <p class="eyebrow">Wellness Cafe</p>
        <h2>Jini's Wellness Cafe</h2>
        <p>${c.cafeBlurb}</p>
        <div class="chip-grid">
          <span>Organic Ingredients</span><span>Healthy Meals</span><span>Fresh Juices</span>
          <span>Protein Rich Menu</span><span>Coffee</span><span>Smoothies</span>
        </div>
        <p class="note">${c.hours || 'Open 9 AM – 10 PM'} · Delivery on Swiggy & Zomato</p>
      </div>
      <div class="cafe-photos">
        ${photos.map(item =>
          `<img src="${window.JinisContent.assetUrl(item.src, prefix)}" alt="${item.alt || 'Cafe'}">`).join('')}
      </div>
    </div>`;
  }

  if (type === 'about') {
    root.innerHTML = `<div class="about-block">
      <h2>${c.aboutTitle}</h2>
      <p>${c.aboutBody}</p>
      <div class="card-grid cols-4 stats">${c.stats.map(s => `
        <article class="stat-card"><strong>${s.value}</strong><span>${s.label}</span></article>`).join('')}</div>
    </div>`;
  }
})();