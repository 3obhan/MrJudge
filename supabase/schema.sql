-- Mr Judge database schema
-- Run this in the Supabase SQL editor (or via `supabase db push`)
-- Uses Supabase Auth: each dispute belongs to auth.uid(), enforced by RLS.

create extension if not exists "uuid-ossp";

create type dispute_status as enum ('pending', 'analyzed');
create type dispute_language as enum ('en', 'fa');

create table if not exists disputes (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  person_a_statement text not null,
  person_b_statement text not null,
  person_a_score integer check (person_a_score between 0 and 100),
  person_b_score integer check (person_b_score between 0 and 100),
  verdict text,
  explanation text,
  language dispute_language not null default 'en',
  status dispute_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists disputes_user_id_idx on disputes (user_id);
create index if not exists disputes_created_at_idx on disputes (created_at desc);

alter table disputes enable row level security;

-- Each signed-in user can only see and manage their own disputes.
create policy "Users can view own disputes"
  on disputes for select
  using (auth.uid() = user_id);

create policy "Users can insert own disputes"
  on disputes for insert
  with check (auth.uid() = user_id);

create policy "Users can update own disputes"
  on disputes for update
  using (auth.uid() = user_id);

create policy "Users can delete own disputes"
  on disputes for delete
  using (auth.uid() = user_id);

-- Optional: a `profiles` table if you later want to store plan/subscription
-- status per user for the paid tiers you mentioned.
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  plan text not null default 'free',
  created_at timestamptz not null default now()
);
alter table profiles enable row level security;
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Auto-create a profile row whenever a new user signs up.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
