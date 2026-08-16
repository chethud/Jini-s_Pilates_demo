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
          <a class="btn outline" href="/#contact">Book Now</a>
        </div>
      </article>`).join('')}</div>`;
  }

  if (type === 'trainers') {
    location.replace('/#why-pilates');
    return;
  }

  if (type === 'plans' && window.JinisPlans) {
    window.JinisPlans.render(root, c.plans || [], {
      contactHref: '/#contact',
      classes: c.classes || [],
      resolveSrc: (src) => window.JinisContent.assetUrl(src, prefix),
    });
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