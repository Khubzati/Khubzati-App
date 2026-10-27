import { StoreCategory } from "@/data/stores";

type TranslationShape = {
  nav: {
    home: string;
    about: string;
    stores: string;
    appRoutes: string;
    partner: string;
    brandSubtitle: string;
  };
  language: {
    ar: string;
    en: string;
    switchLabel: string;
  };
  categories: Record<StoreCategory, string>;
  footer: {
    description: string;
    about: string;
    stores: string;
    appRoutes: string;
    partner: string;
  };
  home: {
    eyebrow: string;
    title: string;
    description: string;
    exploreStores: string;
    appMap: string;
    statOneLabel: string;
    statTwoLabel: string;
    statThreeLabel: string;
    whyEyebrow: string;
    whyTitle: string;
    whyDescription: string;
    highlights: string[];
    topStoresEyebrow: string;
    topStoresTitle: string;
    topStoresDescription: string;
    nextStepEyebrow: string;
    nextStepTitle: string;
    nextStepDescription: string;
    startOnboarding: string;
  };
  about: {
    title: string;
    whatEyebrow: string;
    whatTitle: string;
    whatDescription: string;
    whatParagraph: string;
    principlesEyebrow: string;
    principlesTitle: string;
    principlesDescription: string;
    principles: { title: string; text: string }[];
    valueEyebrow: string;
    valueTitle: string;
    valueDescription: string;
    valuePoints: string[];
  };
  stores: {
    title: string;
    eyebrow: string;
    pageTitle: string;
    pageDescription: string;
    searchLabel: string;
    searchPlaceholder: string;
    all: string;
    noMatchTitle: string;
    noMatchDescription: string;
    viewStoreRoute: string;
    rating: string;
  };
  storeDetails: {
    notFoundTitle: string;
    detailsTitle: string;
    city: string;
    eta: string;
    openHours: string;
    deliveryDays: string;
    customerRating: string;
    specialties: string;
    backToStores: string;
    partner: string;
    minutes: string;
  };
  appRoutes: {
    title: string;
    eyebrow: string;
    pageTitle: string;
    pageDescription: string;
    customerTitle: string;
    storeTitle: string;
    customerFlow: string[];
    storeFlow: string[];
    supportTitle: string;
    supportPoints: string[];
    openStores: string;
    startOnboarding: string;
  };
  contact: {
    title: string;
    eyebrow: string;
    pageTitle: string;
    pageDescription: string;
    teamTitle: string;
    teamDescription: string;
    salesLine: string;
    viewExamples: string;
    prepareTitle: string;
    preparePoints: string[];
  };
  notFound: {
    title: string;
    description: string;
    goStores: string;
  };
};

export const translations: Record<"ar" | "en", TranslationShape> = {
  ar: {
    nav: {
      home: "الرئيسية",
      about: "عن خبزاتي",
      stores: "المتاجر",
      appRoutes: "كيف يعمل خبزاتي",
      partner: "شراكة",
      brandSubtitle: "شبكة الخبز المحلي"
    },
    language: {
      ar: "عربي",
      en: "English",
      switchLabel: "تغيير اللغة"
    },
    categories: {
      bakery: "مخبز",
      restaurant: "مطعم",
    },
    footer: {
      description: "اكتشف المخابز والمطاعم المحلية وتعرّف على المتاجر المتاحة على خبزاتي.",
      about: "عن خبزاتي",
      stores: "المتاجر",
      appRoutes: "مسارات التطبيق",
      partner: "شراكة"
    },
    home: {
      eyebrow: "خبزاتي · طازج من حارتك",
      title: "خبز الحارة الطازج، أقرب إليك من أي وقت.",
      description:
        "خبزاتي تساعدك على اكتشاف المخابز والمطاعم المحلية والتعرّف على المتاجر المتاحة.",
      exploreStores: "استكشف المتاجر",
      appMap: "انضم كشريك",
      statOneLabel: "متوسط وقت توجيه الطلب إلى المتجر",
      statTwoLabel: "مستوى تقييم جودة المتاجر",
      statThreeLabel: "مدن جاهزة للتوسع التجريبي",
      whyEyebrow: "لماذا خبزاتي",
      whyTitle: "مصمم لخدمة العميل وتشغيل المتجر في نفس الوقت",
      whyDescription: "تجربة تساعد العملاء على اكتشاف المتاجر المحلية وتساعد المتاجر على تقديم معلوماتها بوضوح.",
      highlights: [
        "اكتشاف المخابز والمطاعم المنشورة ضمن دليل واحد.",
        "صفحة متجر تعرض المعلومات المتوفرة من بيانات الشريك.",
        "مسار تواصل مباشر للمتاجر الراغبة بالاستفسار عن الشراكة."
      ],
      topStoresEyebrow: "أفضل المتاجر",
      topStoresTitle: "متاجر متاحة على خبزاتي",
      topStoresDescription: "المتاجر المعروضة تُحمّل من بيانات المنصة مباشرة.",
      nextStepEyebrow: "الخطوة التالية",
      nextStepTitle: "هل تدير مخبزًا أو مطعمًا محليًا؟",
      nextStepDescription: "تواصل مع فريق خبزاتي للاستفسار عن خطوات الشراكة المتاحة حاليًا.",
      startOnboarding: "ابدأ انضمام المتاجر"
    },
    about: {
      title: "عن خبزاتي",
      whatEyebrow: "ما هو خبزاتي",
      whatTitle: "خبزاتي شبكة رقمية للخبز الطازج وطعام الأحياء",
      whatDescription: "منصة محلية تساعد الناس على اكتشاف المخابز والمطاعم والتعرّف عليها.",
      whatParagraph:
        "خبزاتي يجمع اكتشاف المتاجر المحلية ومعلوماتها، ويربط حضورها الرقمي بمسارات التطبيق المتاحة للعملاء والشركاء.",
      principlesEyebrow: "مبادئ أساسية",
      principlesTitle: "مبني على واقع تشغيل المطابخ",
      principlesDescription: "نركز على اكتشاف بسيط، ومعلومات واضحة، ومسار تواصل مباشر للمتاجر.",
      principles: [
        {
          title: "سوق محلي أولًا",
          text: "خبزاتي يعزز ظهور متاجر الأحياء بدل أن تضيع داخل قوائم توصيل عامة."
        },
        {
          title: "اكتشاف محلي",
          text: "مساحة واضحة للمخابز والمطاعم المحلية كي تظهر أمام العملاء الباحثين عن خيارات قريبة."
        },
        {
          title: "تمكين المتجر",
          text: "تمنح صفحة المتجر الشريك حضورًا واضحًا ضمن دليل خبزاتي."
        }
      ],
      valueEyebrow: "القيمة",
      valueTitle: "ماذا يقدم خبزاتي",
      valueDescription: "للعميل: اكتشاف أسهل. وللمتجر: حضور رقمي ومسار تواصل واضح.",
      valuePoints: [
        "اكتشاف أسرع للمتاجر حسب المدينة والتخصص",
        "معلومات متجر واضحة عندما تكون متاحة",
        "مسار انضمام واضح للمخابز والمطاعم",
        "هوية بصرية حديثة وقريبة من ثقافة الحي"
      ]
    },
    stores: {
      title: "استكشاف المتاجر",
      eyebrow: "توجيه المتاجر",
      pageTitle: "تصفح المخابز والمطاعم المتاحة",
      pageDescription: "ابحث بالاسم أو المدينة أو التخصص، وصنّف حسب نوع المتجر.",
      searchLabel: "ابحث عن متجر أو مدينة أو تخصص",
      searchPlaceholder: "مثال: صاج، عمّان، كرواسون",
      all: "الكل",
      noMatchTitle: "لا يوجد نتائج مطابقة",
      noMatchDescription: "جرّب إزالة الفلاتر أو استخدم اسمًا أو مدينة أخرى.",
      viewStoreRoute: "عرض تفاصيل المتجر",
      rating: "تقييم"
    },
    storeDetails: {
      notFoundTitle: "المتجر غير موجود",
      detailsTitle: "معلومات المتجر",
      city: "المدينة",
      eta: "وقت الطلب المتوقع",
      openHours: "ساعات العمل",
      deliveryDays: "أيام التوفر",
      customerRating: "تقييم العملاء",
      specialties: "التخصصات",
      backToStores: "العودة للمتاجر",
      partner: "انضم كشريك مع خبزاتي",
      minutes: "دقيقة"
    },
    appRoutes: {
      title: "مسارات التطبيق",
      eyebrow: "هيكل التوجيه",
      pageTitle: "تطبيق العميل وتطبيق المتجر ضمن نظام واحد",
      pageDescription: "تعرف على رحلة استكشاف المتاجر وتجربة العميل والمتجر عبر تطبيق خبزاتي.",
      customerTitle: "مسار تطبيق العميل",
      storeTitle: "مسار تطبيق المتجر",
      customerFlow: [
        "اكتشاف المتاجر القريبة حسب المدينة والتخصص",
        "اختيار المنتجات ووقت التوصيل المناسب",
        "مراجعة تفاصيل المتجر وخياراته المتاحة",
        "إتمام الطلب عبر التطبيق عند توفر الخدمة"
      ],
      storeFlow: [
        "استلام الطلبات الموجهة حسب نافذة التحضير",
        "قبول الطلب أو تعديل السعة التشغيلية بسرعة",
        "متابعة الطلبات وفق الأدوات المتاحة في التطبيق",
        "تجهيز الطلب وتسليمه وفق إجراءات المتجر"
      ],
      supportTitle: "كيف يخدم الموقع كلا التطبيقين",
      supportPoints: [
        "يشرح خبزاتي بوضوح للمستخدمين والشركاء",
        "يوفر صفحات متاجر قابلة للاكتشاف مع معلومات توجيه واضحة",
        "يفتح مسار انضمام مباشر للمتاجر الجديدة",
        "يبني أساس علامة تجارية جاهزة للنمو"
      ],
      openStores: "فتح المتاجر",
      startOnboarding: "ابدأ الانضمام"
    },
    contact: {
      title: "شراكة مع خبزاتي",
      eyebrow: "انضمام المتاجر",
      pageTitle: "انضم إلى خبزاتي كمخبز أو مطعم",
      pageDescription: "نساعد المتاجر المحلية على انطلاقة أسرع بظهور رقمي أقوى وتوجيه طلبات أذكى.",
      teamTitle: "فريق الشراكات",
      teamDescription: "شارك بيانات متجرك وسنتواصل معك بخطة الانضمام.",
      salesLine: "خط المبيعات",
      viewExamples: "عرض أمثلة المتاجر",
      prepareTitle: "ما الذي تحتاج تحضيره",
      preparePoints: [
        "هوية المتجر ومناطق التغطية",
        "تصنيفات القائمة وأهم المنتجات",
        "ساعات العمل اليومية وسعة التحضير",
        "الجدول الزمني المفضل للإطلاق"
      ]
    },
    notFound: {
      title: "الصفحة غير موجودة",
      description: "هذا المسار غير متاح حاليًا. يمكنك المتابعة من صفحة المتاجر.",
      goStores: "الذهاب إلى المتاجر"
    }
  },
  en: {
    nav: {
      home: "Home",
      about: "About Khubzati",
      stores: "Stores",
      appRoutes: "How it works",
      partner: "Partner",
      brandSubtitle: "Local Bread Network"
    },
    language: {
      ar: "Arabic",
      en: "English",
      switchLabel: "Change language"
    },
    categories: {
      bakery: "Bakery",
      restaurant: "Restaurant",
    },
    footer: {
      description: "Discover local bakeries and restaurants listed on Khubzati.",
      about: "About",
      stores: "Stores",
      appRoutes: "App Routes",
      partner: "Partner"
    },
    home: {
      eyebrow: "Khubzati · Fresh from your neighborhood",
      title: "Fresh from your neighborhood. Made for your moments.",
      description:
        "Khubzati brings your neighborhood's best bakeries, restaurants, and cafés together in one place — discover them, order, and enjoy it fresh.",
      exploreStores: "Explore Stores",
      appMap: "Become a Partner",
      statOneLabel: "Average order-to-store routing time",
      statTwoLabel: "Store quality rating baseline",
      statThreeLabel: "Cities ready for pilot expansion",
      whyEyebrow: "Why Khubzati",
      whyTitle: "Designed for customer experience and store operations together",
      whyDescription: "An experience that helps customers discover local businesses and helps stores present clear details.",
      highlights: [
        "Discover listed bakeries and restaurants in one directory.",
        "Store pages present information supplied through partner data.",
        "A direct contact path for businesses interested in joining."
      ],
      topStoresEyebrow: "Top Stores",
      topStoresTitle: "Stores available on Khubzati",
      topStoresDescription: "Listed businesses are loaded directly from platform data.",
      nextStepEyebrow: "Next Step",
      nextStepTitle: "Run a local bakery or restaurant?",
      nextStepDescription: "Contact the Khubzati team to ask about the partnership steps currently available.",
      startOnboarding: "Start Store Onboarding"
    },
    about: {
      title: "About Khubzati",
      whatEyebrow: "What is Khubzati",
      whatTitle: "Khubzati is a digital network for fresh bread and neighborhood food",
      whatDescription: "A local platform that helps people discover bakeries and restaurants.",
      whatParagraph:
        "Khubzati brings local store discovery and business details together, connected to the app journeys available to customers and partners.",
      principlesEyebrow: "Core Principles",
      principlesTitle: "Built around real kitchen operations",
      principlesDescription: "We focus on simple discovery, clear information, and a direct contact path for local businesses.",
      principles: [
        {
          title: "Local-first marketplace",
          text: "Khubzati elevates neighborhood stores instead of burying them in generic delivery lists."
        },
        {
          title: "Local discovery",
          text: "A clear place for neighborhood bakeries and restaurants to be found by nearby customers."
        },
        {
          title: "Store enablement",
          text: "A store page gives partners a clear presence in the Khubzati directory."
        }
      ],
      valueEyebrow: "Value",
      valueTitle: "What Khubzati delivers",
      valueDescription: "For customers: easier discovery. For stores: a digital presence and a clear way to get in touch.",
      valuePoints: [
        "Faster store discovery by city and specialty",
        "Clear store details when available",
        "Clear onboarding path for bakeries and restaurants",
        "Modern local brand presence"
      ]
    },
    stores: {
      title: "Store Explorer",
      eyebrow: "Store Routing",
      pageTitle: "Browse available bakeries and restaurants",
      pageDescription: "Browse bakeries and restaurants currently listed on Khubzati.",
      searchLabel: "Search store, city, or specialty",
      searchPlaceholder: "Try: Saj, Amman, Croissant",
      all: "All",
      noMatchTitle: "No stores match",
      noMatchDescription: "Try removing a filter or searching for another name or city.",
      viewStoreRoute: "View store details",
      rating: "rating"
    },
    storeDetails: {
      notFoundTitle: "Store not found",
      detailsTitle: "Store information",
      city: "City",
      eta: "Average ETA",
      openHours: "Open Hours",
      deliveryDays: "Delivery Days",
      customerRating: "Customer Rating",
      specialties: "Specialties",
      backToStores: "Back to Stores",
      partner: "Partner with Khubzati",
      minutes: "minutes"
    },
    appRoutes: {
      title: "App Route Map",
      eyebrow: "Routing Architecture",
      pageTitle: "Customer app and store app working as one system",
      pageDescription: "Explore the customer and store journeys through Khubzati’s apps.",
      customerTitle: "Customer App Route",
      storeTitle: "Store App Route",
      customerFlow: [
        "Discover nearby stores by city and specialty",
        "Select items and preferred delivery timing",
        "Review store details and available options",
        "Place an order through the app when service is available"
      ],
      storeFlow: [
        "Receive routed orders grouped by prep windows",
        "Accept orders or adjust capacity quickly",
        "Manage orders through the tools available in the app",
        "Prepare and hand off orders through the store’s process"
      ],
      supportTitle: "How this website supports both apps",
      supportPoints: [
        "Explains Khubzati clearly for users and partners",
        "Provides discoverable store pages with route details",
        "Creates a direct onboarding path for new stores",
        "Builds launch-ready brand foundation"
      ],
      openStores: "Open Stores",
      startOnboarding: "Start Onboarding"
    },
    contact: {
      title: "Partner With Khubzati",
      eyebrow: "Store Onboarding",
      pageTitle: "Join Khubzati as a bakery or restaurant",
      pageDescription: "Contact Khubzati to ask about joining as a local bakery or restaurant.",
      teamTitle: "Partnership Team",
      teamDescription: "Share your store profile and we will contact you with onboarding steps.",
      salesLine: "Sales line",
      viewExamples: "View Live Store Examples",
      prepareTitle: "What to prepare",
      preparePoints: [
        "Store identity and coverage areas",
        "Menu categories and top products",
        "Daily open hours and prep capacity",
        "Preferred launch timeline"
      ]
    },
    notFound: {
      title: "Page not found",
      description: "This route does not exist yet. You can continue from the store explorer.",
      goStores: "Go to Stores"
    }
  }
};
