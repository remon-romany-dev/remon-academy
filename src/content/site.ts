export const SITE_URL = "https://courses.remonromany.com";
export const SITE_NAME = "أكاديمية ريمون";

export type TrackId =
  | "programming"
  | "design"
  | "marketing"
  | "ai"
  | "data-analysis"
  | "data-science";

export type TrackFilter = TrackId | "all";

export type Track = {
  id: TrackId;
  title: string;
  line: string;
  /** درجة اللون (hue) المستخدمة في oklch لكل مسار. */
  hue: number;
  tags: string[];
};

export const tracks: Track[] = [
  {
    id: "programming",
    title: "برمجة",
    line: "مواقع كاملة، سيستمز، وتطبيقات موبايل",
    hue: 145,
    tags: ["React", "Node", "Laravel", "WordPress", "Flutter"],
  },
  {
    id: "ai",
    title: "ذكاء اصطناعي",
    line: "أدوات وأتمتة بتختصر شغلك كله",
    hue: 255,
    tags: ["Prompting", "Automation", "Agents"],
  },
  {
    id: "design",
    title: "تصميم",
    line: "واجهات وتجربة مستخدم من الفكرة للبروتوتايب",
    hue: 345,
    tags: ["Figma", "Photoshop", "Illustrator", "سوشيال"],
  },
  {
    id: "marketing",
    title: "تسويق",
    line: "إعلانات ومحتوى ونمو بيجيب مبيعات",
    hue: 70,
    tags: ["سوشيال", "إعلانات", "SEO", "متاجر"],
  },
  {
    id: "data-analysis",
    title: "تحليل البيانات",
    line: "إكسل وSQL وداشبورد تقرأ بيها الأرقام",
    hue: 205,
    tags: ["Excel", "SQL", "Power BI"],
  },
  {
    id: "data-science",
    title: "علم البيانات",
    line: "إحصاء وPython ونماذج بتتنبأ",
    hue: 300,
    tags: ["Python", "Stats", "ML"],
  },
];

export type Course = {
  slug: string;
  title: string;
  track: TrackId;
  hours: number;
  /** السعر بالجنيه المصري، على سعر البرنامج المماثل المنشور في السوق (نوفمبر 2026). */
  priceEgp: number;
  attendance: string;
  summary: string;
  audience: string;
  outcomes: string[];
  modules: string[];
  /** رابط تضمين (iframe) للدرس المجاني من Bunny Stream. لو فاضي بيظهر زر طلب الدرس على واتساب. */
  freeLessonEmbedUrl?: string;
};

export const courses: Course[] = [
  {
    slug: "fullstack-react-node",
    title: "Full Stack React + Node",
    track: "programming",
    hours: 180,
    priceEgp: 13900,
    attendance: "أونلاين أو حضوري",
    summary:
      "تبني مواقع وتطبيقات ويب كاملة من الصفر: واجهة بـ React وسيرفر بـ Node وقاعدة بيانات، وتخرج بمشروع حقيقي منشور على النت.",
    audience: "مناسب للمبتدئ تمامًا، ولو عندك أساسيات بسيطة هتبدأ أسرع.",
    outcomes: [
      "تبني واجهات تفاعلية بـ React وTypeScript",
      "تعمل API وقاعدة بيانات بـ Node وExpress",
      "تنفذ تسجيل دخول وصلاحيات ودفع أونلاين",
      "تنشر مشروعك على سيرفر حقيقي",
    ],
    modules: [
      "أساسيات الويب: HTML وCSS وJavaScript",
      "Git وGitHub وبيئة الشغل",
      "React وTypeScript",
      "Node وExpress وبناء الـ API",
      "قواعد البيانات وSQL",
      "تسجيل الدخول والصلاحيات",
      "النشر والمشروع النهائي",
    ],
  },
  {
    slug: "fullstack-react-laravel",
    title: "Full Stack React + Laravel",
    track: "programming",
    hours: 180,
    priceEgp: 13900,
    attendance: "أونلاين أو حضوري",
    summary:
      "نفس رحلة الـ Full Stack لكن بسيرفر PHP وLaravel، وهو الأكتر طلبًا في شركات ومشاريع السوق المحلي.",
    audience: "مناسب للمبتدئ، ولمن يشتغل على ووردبريس ويريد ينتقل لبرمجة التطبيقات.",
    outcomes: [
      "تبني واجهات حديثة بـ React",
      "تبني API كاملة بـ Laravel وEloquent",
      "تصمم قاعدة بيانات وعلاقات سليمة",
      "تسلّم مشروع متكامل بلوحة تحكم",
    ],
    modules: [
      "أساسيات الويب وJavaScript",
      "PHP الحديثة وأساسيات Laravel",
      "قواعد البيانات والعلاقات",
      "REST API والمصادقة",
      "React وربطها بالـ API",
      "لوحة التحكم والصلاحيات",
      "النشر والمشروع النهائي",
    ],
  },
  {
    slug: "flutter",
    title: "Flutter",
    track: "programming",
    hours: 120,
    priceEgp: 9900,
    attendance: "أونلاين أو حضوري",
    summary:
      "تبني تطبيق موبايل واحد يشتغل على أندرويد وآيفون بنفس الكود، وتنشره على المتجر.",
    audience: "مناسب لمن لديه أساسيات برمجة، أو يبدأ معنا من Dart.",
    outcomes: [
      "تتقن Dart وبناء الواجهات بالـ Widgets",
      "تدير حالة التطبيق بشكل منظم",
      "تربط التطبيق بـ API وFirebase",
      "تنشر التطبيق على المتاجر",
    ],
    modules: [
      "لغة Dart من الأساس",
      "الـ Widgets والتصميم المتجاوب",
      "التنقل وإدارة الحالة",
      "التعامل مع الـ API",
      "Firebase والإشعارات",
      "التخزين المحلي",
      "النشر والمشروع النهائي",
    ],
  },
  {
    slug: "ui-ux",
    title: "UI/UX",
    track: "design",
    hours: 90,
    priceEgp: 7500,
    attendance: "أونلاين",
    summary:
      "تتعلم تصميم الواجهات وتجربة المستخدم باحتراف: من البحث والـ wireframes لحد بروتوتايب تفاعلي ومشروع في البورتفوليو.",
    audience: "مناسب لأي حد من غير خبرة في التصميم.",
    outcomes: [
      "تبحث وتفهم المستخدم قبل ما تصمم",
      "تتقن Figma وتبني Design System",
      "تعمل بروتوتايب تفاعلي وتختبره",
      "تخرج ببورتفوليو جاهز للتقديم على شغل",
    ],
    modules: [
      "أساسيات التصميم والألوان والخطوط",
      "بحث المستخدم ورحلته",
      "الـ Wireframes وهيكل التطبيق",
      "Figma من الأساس للاحتراف",
      "الـ Design System والمكونات",
      "البروتوتايب واختبار الاستخدام",
      "البورتفوليو والمشروع النهائي",
    ],
  },
  {
    slug: "digital-marketing",
    title: "التسويق الرقمي",
    track: "marketing",
    hours: 81,
    priceEgp: 7900,
    attendance: "أونلاين",
    summary:
      "تبني استراتيجية تسويق كاملة وتشغّل حملات إعلانية حقيقية وتقيس نتيجتها بالأرقام.",
    audience: "مناسب للمبتدئ، ولصاحب مشروع يريد يسوّق لنفسه.",
    outcomes: [
      "تضع خطة تسويق تناسب نشاطك",
      "تشغّل حملات Meta وGoogle بميزانية صغيرة",
      "تكتب محتوى وإعلانات بتبيع",
      "تقرأ التقارير وتحسّن النتيجة",
    ],
    modules: [
      "أساسيات التسويق والاستراتيجية",
      "المحتوى والسوشيال ميديا",
      "إعلانات Meta",
      "إعلانات Google وSEO",
      "التحليلات وقياس النتائج",
      "الأتمتة والإيميل",
      "حملة تطبيقية كاملة",
    ],
  },
  {
    slug: "applied-ai",
    title: "ذكاء اصطناعي تطبيقي",
    track: "ai",
    hours: 60,
    priceEgp: 6900,
    attendance: "أونلاين",
    summary:
      "مش نظريات. تتعلم تستخدم أدوات الذكاء الاصطناعي في شغلك اليومي، وتبني أتمتة ومساعدين ذكيين تختصر بيهم ساعات.",
    audience: "مناسب لأي حد، مش محتاج خلفية برمجية.",
    outcomes: [
      "تكتب Prompts تجيب نتيجة دقيقة",
      "تبني أتمتة تربط أدواتك ببعض",
      "تستخدم الـ AI في الكتابة والتصميم والفيديو",
      "تصمم مساعد ذكي لشغلك",
    ],
    modules: [
      "إزاي بيشتغل الذكاء الاصطناعي",
      "هندسة الـ Prompts",
      "الـ AI في الشغل اليومي",
      "الصور والفيديو والصوت",
      "الأتمتة بين الأدوات",
      "بناء مساعد ذكي",
      "الأخلاقيات والخصوصية",
    ],
  },
  {
    slug: "data-bi",
    title: "تحليل البيانات",
    track: "data-analysis",
    hours: 96,
    priceEgp: 7500,
    attendance: "أونلاين أو حضوري",
    summary:
      "تحوّل الأرقام الخام لتقارير وداشبورد تساعد على اتخاذ القرار، باستخدام إكسل وSQL وPower BI.",
    audience: "مناسب للمبتدئ، ولمن يشتغل بالأرقام والتقارير.",
    outcomes: [
      "تنضف البيانات وتحللها بإكسل",
      "تستعلم من قواعد البيانات بـ SQL",
      "تبني داشبورد تفاعلي في Power BI",
      "تحكي قصة من الأرقام لمديرك",
    ],
    modules: [
      "إكسل من الأساس للمتقدم",
      "تنظيف وتجهيز البيانات",
      "SQL وقواعد البيانات",
      "Power BI والداشبورد",
      "التصور البصري للبيانات",
      "رواية القصة من الأرقام",
      "المشروع النهائي",
    ],
  },
  {
    slug: "data-science",
    title: "علم البيانات",
    track: "data-science",
    hours: 210,
    priceEgp: 15000,
    attendance: "أونلاين",
    summary:
      "مسار علم البيانات لوحده: Python والإحصاء ونماذج التنبؤ الكلاسيكية. مش تحليل تقارير، ومش كورس أدوات الذكاء الاصطناعي.",
    audience: "مناسب لمن لديه حس رياضي، ولا يشترط خبرة برمجية سابقة.",
    outcomes: [
      "تتقن Python ومكتبات تحليل البيانات",
      "تفهم الإحصاء اللي وراء النماذج",
      "تبني وتقيّم نماذج تعلّم آلة كلاسيكية",
      "تسلّم مشروع بيانات كامل من البيانات الخام للاستنتاج",
    ],
    modules: [
      "Python من الأساس",
      "Pandas وNumPy",
      "تنظيف البيانات وبناء الـ Pipeline",
      "الإحصاء الاستدلالي والاحتمالات",
      "التصور العلمي بـ Matplotlib وSeaborn",
      "SQL لمشاريع البيانات",
      "Feature Engineering",
      "نماذج الانحدار والتصنيف",
      "تقييم النماذج",
      "المشروع النهائي",
    ],
  },
  {
    slug: "fullstack-react-python",
    title: "Full Stack React + Python",
    track: "programming",
    hours: 180,
    priceEgp: 13900,
    attendance: "أونلاين أو حضوري",
    summary: "واجهة بـ React وسيرفر بـ Python (Django وFastAPI)، وتخرج بتطبيق ويب كامل منشور.",
    audience: "مناسب للمبتدئ، ولمن ناوي يكمل بعد كده في البيانات أو الذكاء الاصطناعي.",
    outcomes: [
      "تبني واجهات بـ React وNext.js",
      "تبني API بـ Django وFastAPI",
      "تربط الواجهة بقاعدة بيانات",
      "تنشر المشروع كاملًا",
    ],
    modules: [
      "أساسيات الويب وJavaScript",
      "React وNext.js",
      "Python للباكند",
      "Django وFastAPI",
      "قواعد البيانات",
      "المصادقة وREST API",
      "النشر والمشروع النهائي",
    ],
  },
  {
    slug: "fullstack-angular-dotnet",
    title: "Full Stack Angular + ASP.NET",
    track: "programming",
    hours: 153,
    priceEgp: 19000,
    attendance: "أونلاين أو حضوري",
    summary: "التوليفة الأكثر طلبًا في شركات مصر: واجهة Angular وسيرفر ASP.NET Core وSQL Server.",
    audience: "مناسب للمبتدئ الجاد، ولمن يستهدف وظائف الشركات.",
    outcomes: [
      "تبني واجهات بـ Angular وTypeScript",
      "تبني API بـ ASP.NET Core",
      "تستخدم Entity Framework وSQL Server",
      "تسلّم نظام بصلاحيات ونشر",
    ],
    modules: [
      "HTML وCSS وJavaScript",
      "TypeScript",
      "Angular من الأساس",
      "C# وASP.NET Core",
      "Entity Framework وSQL Server",
      "Identity والصلاحيات",
      "المشروع النهائي",
    ],
  },
  {
    slug: "fullstack-react-dotnet",
    title: "Full Stack React + ASP.NET",
    track: "programming",
    hours: 160,
    priceEgp: 19000,
    attendance: "أونلاين أو حضوري",
    summary: "نفس قوة الـ .NET في الشركات، بواجهة React بدل Angular.",
    audience: "مناسب لمن يفضّل React ويريد باكند الشركات.",
    outcomes: [
      "تبني واجهة React حديثة",
      "تبني API بـ ASP.NET Core",
      "تصمم قاعدة SQL Server",
      "تنشر النظام كاملًا",
    ],
    modules: [
      "JavaScript وTypeScript",
      "React",
      "C# وOOP",
      "ASP.NET Core",
      "Entity Framework وSQL Server",
      "المصادقة",
      "المشروع النهائي",
    ],
  },
  {
    slug: "fullstack-angular-node",
    title: "Full Stack Angular + Node",
    track: "programming",
    hours: 180,
    priceEgp: 13900,
    attendance: "أونلاين أو حضوري",
    summary: "واجهة Angular وسيرفر Node.js، لتطبيق ويب كامل من غير ما تتقيد بإطار واحد.",
    audience: "مناسب للمبتدئ ولمن يشتغل في بيئات بتطلب Angular.",
    outcomes: [
      "تتقن Angular وTypeScript",
      "تبني API بـ Node وExpress",
      "تربط الواجهة بالسيرفر",
      "تنشر مشروعًا كاملًا",
    ],
    modules: [
      "أساسيات الويب وJavaScript",
      "TypeScript",
      "Angular",
      "Node وExpress",
      "قواعد البيانات",
      "المصادقة",
      "المشروع النهائي",
    ],
  },
  {
    slug: "fullstack-vue-node",
    title: "Full Stack Vue + Node",
    track: "programming",
    hours: 180,
    priceEgp: 13900,
    attendance: "أونلاين أو حضوري",
    summary: "Vue.js في الواجهة وNode في السيرفر. مسار أخف شكلًا، ونفس ناتج تطبيق كامل.",
    audience: "مناسب للمبتدئ ولمن يفضّل Vue على React.",
    outcomes: [
      "تبني واجهات بـ Vue",
      "تبني API بـ Node",
      "تدير حالة التطبيق وتربطها بالسيرفر",
      "تنشر المشروع",
    ],
    modules: ["أساسيات الويب", "JavaScript", "Vue.js", "Node وExpress", "قواعد البيانات", "المصادقة", "المشروع النهائي"],
  },
  {
    slug: "fullstack-vue-laravel",
    title: "Full Stack Vue + Laravel",
    track: "programming",
    hours: 180,
    priceEgp: 13900,
    attendance: "أونلاين أو حضوري",
    summary: "Vue في الواجهة وLaravel في السيرفر، وهي توليفة شائعة في مشاريع السوق المحلي.",
    audience: "مناسب للمبتدئ ولمن يشتغل مع PHP.",
    outcomes: [
      "تبني واجهات بـ Vue",
      "تبني API بـ Laravel",
      "تصمم قاعدة بيانات بـ Eloquent",
      "تسلّم مشروع بلوحة تحكم",
    ],
    modules: ["أساسيات الويب", "JavaScript وVue", "PHP وLaravel", "Eloquent وMySQL", "REST API", "الصلاحيات", "المشروع النهائي"],
  },
  {
    slug: "fullstack-react-java",
    title: "Full Stack React + Java Spring",
    track: "programming",
    hours: 180,
    priceEgp: 14000,
    attendance: "أونلاين أو حضوري",
    summary: "واجهة React وسيرفر Spring Boot. مناسبة للي عايز يدخل شركات بتشتغل Java.",
    audience: "مناسب للمبتدئ الجاد. لو عايز تعمق Java أكتر، فيه دبلومة الباكند المنفصلة.",
    outcomes: [
      "تبني واجهة React",
      "تبني API بـ Spring Boot",
      "تستخدم JPA وقاعدة بيانات",
      "تنشر النظام",
    ],
    modules: ["أساسيات الويب وReact", "Java وOOP", "Spring Boot", "JPA وHibernate", "Security أساسي", "SQL", "المشروع النهائي"],
  },
  {
    slug: "fullstack-angular-java",
    title: "Full Stack Angular + Java Spring",
    track: "programming",
    hours: 180,
    priceEgp: 14000,
    attendance: "أونلاين أو حضوري",
    summary: "Angular مع Spring Boot، توليفة شركات بتشتغل الاتنين مع بعض.",
    audience: "مناسب لمن يستهدف وظائف Java في الشركات.",
    outcomes: ["تتقن Angular", "تبني API بـ Spring Boot", "تربط الواجهة بالسيرفر", "تسلّم مشروع مؤسسي"],
    modules: ["JavaScript وTypeScript", "Angular", "Java وOOP", "Spring Boot", "JPA", "Security", "المشروع النهائي"],
  },
  {
    slug: "frontend-react",
    title: "Front-End",
    track: "programming",
    hours: 160,
    priceEgp: 8500,
    attendance: "أونلاين أو حضوري",
    summary: "تتخصص في الواجهة فقط: HTML وCSS وJavaScript وTypeScript وReact وNext.js، وتخرج بمشروع Dashboard.",
    audience: "مناسب للمبتدئ ولمن يريد وظيفة واجهات قبل ما يدخل الباكند.",
    outcomes: [
      "تبني صفحات متجاوبة ومتاحة",
      "تتقن JavaScript وTypeScript",
      "تبني تطبيقات React وNext.js",
      "تسلّم مشروع واجهة كامل",
    ],
    modules: [
      "HTML5 وCSS وResponsive",
      "Sass وTailwind",
      "JavaScript ES6",
      "TypeScript",
      "React وHooks",
      "Next.js وإدارة الحالة",
      "مشروع Dashboard",
    ],
  },
  {
    slug: "backend-nodejs",
    title: "Back-End Node.js",
    track: "programming",
    hours: 140,
    priceEgp: 8500,
    attendance: "أونلاين أو حضوري",
    summary: "تتخصص في السيرفر: Node وExpress وTypeScript وقواعد بيانات ومصادقة ونشر.",
    audience: "مناسب لمن عنده أساسيات جافاسكربت أو خلّص فرونت.",
    outcomes: ["تبني REST API", "تشتغل على MongoDB وPostgreSQL", "تنفّذ تسجيل دخول وصلاحيات", "تنشر السيرفر بـ Docker"],
    modules: ["Node وExpress", "TypeScript على السيرفر", "Validation والأخطاء", "MongoDB وPostgreSQL", "JWT والمصادقة", "Docker والنشر", "مشروع API"],
  },
  {
    slug: "backend-laravel",
    title: "Back-End Laravel",
    track: "programming",
    hours: 120,
    priceEgp: 8500,
    attendance: "أونلاين أو حضوري",
    summary: "PHP وLaravel وEloquent، وهو الباكند الأكثر طلبًا في مشاريع مصر.",
    audience: "مناسب للمبتدئ في الباكند ولمن ينتقل من ووردبريس.",
    outcomes: ["تكتب PHP حديثة", "تبني تطبيق Laravel", "تصمم علاقات قاعدة البيانات", "تسلّم API ولوحة تحكم"],
    modules: ["PHP وOOP", "Laravel", "Eloquent وMySQL", "REST API", "المصادقة والصلاحيات", "Queues وStorage", "المشروع النهائي"],
  },
  {
    slug: "backend-java",
    title: "Back-End Java",
    track: "programming",
    hours: 300,
    priceEgp: 14000,
    attendance: "أونلاين أو حضوري",
    summary: "دبلومة Java الطويلة: من اللغة نفسها لحد Spring Boot وJPA ومشروع API مؤسسي.",
    audience: "مناسب لمن يريد مسار شركات طويل، مش كورس سريع.",
    outcomes: ["تتقن Java وOOP", "تبني خدمات بـ Spring Boot", "تستخدم Hibernate وقواعد بيانات", "تسلّم API مؤمّنة"],
    modules: ["Java SE", "OOP وهياكل البيانات", "Spring Boot", "JPA وHibernate", "MySQL وPostgreSQL", "Spring Security", "الاختبارات والنشر", "مشروع API"],
  },
  {
    slug: "backend-dotnet",
    title: "Back-End .NET",
    track: "programming",
    hours: 160,
    priceEgp: 9000,
    attendance: "أونلاين أو حضوري",
    summary: "C# وASP.NET Core وEntity Framework وSQL Server، مسار توظيف الشركات.",
    audience: "مناسب للمبتدئ في الباكند ولمن يستهدف وظائف .NET.",
    outcomes: ["تتقن C#", "تبني API بـ ASP.NET Core", "تستخدم Entity Framework", "تنفّذ Identity والصلاحيات"],
    modules: ["C# وOOP", "ASP.NET Core", "Entity Framework", "SQL Server", "Identity", "LINQ", "المشروع النهائي"],
  },
  {
    slug: "backend-python",
    title: "Back-End Python",
    track: "programming",
    hours: 140,
    priceEgp: 8500,
    attendance: "أونلاين أو حضوري",
    summary: "Django وFastAPI وقواعد بيانات، من غير مسار الواجهة. مناسب قبل علم البيانات أو كوظيفة باكند.",
    audience: "مناسب لمن عنده أساسيات Python أو يبدأ معنا من اللغة.",
    outcomes: ["تبني API بـ Django وFastAPI", "تصمم قاعدة بيانات", "تنفّذ مصادقة", "تنشر الخدمة"],
    modules: ["Python وOOP", "Django", "FastAPI", "ORM وPostgreSQL", "المصادقة", "Docker والنشر", "مشروع API"],
  },
  {
    slug: "qa-automation",
    title: "QA واختبار البرمجيات",
    track: "programming",
    hours: 150,
    priceEgp: 14500,
    attendance: "أونلاين أو حضوري",
    summary: "اختبار يدوي ثم أتمتة بـ Selenium وPlaywright وCypress، وتخرج بمشروع اختبار حقيقي.",
    audience: "مناسب للمبتدئ ولمن يريد يدخل مجال الجودة من غير ما يبقى مطوّر واجهات.",
    outcomes: ["تكتب Test Cases وتبلّغ عن الأخطاء", "تختبر APIs بـ Postman", "تأتمت واجهات الويب", "تسلّم مشروع أتمتة"],
    modules: ["الاختبار اليدوي", "Test Cases وBug Reports", "Postman وAPI Testing", "Selenium", "Playwright", "Cypress", "مشروع أتمتة"],
  },
  {
    slug: "graphic-design",
    title: "التصميم الجرافيكي",
    track: "design",
    hours: 105,
    priceEgp: 6500,
    attendance: "أونلاين",
    summary: "Photoshop وIllustrator وInDesign وهوية بصرية كاملة، من أول الألوان لحد مشروع بورتفوليو.",
    audience: "مناسب لأي حد من غير خبرة في التصميم.",
    outcomes: ["تتقن أدوات أدوبي الأساسية", "تصمم لوجو وهوية", "تجهّز منشورات سوشيال ومطبوعات", "تخرج ببورتفوليو"],
    modules: ["أسس الجرافيك والألوان والتيبوجرافي", "Photoshop", "Illustrator", "InDesign", "الهوية البصرية واللوجو", "تصميم السوشيال والمطبوعات", "مشروع هوية كاملة"],
  },
  {
    slug: "motion-video",
    title: "الموشن والفيديو",
    track: "design",
    hours: 80,
    priceEgp: 6500,
    attendance: "أونلاين",
    summary: "مونتاج وموشن جرافيك وريلز، من Premiere وAfter Effects لحد مشروع فيديو ينزل على الشغل.",
    audience: "مناسب للمبتدئ ولصناع المحتوى.",
    outcomes: ["تمونتاج فيديو بشكل نظيف", "تعمل موشن جرافيك بسيط", "تجهّز ريلز وثامبنيل", "تسلّم مشروع فيديو"],
    modules: ["المونتاج من الصفر", "Premiere Pro", "After Effects والموشن", "CapCut والريلز", "ثامبنيل يوتيوب", "مقدمة Blender", "مشروع فيديو"],
  },
  {
    slug: "ai-for-marketing",
    title: "ذكاء اصطناعي للتسويق",
    track: "marketing",
    hours: 20,
    priceEgp: 2900,
    attendance: "أونلاين",
    summary: "كورس قصير: تستخدم أدوات الذكاء الاصطناعي في المحتوى والإعلانات والأتمتة، وتطلع بحملة.",
    audience: "مناسب للمسوّق ولصاحب المشروع. مش محتاج برمجة.",
    outcomes: ["تختار الأداة المناسبة للمهمة", "تكتب محتوى وإعلان بأداة ذكاء اصطناعي", "تأتمت جزء من الشغل", "تسلّم حملة قصيرة"],
    modules: ["أدوات الذكاء الاصطناعي للمسوّق", "صناعة المحتوى", "الإعلانات", "أتمتة الحملة", "مشروع حملة"],
  },
  {
    slug: "ai-machine-learning",
    title: "الذكاء الاصطناعي وتعلّم الآلة",
    track: "ai",
    hours: 240,
    priceEgp: 19900,
    attendance: "أونلاين أو حضوري",
    summary: "دبلومة النماذج: Machine Learning وDeep Learning ومقدمة للرؤية واللغة. مش كورس أدوات الشغل اليومي.",
    audience: "مناسب لمن عنده استعداد للرياضة والبرمجة، أو خلّص تأسيس Python.",
    outcomes: ["تبني نماذج تعلّم آلة وتقيّمها", "تفهم أساسيات الشبكات العصبية", "تجرب رؤية حاسوبية ولغة بشكل مبسط", "تسلّم مشروع نموذج"],
    modules: [
      "Python العلمي",
      "الإحصاء اللازم للنماذج",
      "تعلّم الآلة الكلاسيكي",
      "تقييم النماذج",
      "Deep Learning مبسط",
      "مقدمة Computer Vision",
      "مقدمة NLP",
      "المشروع النهائي",
    ],
  },
  {
    slug: "ai-for-developers",
    title: "ذكاء اصطناعي للمطورين",
    track: "ai",
    hours: 27,
    priceEgp: 3500,
    attendance: "أونلاين",
    summary: "كورس قصير للمبرمج: تستخدم الذكاء الاصطناعي جوه الشغل اليومي في الكود والمراجعة والاختبارات.",
    audience: "مناسب لمن يبرمج فعلًا. مش كورس للمبتدئ من الصفر.",
    outcomes: ["تكتب prompts تخدّم على الكود", "تولّد وتراجع كود بأداة", "تسرّع الاختبارات", "تطبّق ده على مشروع صغير"],
    modules: ["أدوات الذكاء الاصطناعي جوه المحرر", "الـ Prompting للمطور", "توليد الكود ومراجعته", "الاختبارات بمساعدة الأداة", "مشروع صغير"],
  },
  {
    slug: "wordpress",
    title: "WordPress وWooCommerce",
    track: "programming",
    hours: 70,
    priceEgp: 6000,
    attendance: "أونلاين",
    summary: "تبني موقع ومتجر من غير ما تكتب النظام من الصفر: ووردبريس، Elementor، WooCommerce، وأمان وسرعة أساسية.",
    audience: "مناسب لصاحب مشروع وللمبتدئ اللي عايز يطلع موقع يشتغل. مش مسار مبرمج Backend.",
    outcomes: ["تنشئ موقع ووردبريس وتديره", "تصمّم الصفحات بـ Elementor", "تبني متجر WooCommerce", "تظبط الأمان والسرعة بشكل أساسي"],
    modules: ["ووردبريس من الصفر", "Elementor وبناء الصفحات", "WooCommerce والمتجر", "الأمان والسرعة", "أتمتة بسيطة", "مشروع موقع أو متجر"],
  },
  {
    slug: "photoshop",
    title: "Photoshop",
    track: "design",
    hours: 42,
    priceEgp: 3000,
    attendance: "أونلاين",
    summary: "تعديل الصور والتصميم الإعلاني على فوتوشوب، من الأدوات الأساسية لحد شغل جاهز للتسليم.",
    audience: "مناسب للمبتدئ وللي بيشتغل محتوى أو إعلانات.",
    outcomes: ["تظبط الصور والقص والإضاءة", "تركّب تصميم إعلاني", "تجهّز ملف للطباعة وللسوشيال", "تسلّم شغل فوتوشوب كامل"],
    modules: ["أدوات فوتوشوب", "الطبقات والأقنعة", "تعديل الصور", "التصميم الإعلاني", "التجهيز للطباعة والسوشيال", "مشروع"],
  },
  {
    slug: "illustrator",
    title: "Illustrator",
    track: "design",
    hours: 42,
    priceEgp: 2200,
    attendance: "أونلاين",
    summary: "رسم فكتور وهوية بسيطة على إليستريتور: لوجو، أيقونات، وملفات تتكبّر من غير ما تبوظ.",
    audience: "مناسب للمبتدئ في الفكتور وللي خلّص فوتوشوب وعايز الشعارات.",
    outcomes: ["ترسم فكتور نظيف", "تعمل لوجو بسيط", "تظبط ألوان وخطوط الهوية", "تسلّم ملفات إليستريتور"],
    modules: ["أدوات إليستريتور", "الرسم الفكتور", "اللوجو", "الألوان والتيبوجرافي", "تجهيز الملفات", "مشروع لوجو"],
  },
  {
    slug: "indesign",
    title: "InDesign",
    track: "design",
    hours: 30,
    priceEgp: 2200,
    attendance: "أونلاين",
    summary: "تصميم المطبوعات متعددة الصفحات: بروشور، كتالوج، وملف جاهز للمطبعة.",
    audience: "مناسب لمن يعرف أساسيات التصميم وعايز المطبوعات.",
    outcomes: ["تبني مستند متعدد الصفحات", "تظبط الشبكة والتيبوجرافي", "تجهّز ملف للمطبعة", "تسلّم مطبوع كامل"],
    modules: ["المستند والصفحات", "الشبكة والتيبوجرافي", "الصور والرسوم", "تجهيز المطبعة", "مشروع مطبوع"],
  },
  {
    slug: "social-design",
    title: "تصميم السوشيال ميديا",
    track: "design",
    hours: 24,
    priceEgp: 2200,
    attendance: "أونلاين",
    summary: "تصمّم بوستات وستوريز وريلز ثابتة بهوية واحدة، على فوتوشوب وكانفا، وتطلع بباقة شهر جاهزة.",
    audience: "مناسب لصانع المحتوى وللي بيسلّم شغل لصفحات.",
    outcomes: ["تبني قوالب هوية للصفحة", "تصمّم بوست وستوريز", "تجهّز مقاسات كل منصة", "تسلّم باقة محتوى شهر"],
    modules: ["مقاسات المنصات", "الهوية على القوالب", "البوست والستوريز", "كانفا للشغل السريع", "باقة شهر", "مشروع صفحة"],
  },
  {
    slug: "social-media-marketing",
    title: "التسويق على السوشيال",
    track: "marketing",
    hours: 36,
    priceEgp: 4000,
    attendance: "أونلاين",
    summary: "تدير فيسبوك وإنستجرام وتيك توك: خطة محتوى، كتابة، ونشر، وتطلع بتقويم شهر لصفحة حقيقية.",
    audience: "مناسب للمبتدئ في التسويق ولصاحب الصفحة.",
    outcomes: ["تعمل خطة محتوى شهرية", "تكتب بوستات وإعلانات قصيرة", "تدير فيسبوك وإنستجرام وتيك توك", "تسلّم تقويم محتوى"],
    modules: ["خطة السوشيال", "صناعة المحتوى", "الكتابة الإعلانية", "فيسبوك وإنستجرام", "تيك توك والشورتس", "تقويم شهر"],
  },
  {
    slug: "ads-seo",
    title: "الإعلانات وSEO",
    track: "marketing",
    hours: 40,
    priceEgp: 4000,
    attendance: "أونلاين",
    summary: "تشغّل إعلانات ميتا وجوجل، وتظبط ظهور الموقع في البحث، وتقرأ النتائج على GA4.",
    audience: "مناسب لمن فهم أساسيات التسويق وعايز يجيب زيارات وعملاء.",
    outcomes: ["تطلق حملة ميتا", "تطلق حملة جوجل", "تعمل تدقيق SEO بسيط", "تقرأ النتائج على GA4"],
    modules: ["إعلانات ميتا", "إعلانات جوجل", "SEO للمبتدئ", "Google Analytics", "قياس الحملة", "مشروع حملة"],
  },
  {
    slug: "ecommerce-marketing",
    title: "تسويق المتاجر الإلكترونية",
    track: "marketing",
    hours: 20,
    priceEgp: 2900,
    attendance: "أونلاين",
    summary: "تسويق متجر: صفحات المنتج، العروض، والإعلانات اللي بتبيع، مع قياس الطلبات مش المشاهدات بس.",
    audience: "مناسب لصاحب متجر وللي بيخلّص مسار التسويق أو ووردبريس.",
    outcomes: ["تكتب صفحة منتج بتبيع", "تعمل عرض وحملة موسم", "تربط الإعلان بالطلب", "تسلّم خطة تسويق لمتجر"],
    modules: ["صفحة المنتج", "العروض والمواسم", "إعلانات المتجر", "البريد بعد الشراء", "قياس الطلبات", "خطة متجر"],
  },
];

export function courseBySlug(slug: string): Course | undefined {
  return courses.find((course) => course.slug === slug);
}

export function trackById(id: TrackId): Track {
  const found = tracks.find((track) => track.id === id);
  if (!found) {
    throw new Error(`Unknown track: ${id}`);
  }
  return found;
}

export function formatEgp(amount: number): string {
  return amount.toLocaleString("en-US");
}

export const steps = [
  {
    title: "اختار مسارك",
    text: "برمجة، تصميم، تسويق، ذكاء اصطناعي أو بيانات. مش عارف تبدأ منين؟ كل كورس ليه صفحة بتقولك مناسب لمين.",
  },
  {
    title: "شوف أول درس ببلاش",
    text: "أول درس في كل كورس مفتوح للجميع. شوف أسلوب الشرح قبل ما تدفع أي جنيه.",
  },
  {
    title: "ادفع وادخل الكورس",
    text: "بعد الدفع الكورس يتفتح لك جوه الموقع على طول، وتتعلم أونلاين أو في القاعة.",
  },
  {
    title: "خد شهادتك",
    text: "كمّل الدروس واعمل مشروعك، واستلم شهادة إتمام تحطها على البروفايل.",
  },
];

export const faqs = [
  {
    q: "أول درس ببلاش فعلًا؟",
    a: "أيوه. أول درس في كل كورس مجاني بالكامل ومن غير تسجيل بيانات كروت. شوفه وقرر.",
  },
  {
    q: "أتعلم أونلاين ولا في القاعة؟",
    a: "الاتنين. أغلب الكورسات بتتاح أونلاين، وبرضه في القاعة (حضوري) في الكورسات المكتوب عليها «أونلاين أو حضوري». اللي تختاره يناسبك.",
  },
  {
    q: "لو أنا مبتدئ تمامًا أقدر أبدأ؟",
    a: "أيوه. كل كورس مكتوب فيه المستوى المناسب. في برمجة وتصميم وتسويق مفيش خلفية مطلوبة.",
  },
  {
    q: "هلاقي الدروس بعد ما أخلص؟",
    a: "الدروس مسجلة وبتفضل متاحة ليك جوه حسابك، فتقدر ترجع لها وقت ما تحب.",
  },
  {
    q: "هاخد شهادة؟",
    a: "أيوه، شهادة إتمام بعد ما تكمل دروس الكورس وتسلّم المشروع النهائي.",
  },
  {
    q: "الدفع بيتم إزاي؟",
    a: "إنستا باي أو فودافون كاش على 01065344806. بعد مراجعة التحويل الكورس يتفتح في حسابك. الدفع بالبطاقة يتفتح لما حساب Paymob يبقى جاهز.",
  },
];

export const proofs = [
  { name: "Almaza Bay", file: "almaza-bay" },
  { name: "GO Bus", file: "go-bus" },
  { name: "Lychee", file: "lychee" },
  { name: "El Gouna", file: "el-gouna" },
  { name: "MG", file: "mg" },
  { name: "Sidekick", file: "sidekick" },
  { name: "Golimo", file: "golimo" },
  { name: "Naseej", file: "naseej" },
];
