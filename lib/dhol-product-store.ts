import type { DholCatalogItem } from "@/lib/dhol-checkout";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

type ProductRow = {
  active: boolean;
  base_unit_amount_cents: number;
  category: string;
  id: string;
  image_alt: string;
  image_src: string;
  inventory_count: number;
  selection_summary: string;
  subtitle: string;
  title: string;
};

const mapProductRowToCatalogItem = (row: ProductRow): DholCatalogItem => ({
  active: row.active,
  id: row.id,
  title: row.title,
  subtitle: row.subtitle,
  selectionSummary: row.selection_summary,
  imageSrc: row.image_src,
  imageAlt: row.image_alt,
  inventoryCount: row.inventory_count,
  unitAmount: row.base_unit_amount_cents / 100,
});

const normalizeProductRows = (
  rows: ProductRow[] | null | undefined,
  {
    activeOnly = true,
  }: {
    activeOnly?: boolean;
  } = {},
) =>
  (rows ?? [])
    .filter((row) => row.category === "dhol" && (!activeOnly || row.active))
    .map(mapProductRowToCatalogItem);

export const listDholProducts = async ({
  activeOnly = false,
}: {
  activeOnly?: boolean;
} = {}) => {
  const { data, error } = await getSupabaseAdmin()
    .from("products")
    .select(
      "id, title, subtitle, selection_summary, image_src, image_alt, inventory_count, base_unit_amount_cents, active, category",
    )
    .eq("category", "dhol")
    .order("title", { ascending: true });

  if (error) {
    throw new Error(`Unable to load dhol products from Supabase: ${error.message}`);
  }

  return normalizeProductRows(data as ProductRow[] | null, { activeOnly });
};

export const listActiveDholProducts = async () => {
  return listDholProducts({ activeOnly: true });
};

export const getDholProductsByIds = async (productIds: string[]) => {
  const uniqueProductIds = Array.from(
    new Set(productIds.map((productId) => productId.trim()).filter(Boolean)),
  );

  if (uniqueProductIds.length === 0) {
    return [];
  }

  const { data, error } = await getSupabaseAdmin()
    .from("products")
    .select(
      "id, title, subtitle, selection_summary, image_src, image_alt, inventory_count, base_unit_amount_cents, active, category",
    )
    .in("id", uniqueProductIds)
    .eq("category", "dhol")
    .eq("active", true);

  if (error) {
    throw new Error(`Unable to load dhol products from Supabase: ${error.message}`);
  }

  return normalizeProductRows(data as ProductRow[] | null, { activeOnly: true }).sort(
    (left, right) => uniqueProductIds.indexOf(left.id) - uniqueProductIds.indexOf(right.id),
  );
};
