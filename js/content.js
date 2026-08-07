(() => {
  const STORAGE_KEY = "jinis_site_content_v1";

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
    classes: [
          {
                "name": "Mat Pilates",
                "blurb": "50 min · All levels — Classical mat flow that builds core control and long, lean strength."
          },
          {
                "name": "Reformer Pilates",
                "blurb": "55 min · Intermediate — Spring-loaded resistance work for full-body tone and precision."
          },
          {
                "name": "Beginner Pilates",
                "blurb": "45 min · Beginner — Foundations of breath, alignment and the core principles, unhurried."
          },
          {
                "name": "Advanced Pilates",
                "blurb": "60 min · Advanced — Complex sequencing and deeper loading for seasoned practitioners."
          },
          {
                "name": "Private Training",
                "blurb": "60 min · Personalised — One-to-one programming built entirely around your body and goals."
          },
          {
                "name": "Group Sessions",
                "blurb": "50 min · All levels — Small groups of six, so every cue still lands personally."
          },
          {
                "name": "Strength & Flexibility",
                "blurb": "55 min · Intermediate — Blended resistance and mobility work for balanced conditioning."
          },
          {
                "name": "Senior Pilates",
                "blurb": "45 min · Gentle — Joint-friendly movement for balance, bone health and confidence."
          },
          {
                "name": "Prenatal Pilates",
                "blurb": "45 min · Prenatal — Safe, trimester-aware sessions supporting pelvic floor and posture."
          }
    ],
    trainers: [
          {
                "name": "Jini Menon",
                "role": "BASI Certified Instructor"
          },
          {
                "name": "Aditi Rao",
                "role": "STOTT Pilates, Level 3"
          },
          {
                "name": "Rohan Verma",
                "role": "Clinical Pilates, MSc Physio"
          }
    ],
    cafeBlurb: "Nourish after class with fresh bowls, smoothies, and wellness drinks.",
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
    const saved = readStore();
    return saved ? { ...DEFAULT_CONTENT, ...saved } : { ...DEFAULT_CONTENT };
  };

  const saveContent = (data) => {
    const next = { ...DEFAULT_CONTENT, ...data };
    writeStore(next);
    return next;
  };

  const resetContent = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    return { ...DEFAULT_CONTENT };
  };

  window.JinisContent = {
    STORAGE_KEY,
    DEFAULT_CONTENT,
    getContent,
    saveContent,
    resetContent,
  };
})();
