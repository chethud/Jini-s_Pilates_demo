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
          <a class="btn outline" href="/plans?class=${encodeURIComponent(window.JinisPlans ? window.JinisPlans.tabOf({ period: item.name }) : item.name)}">View Class →</a>
        </div>
      </article>`).join('')}</div>`;
  }

  if (type === 'plans' && window.JinisPlans) {
    window.JinisPlans.render(root, c.plans || [], {
      contactHref: '/#contact',
      classes: c.classes || [],
      resolveSrc: (src) => window.JinisContent.assetUrl(src, prefix),
      detailTab: new URLSearchParams(location.search).get('class'),
      backHref: '/classes',
    });
  }

  if (type === 'cafe') {
    const photos = Array.isArray(c.cafeImages) && c.cafeImages.length
      ? c.cafeImages
      : [
          { src: 'assets/cafe/cafe-01.jpg', alt: 'Dragon fruit smoothie bowl' },
          { src: 'assets/cafe/cafe-02.jpg', alt: 'Spaghetti bolognese with parmesan' },
          { src: 'assets/cafe/cafe-03.jpg', alt: 'Pasta Frescol with fresh greens and olives' },
          { src: 'assets/cafe/cafe-04.jpg', alt: 'Berry smoothie bowl' },
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