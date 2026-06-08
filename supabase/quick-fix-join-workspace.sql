create extension if not exists "pgcrypto";

do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type public.user_role as enum ('college_admin', 'student', 'super_admin');
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_enum
    where enumlabel = 'super_admin'
      and enumtypid = 'public.user_role'::regtype
  ) then
    alter type public.user_role add value 'super_admin';
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'membership_status') then
    create type public.membership_status as enum ('active', 'pending', 'suspended');
  end if;
end $$;

create or replace function public.join_college_workspace(
  join_code text,
  requested_role public.user_role
)
returns table (
  membership_id uuid,
  college_id uuid,
  college_name text,
  role public.user_role,
  status public.membership_status
)
language plpgsql
security definer
set search_path = public
as $$
declare
  target_college public.colleges%rowtype;
  auth_user auth.users%rowtype;
  desired_status public.membership_status;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;

  select * into target_college
  from public.colleges
  where code = upper(join_code);

  if not found then
    raise exception 'invalid college code';
  end if;

  select * into auth_user
  from auth.users
  where id = auth.uid();

  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    auth_user.id,
    auth_user.email,
    auth_user.raw_user_meta_data->>'full_name',
    auth_user.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do update
  set
    email = excluded.email,
    full_name = coalesce(excluded.full_name, public.profiles.full_name),
    avatar_url = coalesce(excluded.avatar_url, public.profiles.avatar_url);

  desired_status := case
    when requested_role in ('college_admin', 'super_admin') then 'pending'::public.membership_status
    else 'active'::public.membership_status
  end;

  insert into public.college_memberships (college_id, user_id, role, status)
  values (target_college.id, auth.uid(), requested_role, desired_status)
  on conflict (college_id, user_id) do update
  set role = excluded.role,
      status = case
        when public.college_memberships.status = 'active' then 'active'::public.membership_status
        else excluded.status
      end
  returning id into membership_id;

  college_id := target_college.id;
  college_name := target_college.name;
  role := requested_role;
  status := desired_status;
  return next;
end;
$$;

grant execute on function public.join_college_workspace(text, public.user_role) to authenticated;

notify pgrst, 'reload schema';
