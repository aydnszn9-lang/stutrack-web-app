create or replace function public.current_user_role()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.current_user_has_role(allowed_roles public.user_role[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_user_role() = any(allowed_roles), false)
$$;

drop policy if exists "profiles_select_own_or_admin" on public.profiles;
drop policy if exists "student_profiles_own_or_admin" on public.student_profiles;
drop policy if exists "company_profiles_company_write" on public.company_profiles;
drop policy if exists "internships_company_write" on public.internships;
drop policy if exists "applications_student_company_admin" on public.applications;
drop policy if exists "applications_participant_update" on public.applications;
drop policy if exists "test_results_student_admin" on public.test_results;
drop policy if exists "mentorship_requests_participants" on public.mentorship_requests;
drop policy if exists "interviews_participants" on public.interview_schedules;

create policy "profiles_select_own_or_admin" on public.profiles
  for select using (
    auth.uid() = id
    or public.current_user_has_role(array['UNIVERSITY_ADMIN', 'PLATFORM_ADMIN']::public.user_role[])
  );

create policy "student_profiles_own_or_admin" on public.student_profiles
  for all using (
    auth.uid() = user_id
    or public.current_user_has_role(array['UNIVERSITY_ADMIN', 'PLATFORM_ADMIN']::public.user_role[])
  )
  with check (
    auth.uid() = user_id
    or public.current_user_has_role(array['UNIVERSITY_ADMIN', 'PLATFORM_ADMIN']::public.user_role[])
  );

create policy "company_profiles_company_write" on public.company_profiles
  for all using (
    auth.uid() = user_id
    or public.current_user_has_role(array['PLATFORM_ADMIN']::public.user_role[])
  )
  with check (
    auth.uid() = user_id
    or public.current_user_has_role(array['PLATFORM_ADMIN']::public.user_role[])
  );

create policy "internships_company_write" on public.internships
  for all using (
    auth.uid() = company_id
    or public.current_user_has_role(array['PLATFORM_ADMIN']::public.user_role[])
  )
  with check (
    auth.uid() = company_id
    or public.current_user_has_role(array['PLATFORM_ADMIN']::public.user_role[])
  );

create policy "applications_student_company_admin" on public.applications
  for select using (
    auth.uid() = student_id
    or exists (select 1 from public.internships i where i.id = internship_id and i.company_id = auth.uid())
    or public.current_user_has_role(array['UNIVERSITY_ADMIN', 'PLATFORM_ADMIN']::public.user_role[])
  );

create policy "applications_participant_update" on public.applications
  for update using (
    auth.uid() = student_id
    or exists (select 1 from public.internships i where i.id = internship_id and i.company_id = auth.uid())
    or public.current_user_has_role(array['PLATFORM_ADMIN']::public.user_role[])
  )
  with check (
    auth.uid() = student_id
    or exists (select 1 from public.internships i where i.id = internship_id and i.company_id = auth.uid())
    or public.current_user_has_role(array['PLATFORM_ADMIN']::public.user_role[])
  );

create policy "test_results_student_admin" on public.test_results
  for all using (
    auth.uid() = student_id
    or public.current_user_has_role(array['UNIVERSITY_ADMIN', 'PLATFORM_ADMIN']::public.user_role[])
  )
  with check (
    auth.uid() = student_id
    or public.current_user_has_role(array['UNIVERSITY_ADMIN', 'PLATFORM_ADMIN']::public.user_role[])
  );

create policy "mentorship_requests_participants" on public.mentorship_requests
  for all using (
    auth.uid() = mentee_id
    or public.current_user_has_role(array['PLATFORM_ADMIN']::public.user_role[])
  )
  with check (
    auth.uid() = mentee_id
    or public.current_user_has_role(array['PLATFORM_ADMIN']::public.user_role[])
  );

create policy "interviews_participants" on public.interview_schedules
  for all using (
    auth.uid() = candidate_id
    or public.current_user_has_role(array['COMPANY', 'PLATFORM_ADMIN']::public.user_role[])
  )
  with check (
    auth.uid() = candidate_id
    or public.current_user_has_role(array['COMPANY', 'PLATFORM_ADMIN']::public.user_role[])
  );
