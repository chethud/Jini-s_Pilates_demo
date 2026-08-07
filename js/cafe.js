(() => {
  const initCafeCarousel = () => {
    const root = document.querySelector("[data-cafe-carousel]");
    if (!root || root.dataset.ready === "1") return;
    root.dataset.ready = "1";

    const section = root.closest("section");
    if (section) section.classList.add("is-visible");

    const slides = [...root.querySelectorAll("[data-cafe-slide]")];
    const dotsRoot = root.querySelector("[data-cafe-dots]");
    if (!slides.length) return;

    let index = 0;

    if (dotsRoot) {
      dotsRoot.innerHTML = slides
        .map((_, i) => `<button type="button" aria-label="Go to cafe photo ${i + 1}"></button>`)
        .join("");
    }
    const dots = dotsRoot ? [...dotsRoot.querySelectorAll("button")] : [];

    const paint = () => {
      const n = slides.length;
      const prevIndex = (index - 1 + n) % n;
      const nextIndex = (index + 1) % n;

      slides.forEach((slide, i) => {
        slide.classList.remove("is-prev", "is-active", "is-next");
        if (i === prevIndex) slide.classList.add("is-prev");
        else if (i === index) slide.classList.add("is-active");
        else if (i === nextIndex) slide.classList.add("is-next");
      });

      dots.forEach((dot, i) => {
        const on = i === index;
        dot.classList.toggle("is-active", on);
        dot.setAttribute("aria-current", on ? "true" : "false");
      });
    };

    const go = (dir) => {
      index = (index + dir + slides.length) % slides.length;
      paint();
    };

    const goTo = (i) => {
      index = ((i % slides.length) + slides.length) % slides.length;
      paint();
    };

    root.addEventListener("click", (event) => {
      const target = event.target.closest("button, [data-cafe-slide]");
      if (!target || !root.contains(target)) return;

      if (target.matches("[data-cafe-prev]")) {
        event.preventDefault();
        go(-1);
        return;
      }
      if (target.matches("[data-cafe-next]")) {
        event.preventDefault();
        go(1);
        return;
      }
      if (dotsRoot && dotsRoot.contains(target) && target.tagName === "BUTTON") {
        event.preventDefault();
        const i = dots.indexOf(target);
        if (i >= 0) goTo(i);
        return;
      }
      if (target.matches("[data-cafe-slide].is-prev")) {
        go(-1);
        return;
      }
      if (target.matches("[data-cafe-slide].is-next")) {
        go(1);
      }
    });

    // Keyboard support when focused inside carousel
    root.setAttribute("tabindex", "0");
    root.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        go(-1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        go(1);
      }
    });

    paint();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCafeCarousel);
  } else {
    initCafeCarousel();
  }
  window.addEventListener("load", initCafeCarousel);
})();
