-- ==========================================================
-- Koli Piac – Supabase PostgreSQL Adatbázis Séma
-- Másold be ezt a Supabase SQL Editorba és nyomd meg a RUN gombot!
-- ==========================================================

-- 1. Hirdetések tábla létrehozása
create table if not exists public.listings (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  price integer not null default 0,
  room text not null,
  description text default '',
  image_url text default '',
  is_sold boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Indexek létrehozása a villámgyors szűréshez és kereséshez
create index if not exists idx_listings_created_at on public.listings (created_at desc);
create index if not exists idx_listings_is_sold on public.listings (is_sold);
create index if not exists idx_listings_price on public.listings (price);

-- 3. Row Level Security (RLS) bekapcsolása
alter table public.listings enable row level security;

-- 4. Nyilvános olvasási jog (mindenki láthatja a kolis hirdetéseket)
create policy "Bárki megtekintheti a hirdetéseket"
  on public.listings for select
  using (true);

-- 5. Nyilvános hozzáadási jog (bárki adhat fel hirdetést belépés nélkül)
create policy "Bárki feladhat hirdetést"
  on public.listings for insert
  with check (true);

-- 6. Nyilvános státuszváltási jog (Elkelt / Visszaállítás)
create policy "Bárki módosíthatja a státuszt"
  on public.listings for update
  using (true);

-- 7. Nyilvános törlési jog (ha valaki törölni szeretné)
create policy "Bárki törölheti a hirdetést"
  on public.listings for delete
  using (true);
