import { API_BASE_URL } from "@/lib/api";
import { LocalizedText, Store } from "@/data/stores";

type StoreVendorType = "bakery" | "restaurant";

type BakeryApi = {
  id: string;
  name: string;
  description?: string | null;
  logoUrl?: string | null;
  coverImageUrl?: string | null;
  imageUrl?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  operatingHours?: unknown;
  averageRating?: number | null;
};

type RestaurantApi = {
  id: string;
  name: string;
  description?: string | null;
  logoUrl?: string | null;
  coverImageUrl?: string | null;
  imageUrl?: string | null;
  cuisineType?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  operatingHours?: unknown;
  averageRating?: number | null;
};

type ProductApi = {
  name?: string | null;
};

type BakeryListResponse = {
  data?: {
    bakeries?: BakeryApi[];
  };
};

type RestaurantListResponse = {
  data?: {
    restaurants?: RestaurantApi[];
  };
};

type BakeryDetailsResponse = {
  data?: {
    bakery?: BakeryApi;
  };
};

type RestaurantDetailsResponse = {
  data?: {
    restaurant?: RestaurantApi;
  };
};

type ProductsResponse = {
  data?: {
    products?: ProductApi[];
  };
};

const STORE_SLUG_SEPARATOR = "--";
const OPEN_HOURS_FALLBACK: LocalizedText = { ar: "غير متوفرة", en: "Not provided" };
const API_ORIGIN = (() => {
  try {
    return new URL(API_BASE_URL).origin;
  } catch {
    return "";
  }
})();

const STORE_GRADIENTS = {
  bakery: [
    "linear-gradient(135deg, #ffd08a 0%, #f49657 100%)",
    "linear-gradient(135deg, #fbe5a3 0%, #efb86b 100%)",
    "linear-gradient(135deg, #f8d9a5 0%, #d9a25f 100%)",
  ],
  restaurant: [
    "linear-gradient(135deg, #f4ba8f 0%, #de7f52 100%)",
    "linear-gradient(135deg, #edc49b 0%, #c68a5a 100%)",
    "linear-gradient(135deg, #e9b08e 0%, #b86e43 100%)",
  ],
};

function toLocalizedText(value: string | null | undefined, fallback: LocalizedText): LocalizedText {
  const normalized = value?.trim();
  if (!normalized) return fallback;
  return { ar: normalized, en: normalized };
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function buildStoreSlug(name: string, vendorType: StoreVendorType, id: string): string {
  const safeName = slugify(name) || vendorType;
  return `${safeName}${STORE_SLUG_SEPARATOR}${vendorType}${STORE_SLUG_SEPARATOR}${id}`;
}

function parseStoreSlug(slug: string | null | undefined): { vendorType: StoreVendorType; id: string } | null {
  if (typeof slug !== "string" || !slug.trim()) return null;
  const parts = slug.split(STORE_SLUG_SEPARATOR);
  if (parts.length < 3) return null;

  const id = parts.at(-1) ?? "";
  const vendorType = parts.at(-2);
  if (!id || (vendorType !== "bakery" && vendorType !== "restaurant")) {
    return null;
  }

  return { vendorType, id };
}

function parseOperatingHoursText(value: unknown): string {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (Array.isArray(value) && value.length > 0) return String(value[0]);
  if (value && typeof value === "object") {
    const text = Object.values(value as Record<string, unknown>)
      .map((entry) => String(entry ?? "").trim())
      .filter(Boolean)
      .join(" | ");
    if (text) return text;
  }
  return OPEN_HOURS_FALLBACK.en;
}

function asOptionalNumber(value: unknown): number | undefined {
  const numericValue = typeof value === "number" ? value : Number(value);
  return Number.isFinite(numericValue) && numericValue > 0 ? numericValue : undefined;
}

function normalizeVendorImageUrl(value: string | null | undefined): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  if (/^https?:\/\//i.test(trimmed)) return encodeURI(trimmed);
  if (!API_ORIGIN) return null;
  if (trimmed.startsWith("/")) return encodeURI(`${API_ORIGIN}${trimmed}`);

  return encodeURI(`${API_ORIGIN}/${trimmed.replace(/^\/+/, "")}`);
}

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    next: { revalidate: 300 },
  });

  const data = (await response.json().catch(() => null)) as T | null;
  if (!response.ok || data == null) {
    throw new Error(`Request failed: ${path}`);
  }

  return data;
}

function toBakeryStore(bakery: BakeryApi, index: number): Store {
  const city = bakery.city ? toLocalizedText(bakery.city, { ar: "", en: "" }) : undefined;
  const address = bakery.addressLine1 || bakery.addressLine2;
  const neighborhood = address ? toLocalizedText(address, { ar: "", en: "" }) : undefined;

  return {
    slug: buildStoreSlug(bakery.name, "bakery", bakery.id),
    name: toLocalizedText(bakery.name, { ar: "مخبز", en: "Bakery" }),
    city,
    neighborhood,
    imageUrl: normalizeVendorImageUrl(bakery.logoUrl || bakery.imageUrl || bakery.coverImageUrl),
    category: "bakery",
    rating: asOptionalNumber(bakery.averageRating),
    openHours: toLocalizedText(parseOperatingHoursText(bakery.operatingHours), OPEN_HOURS_FALLBACK),
    description: toLocalizedText(bakery.description, {
      ar: "تصفح المنتجات المدرجة لهذا المخبز.",
      en: "Browse products listed by this bakery.",
    }),
    specialties: [],
    gradient: STORE_GRADIENTS.bakery[index % STORE_GRADIENTS.bakery.length],
  };
}

function toRestaurantStore(restaurant: RestaurantApi, index: number): Store {
  const city = restaurant.city ? toLocalizedText(restaurant.city, { ar: "", en: "" }) : undefined;
  const address = restaurant.addressLine1 || restaurant.addressLine2;
  const neighborhood = address ? toLocalizedText(address, { ar: "", en: "" }) : undefined;
  const cuisine = restaurant.cuisineType?.trim();

  return {
    slug: buildStoreSlug(restaurant.name, "restaurant", restaurant.id),
    name: toLocalizedText(restaurant.name, { ar: "مطعم", en: "Restaurant" }),
    city,
    neighborhood,
    imageUrl: normalizeVendorImageUrl(restaurant.logoUrl || restaurant.imageUrl || restaurant.coverImageUrl),
    category: "restaurant",
    rating: asOptionalNumber(restaurant.averageRating),
    openHours: toLocalizedText(parseOperatingHoursText(restaurant.operatingHours), OPEN_HOURS_FALLBACK),
    description: toLocalizedText(restaurant.description, {
      ar: "تصفح المنتجات المدرجة لهذا المطعم.",
      en: "Browse products listed by this restaurant.",
    }),
    specialties: cuisine
      ? [toLocalizedText(cuisine, { ar: "قائمة يومية", en: "Daily Menu" })]
      : [],
    gradient: STORE_GRADIENTS.restaurant[index % STORE_GRADIENTS.restaurant.length],
  };
}

function applySpecialties(store: Store, products: ProductApi[] | undefined): Store {
  const names = (products ?? [])
    .map((product) => product.name?.trim())
    .filter((name): name is string => Boolean(name))
    .slice(0, 5);

  if (!names.length) return store;

  return {
    ...store,
    specialties: names.map((name) => ({ ar: name, en: name })),
  };
}

export async function fetchStores(): Promise<Store[]> {
    const [bakeryResult, restaurantResult] = await Promise.allSettled([
      fetchJson<BakeryListResponse>("/bakeries?limit=100"),
      fetchJson<RestaurantListResponse>("/restaurants?limit=100"),
    ]);

    if (bakeryResult.status === "rejected" && restaurantResult.status === "rejected") {
      throw new Error("Store directory is unavailable");
    }

    const bakeries =
      bakeryResult.status === "fulfilled"
        ? (bakeryResult.value.data?.bakeries ?? []).map(toBakeryStore)
        : [];
    const restaurants =
      restaurantResult.status === "fulfilled"
        ? (restaurantResult.value.data?.restaurants ?? []).map(toRestaurantStore)
        : [];

    const linkedStores = [...bakeries, ...restaurants];
    const storesWithResolvedLogos = await Promise.all(
      linkedStores.map(async (store) => {
        if (store.imageUrl) return store;

        const parsed = parseStoreSlug(store.slug);
        if (!parsed) return store;

        try {
          if (parsed.vendorType === "bakery") {
            const details = await fetchJson<BakeryDetailsResponse>(`/bakeries/${parsed.id}`);
            const bakery = details.data?.bakery;
            const resolved = normalizeVendorImageUrl(
              bakery?.logoUrl || bakery?.imageUrl || bakery?.coverImageUrl,
            );
            return resolved ? { ...store, imageUrl: resolved } : store;
          }

          const details = await fetchJson<RestaurantDetailsResponse>(`/restaurants/${parsed.id}`);
          const restaurant = details.data?.restaurant;
          const resolved = normalizeVendorImageUrl(
            restaurant?.logoUrl || restaurant?.imageUrl || restaurant?.coverImageUrl,
          );
          return resolved ? { ...store, imageUrl: resolved } : store;
        } catch {
          return store;
        }
      }),
    );

    // Return real vendors only — empty when none exist yet (no dummy data).
    return storesWithResolvedLogos.sort((first, second) =>
      first.name.en.localeCompare(second.name.en),
    );
}

export async function fetchStoreBySlug(slug: string | null | undefined): Promise<Store | null> {
  if (typeof slug !== "string" || !slug.trim()) return null;
  const parsedSlug = parseStoreSlug(slug);
  if (!parsedSlug) {
    return null;
  }

  try {
    if (parsedSlug.vendorType === "bakery") {
      const [details, products] = await Promise.all([
        fetchJson<BakeryDetailsResponse>(`/bakeries/${parsedSlug.id}`),
        fetchJson<ProductsResponse>(`/bakeries/${parsedSlug.id}/products?limit=8`).catch(() => null),
      ]);

      const bakery = details.data?.bakery;
      if (!bakery) return null;
      return applySpecialties(toBakeryStore(bakery, 0), products?.data?.products);
    }

    const [details, products] = await Promise.all([
      fetchJson<RestaurantDetailsResponse>(`/restaurants/${parsedSlug.id}`),
      fetchJson<ProductsResponse>(`/restaurants/${parsedSlug.id}/products?limit=8`).catch(() => null),
    ]);

    const restaurant = details.data?.restaurant;
    if (!restaurant) return null;
    return applySpecialties(toRestaurantStore(restaurant, 0), products?.data?.products);
  } catch {
    return null;
  }
}
