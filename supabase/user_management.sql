-- Drop existing if any to avoid conflicts
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();
drop table if exists profiles;

-- 1. Create Profiles Table
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  role text not null check (role in ('Admin', 'Staff')) default 'Staff',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security
alter table profiles enable row level security;

-- Allow all authenticated users to read profiles
create policy "Enable read access for all authenticated users" 
on profiles for select 
using (auth.role() = 'authenticated');

-- Allow all authenticated users to update roles (as requested for this demo)
create policy "Enable update access for all authenticated users" 
on profiles for update
using (auth.role() = 'authenticated');

-- 3. Trigger Function to automatically create a profile on new signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (
    new.id, 
    new.email, 
    -- Make the first user 'Admin' or anyone with 'admin' in email, otherwise 'Staff'
    case 
      when new.email ilike '%admin%' then 'Admin' 
      else 'Staff' 
    end
  );
  return new;
end;
$$ language plpgsql security definer;

-- 4. Set up the trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 5. Backfill existing users (if there are any already registered)
insert into public.profiles (id, email, role)
select 
  id, 
  email,
  case 
    when email ilike '%admin%' then 'Admin' 
    else 'Staff' 
  end
from auth.users
on conflict (id) do nothing;
