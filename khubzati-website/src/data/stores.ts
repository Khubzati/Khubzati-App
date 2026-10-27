import { Language } from "@/i18n/types";

export type StoreCategory = "bakery" | "restaurant";

export type LocalizedText = {
  ar: string;
  en: string;
};

export type Store = {
  slug: string;
  name: LocalizedText;
  city?: LocalizedText;
  neighborhood?: LocalizedText;
  imageUrl?: string | null;
  category: StoreCategory;
  rating?: number;
  etaMinutes?: number;
  deliveryDays?: LocalizedText;
  openHours: LocalizedText;
  description: LocalizedText;
  specialties: LocalizedText[];
  gradient: string;
};

export const storeCategories: StoreCategory[] = ["bakery", "restaurant"];

export const localize = (value: LocalizedText, language: Language): string => value[language];
