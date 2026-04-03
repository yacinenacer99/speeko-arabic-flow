-- Sessions table with analysis and XP details.

create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  topic text not null,
  duration double precision not null,
  flow_score integer not null,
  filler_count integer not null,
  forbidden_used integer not null,
  pace integer not null,
  longest_pause double precision not null,
  word_count integer not null,
  transcript text not null,
  challenge_type text not null,
  analysis jsonb not null,
  xp_breakdown jsonb not null,
  stage_advancement jsonb not null,
  streak_count integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.sessions enable row level security;

create policy "sessions_select_own" on public.sessions for select using (auth.uid() = user_id);

create policy "sessions_insert_own" on public.sessions for insert with check (auth.uid() = user_id);

-- Extra fields for progress streak and maintenance.

alter table public.progress
  add column if not exists last_session_date date,
  add column if not exists freeze_tokens integer not null default 0;

