create table if not exists public.forklifts (
  id text primary key,
  vehicle_number text not null default '',
  model text not null default '',
  year text not null default '',
  price text not null default '',
  status text not null default '판매중',
  note text not null default '',
  organization_id text,
  created_at timestamptz not null default now()
);

create table if not exists public.customers (
  id text primary key,
  name text not null default '',
  phone text not null default '',
  company text not null default '',
  region text not null default '',
  interest_model text not null default '',
  status text not null default '신규',
  memo text not null default '',
  organization_id text,
  created_at timestamptz not null default now()
);

create table if not exists public.consultations (
  id text primary key,
  customer_id text not null default '',
  customer_name text not null default '',
  phone text not null default '',
  company text not null default '',
  forklift_id text not null default '',
  model text not null default '',
  consult_date text not null default '',
  status text not null default '신규',
  note text not null default '',
  converted_to_shipment boolean not null default false,
  organization_id text,
  created_at timestamptz not null default now()
);

create table if not exists public.shipments (
  id text primary key,
  forklift_id text not null default '',
  vehicle_number text not null default '',
  customer_id text not null default '',
  customer_name text not null default '',
  shipment_date text not null default '',
  transport_method text not null default '',
  manager text not null default '',
  note text not null default '',
  status text not null default '준비중',
  consultation_id text,
  organization_id text,
  created_at timestamptz not null default now()
);

create table if not exists public.as_requests (
  id text primary key,
  forklift_id text not null default '',
  organization_id text,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null default '',
  display_name text not null default '',
  role text not null default 'staff',
  organization_id text,
  created_at timestamptz not null default now()
);

create index if not exists idx_forklifts_status on public.forklifts (status);
create index if not exists idx_forklifts_org on public.forklifts (organization_id);
create index if not exists idx_customers_status on public.customers (status);
create index if not exists idx_customers_region on public.customers (region);
create index if not exists idx_customers_org on public.customers (organization_id);
create index if not exists idx_consultations_status on public.consultations (status);
create index if not exists idx_consultations_customer_id on public.consultations (customer_id);
create index if not exists idx_consultations_forklift_id on public.consultations (forklift_id);
create index if not exists idx_consultations_org on public.consultations (organization_id);
create index if not exists idx_shipments_status on public.shipments (status);
create index if not exists idx_shipments_customer_id on public.shipments (customer_id);
create index if not exists idx_shipments_forklift_id on public.shipments (forklift_id);
create index if not exists idx_shipments_org on public.shipments (organization_id);
create index if not exists idx_as_requests_forklift_id on public.as_requests (forklift_id);
create index if not exists idx_as_requests_org on public.as_requests (organization_id);
create index if not exists idx_profiles_role on public.profiles (role);
create index if not exists idx_profiles_org on public.profiles (organization_id);
