import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const publishableKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !publishableKey || !serviceRoleKey) {
  throw new Error('Missing Supabase env vars. Check .env.local.');
}

const admin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const anon = () => createClient(supabaseUrl, publishableKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const demoPassword = 'Password123!';
const demoUsers = [
  { email: 'student@example.com', role: 'STUDENT', fullName: 'Alex Johnson' },
  { email: 'hr@techflow.com', role: 'COMPANY', fullName: 'TechFlow' },
  { email: 'admin@university.edu', role: 'UNIVERSITY_ADMIN', fullName: 'Dr. Sarah Wilson' },
  { email: 'admin@stutrack.com', role: 'PLATFORM_ADMIN', fullName: 'Platform Admin' },
];

const fail = (label, error) => {
  if (error) throw new Error(`${label}: ${error.message}`);
};

const listAllUsers = async () => {
  const users = [];
  let page = 1;
  while (true) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 });
    fail('list auth users', error);
    users.push(...data.users);
    if (data.users.length < 1000) return users;
    page += 1;
  }
};

const ensureAuthUser = async ({ email, role, fullName }) => {
  const existing = (await listAllUsers()).find((user) => user.email === email);

  if (existing) {
    const { data, error } = await admin.auth.admin.updateUserById(existing.id, {
      email_confirm: true,
      password: demoPassword,
      user_metadata: { role, full_name: fullName },
    });
    fail(`update auth user ${email}`, error);
    return data.user;
  }

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password: demoPassword,
    email_confirm: true,
    user_metadata: { role, full_name: fullName },
  });
  fail(`create auth user ${email}`, error);
  return data.user;
};

const hasCompanyNameColumn = async () => {
  const { error } = await admin.from('internships').select('company_name').limit(1);
  return !error;
};

const seed = async () => {
  const authUsers = {};
  for (const demoUser of demoUsers) {
    const user = await ensureAuthUser(demoUser);
    authUsers[demoUser.role] = user;
  }

  const profiles = demoUsers.map((demoUser) => ({
    id: authUsers[demoUser.role].id,
    email: demoUser.email,
    role: demoUser.role,
    full_name: demoUser.fullName,
  }));
  fail('upsert profiles', (await admin.from('profiles').upsert(profiles)).error);

  fail('upsert university', (await admin.from('universities').upsert({
    id: '11111111-1111-1111-1111-111111111111',
    name: 'Northbridge University',
    domain: 'university.edu',
  })).error);

  fail('upsert student profile', (await admin.from('student_profiles').upsert({
    user_id: authUsers.STUDENT.id,
    university_id: '11111111-1111-1111-1111-111111111111',
    department: 'Computer Science',
    gpa: 3.8,
    skills: ['React', 'TypeScript', 'Node.js', 'Python', 'Tailwind CSS'],
    resume_url: 'https://example.com/resume-alex.pdf',
    bio: 'Passionate frontend developer looking for opportunities to build interactive user experiences.',
    career_interests: ['Frontend Development', 'UI/UX Design', 'Fullstack Engineering'],
  })).error);

  fail('upsert company profile', (await admin.from('company_profiles').upsert({
    user_id: authUsers.COMPANY.id,
    sector: 'Technology',
    size: '100-500',
    website: 'https://techflow.com',
    location: 'San Francisco, CA',
    transparency_score: 4.8,
    verified: true,
    description: 'TechFlow is a leading innovator in cloud solutions and enterprise software.',
  })).error);

  const useCompanyName = await hasCompanyNameColumn();
  const internships = [
    {
      id: '22222222-2222-2222-2222-222222222221',
      company_id: authUsers.COMPANY.id,
      ...(useCompanyName ? { company_name: 'TechFlow' } : {}),
      title: 'Frontend Engineering Intern',
      description: 'Work with React, TypeScript, and Tailwind to build modern web apps.',
      responsibilities: ['Build components', 'Fix UI bugs', 'Collaborate with designers'],
      requirements: ['React', 'TypeScript', 'CSS'],
      status: 'OPEN',
      location: 'Remote',
      type: 'REMOTE',
      duration: '3 Months',
      stipend: '$2000/mo',
      expires_at: '2026-06-30',
      match_score: 92,
    },
    {
      id: '22222222-2222-2222-2222-222222222222',
      company_id: authUsers.COMPANY.id,
      ...(useCompanyName ? { company_name: 'TechFlow' } : {}),
      title: 'Data Science Intern',
      description: 'Analyze large datasets and create meaningful visualizations.',
      responsibilities: ['Data cleanup', 'Model training', 'D3 visualization'],
      requirements: ['Python', 'SQL', 'D3.js'],
      status: 'OPEN',
      location: 'New York, NY',
      type: 'HYBRID',
      duration: '6 Months',
      stipend: '$2500/mo',
      expires_at: '2026-07-15',
      match_score: 65,
    },
  ];
  fail('upsert internships', (await admin.from('internships').upsert(internships)).error);

  fail('upsert application', (await admin.from('applications').upsert({
    id: '33333333-3333-3333-3333-333333333331',
    student_id: authUsers.STUDENT.id,
    internship_id: internships[0].id,
    status: 'INTERVIEW_SCHEDULED',
    match_score: 92,
    match_reason: 'Excellent match between React skills and the job requirements.',
    documents: [{ name: 'Resume_Alex_J.pdf', url: 'https://example.com/resume-alex.pdf' }],
  }, { onConflict: 'student_id,internship_id' })).error);

  fail('upsert test result', (await admin.from('test_results').upsert({
    id: '44444444-4444-4444-4444-444444444441',
    student_id: authUsers.STUDENT.id,
    test_name: 'React Technical Skill',
    score: 'Top 5%',
    verified: true,
    date: '2026-04-05',
    valid_until: '2027-04-05',
  })).error);

  fail('upsert experience', (await admin.from('experiences').upsert({
    id: '55555555-5555-5555-5555-555555555551',
    student_id: authUsers.STUDENT.id,
    company_id: authUsers.COMPANY.id,
    rating: 5,
    review: 'Amazing culture and mentorship.',
    interview_questions: ['Explain the virtual DOM', 'How do you handle state?'],
    advice: 'Be curious and ask for help.',
    is_public: true,
    likes: 12,
  })).error);

  fail('upsert mentor', (await admin.from('mentors').upsert({
    id: '66666666-6666-6666-6666-666666666661',
    name: 'James Wilson',
    role: 'Staff Engineer',
    company: 'Google',
    expertise: ['Architecture', 'Career Growth'],
    avatar_url: 'https://i.pravatar.cc/150?u=m1',
  })).error);

  fail('upsert mentorship request', (await admin.from('mentorship_requests').upsert({
    id: '77777777-7777-7777-7777-777777777771',
    mentor_id: '66666666-6666-6666-6666-666666666661',
    mentee_id: authUsers.STUDENT.id,
    status: 'PENDING',
    message: 'I would love help preparing for frontend interviews.',
  })).error);

  fail('upsert interview schedule', (await admin.from('interview_schedules').upsert({
    id: '88888888-8888-8888-8888-888888888881',
    application_id: '33333333-3333-3333-3333-333333333331',
    candidate_id: authUsers.STUDENT.id,
    date: '2026-05-17',
    time: '14:00',
    type: 'VIDEO',
    location: 'Google Meet',
    notes: 'Focus on React basics and project experience.',
  })).error);

  fail('upsert notification', (await admin.from('notifications').upsert({
    id: '99999999-9999-9999-9999-999999999991',
    user_id: authUsers.STUDENT.id,
    title: 'Interview Scheduled',
    message: 'Your interview with TechFlow is set for tomorrow.',
    type: 'SUCCESS',
    read: false,
  })).error);

  return { authUsers, useCompanyName };
};

const countTable = async (table) => {
  const { count, error } = await admin.from(table).select('*', { count: 'exact', head: true });
  fail(`count ${table}`, error);
  return count ?? 0;
};

const testAuthAndRls = async ({ authUsers }) => {
  const studentClient = anon();
  const studentSignIn = await studentClient.auth.signInWithPassword({
    email: 'student@example.com',
    password: demoPassword,
  });
  fail('student sign in', studentSignIn.error);

  const studentId = studentSignIn.data.user.id;
  const studentProfile = await studentClient.from('profiles').select('*').eq('id', studentId).single();
  fail('student read own profile', studentProfile.error);

  const publicInternships = await studentClient.from('internships').select('*').limit(10);
  fail('student read internships', publicInternships.error);

  const applicationFlow = await studentClient.from('applications').upsert({
    student_id: studentId,
    internship_id: '22222222-2222-2222-2222-222222222222',
    status: 'SUBMITTED',
    match_score: 65,
    match_reason: 'Smoke-test application created through authenticated RLS.',
    documents: [],
  }, { onConflict: 'student_id,internship_id' }).select('*').single();
  fail('student application upsert', applicationFlow.error);

  const companyClient = anon();
  const companySignIn = await companyClient.auth.signInWithPassword({
    email: 'hr@techflow.com',
    password: demoPassword,
  });
  fail('company sign in', companySignIn.error);

  const companyApplications = await companyClient.from('applications').select('*').limit(10);
  fail('company read applications for own internships', companyApplications.error);

  const platformClient = anon();
  const platformSignIn = await platformClient.auth.signInWithPassword({
    email: 'admin@stutrack.com',
    password: demoPassword,
  });
  fail('platform admin sign in', platformSignIn.error);

  const allProfiles = await platformClient.from('profiles').select('*').limit(10);
  fail('platform admin read profiles', allProfiles.error);

  return {
    studentProfile: studentProfile.data.email,
    internshipRowsVisibleToStudent: publicInternships.data.length,
    applicationFlowStatus: applicationFlow.data.status,
    companyApplicationRows: companyApplications.data.length,
    platformProfileRows: allProfiles.data.length,
    ids: {
      student: authUsers.STUDENT.id,
      company: authUsers.COMPANY.id,
      universityAdmin: authUsers.UNIVERSITY_ADMIN.id,
      platformAdmin: authUsers.PLATFORM_ADMIN.id,
    },
  };
};

const main = async () => {
  const seeded = await seed();
  const tables = [
    'profiles',
    'universities',
    'student_profiles',
    'company_profiles',
    'internships',
    'applications',
    'test_results',
    'experiences',
    'mentors',
    'mentorship_requests',
    'interview_schedules',
    'notifications',
  ];

  const tableCounts = {};
  for (const table of tables) {
    tableCounts[table] = await countTable(table);
  }

  const rls = await testAuthAndRls(seeded);

  console.log(JSON.stringify({
    ok: true,
    companyNameColumnApplied: seeded.useCompanyName,
    demoPassword,
    tableCounts,
    rls,
  }, null, 2));
};

main().catch((error) => {
  console.error(JSON.stringify({ ok: false, error: error.message }, null, 2));
  process.exit(1);
});
