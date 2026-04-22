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
      appRoutes: "مسارات التطبيق",
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
      cafe: "مقهى"
    },
    footer: {
      description: "ربط المخابز والمطاعم والمقاهي المحلية بمسارات توصيل أسرع وتجربة أفضل.",
      about: "عن خبزاتي",
      stores: "المتاجر",
      appRoutes: "مسارات التطبيق",
      partner: "شراكة"
    },
    home: {
      eyebrow: "موقع خبزاتي",
      title: "منصة واحدة لخبز الحي، ومتاجر الطعام، وتجربة طلب متكاملة.",
      description:
        "خبزاتي منصة تجارة محلية تربط المخابز والمطاعم والمقاهي بالعملاء عبر توجيه ذكي للطلبات وتجربة استخدام عالية الجودة.",
      exploreStores: "استكشف المتاجر",
      appMap: "عرض خريطة مسارات التطبيق",
      statOneLabel: "متوسط وقت توجيه الطلب إلى المتجر",
      statTwoLabel: "مستوى تقييم جودة المتاجر",
      statThreeLabel: "مدن جاهزة للتوسع التجريبي",
      whyEyebrow: "لماذا خبزاتي",
      whyTitle: "مصمم لخدمة العميل وتشغيل المتجر في نفس الوقت",
      whyDescription: "ليست مجرد قائمة طلبات. بل نظام تشغيل وتوصيل مبني على واقع تجهيز الخبز والوجبات الطازجة.",
      highlights: [
        "توجيه الطلبات حسب سرعة التحضير، المسافة، وتوقيت الفرن حتى يصل الخبز ساخنًا.",
        "لوحة تشغيل للمتجر تعطي رؤية أوضح للطلبات ونوافذ التحضير والطلبات المتكررة.",
        "تعزيز الثقة بين أهل الحي والمتاجر عبر التزام أوضح بالمواعيد وجودة الخدمة."
      ],
      topStoresEyebrow: "أفضل المتاجر",
      topStoresTitle: "شركاء جاهزون للتشغيل الرقمي",
      topStoresDescription: "نماذج متاجر يمكن لخبزاتي تشغيلها وتوجيه طلباتها بتجربة مميزة.",
      nextStepEyebrow: "الخطوة التالية",
      nextStepTitle: "إطلاق حضور ويب كامل لخبزاتي للعملاء والمتاجر.",
      nextStepDescription:
        "هذا المشروع يتضمن الهيكل الأساسي للموقع، ونظام التصميم، ومسارات المتاجر ليستمر فريقك نحو التكامل مع APIs والإطلاق الإنتاجي.",
      startOnboarding: "ابدأ انضمام المتاجر"
    },
    about: {
      title: "عن خبزاتي",
      whatEyebrow: "ما هو خبزاتي",
      whatTitle: "خبزاتي شبكة رقمية للخبز الطازج وطعام الأحياء",
      whatDescription: "الاسم مستوحى من ثقافة الخبز اليومي وعلاقة الناس بالمخبز المحلي.",
      whatParagraph:
        "خبزاتي يساعد العملاء على اكتشاف المتاجر الموثوقة، ويمنح المخابز والمطابخ تحكمًا أفضل في التوجيه والتشغيل اليومي.",
      principlesEyebrow: "مبادئ أساسية",
      principlesTitle: "مبني على واقع تشغيل المطابخ",
      principlesDescription: "واجهة ممتازة لا تعني الشكل فقط، بل تعني أيضًا وضوح التحضير، وثقة التوصيل، وتواصلًا واضحًا.",
      principles: [
        {
          title: "سوق محلي أولًا",
          text: "خبزاتي يعزز ظهور متاجر الأحياء بدل أن تضيع داخل قوائم توصيل عامة."
        },
        {
          title: "منطق توصيل يحافظ على السخونة",
          text: "المسارات تُبنى حسب وقت التجهيز وتوقيت الفرن، وهذا أساسي لجودة الخبز وثقة العميل."
        },
        {
          title: "تمكين المتجر",
          text: "المنصة تمنح المتجر تدفق طلبات أوضح، وتخطيط سعة أفضل، وهوية رقمية احترافية."
        }
      ],
      valueEyebrow: "القيمة",
      valueTitle: "ماذا يقدم خبزاتي",
      valueDescription: "للعميل: جودة أعلى وثبات بالتوصيل. للمتجر: نمو محلي قابل للتوسع.",
      valuePoints: [
        "اكتشاف أسرع للمتاجر حسب المدينة والتخصص",
        "توجيه أوضح للطلبات بين تطبيق العميل وتطبيق المتجر",
        "مسار انضمام واضح للمخابز والمقاهي",
        "هوية بصرية حديثة وقريبة من ثقافة الحي"
      ]
    },
    stores: {
      title: "استكشاف المتاجر",
      eyebrow: "توجيه المتاجر",
      pageTitle: "تصفح متاجر خبزاتي الشريكة",
      pageDescription: "ابحث بالاسم أو المدينة أو التخصص، وصنّف حسب نوع المتجر.",
      searchLabel: "ابحث عن متجر أو مدينة أو تخصص",
      searchPlaceholder: "مثال: صاج، عمّان، كرواسون",
      all: "الكل",
      noMatchTitle: "لا يوجد نتائج مطابقة",
      noMatchDescription: "جرّب إزالة الفلاتر أو البحث باسم مدينة مثل عمّان أو إربد أو العقبة.",
      viewStoreRoute: "عرض مسار المتجر",
      rating: "تقييم"
    },
    storeDetails: {
      notFoundTitle: "المتجر غير موجود",
      detailsTitle: "تفاصيل مسار المتجر",
      city: "المدينة",
      eta: "متوسط زمن التوصيل",
      openHours: "ساعات العمل",
      deliveryDays: "أيام التوصيل",
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
      pageDescription: "خبزاتي يفصل بين تجربة العميل وتجربة المتجر، مع مزامنة كاملة عبر منطق التوجيه.",
      customerTitle: "مسار تطبيق العميل",
      storeTitle: "مسار تطبيق المتجر",
      customerFlow: [
        "اكتشاف المتاجر القريبة حسب المدينة والتخصص",
        "اختيار المنتجات ووقت التوصيل المناسب",
        "استلام تحديثات التحضير والتوصيل لحظة بلحظة",
        "متابعة التسليم وتأكيد وصول الطلب ساخنًا"
      ],
      storeFlow: [
        "استلام الطلبات الموجهة حسب نافذة التحضير",
        "قبول الطلب أو تعديل السعة التشغيلية بسرعة",
        "تجهيز الدُفعات بمساعدة توقيت واضحة",
        "تسليم الطلب مع حالة تسليم دقيقة"
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
      pageTitle: "انضم إلى خبزاتي كمخبز أو مطعم أو مقهى",
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
      appRoutes: "App Routes",
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
      cafe: "Cafe"
    },
    footer: {
      description: "Routing local bakeries, restaurants, and cafes with smarter delivery flows and better UX.",
      about: "About",
      stores: "Stores",
      appRoutes: "App Routes",
      partner: "Partner"
    },
    home: {
      eyebrow: "Khubzati Website",
      title: "One platform for local bread, food stores, and delivery-ready journeys.",
      description:
        "Khubzati connects bakeries, restaurants, and cafes to customers through intelligent order routing and premium experience design.",
      exploreStores: "Explore Stores",
      appMap: "View App Route Map",
      statOneLabel: "Average order-to-store routing time",
      statTwoLabel: "Store quality rating baseline",
      statThreeLabel: "Cities ready for pilot expansion",
      whyEyebrow: "Why Khubzati",
      whyTitle: "Designed for customer experience and store operations together",
      whyDescription: "Not just an order list. It is an operating and delivery system built around real fresh-food prep.",
      highlights: [
        "Orders are routed by prep speed, distance, and oven timing so bread arrives warm.",
        "Store dashboards provide cleaner visibility for orders, prep waves, and repeat behavior.",
        "Neighborhood trust is strengthened with predictable timing and transparent service quality."
      ],
      topStoresEyebrow: "Top Stores",
      topStoresTitle: "Trusted partners ready for digital routing",
      topStoresDescription: "Preview the types of stores Khubzati can onboard and operate with premium UX.",
      nextStepEyebrow: "Next Step",
      nextStepTitle: "Launch Khubzati as a full customer + store web presence.",
      nextStepDescription:
        "This project includes a launch-ready website structure, design system, and store routing pages for future API integration.",
      startOnboarding: "Start Store Onboarding"
    },
    about: {
      title: "About Khubzati",
      whatEyebrow: "What is Khubzati",
      whatTitle: "Khubzati is a digital network for fresh bread and neighborhood food",
      whatDescription: "The name is inspired by daily bread culture and local food habits.",
      whatParagraph:
        "Khubzati helps customers discover trusted local stores while giving bakeries and kitchens better routing and operational control.",
      principlesEyebrow: "Core Principles",
      principlesTitle: "Built around real kitchen operations",
      principlesDescription: "Great UX is not just visual. It is also prep clarity, delivery confidence, and transparent communication.",
      principles: [
        {
          title: "Local-first marketplace",
          text: "Khubzati elevates neighborhood stores instead of burying them in generic delivery lists."
        },
        {
          title: "Warm-delivery logic",
          text: "Routes are designed around prep windows and oven timing to preserve food quality."
        },
        {
          title: "Store enablement",
          text: "The platform gives stores clearer order flow, demand planning, and premium digital identity."
        }
      ],
      valueEyebrow: "Value",
      valueTitle: "What Khubzati delivers",
      valueDescription: "For customers: better reliability. For stores: scalable local growth.",
      valuePoints: [
        "Faster store discovery by city and specialty",
        "Cleaner routing between customer app and store app",
        "Clear onboarding path for bakeries and cafes",
        "Modern local brand presence"
      ]
    },
    stores: {
      title: "Store Explorer",
      eyebrow: "Store Routing",
      pageTitle: "Browse Khubzati partner stores",
      pageDescription: "Filter by category and search by city, name, or specialty.",
      searchLabel: "Search store, city, or specialty",
      searchPlaceholder: "Try: Saj, Amman, Croissant",
      all: "All",
      noMatchTitle: "No stores match",
      noMatchDescription: "Try removing filters or searching with a city like Amman, Irbid, or Aqaba.",
      viewStoreRoute: "View Store Route",
      rating: "rating"
    },
    storeDetails: {
      notFoundTitle: "Store not found",
      detailsTitle: "Store route details",
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
      pageDescription: "Khubzati separates both experiences while synchronizing them through routing logic.",
      customerTitle: "Customer App Route",
      storeTitle: "Store App Route",
      customerFlow: [
        "Discover nearby stores by city and specialty",
        "Select items and preferred delivery timing",
        "Receive live prep and route updates",
        "Track handoff and confirm warm delivery"
      ],
      storeFlow: [
        "Receive routed orders grouped by prep windows",
        "Accept orders or adjust capacity quickly",
        "Prepare batches with clear timing guidance",
        "Dispatch with precise handoff visibility"
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
      pageTitle: "Join Khubzati as a bakery, restaurant, or cafe",
      pageDescription: "We help local stores launch faster with stronger digital visibility and smarter routing.",
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
