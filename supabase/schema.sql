-- NOVA Shopping core schema. Run in Supabase SQL Editor.
create extension if not exists pgcrypto;
create table if not exists public.profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 display_name text, phone text, created_at timestamptz not null default now()
);
create table if not exists public.products (
 id text primary key, name text not null, description text not null default '',
 category text not null, price_cents integer not null check(price_cents>=0),
 currency text not null default 'usd', active boolean not null default true,
 seller_id uuid, inventory integer not null default 0 check(inventory>=0),
 image_url text, created_at timestamptz not null default now()
);
create table if not exists public.sellers (
 id uuid primary key default gen_random_uuid(), user_id uuid not null unique references auth.users(id),
 store_name text not null, description text default '', status text not null default 'pending' check(status in ('pending','approved','rejected','suspended')),
 created_at timestamptz not null default now()
);
alter table public.products add constraint products_seller_fk foreign key(seller_id) references public.sellers(id) on delete set null;
create table if not exists public.addresses (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 full_name text not null, line1 text not null, line2 text, city text not null, region text not null, postal_code text not null, country text not null default 'US', is_default boolean not null default false
);
create table if not exists public.orders (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id),
 stripe_session_id text unique, status text not null default 'pending',
 total_cents integer not null default 0, currency text not null default 'usd',
 created_at timestamptz not null default now()
);
create table if not exists public.order_items (
 id uuid primary key default gen_random_uuid(), order_id uuid not null references public.orders(id) on delete cascade,
 product_id text references public.products(id), product_name text not null, quantity integer not null check(quantity>0), unit_price_cents integer not null
);
create table if not exists public.reviews (
 id uuid primary key default gen_random_uuid(), product_id text not null references public.products(id),
 user_id uuid not null references auth.users(id), rating integer not null check(rating between 1 and 5),
 title text, body text, verified_purchase boolean not null default false, created_at timestamptz not null default now(), unique(product_id,user_id)
);
create table if not exists public.price_alerts (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 product_id text not null references public.products(id), target_price_cents integer not null check(target_price_cents>0),
 active boolean not null default true, created_at timestamptz not null default now()
);
create table if not exists public.reward_ledger (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 points integer not null, reason text not null, order_id uuid references public.orders(id), created_at timestamptz not null default now()
);
create table if not exists public.shopping_lists (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 title text not null, is_public boolean not null default false, share_token uuid not null default gen_random_uuid(), created_at timestamptz not null default now()
);
create table if not exists public.shopping_list_items (
 list_id uuid not null references public.shopping_lists(id) on delete cascade,
 product_id text not null references public.products(id), added_at timestamptz not null default now(), primary key(list_id,product_id)
);
create table if not exists public.price_history (
 id bigint generated always as identity primary key, product_id text not null references public.products(id), price_cents integer not null, recorded_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
alter table public.addresses enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.reviews enable row level security;
alter table public.price_alerts enable row level security;
alter table public.reward_ledger enable row level security;
alter table public.shopping_lists enable row level security;
alter table public.shopping_list_items enable row level security;
alter table public.sellers enable row level security;
alter table public.products enable row level security;
alter table public.price_history enable row level security;
create policy "profiles own read/write" on public.profiles for all using(auth.uid()=id) with check(auth.uid()=id);
create policy "products public read active" on public.products for select using(active=true);
create policy "seller own profile" on public.sellers for select using(auth.uid()=user_id);
create policy "seller apply" on public.sellers for insert with check(auth.uid()=user_id);
create policy "addresses own" on public.addresses for all using(auth.uid()=user_id) with check(auth.uid()=user_id);
create policy "orders own read" on public.orders for select using(auth.uid()=user_id);
create policy "items own read" on public.order_items for select using(exists(select 1 from public.orders o where o.id=order_id and o.user_id=auth.uid()));
create policy "reviews public read" on public.reviews for select using(true);
create policy "reviews own create" on public.reviews for insert with check(auth.uid()=user_id);
create policy "reviews own edit" on public.reviews for update using(auth.uid()=user_id) with check(auth.uid()=user_id);
create policy "alerts own" on public.price_alerts for all using(auth.uid()=user_id) with check(auth.uid()=user_id);
create policy "rewards own read" on public.reward_ledger for select using(auth.uid()=user_id);
create policy "lists public or own read" on public.shopping_lists for select using(is_public or auth.uid()=user_id);
create policy "lists own manage" on public.shopping_lists for all using(auth.uid()=user_id) with check(auth.uid()=user_id);
create policy "list items visible lists" on public.shopping_list_items for select using(exists(select 1 from public.shopping_lists l where l.id=list_id and (l.is_public or l.user_id=auth.uid())));
create policy "list items own manage" on public.shopping_list_items for all using(exists(select 1 from public.shopping_lists l where l.id=list_id and l.user_id=auth.uid())) with check(exists(select 1 from public.shopping_lists l where l.id=list_id and l.user_id=auth.uid()));
create policy "price history public read" on public.price_history for select using(true);
insert into public.products(id,name,category,price_cents,active,inventory) values
('1','Wireless Noise-Canceling Headphones','Electronics',8999,true,50),('2','Minimal Ceramic Table Lamp','Home',4250,true,50),
('3','Everyday Canvas Sneakers','Fashion',5400,true,50),('4','Hydrating Daily Skin Set','Beauty',3200,true,50),
('5','Smart Fitness Watch','Electronics',11900,true,50),('6','Insulated Travel Bottle','Sports',2499,true,50),
('7','The Art of Small Habits','Books',1650,true,50),('8','Soft Knit Throw Blanket','Home',3800,true,50),
('9','Build-It Creative Robot Kit','Toys',3999,true,50),('10','Classic Everyday Backpack','Fashion',4600,true,50),
('11','Portable Bluetooth Speaker','Electronics',3499,true,50),('12','Indoor Plant Starter Set','Home',2750,true,50)
on conflict(id) do nothing;
