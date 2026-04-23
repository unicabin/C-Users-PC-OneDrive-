create extension if not exists pgcrypto;
create extension if not exists vector;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  description text,
  status text not null check (status in ('기획중', '분석중', '개발중', '완료')),
  created_at timestamptz not null default now()
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  project_id uuid references public.projects (id) on delete set null,
  title text not null,
  content text,
  category text not null check (
    category in ('설계자료', '사양서', '시험성적서', '도면설명', '개발이력', '기타')
  ),
  file_type text not null check (
    file_type in ('PDF', 'DOCX', 'XLSX', 'PPTX', 'TXT')
  ),
  created_at timestamptz not null default now()
);

create table if not exists public.document_chunks (
  id uuid primary key default gen_random_uuid(),
  document_name text not null,
  content text not null,
  embedding vector(1536) not null,
  created_at timestamptz not null default now()
);

create table if not exists public.patents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  project_id uuid references public.projects (id) on delete set null,
  title text not null,
  summary text,
  risk_level text not null check (risk_level in ('낮음', '중간', '높음')),
  similarity numeric(5,2) not null check (similarity >= 0 and similarity <= 100),
  created_at timestamptz not null default now()
);

create table if not exists public.predictions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  score numeric(5,2) not null check (score >= 0 and score <= 100),
  risk text not null check (risk in ('낮음', '중간', '높음')),
  recommendation text,
  created_at timestamptz not null default now()
);

create table if not exists public.ideas (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  title text not null,
  description text,
  effect text,
  created_at timestamptz not null default now()
);

create table if not exists public.automation_results (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  template_title text not null,
  output text not null,
  created_at timestamptz not null default now()
);

create index if not exists projects_user_id_idx on public.projects (user_id);
create index if not exists projects_created_at_idx on public.projects (created_at desc);
create index if not exists documents_user_id_idx on public.documents (user_id);
create index if not exists documents_project_id_idx on public.documents (project_id);
create index if not exists document_chunks_embedding_idx
on public.document_chunks
using ivfflat (embedding vector_cosine_ops)
with (lists = 100);
create index if not exists patents_user_id_idx on public.patents (user_id);
create index if not exists patents_project_id_idx on public.patents (project_id);
create index if not exists predictions_project_id_idx on public.predictions (project_id);
create index if not exists ideas_project_id_idx on public.ideas (project_id);
create index if not exists automation_results_project_id_idx on public.automation_results (project_id);

alter table public.projects enable row level security;
alter table public.documents enable row level security;
alter table public.patents enable row level security;
alter table public.predictions enable row level security;
alter table public.ideas enable row level security;
alter table public.automation_results enable row level security;

drop policy if exists "Users can view own projects" on public.projects;
drop policy if exists "Users can insert own projects" on public.projects;
drop policy if exists "Users can update own projects" on public.projects;
drop policy if exists "Users can delete own projects" on public.projects;

create policy "Users can view own projects"
on public.projects
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert own projects"
on public.projects
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update own projects"
on public.projects
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own projects"
on public.projects
for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can view own documents" on public.documents;
drop policy if exists "Users can insert own documents" on public.documents;
drop policy if exists "Users can update own documents" on public.documents;
drop policy if exists "Users can delete own documents" on public.documents;

create policy "Users can view own documents"
on public.documents
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert own documents"
on public.documents
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update own documents"
on public.documents
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own documents"
on public.documents
for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can view own patents" on public.patents;
drop policy if exists "Users can insert own patents" on public.patents;
drop policy if exists "Users can update own patents" on public.patents;
drop policy if exists "Users can delete own patents" on public.patents;

create policy "Users can view own patents"
on public.patents
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert own patents"
on public.patents
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update own patents"
on public.patents
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own patents"
on public.patents
for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can view predictions of own projects" on public.predictions;
drop policy if exists "Users can insert predictions of own projects" on public.predictions;
drop policy if exists "Users can update predictions of own projects" on public.predictions;
drop policy if exists "Users can delete predictions of own projects" on public.predictions;

create policy "Users can view predictions of own projects"
on public.predictions
for select
to authenticated
using (
  exists (
    select 1
    from public.projects
    where public.projects.id = predictions.project_id
      and public.projects.user_id = auth.uid()
  )
);

create policy "Users can insert predictions of own projects"
on public.predictions
for insert
to authenticated
with check (
  exists (
    select 1
    from public.projects
    where public.projects.id = predictions.project_id
      and public.projects.user_id = auth.uid()
  )
);

create policy "Users can update predictions of own projects"
on public.predictions
for update
to authenticated
using (
  exists (
    select 1
    from public.projects
    where public.projects.id = predictions.project_id
      and public.projects.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.projects
    where public.projects.id = predictions.project_id
      and public.projects.user_id = auth.uid()
  )
);

create policy "Users can delete predictions of own projects"
on public.predictions
for delete
to authenticated
using (
  exists (
    select 1
    from public.projects
    where public.projects.id = predictions.project_id
      and public.projects.user_id = auth.uid()
  )
);

drop policy if exists "Users can view ideas of own projects" on public.ideas;
drop policy if exists "Users can insert ideas of own projects" on public.ideas;
drop policy if exists "Users can update ideas of own projects" on public.ideas;
drop policy if exists "Users can delete ideas of own projects" on public.ideas;

create policy "Users can view ideas of own projects"
on public.ideas
for select
to authenticated
using (
  exists (
    select 1
    from public.projects
    where public.projects.id = ideas.project_id
      and public.projects.user_id = auth.uid()
  )
);

create policy "Users can insert ideas of own projects"
on public.ideas
for insert
to authenticated
with check (
  exists (
    select 1
    from public.projects
    where public.projects.id = ideas.project_id
      and public.projects.user_id = auth.uid()
  )
);

create policy "Users can update ideas of own projects"
on public.ideas
for update
to authenticated
using (
  exists (
    select 1
    from public.projects
    where public.projects.id = ideas.project_id
      and public.projects.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.projects
    where public.projects.id = ideas.project_id
      and public.projects.user_id = auth.uid()
  )
);

create policy "Users can delete ideas of own projects"
on public.ideas
for delete
to authenticated
using (
  exists (
    select 1
    from public.projects
    where public.projects.id = ideas.project_id
      and public.projects.user_id = auth.uid()
  )
);

drop policy if exists "Users can view automation results of own projects" on public.automation_results;
drop policy if exists "Users can insert automation results of own projects" on public.automation_results;
drop policy if exists "Users can delete automation results of own projects" on public.automation_results;

create policy "Users can view automation results of own projects"
on public.automation_results
for select
to authenticated
using (
  exists (
    select 1
    from public.projects
    where public.projects.id = automation_results.project_id
      and public.projects.user_id = auth.uid()
  )
);

create policy "Users can insert automation results of own projects"
on public.automation_results
for insert
to authenticated
with check (
  exists (
    select 1
    from public.projects
    where public.projects.id = automation_results.project_id
      and public.projects.user_id = auth.uid()
  )
);

create policy "Users can delete automation results of own projects"
on public.automation_results
for delete
to authenticated
using (
  exists (
    select 1
    from public.projects
    where public.projects.id = automation_results.project_id
      and public.projects.user_id = auth.uid()
  )
);

create or replace function public.match_documents(
  query_embedding vector(1536),
  match_count int
)
returns table (
  id uuid,
  content text,
  document_name text,
  similarity float
)
language sql
stable
as $$
  select
    document_chunks.id,
    document_chunks.content,
    document_chunks.document_name,
    1 - (document_chunks.embedding <=> query_embedding) as similarity
  from public.document_chunks
  order by document_chunks.embedding <=> query_embedding
  limit match_count;
$$;
