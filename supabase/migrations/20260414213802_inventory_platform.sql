create extension if not exists pgcrypto with schema extensions;

do $$
begin
  if not exists (
    select 1
    from pg_type
    where typname = 'order_status'
      and typnamespace = 'public'::regnamespace
  ) then
    create type public.order_status as enum (
      'checkout_pending',
      'checkout_created',
      'checkout_failed',
      'paid',
      'canceled',
      'expired',
      'refunded'
    );
  end if;
end
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.products (
  id text primary key,
  category text not null default 'dhol',
  title text not null,
  subtitle text not null,
  selection_summary text not null,
  image_src text not null,
  image_alt text not null,
  active boolean not null default true,
  inventory_count integer not null check (inventory_count >= 0),
  base_unit_amount_cents integer not null check (base_unit_amount_cents >= 0),
  rental_block_days integer not null default 4 check (rental_block_days > 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.inventory_adjustments (
  id uuid primary key default extensions.gen_random_uuid(),
  product_id text not null references public.products(id) on delete cascade,
  change_quantity integer not null,
  reason text not null,
  note text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.orders (
  id uuid primary key default extensions.gen_random_uuid(),
  checkout_scope text not null default 'dhol-pilot',
  status public.order_status not null default 'checkout_pending',
  stripe_session_id text unique,
  stripe_payment_intent_id text unique,
  stripe_event_id text unique,
  checkout_url text,
  stripe_error_message text,
  customer_email text not null,
  customer_name text not null,
  customer_phone text not null,
  fulfillment_method text not null check (fulfillment_method in ('pickup', 'delivery')),
  pickup_date date not null,
  return_date date not null,
  delivery_street_address text,
  delivery_apartment text,
  delivery_city text,
  delivery_state_region text,
  delivery_zip_code text,
  delivery_notes text,
  item_subtotal_cents integer not null default 0 check (item_subtotal_cents >= 0),
  delivery_fee_cents integer not null default 0 check (delivery_fee_cents >= 0),
  extended_rental_surcharge_cents integer not null default 0 check (extended_rental_surcharge_cents >= 0),
  total_cents integer not null default 0 check (total_cents >= 0),
  rental_window_length integer not null check (rental_window_length > 0),
  rental_block_count integer not null default 1 check (rental_block_count > 0),
  additional_rental_block_count integer not null default 0 check (additional_rental_block_count >= 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint orders_return_after_pickup check (return_date >= pickup_date)
);

create table if not exists public.order_items (
  id uuid primary key default extensions.gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id text not null references public.products(id) on delete restrict,
  title_snapshot text not null,
  subtitle_snapshot text not null,
  image_src_snapshot text not null,
  quantity integer not null check (quantity > 0),
  unit_amount_cents integer not null check (unit_amount_cents >= 0),
  line_total_cents integer not null check (line_total_cents >= 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (order_id, product_id)
);

create index if not exists orders_status_idx on public.orders(status);
create index if not exists orders_pickup_return_idx on public.orders(pickup_date, return_date);
create index if not exists order_items_product_id_idx on public.order_items(product_id);
create index if not exists inventory_adjustments_product_id_idx on public.inventory_adjustments(product_id);

drop trigger if exists set_products_updated_at on public.products;
create trigger set_products_updated_at
before update on public.products
for each row
execute function public.set_updated_at();

drop trigger if exists set_orders_updated_at on public.orders;
create trigger set_orders_updated_at
before update on public.orders
for each row
execute function public.set_updated_at();

drop trigger if exists set_order_items_updated_at on public.order_items;
create trigger set_order_items_updated_at
before update on public.order_items
for each row
execute function public.set_updated_at();

insert into public.products (
  id,
  category,
  title,
  subtitle,
  selection_summary,
  image_src,
  image_alt,
  active,
  inventory_count,
  base_unit_amount_cents,
  rental_block_days
)
values
  (
    'single-ivory',
    'dhol',
    'Ivory embroidered',
    'Large premium dhol',
    'You are selecting an ivory embroidered dhol with larger premium proportions and a more heirloom feel.',
    '/product-pictures/dhol-1/Dhol1A-Photoroom.png',
    'Cutout view of the ivory embroidered dhol rental option.',
    true,
    1,
    3000,
    4
  ),
  (
    'double-mixed',
    'dhol',
    'Royal blue',
    'Large velvet dhol',
    'You are selecting a royal blue dhol with a larger velvet body for a richer focal layer.',
    '/product-pictures/dhol-2/Dhol2A-Photoroom.png',
    'Front view of the royal blue dhol rental option.',
    true,
    1,
    2000,
    4
  ),
  (
    'mirror-festival',
    'dhol',
    'Wooden multicolored',
    'Small dhol (7.5 x 5 inches)',
    'You are selecting a small wooden multicolored dhol for a more compact accent.',
    '/product-pictures/dhol-3/Dhol3A-Photoroom.png',
    'Cutout view of the wooden multicolored dhol rental option.',
    true,
    1,
    800,
    4
  )
on conflict (id) do update
set
  category = excluded.category,
  title = excluded.title,
  subtitle = excluded.subtitle,
  selection_summary = excluded.selection_summary,
  image_src = excluded.image_src,
  image_alt = excluded.image_alt,
  active = excluded.active,
  inventory_count = excluded.inventory_count,
  base_unit_amount_cents = excluded.base_unit_amount_cents,
  rental_block_days = excluded.rental_block_days,
  updated_at = timezone('utc', now());

alter table public.products enable row level security;
alter table public.inventory_adjustments enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

drop policy if exists "Active products are publicly readable" on public.products;
create policy "Active products are publicly readable"
on public.products
for select
to anon, authenticated
using (active = true);
