-- profiles table: one row per auth.users row, populated automatically on signup.
-- Does not modify auth.users itself.
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  role text not null default 'driver',
  created_at timestamptz not null default now()
);

-- Inserts a profiles row whenever a new auth.users row is created, pulling
-- full_name out of the signup metadata your teammate's auth flow provides.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

alter table public.profiles enable row level security;

create policy "Users can read their own profile"
  on public.profiles
  for select
  using (auth.uid() = id);

create policy "Authenticated users can read all profiles"
  on public.profiles
  for select
  to authenticated
  using (true);
