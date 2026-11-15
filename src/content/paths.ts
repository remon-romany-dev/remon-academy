export type PathStep = {
  slug: string;
  note: string;
};

export type Goal = {
  slug: "beginner" | "developer" | "it";
  title: string;
  line: string;
  outcome: string;
  mode: "choices" | "sequence";
  steps: PathStep[];
  extras?: PathStep[];
  diplomaSlug?: string;
};

export type Diploma = {
  slug: string;
  title: string;
  line: string;
  slugs: readonly string[];
  save: number;
};

export const goals: Goal[] = [
  {
    slug: "beginner",
    title: "مبتدئ",
    line: "لسه بتختار المجال",
    outcome: "تختار مجال واحد وتجرّب أول درس فيه قبل ما تدفع.",
    mode: "choices",
    steps: [
      { slug: "programming-fundamentals", note: "لو عايز برمجة. الأساس قبل أي ستاك." },
      { slug: "ui-ux", note: "لو عايز تصميم واجهات." },
      { slug: "digital-marketing", note: "لو عايز تسويق وإعلانات." },
    ],
  },
  {
    slug: "developer",
    title: "مطوّر",
    line: "طريق شغل مطوّر ويب",
    outcome: "تقدر تبني موقع كامل وتقدّم بالمشروع على شغل مطوّر.",
    mode: "sequence",
    diplomaSlug: "web-developer",
    steps: [
      { slug: "programming-fundamentals", note: "الأساس: منطق، ويب، وجيت." },
      { slug: "fullstack-react-node", note: "مشروع كامل بواجهة وسيرفر يتقدم بيه." },
    ],
    extras: [
      { slug: "fullstack-react-laravel", note: "نفس الطريق لو السيرفر هيبقى Laravel." },
      { slug: "flutter", note: "لو الشغل تطبيقات موبايل مش مواقع." },
    ],
  },
  {
    slug: "it",
    title: "IT",
    line: "طريق دعم فني وشبكات",
    outcome: "تقدر تشتغل دعم فني وتفهم شبكة محلية. رسوم امتحان ICDL أو سيسكو مش ضمن السعر.",
    mode: "sequence",
    diplomaSlug: "it-support",
    steps: [
      { slug: "icdl", note: "استخدام الكمبيوتر وملفات المكتب." },
      { slug: "pc-support", note: "تجميع الجهاز وتشخيص العطل." },
      { slug: "network-fundamentals", note: "شبكة صغيرة قبل CCNA." },
      { slug: "ccna", note: "الخطوة اللي تتقدم بيها على شغل شبكات." },
    ],
  },
];

export const diplomas: Diploma[] = [
  {
    slug: "web-developer",
    title: "دبلومة مطوّر ويب",
    line: "أساسيات البرمجة وبعدين Full Stack React + Node. مشروع يتقدم بيه على شغل.",
    slugs: ["programming-fundamentals", "fullstack-react-node"],
    save: 2000,
  },
  {
    slug: "it-support",
    title: "دبلومة دعم وشبكات",
    line: "من استخدام الحاسب لحد CCNA. رسوم الامتحان الرسمي مش ضمن السعر.",
    slugs: ["icdl", "pc-support", "network-fundamentals", "ccna"],
    save: 2000,
  },
  {
    slug: "design-social",
    title: "تصميم + سوشيال",
    line: "جرافيك وظهور على السوشيال في باقة واحدة.",
    slugs: ["graphic-design", "social-media-marketing"],
    save: 2000,
  },
  {
    slug: "fullstack-ai",
    title: "Full Stack + ذكاء اصطناعي للمطورين",
    line: "مشروع الويب، وبعده أدوات الذكاء الاصطناعي جوه الشغل البرمجي.",
    slugs: ["fullstack-react-node", "ai-for-developers"],
    save: 1500,
  },
];

export const kidsSlugs = ["programming-kids", "graphics-kids", "ai-for-kids"] as const;

export function goalBySlug(slug: string): Goal | undefined {
  return goals.find((goal) => goal.slug === slug);
}

export function diplomaBySlug(slug: string): Diploma | undefined {
  return diplomas.find((diploma) => diploma.slug === slug);
}

export function diplomaTotals(prices: number[], save: number): { sum: number; price: number } {
  const sum = prices.reduce((total, price) => total + price, 0);
  return { sum, price: Math.max(0, sum - save) };
}

export type CoursePlace = {
  href: string;
  label: string;
};

export function coursePlaces(slug: string): CoursePlace[] {
  const places: CoursePlace[] = [];
  if ((kidsSlugs as readonly string[]).includes(slug)) {
    places.push({ href: "/kids", label: "كورسات الأطفال" });
  }
  for (const goal of goals) {
    const inPath = goal.steps.some((step) => step.slug === slug) || goal.extras?.some((step) => step.slug === slug);
    if (inPath) {
      places.push({ href: `/goals/${goal.slug}`, label: `طريق ${goal.title}` });
    }
  }
  for (const diploma of diplomas) {
    if (diploma.slugs.includes(slug)) {
      places.push({ href: `/diplomas/${diploma.slug}`, label: diploma.title });
    }
  }
  return places.slice(0, 3);
}
