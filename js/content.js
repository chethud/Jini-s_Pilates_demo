(() => {
  const STORAGE_KEY = "jinis_site_content_v4";

  const DEFAULT_GALLERY = [
    { id: "g1", src: "assets/gallery_studio_bptwifhk.jpg", alt: "Studio reception with wooden bench", category: "studio" },
    { id: "g2", src: "assets/class-reformer.png", alt: "Reformer Pilates session", category: "classes" },
    { id: "g3", src: "assets/gallery_equipment_be6bqby0.jpg", alt: "Reformer straps close up", category: "equipment" },
    { id: "g4", src: "assets/cafe_b_nzqt9u.jpg", alt: "Wellness cafe counter", category: "cafe" },
    { id: "g5", src: "assets/gallery_members_cyis7hte.jpg", alt: "Members chatting after class", category: "members" },
    { id: "g6", src: "assets/about-group.png", alt: "Group class event", category: "events" },
    { id: "g7", src: "assets/class-strength.png", alt: "Mat Pilates stretch", category: "classes" },
    { id: "g8", src: "assets/food_1_bce_p0_t.jpg", alt: "Smoothie and protein bowl", category: "cafe" },
    { id: "g9", src: "assets/food_3_cmezi_2r.jpg", alt: "Salad bowl and coffee", category: "cafe" },
  ];

  const DEFAULT_CONTENT = {
    brandName: "Jini's Pilates Studio",
    heroEyebrow: "Pilates Studio & Wellness Cafe",
    heroTitleBefore: "Elevate Your",
    heroTitleAccent: "Fitness",
    heroSubtitle: "Your Path To A Stronger You.",
    heroBody:
      "Experience personalized Pilates sessions that improve strength, flexibility, posture, balance, and overall wellness in a calm and welcoming environment.",
    heroImage: "assets/hero-home.jpg?v=2",
    aboutTitle: "About Jini's Pilates Studio",
    aboutBody:
      "Nestled in vibrant Mysuru, Jini's Pilates Studio is the ultimate haven for fitness enthusiasts. This trendy studio blends the best of traditional Pilates with modern fitness vibes, creating a dynamic space where strength, flexibility and wellness take centre stage.",
    stats: [
      { value: "1000+", label: "Happy Members" },
      { value: "10+", label: "Years Experience" },
      { value: "12", label: "Certified Trainers" },
      { value: "100%", label: "Personal Guidance" },
    ],
    classes: [
      { name: "Reformer Pilates", blurb: "All levels — Spring-loaded reformer sessions for full-body strength, posture and control.", image: "assets/class-reformer.png" },
      { name: "Mat Pilates", blurb: "All levels — Classical mat flow that builds core control and long, lean strength.", image: "assets/class-mat.png?v=2" },
      { name: "Strength Training", blurb: "All levels — Focused strength training to build power, stability and everyday fitness.", image: "assets/class-strength.png" },
      { name: "Zumba", blurb: "All levels — High-energy dance fitness for cardio, coordination and fun.", image: "assets/about-group.png" },
    ],
    trainers: [
      { name: "Jini Menon", role: "BASI Certified Instructor", detail: "12 years experience · Reformer & postural correction", image: "assets/trainer_1_cex1xk_w.jpg" },
      { name: "Aditi Rao", role: "STOTT Pilates, Level 3", detail: "8 years experience · Prenatal & women's wellness", image: "assets/trainer_2_cx4_bncv.jpg" },
      { name: "Rohan Verma", role: "Clinical Pilates, MSc Physio", detail: "10 years experience · Rehabilitation & mobility", image: "assets/trainer_3_dj_srliy.jpg" },
    ],
    cafeBlurb: "Nourish after class with fresh bowls, smoothies, and wellness drinks.",
    cafeImages: [
      { src: "assets/food_1_bce_p0_t.jpg", alt: "Green smoothie and berry protein bowl" },
      { src: "assets/food_2_bb_dr2jh.jpg", alt: "Fresh cold pressed juices with fruit" },
      { src: "assets/food_3_cmezi_2r.jpg", alt: "Salad bowl and coffee" },
      { src: "assets/cafe_b_nzqt9u.jpg", alt: "Wellness cafe counter" },
    ],
    plans: [
      { tab: "Reformer Pilates", period: "Reformer Pilates", name: "12 Sessions", price: "₹7,899", validity: "45 days" },
      { tab: "Reformer Pilates", period: "Reformer Pilates", name: "36 Sessions", price: "₹23,697", validity: "105 days" },
      { tab: "Reformer Pilates", period: "Reformer Pilates", name: "6 Months", price: "₹47,394", validity: "6 months" },
      { tab: "Reformer Pilates", period: "Reformer Pilates", name: "12 Months", price: "₹94,788", validity: "12 months" },
      { tab: "Mat Pilates", period: "Mat Pilates", name: "1 Month", price: "₹3,699", validity: "1 month" },
      { tab: "Mat Pilates", period: "Mat Pilates", name: "3 Months", price: "₹11,097", validity: "3 months" },
      { tab: "Mat Pilates", period: "Mat Pilates", name: "6 Months", price: "₹22,194", validity: "6 months" },
      { tab: "Mat Pilates", period: "Mat Pilates", name: "12 Months", price: "₹44,388", validity: "12 months" },
      { tab: "Strength", period: "Strength Training", name: "12 Sessions", price: "₹7,899", validity: "—" },
      { tab: "Zumba", period: "Zumba", name: "12 Sessions", price: "₹3,500", validity: "—" },
    ],
    testimonials: [
      {
        name: "Ananya",
        quote:
          "I can't say enough about Jini's Pilates Studio! From the moment I walked in, I felt welcomed and motivated. The variety of classes keeps me engaged and the instructors are knowledgeable and incredibly supportive.",
        image: "assets/testimonial-ananya.png",
        rating: 5,
      },
      {
        name: "Kavya",
        quote:
          "Embarking on this fitness journey has been nothing short of transformative, and I am incredibly grateful for the guidance, expertise and support the studio has provided me.",
        image: "assets/testimonial-kavya.png",
        rating: 5,
      },
      {
        name: "Diya",
        quote:
          "I've finally found my fitness home at Jini's Pilates Studio! The atmosphere is energizing, the trainers are top-notch and the variety of classes keeps me engaged.",
        image: "assets/testimonial-diya.png",
        rating: 5,
      },
      {
        name: "Ishika",
        quote:
          "The atmosphere is motivating, the trainers are knowledgeable and supportive, and the variety of classes keeps me engaged. Thanks to their guidance, I've achieved fitness goals I never thought possible.",
        image: "assets/testimonial-ishika.png",
        rating: 5,
      },
    ],
    gallery: DEFAULT_GALLERY.slice(),
    phone: "+91 96868 68697",
    email: "info@jinispilatesstudio.com",
    address: "2955/1, 5th Main Rd, Vani Vilas Mohalla, Mysuru 570002",
    hours: "Open daily 9 AM – 10 PM",
    whatsapp: "919686868697",
    faqs: [
      {
        q: "What is Pilates?",
        a: "Pilates is a low-impact method of controlled movement that strengthens the deep core, improves alignment and builds flexibility. Sessions combine precise exercises with focused breathing, on a mat or on spring-based reformer equipment.",
      },
      {
        q: "Do beginners need experience?",
        a: "Not at all. Our Beginner Pilates classes assume zero background — you'll learn breathing, alignment and the core principles at an unhurried pace, with hands-on guidance from a certified instructor.",
      },
      {
        q: "How many classes should I attend?",
        a: "Two to three sessions a week is the sweet spot for visible change within six to eight weeks. Even one consistent weekly class delivers meaningful improvements in posture and mobility.",
      },
      {
        q: "What should I wear?",
        a: "Comfortable, fitted activewear that lets us see your alignment, plus grip socks. Pilates is practised barefoot or in grip socks — no shoes needed, and we provide mats and all equipment.",
      },
      {
        q: "Is Pilates suitable for seniors?",
        a: "Yes. Our Senior Pilates classes are joint-friendly and focus on balance, bone health and confident everyday movement, with modifications for every condition.",
      },
      {
        q: "Can I lose weight with Pilates?",
        a: "Pilates builds lean muscle, improves body composition and boosts consistency in movement — which supports healthy weight loss, especially paired with the balanced nutrition from our wellness cafe.",
      },
    ],
  };

  const GALLERY_CATEGORIES = [
    { id: "all", label: "All", href: "index.html" },
    { id: "studio", label: "Studio", href: "studio.html" },
    { id: "classes", label: "Classes", href: "classes.html" },
    { id: "equipment", label: "Equipment", href: "equipment.html" },
    { id: "cafe", label: "Cafe", href: "cafe.html" },
    { id: "members", label: "Members", href: "members.html" },
    { id: "events", label: "Events", href: "events.html" },
  ];

  const readStore = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  };

  const writeStore = (data) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch {
      return false;
    }
  };

  const withoutClassPrice = (blurb) =>
    String(blurb || "")
      .replace(/\s*[·•]\s*₹\s*[\d,]+(?:\/-)?/g, "")
      .replace(/₹\s*[\d,]+(?:\/-)?/g, "")
      .replace(/\s{2,}/g, " ")
      .trim();

  const getContent = () => {
    const saved = readStore() || {};
    const classes = (Array.isArray(saved.classes) ? saved.classes : DEFAULT_CONTENT.classes.slice()).map((item) => {
      const custom = String(item.image || "").startsWith("data:");
      let image = item.image;
      if (!custom && /class_reformer_cbidz7_n/i.test(String(image || ""))) {
        image = "assets/class-reformer.png";
      } else if (!custom && /^Mat Pilates$/i.test(String(item.name || ""))) {
        image = "assets/class-mat.png?v=2";
      } else if (!custom && /^Strength Training$/i.test(String(item.name || ""))) {
        image = "assets/class-strength.png";
      } else if (
        !custom &&
        /^Zumba$/i.test(String(item.name || "")) &&
        /class_group_sremfjhc/i.test(String(image || ""))
      ) {
        image = "assets/about-group.png";
      }
      return { ...item, blurb: withoutClassPrice(item.blurb), image };
    });
    const aboutTitle = (() => {
      const title = String(saved.aboutTitle || DEFAULT_CONTENT.aboutTitle);
      return /About Jini'?s Pilates Studio with Cafe/i.test(title)
        ? DEFAULT_CONTENT.aboutTitle
        : title;
    })();

    return {
      ...DEFAULT_CONTENT,
      ...saved,
      aboutTitle,
      stats: Array.isArray(saved.stats) ? saved.stats : DEFAULT_CONTENT.stats.slice(),
      classes,
      trainers: Array.isArray(saved.trainers) ? saved.trainers : DEFAULT_CONTENT.trainers.slice(),
      cafeImages: Array.isArray(saved.cafeImages)
        ? saved.cafeImages
        : DEFAULT_CONTENT.cafeImages.slice(),
      plans: Array.isArray(saved.plans) ? saved.plans : DEFAULT_CONTENT.plans.slice(),
      gallery: (Array.isArray(saved.gallery) ? saved.gallery : DEFAULT_CONTENT.gallery.slice()).map((item) => {
        const custom = String(item.src || "").startsWith("data:");
        if (custom) return item;
        if (/class_group_sremfjhc/i.test(String(item.src || "")) || item.id === "g6") {
          return { ...item, src: "assets/about-group.png" };
        }
        if (/class_reformer_cbidz7_n/i.test(String(item.src || "")) || item.id === "g2") {
          return { ...item, src: "assets/class-reformer.png" };
        }
        if (/class_mat_dkcnn3u_/i.test(String(item.src || "")) || item.id === "g7") {
          return { ...item, src: "assets/class-strength.png" };
        }
        return item;
      }),
      faqs: Array.isArray(saved.faqs) ? saved.faqs : DEFAULT_CONTENT.faqs.slice(),
      testimonials: (Array.isArray(saved.testimonials)
        ? saved.testimonials
        : DEFAULT_CONTENT.testimonials.slice()
      ).map((item, i) => {
        const fallback = DEFAULT_CONTENT.testimonials[i];
        const custom = String(item.image || "").startsWith("data:");
        const quote = String(item.quote || "");
        // Pull shorter defaults for anyone still on the old long stock quotes.
        const legacy =
          /fitness family that keeps me coming back|thrilled to share my experience|remarkable progress in my strength|Highly recommended\.?\s*$/i.test(
            quote
          );
        return {
          ...item,
          image: custom ? item.image : fallback?.image || item.image,
          quote: legacy || !quote ? fallback?.quote || quote : quote,
        };
      }),
    };
  };

  const saveContent = (data) => {
    const next = getContent();
    const merged = { ...next, ...data };
    const ok = writeStore(merged);
    return ok ? merged : null;
  };

  const resetContent = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    return getContent();
  };

  const assetUrl = (src, prefix = "") => {
    if (!src) return "";
    if (src.startsWith("data:") || src.startsWith("http") || src.startsWith("blob:")) return src;
    if (src.startsWith("../") || src.startsWith("/")) return src;
    return prefix + src.replace(/^\//, "");
  };

  window.JinisContent = {
    STORAGE_KEY,
    DEFAULT_CONTENT,
    GALLERY_CATEGORIES,
    getContent,
    saveContent,
    resetContent,
    assetUrl,
  };
})();
