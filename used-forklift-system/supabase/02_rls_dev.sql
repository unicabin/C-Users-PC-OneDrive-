alter table public.forklifts enable row level security;
alter table public.customers enable row level security;
alter table public.consultations enable row level security;
alter table public.shipments enable row level security;
alter table public.as_requests enable row level security;
alter table public.profiles enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

create or replace function public.current_org_id()
returns text
language sql
stable
as $$
  select organization_id
  from public.profiles
  where id = auth.uid();
$$;

drop policy if exists "forklifts_select" on public.forklifts;
create policy "forklifts_select"
on public.forklifts
for select
to authenticated
using (true);

drop policy if exists "forklifts_insert" on public.forklifts;
create policy "forklifts_insert"
on public.forklifts
for insert
to authenticated
with check (true);

drop policy if exists "forklifts_update" on public.forklifts;
create policy "forklifts_update"
on public.forklifts
for update
to authenticated
using (true)
with check (true);

drop policy if exists "forklifts_delete_admin" on public.forklifts;
create policy "forklifts_delete_admin"
on public.forklifts
for delete
to authenticated
using (public.is_admin());

drop policy if exists "customers_select" on public.customers;
create policy "customers_select"
on public.customers
for select
to authenticated
using (true);

drop policy if exists "customers_insert" on public.customers;
create policy "customers_insert"
on public.customers
for insert
to authenticated
with check (true);

drop policy if exists "customers_update" on public.customers;
create policy "customers_update"
on public.customers
for update
to authenticated
using (true)
with check (true);

drop policy if exists "customers_delete_admin" on public.customers;
create policy "customers_delete_admin"
on public.customers
for delete
to authenticated
using (public.is_admin());

drop policy if exists "consultations_select" on public.consultations;
create policy "consultations_select"
on public.consultations
for select
to authenticated
using (true);

drop policy if exists "consultations_insert" on public.consultations;
create policy "consultations_insert"
on public.consultations
for insert
to authenticated
with check (true);

drop policy if exists "consultations_update" on public.consultations;
create policy "consultations_update"
on public.consultations
for update
to authenticated
using (true)
with check (true);

drop policy if exists "consultations_delete_admin" on public.consultations;
create policy "consultations_delete_admin"
on public.consultations
for delete
to authenticated
using (public.is_admin());

drop policy if exists "shipments_select" on public.shipments;
create policy "shipments_select"
on public.shipments
for select
to authenticated
using (true);

drop policy if exists "shipments_insert" on public.shipments;
create policy "shipments_insert"
on public.shipments
for insert
to authenticated
with check (true);

drop policy if exists "shipments_update" on public.shipments;
create policy "shipments_update"
on public.shipments
for update
to authenticated
using (true)
with check (true);

drop policy if exists "as_requests_select" on public.as_requests;
create policy "as_requests_select"
on public.as_requests
for select
to authenticated
using (true);

drop policy if exists "as_requests_insert" on public.as_requests;
create policy "as_requests_insert"
on public.as_requests
for insert
to authenticated
with check (true);

drop policy if exists "as_requests_update" on public.as_requests;
create policy "as_requests_update"
on public.as_requests
for update
to authenticated
using (true)
with check (true);

drop policy if exists "profiles_select_self_or_admin" on public.profiles;
create policy "profiles_select_self_or_admin"
on public.profiles
for select
to authenticated
using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles_insert_self" on public.profiles;
create policy "profiles_insert_self"
on public.profiles
for insert
to authenticated
with check (id = auth.uid());

drop policy if exists "profiles_update_self_or_admin" on public.profiles;
create policy "profiles_update_self_or_admin"
on public.profiles
for update
to authenticated
using (id = auth.uid() or public.is_admin())
with check (id = auth.uid() or public.is_admin());

-- 다음 단계 멀티테넌트 전환 예시:
-- 각 업무 테이블 policy를
-- using (organization_id = public.current_org_id())
-- with check (organization_id = public.current_org_id())
-- 형태로 바꾸면 조직 단위 격리가 가능합니다.
