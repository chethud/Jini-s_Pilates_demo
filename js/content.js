(() => {
  const STORAGE_KEY = "jinis_site_content_v1";

  const DEFAULT_GALLERY = [
    { id: "g1", src: "assets/gallery_studio_bptwifhk.jpg", alt: "Studio reception with wooden bench", category: "studio" },
    { id: "g2", src: "assets/class_reformer_cbidz7_n.jpg", alt: "Reformer Pilates session", category: "classes" },
    { id: "g3", src: "assets/gallery_equipment_be6bqby0.jpg", alt: "Reformer straps close up", category: "equipment" },
    { id: "g4", src: "assets/cafe_b_nzqt9u.jpg", alt: "Wellness cafe counter", category: "cafe" },
    { id: "g5", src: "assets/gallery_members_cyis7hte.jpg", alt: "Members chatting after class", category: "members" },
    { id: "g6", src: "assets/class_group_sremfjhc.jpg", alt: "Group class event", category: "events" },
    { id: "g7", src: "assets/class_mat_dkcnn3u_.jpg", alt: "Mat Pilates stretch", category: "classes" },
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
    heroImage: "assets/hero-home.jpg",
    aboutTitle: "About Jini's Pilates Studio with Cafe",
    aboutBody:
      "Nestled in vibrant Mysuru, Jini's Pilates Studio is the ultimate haven for fitness enthusiasts. This trendy studio blends the best of traditional Pilates with modern fitness vibes, creating a dynamic space where strength, flexibility and wellness take centre stage.",
    stats: [
      { value: "1000+", label: "Happy Members" },
      { value: "10+", label: "Years Experience" },
      { value: "12", label: "Certified Trainers" },
      { value: "100%", label: "Personal Guidance" },
    ],
    classes: [
      { name: "Mat Pilates", blurb: "50 min · All levels — Classical mat flow that builds core control and long, lean strength.", image: "assets/class_mat_dkcnn3u_.jpg" },
      { name: "Reformer Pilates", blurb: "55 min · Intermediate — Spring-loaded resistance work for full-body tone and precision.", image: "assets/class_reformer_cbidz7_n.jpg" },
      { name: "Beginner Pilates", blurb: "45 min · Beginner — Foundations of breath, alignment and the core principles, unhurried.", image: "assets/class_group_sremfjhc.jpg" },
      { name: "Advanced Pilates", blurb: "60 min · Advanced — Complex sequencing and deeper loading for seasoned practitioners.", image: "assets/class_reformer_cbidz7_n.jpg" },
      { name: "Private Training", blurb: "60 min · Personalised — One-to-one programming built entirely around your body and goals.", image: "assets/gallery_members_cyis7hte.jpg" },
      { name: "Group Sessions", blurb: "50 min · All levels — Small groups of six, so every cue still lands personally.", image: "assets/class_group_sremfjhc.jpg" },
      { name: "Strength & Flexibility", blurb: "55 min · Intermediate — Blended resistance and mobility work for balanced conditioning.", image: "assets/class_mat_dkcnn3u_.jpg" },
      { name: "Senior Pilates", blurb: "45 min · Gentle — Joint-friendly movement for balance, bone health and confidence.", image: "assets/gallery_studio_bptwifhk.jpg" },
      { name: "Prenatal Pilates", blurb: "45 min · Prenatal — Safe, trimester-aware sessions supporting pelvic floor and posture.", image: "assets/gallery_members_cyis7hte.jpg" },
    ],
    trainers: [
      { name: "Jini Menon", role: "BASI Certified Instructor", detail: "12 years experience · Reformer & postural correction", image: "assets/trainer_1_cex1xk_w.jpg" },
      { name: "Aditi Rao", role: "STOTT Pilates, Level 3", detail: "8 years experience · Prenatal & women's wellness", image: "assets/trainer_2_cx4_bncv.jpg" },
      { name: "Rohan Verma", role: "Clinical Pilates, MSc Physio", detail: "10 years experience · Rehabilitation & mobility", image: "assets/trainer_3_dj_srliy.jpg" },
    ],
    cafeBlurb: "Nourish after class with fresh bowls, smoothies, and wellness drinks.",
    plans: [
      {
        name: "Starter",
        period: "Monthly",
        price: "₹ 3,500",
        cadence: "monthly",
        note: "8 group sessions per month",
        popular: false,
        features: ["Progress Tracking"],
      },
      {
        name: "Professional",
        period: "Quarterly",
        price: "₹ 9,000",
        cadence: "quarterly",
        note: "Most chosen by our members",
        popular: true,
        features: ["Unlimited Classes", "Diet Consultation", "Progress Tracking", "Priority Booking"],
      },
      {
        name: "Elite",
        period: "Yearly",
        price: "₹ 32,000",
        cadence: "yearly",
        note: "Includes 12 private sessions & cafe credit",
        popular: false,
        features: ["Unlimited Classes", "Personal Trainer", "Diet Consultation", "Progress Tracking", "Priority Booking"],
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

  const getContent = () => {
    const saved = readStore() || {};
    return {
      ...DEFAULT_CONTENT,
      ...saved,
      stats: Array.isArray(saved.stats) ? saved.stats : DEFAULT_CONTENT.stats.slice(),
      classes: Array.isArray(saved.classes) ? saved.classes : DEFAULT_CONTENT.classes.slice(),
      trainers: Array.isArray(saved.trainers) ? saved.trainers : DEFAULT_CONTENT.trainers.slice(),
      plans: Array.isArray(saved.plans) ? saved.plans : DEFAULT_CONTENT.plans.slice(),
      gallery: Array.isArray(saved.gallery) ? saved.gallery : DEFAULT_CONTENT.gallery.slice(),
      faqs: Array.isArray(saved.faqs) ? saved.faqs : DEFAULT_CONTENT.faqs.slice(),
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
