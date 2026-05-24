import { Language } from "@/i18n/types";

export type StoreCategory = "bakery" | "restaurant" | "cafe";

export type LocalizedText = {
  ar: string;
  en: string;
};

export type Store = {
  slug: string;
  name: LocalizedText;
  city: LocalizedText;
  neighborhood: LocalizedText;
  imageUrl?: string | null;
  category: StoreCategory;
  rating: number;
  etaMinutes: number;
  deliveryDays: LocalizedText;
  openHours: LocalizedText;
  description: LocalizedText;
  specialties: LocalizedText[];
  gradient: string;
};

export const stores: Store[] = [
  {
    slug: "saj-al-balad",
    name: { ar: "صاج البلد", en: "Saj Al Balad" },
    city: { ar: "عمّان", en: "Amman" },
    neighborhood: { ar: "جبل عمّان", en: "Jabal Amman" },
    category: "bakery",
    rating: 4.9,
    etaMinutes: 28,
    deliveryDays: { ar: "السبت - الخميس", en: "Sat - Thu" },
    openHours: { ar: "06:00 - 22:00", en: "06:00 - 22:00" },
    description: {
      ar: "مخبز عائلي معروف بخبز الصاج اليومي وخلطات الزعتر وباقات فطور الحي.",
      en: "Family-run bakery known for daily saj bread, thyme mixes, and neighborhood breakfast bundles."
    },
    specialties: [
      { ar: "خبز صاج", en: "Saj Bread" },
      { ar: "خلطة زعتر", en: "Zaatar Mix" },
      { ar: "لبنة بلدية", en: "Village Labneh" }
    ],
    gradient: "linear-gradient(135deg, #ffd08a 0%, #f49657 100%)"
  },
  {
    slug: "forn-al-ward",
    name: { ar: "فرن الورد", en: "Forn Al Ward" },
    city: { ar: "إربد", en: "Irbid" },
    neighborhood: { ar: "حي الجامعة", en: "University District" },
    category: "bakery",
    rating: 4.7,
    etaMinutes: 35,
    deliveryDays: { ar: "يوميًا", en: "Daily" },
    openHours: { ar: "07:00 - 23:00", en: "07:00 - 23:00" },
    description: {
      ar: "مخبوزات حرفية ومناقيش صغيرة تبقى مقرمشة حتى مع التوصيل.",
      en: "Warm artisan breads and mini manaqeesh trays that stay crisp during delivery."
    },
    specialties: [
      { ar: "مناقيش جبنة", en: "Cheese Manaqeesh" },
      { ar: "خبز زيتون", en: "Olive Bread" },
      { ar: "كوكيز تمر", en: "Date Cookies" }
    ],
    gradient: "linear-gradient(135deg, #fbe5a3 0%, #efb86b 100%)"
  },
  {
    slug: "beit-al-taboon",
    name: { ar: "بيت الطابون", en: "Beit Al Taboon" },
    city: { ar: "الزرقاء", en: "Zarqa" },
    neighborhood: { ar: "الزرقاء الجديدة", en: "New Zarqa" },
    category: "restaurant",
    rating: 4.8,
    etaMinutes: 32,
    deliveryDays: { ar: "يوميًا", en: "Daily" },
    openHours: { ar: "09:00 - 00:00", en: "09:00 - 00:00" },
    description: {
      ar: "مطعم يركز على أطباق الطابون مع وجبات يومية وإضافات خبز طازج.",
      en: "Taboon-focused kitchen with rotating daily meals and fresh oven bread add-ons."
    },
    specialties: [
      { ar: "مسخن دجاج", en: "Chicken Musakhan" },
      { ar: "رغيف طابون", en: "Taboon Loaf" },
      { ar: "شوربة موسمية", en: "Seasonal Soup" }
    ],
    gradient: "linear-gradient(135deg, #f4ba8f 0%, #de7f52 100%)"
  },
  {
    slug: "qahwet-khubzati",
    name: { ar: "قهوة خبزاتي", en: "Qahwet Khubzati" },
    city: { ar: "عمّان", en: "Amman" },
    neighborhood: { ar: "الصويفية", en: "Sweifieh" },
    category: "cafe",
    rating: 4.6,
    etaMinutes: 24,
    deliveryDays: { ar: "يوميًا", en: "Daily" },
    openHours: { ar: "08:00 - 01:00", en: "08:00 - 01:00" },
    description: {
      ar: "قهوة ومعجنات دافئة وباقات فطور سريعة مناسبة للدوام الصباحي.",
      en: "Coffee, warm pastries, and quick breakfast packs designed for office mornings."
    },
    specialties: [
      { ar: "لاتيه هيل", en: "Cardamom Latte" },
      { ar: "علبة كرواسون", en: "Croissant Box" },
      { ar: "كعك صغير", en: "Mini Kaak" }
    ],
    gradient: "linear-gradient(135deg, #f7d3be 0%, #cb8b67 100%)"
  },
  {
    slug: "stone-oven-188",
    name: { ar: "فرن الحجر 188", en: "Stone Oven 188" },
    city: { ar: "السلط", en: "Salt" },
    neighborhood: { ar: "البلد القديم", en: "Old Downtown" },
    category: "bakery",
    rating: 4.8,
    etaMinutes: 40,
    deliveryDays: { ar: "السبت - الخميس", en: "Sat - Thu" },
    openHours: { ar: "05:30 - 20:00", en: "05:30 - 20:00" },
    description: {
      ar: "مخبز تقليدي على الفرن الحجري يحافظ على الوصفات القديمة بدقة تشغيل عالية.",
      en: "Traditional stone oven bakery preserving old recipes with precise batch scheduling."
    },
    specialties: [
      { ar: "خبز بلدي", en: "Village Bread" },
      { ar: "كعك سمسم", en: "Sesame Rings" },
      { ar: "خبز هريسة", en: "Harissa Bun" }
    ],
    gradient: "linear-gradient(135deg, #f8d9a5 0%, #d9a25f 100%)"
  },
  {
    slug: "mashroub-w-furn",
    name: { ar: "مشروب وفرن", en: "Mashroub w Furn" },
    city: { ar: "العقبة", en: "Aqaba" },
    neighborhood: { ar: "حي المارينا", en: "Marina Quarter" },
    category: "cafe",
    rating: 4.5,
    etaMinutes: 26,
    deliveryDays: { ar: "يوميًا", en: "Daily" },
    openHours: { ar: "08:00 - 23:30", en: "08:00 - 23:30" },
    description: {
      ar: "مقهى قريب من البحر يقدم مشروبات خفيفة مع مخبوزات جاهزة للطلب المسبق.",
      en: "Seaside cafe pairing light drinks with baked bites and pre-order bundles."
    },
    specialties: [
      { ar: "كولد برو", en: "Cold Brew" },
      { ar: "براوني ملح البحر", en: "Sea Salt Brownie" },
      { ar: "راب فلافل", en: "Falafel Wrap" }
    ],
    gradient: "linear-gradient(135deg, #b8dddf 0%, #6fb3b8 100%)"
  }
];

export const storeCategories: StoreCategory[] = ["bakery", "restaurant", "cafe"];

export const getStoreBySlug = (slug: string): Store | undefined =>
  stores.find((store) => store.slug === slug);

export const localize = (value: LocalizedText, language: Language): string => value[language];
