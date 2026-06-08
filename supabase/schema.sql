create extension if not exists "pgcrypto";

do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type public.user_role as enum ('college_admin', 'student', 'super_admin');
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_enum where enumlabel = 'super_admin' and enumtypid = 'public.user_role'::regtype) then
    alter type public.user_role add value 'super_admin';
  end if;
end $$;
do $$
begin
  if not exists (select 1 from pg_type where typname = 'membership_status') then
    create type public.membership_status as enum ('active', 'pending', 'suspended');
  end if;
end $$;
do $$
begin
  if not exists (select 1 from pg_type where typname = 'drive_status') then
    create type public.drive_status as enum ('draft', 'open', 'live', 'closed');
  end if;
end $$;
do $$
begin
  if not exists (select 1 from pg_type where typname = 'application_status') then
    create type public.application_status as enum ('applied', 'in_progress', 'selected', 'rejected', 'withdrawn');
  end if;
end $$;
do $$
begin
  if not exists (select 1 from pg_type where typname = 'admin_request_status') then
    create type public.admin_request_status as enum ('pending', 'approved', 'rejected');
  end if;
end $$;

create table if not exists public.colleges (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code char(6) not null unique check (code ~ '^[0-9A-F]{6}$'),
  domain text,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.college_memberships (
  id uuid primary key default gen_random_uuid(),
  college_id uuid not null references public.colleges(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role public.user_role not null,
  status public.membership_status not null default 'active',
  created_at timestamptz not null default now(),
  unique (college_id, user_id)
);

create table if not exists public.admin_requests (
  id uuid primary key default gen_random_uuid(),
  college_id uuid not null references public.colleges(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  requested_role public.user_role not null check (requested_role in ('college_admin', 'super_admin')),
  status public.admin_request_status not null default 'pending',
  note text,
  decided_by uuid references public.profiles(id) on delete set null,
  decided_at timestamptz,
  created_at timestamptz not null default now(),
  unique (college_id, user_id, requested_role)
);

create table if not exists public.activity_events (
  id uuid primary key default gen_random_uuid(),
  college_id uuid not null references public.colleges(id) on delete cascade,
  actor_id uuid references public.profiles(id) on delete set null,
  event_type text not null,
  entity_type text,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.demo_requests (
  id uuid primary key default gen_random_uuid(),
  college_name text not null,
  email text not null,
  phone text not null,
  role text not null,
  source text not null default 'landing',
  created_at timestamptz not null default now()
);

create table if not exists public.student_profiles (
  id uuid primary key default gen_random_uuid(),
  college_id uuid not null references public.colleges(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  branch text,
  batch_year integer,
  skills text[] not null default '{}',
  portfolio_url text,
  created_at timestamptz not null default now(),
  unique (college_id, user_id)
);

create table if not exists public.drives (
  id uuid primary key default gen_random_uuid(),
  college_id uuid not null references public.colleges(id) on delete cascade,
  title text not null,
  company text not null,
  work_type text not null,
  location text,
  status public.drive_status not null default 'draft',
  outcome_days integer not null default 14 check (outcome_days between 1 and 30),
  required_skills text[] not null default '{}',
  closes_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.drive_phases (
  id uuid primary key default gen_random_uuid(),
  drive_id uuid not null references public.drives(id) on delete cascade,
  name text not null,
  position integer not null,
  is_outcome_phase boolean not null default false,
  created_at timestamptz not null default now(),
  unique (drive_id, position)
);

create table if not exists public.resumes (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  college_id uuid not null references public.colleges(id) on delete cascade,
  label text not null,
  storage_path text not null,
  role_focus text,
  created_at timestamptz not null default now()
);

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  drive_id uuid not null references public.drives(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  resume_id uuid references public.resumes(id) on delete set null,
  current_phase_id uuid references public.drive_phases(id) on delete set null,
  status public.application_status not null default 'applied',
  outcome_due_at timestamptz not null,
  feedback text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (drive_id, student_id)
);

alter table public.colleges enable row level security;
alter table public.profiles enable row level security;
alter table public.college_memberships enable row level security;
alter table public.admin_requests enable row level security;
alter table public.activity_events enable row level security;
alter table public.demo_requests enable row level security;
alter table public.student_profiles enable row level security;
alter table public.drives enable row level security;
alter table public.drive_phases enable row level security;
alter table public.resumes enable row level security;
alter table public.applications enable row level security;

create or replace function public.is_college_member(target_college_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.college_memberships
    where college_id = target_college_id
      and user_id = auth.uid()
      and status = 'active'
  );
$$;

create or replace function public.is_college_admin(target_college_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.college_memberships
    where college_id = target_college_id
      and user_id = auth.uid()
      and role in ('college_admin', 'super_admin')
      and status = 'active'
  );
$$;

create or replace function public.is_super_admin(target_college_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.college_memberships
    where college_id = target_college_id
      and user_id = auth.uid()
      and role = 'super_admin'
      and status = 'active'
  );
$$;

drop policy if exists "users can read own profile" on public.profiles;
create policy "users can read own profile"
on public.profiles for select
using (id = auth.uid());

drop policy if exists "users can update own profile" on public.profiles;
create policy "users can update own profile"
on public.profiles for update
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists "members can read their college" on public.colleges;
create policy "members can read their college"
on public.colleges for select
using (public.is_college_member(id));

drop policy if exists "college super admins can manage their college" on public.colleges;
create policy "college super admins can manage their college"
on public.colleges for all
using (public.is_super_admin(id))
with check (public.is_super_admin(id));

drop policy if exists "members can read memberships in their college" on public.college_memberships;
create policy "members can read memberships in their college"
on public.college_memberships for select
using (public.is_college_member(college_id));

drop policy if exists "users can read own memberships" on public.college_memberships;
create policy "users can read own memberships"
on public.college_memberships for select
using (user_id = auth.uid());

drop policy if exists "college super admins can manage memberships" on public.college_memberships;
create policy "college super admins can manage memberships"
on public.college_memberships for all
using (public.is_super_admin(college_id))
with check (public.is_super_admin(college_id));

drop policy if exists "users can read own admin requests" on public.admin_requests;
create policy "users can read own admin requests"
on public.admin_requests for select
using (user_id = auth.uid());

drop policy if exists "college super admins can read admin requests" on public.admin_requests;
create policy "college super admins can read admin requests"
on public.admin_requests for select
using (public.is_super_admin(college_id));

drop policy if exists "college super admins can update admin requests" on public.admin_requests;
create policy "college super admins can update admin requests"
on public.admin_requests for update
using (public.is_super_admin(college_id))
with check (public.is_super_admin(college_id));

drop policy if exists "college admins can read activity" on public.activity_events;
create policy "college admins can read activity"
on public.activity_events for select
using (public.is_college_admin(college_id));

drop policy if exists "demo requests can be inserted publicly" on public.demo_requests;
create policy "demo requests can be inserted publicly"
on public.demo_requests for insert
with check (true);

drop policy if exists "members can read drives in their college" on public.drives;
create policy "members can read drives in their college"
on public.drives for select
using (public.is_college_member(college_id));

drop policy if exists "admins can manage drives" on public.drives;
create policy "admins can manage drives"
on public.drives for all
using (public.is_college_admin(college_id))
with check (public.is_college_admin(college_id));

drop policy if exists "members can read drive phases" on public.drive_phases;
create policy "members can read drive phases"
on public.drive_phases for select
using (
  exists (
    select 1 from public.drives
    where drives.id = drive_phases.drive_id
      and public.is_college_member(drives.college_id)
  )
);

drop policy if exists "admins can manage drive phases" on public.drive_phases;
create policy "admins can manage drive phases"
on public.drive_phases for all
using (
  exists (
    select 1 from public.drives
    where drives.id = drive_phases.drive_id
      and public.is_college_admin(drives.college_id)
  )
)
with check (
  exists (
    select 1 from public.drives
    where drives.id = drive_phases.drive_id
      and public.is_college_admin(drives.college_id)
  )
);

drop policy if exists "students can manage own resumes" on public.resumes;
create policy "students can manage own resumes"
on public.resumes for all
using (student_id = auth.uid())
with check (student_id = auth.uid());

drop policy if exists "admins can read resumes in their college" on public.resumes;
create policy "admins can read resumes in their college"
on public.resumes for select
using (public.is_college_admin(college_id));

drop policy if exists "students can read own applications" on public.applications;
create policy "students can read own applications"
on public.applications for select
using (student_id = auth.uid());

drop policy if exists "students can create own applications" on public.applications;
create policy "students can create own applications"
on public.applications for insert
with check (student_id = auth.uid());

drop policy if exists "admins can manage college applications" on public.applications;
create policy "admins can manage college applications"
on public.applications for all
using (
  exists (
    select 1 from public.drives
    where drives.id = applications.drive_id
      and public.is_college_admin(drives.college_id)
  )
)
with check (
  exists (
    select 1 from public.drives
    where drives.id = applications.drive_id
      and public.is_college_admin(drives.college_id)
  )
);

create or replace function public.log_activity(
  target_college_id uuid,
  event_type text,
  entity_type text default null,
  entity_id uuid default null,
  metadata jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_event_id uuid;
begin
  insert into public.activity_events (
    college_id,
    actor_id,
    event_type,
    entity_type,
    entity_id,
    metadata
  )
  values (
    target_college_id,
    auth.uid(),
    event_type,
    entity_type,
    entity_id,
    coalesce(metadata, '{}'::jsonb)
  )
  returning id into new_event_id;

  return new_event_id;
end;
$$;

create or replace function public.decide_admin_request(
  request_id uuid,
  decision public.admin_request_status,
  decision_note text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  target_request public.admin_requests%rowtype;
begin
  if decision not in ('approved', 'rejected') then
    raise exception 'decision must be approved or rejected';
  end if;

  select * into target_request
  from public.admin_requests
  where id = request_id
  for update;

  if not found then
    raise exception 'admin request not found';
  end if;

  if not public.is_super_admin(target_request.college_id) then
    raise exception 'not allowed';
  end if;

  update public.admin_requests
  set status = decision,
      note = decision_note,
      decided_by = auth.uid(),
      decided_at = now()
  where id = request_id;

  if decision = 'approved' then
    update public.college_memberships
    set status = 'active'
    where college_id = target_request.college_id
      and user_id = target_request.user_id
      and role = target_request.requested_role;
  elsif decision = 'rejected' then
    update public.college_memberships
    set status = 'suspended'
    where college_id = target_request.college_id
      and user_id = target_request.user_id
      and role = target_request.requested_role;
  end if;

  perform public.log_activity(
    target_request.college_id,
    'admin_request_' || decision::text,
    'admin_request',
    target_request.id,
    jsonb_build_object('requested_role', target_request.requested_role, 'user_id', target_request.user_id)
  );

  return request_id;
end;
$$;

create or replace function public.join_college_workspace(join_code text, requested_role public.user_role)
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

  desired_status := case when requested_role in ('college_admin', 'super_admin') then 'pending'::public.membership_status else 'active'::public.membership_status end;

  insert into public.college_memberships (college_id, user_id, role, status)
  values (target_college.id, auth.uid(), requested_role, desired_status)
  on conflict (college_id, user_id) do update
  set role = excluded.role,
      status = case
        when public.college_memberships.status = 'active' then 'active'::public.membership_status
        else excluded.status
      end
  returning id into membership_id;

  if requested_role in ('college_admin', 'super_admin') then
    insert into public.admin_requests (college_id, user_id, requested_role, status)
    values (target_college.id, auth.uid(), requested_role, 'pending')
    on conflict (college_id, user_id, requested_role) do update
    set status = case
          when public.admin_requests.status = 'approved' then 'approved'::public.admin_request_status
          else 'pending'::public.admin_request_status
        end,
        note = null,
        decided_by = null,
        decided_at = null;
  end if;

  perform public.log_activity(
    target_college.id,
    case
      when requested_role in ('college_admin', 'super_admin') then 'admin_access_requested'
      else 'student_joined'
    end,
    'college_membership',
    membership_id,
    jsonb_build_object('role', requested_role, 'status', desired_status)
  );

  college_id := target_college.id;
  college_name := target_college.name;
  role := requested_role;
  status := desired_status;
  return next;
end;
$$;

grant execute on function public.log_activity(uuid, text, text, uuid, jsonb) to authenticated;
grant execute on function public.decide_admin_request(uuid, public.admin_request_status, text) to authenticated;
grant execute on function public.join_college_workspace(text, public.user_role) to authenticated;

create or replace function public.apply_to_drive(target_drive_id uuid, selected_resume_id uuid default null)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  target_drive public.drives%rowtype;
  first_phase_id uuid;
  new_application_id uuid;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;

  select * into target_drive
  from public.drives
  where id = target_drive_id
    and status in ('open', 'live');

  if not found then
    raise exception 'drive is not open';
  end if;

  if not public.is_college_member(target_drive.college_id) then
    raise exception 'student is not active in this college';
  end if;

  if selected_resume_id is not null and not exists (
    select 1
    from public.resumes
    where id = selected_resume_id
      and student_id = auth.uid()
      and college_id = target_drive.college_id
  ) then
    raise exception 'resume does not belong to this student workspace';
  end if;

  select id into first_phase_id
  from public.drive_phases
  where drive_id = target_drive_id
  order by position asc
  limit 1;

  insert into public.applications (
    drive_id,
    student_id,
    resume_id,
    current_phase_id,
    outcome_due_at
  )
  values (
    target_drive_id,
    auth.uid(),
    selected_resume_id,
    first_phase_id,
    now() + make_interval(days => target_drive.outcome_days)
  )
  on conflict (drive_id, student_id) do update
  set resume_id = coalesce(excluded.resume_id, public.applications.resume_id),
      updated_at = now()
  returning id into new_application_id;

  return new_application_id;
end;
$$;

grant execute on function public.apply_to_drive(uuid, uuid) to authenticated;

insert into public.colleges (name, code, domain)
values ('northbridge college', 'A7F21C', 'northbridge.edu')
on conflict (code) do nothing;

notify pgrst, 'reload schema';
