-- Run in Supabase SQL Editor. Submissions are written only by the private server API.
create extension if not exists pgcrypto;
create table if not exists public.poems (
 id uuid primary key default gen_random_uuid(),
 created_at timestamptz not null default now(),
 title text not null check(char_length(title) between 3 and 100),
 body text not null check(char_length(body) between 30 and 6000),
 pen_name text not null check(char_length(pen_name) between 1 and 70),
 location text,
 contact_email text,
 theme text not null,
 status text not null default 'pending' check(status in ('pending','published','rejected'))
);
create index if not exists poems_status_created_idx on public.poems(status,created_at desc);
alter table public.poems enable row level security;
-- No public policies. The server role reads approved poems and submits new items.
-- To publish an approved submission, set its status to 'published' in Supabase Table Editor.
