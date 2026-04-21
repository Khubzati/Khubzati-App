export type StoreCategory = "Bakery" | "Restaurant" | "Cafe";

export type Store = {
  slug: string;
  name: string;
  city: string;
  neighborhood: string;
  category: StoreCategory;
  rating: number;
  etaMinutes: number;
  deliveryDays: string;
  openHours: string;
  description: string;
  specialties: string[];
  gradient: string;
};

export const stores: Store[] = [
  {
    slug: "saj-al-balad",
    name: "Saj Al Balad",
    city: "Amman",
    neighborhood: "Jabal Amman",
    category: "Bakery",
    rating: 4.9,
    etaMinutes: 28,
    deliveryDays: "Sat - Thu",
    openHours: "06:00 - 22:00",
    description:
      "Family-run bakery known for daily saj bread, thyme mixes, and neighborhood breakfast bundles.",
    specialties: ["Saj Bread", "Zaatar Mix", "Village Labneh"],
    gradient: "linear-gradient(135deg, #ffd08a 0%, #f49657 100%)"
  },
  {
    slug: "forn-al-ward",
    name: "Forn Al Ward",
    city: "Irbid",
    neighborhood: "University District",
    category: "Bakery",
    rating: 4.7,
    etaMinutes: 35,
    deliveryDays: "Daily",
    openHours: "07:00 - 23:00",
    description:
      "Warm artisan breads and mini manaqeesh trays that stay crisp during delivery.",
    specialties: ["Cheese Manaqeesh", "Olive Bread", "Date Cookies"],
    gradient: "linear-gradient(135deg, #fbe5a3 0%, #efb86b 100%)"
  },
  {
    slug: "beit-al-taboon",
    name: "Beit Al Taboon",
    city: "Zarqa",
    neighborhood: "New Zarqa",
    category: "Restaurant",
    rating: 4.8,
    etaMinutes: 32,
    deliveryDays: "Daily",
    openHours: "09:00 - 00:00",
    description:
      "Taboon-focused kitchen with rotating daily meals and fresh oven bread add-ons.",
    specialties: ["Chicken Musakhan", "Taboon Loaf", "Seasonal Soup"],
    gradient: "linear-gradient(135deg, #f4ba8f 0%, #de7f52 100%)"
  },
  {
    slug: "qahwet-khubzati",
    name: "Qahwet Khubzati",
    city: "Amman",
    neighborhood: "Sweifieh",
    category: "Cafe",
    rating: 4.6,
    etaMinutes: 24,
    deliveryDays: "Daily",
    openHours: "08:00 - 01:00",
    description:
      "Coffee, warm pastries, and quick breakfast packs designed for office mornings.",
    specialties: ["Cardamom Latte", "Croissant Box", "Mini Kaak"],
    gradient: "linear-gradient(135deg, #f7d3be 0%, #cb8b67 100%)"
  },
  {
    slug: "stone-oven-188",
    name: "Stone Oven 188",
    city: "Salt",
    neighborhood: "Old Downtown",
    category: "Bakery",
    rating: 4.8,
    etaMinutes: 40,
    deliveryDays: "Sat - Thu",
    openHours: "05:30 - 20:00",
    description:
      "Traditional stone oven bakery preserving old recipes with precise batch scheduling.",
    specialties: ["Village Bread", "Sesame Rings", "Harissa Bun"],
    gradient: "linear-gradient(135deg, #f8d9a5 0%, #d9a25f 100%)"
  },
  {
    slug: "mashroub-w-furn",
    name: "Mashroub w Furn",
    city: "Aqaba",
    neighborhood: "Marina Quarter",
    category: "Cafe",
    rating: 4.5,
    etaMinutes: 26,
    deliveryDays: "Daily",
    openHours: "08:00 - 23:30",
    description:
      "Seaside cafe pairing light drinks with baked bites and pre-order bundles.",
    specialties: ["Cold Brew", "Sea Salt Brownie", "Falafel Wrap"],
    gradient: "linear-gradient(135deg, #b8dddf 0%, #6fb3b8 100%)"
  }
];

export const storeCategories: StoreCategory[] = ["Bakery", "Restaurant", "Cafe"];

export const getStoreBySlug = (slug: string): Store | undefined =>
  stores.find((store) => store.slug === slug);
