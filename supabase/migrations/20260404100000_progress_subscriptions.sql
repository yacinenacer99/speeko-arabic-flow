create table if not exists public.progress (
  user_id uuid primary key references auth.users (id) on delete cascade,
  stage int not null default 1 check (stage >= 1 and stage <= 6),
  xp int not null default 0,
  streak int not null default 0,
  stage_progress_count int not null default 0,
  stage_progress_required int not null default 1,
  updated_at timestamptz not null default now()
);

alter table public.progress enable row level security;

create policy "progress_select_own" on public.progress for select using (auth.uid() = user_id);

create policy "progress_insert_own" on public.progress for insert with check (auth.uid() = user_id);

create policy "progress_update_own" on public.progress for update using (auth.uid() = user_id);

create table if not exists public.subscriptions (
  user_id uuid primary key references auth.users (id) on delete cascade,
  plan text not null default 'free' check (plan in ('free', 'pro')),
  updated_at timestamptz not null default now()
);

alter table public.subscriptions enable row level security;

create policy "subscriptions_select_own" on public.subscriptions for select using (auth.uid() = user_id);

create policy "subscriptions_insert_own" on public.subscriptions for insert with check (auth.uid() = user_id);

create policy "subscriptions_update_own" on public.subscriptions for update using (auth.uid() = user_id);
