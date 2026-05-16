alter table public.internships
  add column if not exists company_name text not null default 'Company';

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  user_role public.user_role := coalesce((new.raw_user_meta_data ->> 'role')::public.user_role, 'STUDENT');
  user_name text := coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1));
begin
  insert into public.profiles (id, email, role, full_name)
  values (new.id, new.email, user_role, user_name)
  on conflict (id) do update set
    email = excluded.email,
    role = excluded.role,
    full_name = excluded.full_name;

  if user_role = 'STUDENT' then
    insert into public.student_profiles (
      user_id,
      university_id,
      department,
      gpa,
      skills,
      bio,
      career_interests
    )
    values (
      new.id,
      'univ-demo',
      'Computer Science',
      0,
      '{}',
      '',
      '{}'
    )
    on conflict (user_id) do nothing;
  end if;

  if user_role = 'COMPANY' then
    insert into public.company_profiles (
      user_id,
      sector,
      size,
      website,
      location,
      transparency_score,
      verified,
      description
    )
    values (
      new.id,
      'Technology',
      '1-50',
      '',
      '',
      0,
      false,
      ''
    )
    on conflict (user_id) do nothing;
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
