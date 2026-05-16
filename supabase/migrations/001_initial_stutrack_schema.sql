create extension if not exists pgcrypto;

do $$ begin
  create type public.user_role as enum ('STUDENT', 'COMPANY', 'UNIVERSITY_ADMIN', 'PLATFORM_ADMIN');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.internship_status as enum ('OPEN', 'CLOSED', 'DRAFT');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.internship_type as enum ('REMOTE', 'HYBRID', 'ON_SITE');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.application_status as enum (
    'DRAFT',
    'SUBMITTED',
    'UNDER_REVIEW',
    'TEST_REQUESTED',
    'INTERVIEW_SCHEDULED',
    'OFFER',
    'REJECTED',
    'WITHDRAWN'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.notification_type as enum ('INFO', 'SUCCESS', 'WARNING', 'ERROR');
exception when duplicate_object then null;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role public.user_role not null default 'STUDENT',
  full_name text not null,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.universities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  domain text,
  created_at timestamptz not null default now()
);

create table if not exists public.student_profiles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  university_id text not null default 'univ-demo',
  department text not null default '',
  gpa numeric(3,2) not null default 0,
  skills text[] not null default '{}',
  resume_url text,
  bio text not null default '',
  career_interests text[] not null default '{}'
);

create table if not exists public.company_profiles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  sector text not null default '',
  size text not null default '',
  website text not null default '',
  location text not null default '',
  transparency_score numeric(3,2) not null default 0,
  verified boolean not null default false,
  description text not null default ''
);

create table if not exists public.internships (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.company_profiles(user_id) on delete cascade,
  title text not null,
  description text not null,
  responsibilities text[] not null default '{}',
  requirements text[] not null default '{}',
  status public.internship_status not null default 'OPEN',
  location text not null,
  type public.internship_type not null default 'REMOTE',
  duration text not null,
  stipend text,
  expires_at date not null,
  match_score integer not null default 80,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  internship_id uuid not null references public.internships(id) on delete cascade,
  status public.application_status not null default 'SUBMITTED',
  match_score integer not null default 80,
  match_reason text,
  feedback text,
  documents jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (student_id, internship_id)
);

create table if not exists public.test_results (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  test_name text not null,
  score text not null,
  verified boolean not null default false,
  date date not null,
  valid_until date not null
);

create table if not exists public.experiences (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  company_id uuid not null references public.company_profiles(user_id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  review text not null,
  interview_questions text[] not null default '{}',
  advice text not null default '',
  is_public boolean not null default true,
  likes integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.mentors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  company text not null,
  expertise text[] not null default '{}',
  avatar_url text
);

create table if not exists public.mentorship_requests (
  id uuid primary key default gen_random_uuid(),
  mentor_id uuid not null references public.mentors(id) on delete cascade,
  mentee_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'PENDING',
  message text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.interview_schedules (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications(id) on delete cascade,
  candidate_id uuid not null references public.profiles(id) on delete cascade,
  date date not null,
  time time not null,
  type text not null default 'VIDEO',
  location text not null default '',
  notes text
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  message text not null,
  type public.notification_type not null default 'INFO',
  read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.universities enable row level security;
alter table public.student_profiles enable row level security;
alter table public.company_profiles enable row level security;
alter table public.internships enable row level security;
alter table public.applications enable row level security;
alter table public.test_results enable row level security;
alter table public.experiences enable row level security;
alter table public.mentors enable row level security;
alter table public.mentorship_requests enable row level security;
alter table public.interview_schedules enable row level security;
alter table public.notifications enable row level security;

create policy "profiles_select_own_or_admin" on public.profiles
  for select using (auth.uid() = id or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('UNIVERSITY_ADMIN', 'PLATFORM_ADMIN')));

create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "student_profiles_own_or_admin" on public.student_profiles
  for all using (auth.uid() = user_id or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('UNIVERSITY_ADMIN', 'PLATFORM_ADMIN')))
  with check (auth.uid() = user_id or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('UNIVERSITY_ADMIN', 'PLATFORM_ADMIN')));

create policy "company_profiles_public_read" on public.company_profiles
  for select using (true);

create policy "company_profiles_company_write" on public.company_profiles
  for all using (auth.uid() = user_id or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'PLATFORM_ADMIN'))
  with check (auth.uid() = user_id or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'PLATFORM_ADMIN'));

create policy "internships_public_read" on public.internships
  for select using (true);

create policy "internships_company_write" on public.internships
  for all using (auth.uid() = company_id or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'PLATFORM_ADMIN'))
  with check (auth.uid() = company_id or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'PLATFORM_ADMIN'));

create policy "applications_student_company_admin" on public.applications
  for select using (
    auth.uid() = student_id
    or exists (select 1 from public.internships i where i.id = internship_id and i.company_id = auth.uid())
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('UNIVERSITY_ADMIN', 'PLATFORM_ADMIN'))
  );

create policy "applications_student_insert" on public.applications
  for insert with check (auth.uid() = student_id);

create policy "applications_participant_update" on public.applications
  for update using (
    auth.uid() = student_id
    or exists (select 1 from public.internships i where i.id = internship_id and i.company_id = auth.uid())
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'PLATFORM_ADMIN')
  );

create policy "test_results_student_admin" on public.test_results
  for all using (auth.uid() = student_id or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('UNIVERSITY_ADMIN', 'PLATFORM_ADMIN')))
  with check (auth.uid() = student_id or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('UNIVERSITY_ADMIN', 'PLATFORM_ADMIN')));

create policy "experiences_public_read" on public.experiences
  for select using (is_public or auth.uid() = student_id);

create policy "experiences_student_write" on public.experiences
  for all using (auth.uid() = student_id) with check (auth.uid() = student_id);

create policy "mentors_public_read" on public.mentors
  for select using (true);

create policy "mentorship_requests_participants" on public.mentorship_requests
  for all using (auth.uid() = mentee_id or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'PLATFORM_ADMIN'))
  with check (auth.uid() = mentee_id or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'PLATFORM_ADMIN'));

create policy "interviews_participants" on public.interview_schedules
  for all using (auth.uid() = candidate_id or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('COMPANY', 'PLATFORM_ADMIN')))
  with check (auth.uid() = candidate_id or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('COMPANY', 'PLATFORM_ADMIN')));

create policy "notifications_own" on public.notifications
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "universities_read" on public.universities
  for select using (true);
