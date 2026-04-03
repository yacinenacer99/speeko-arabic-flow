-- App profile row keyed by auth user id (trial onboarding + /login signup both write here).
create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null default '',
  interests jsonb not null default '[]'::jsonb,
  goal text,
  level text not null default 'beginner',
  language text not null default 'ar',
  updated_at timestamptz not null default now()
);

alter table public.users enable row level security;

create policy "users_select_own" on public.users for select using (auth.uid() = id);

create policy "users_insert_own" on public.users for insert with check (auth.uid() = id);

create policy "users_update_own" on public.users for update using (auth.uid() = id);
