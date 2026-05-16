import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  Application,
  CompanyProfile,
  Internship,
  Notification,
  StudentProfile,
  UserProfile,
  UserRole,
} from '../types';
import {
  MOCK_APPLICATIONS,
  MOCK_COMPANY,
  MOCK_INTERNSHIPS,
  MOCK_NOTIFICATIONS,
  MOCK_STUDENT,
  MOCK_USERS,
} from '../mockData';

type ProfileRow = {
  id: string;
  email: string;
  role: UserRole;
  full_name: string;
  avatar_url?: string | null;
  created_at: string;
};

type StudentRow = {
  user_id: string;
  university_id: string;
  department: string;
  gpa: number;
  skills: string[] | null;
  resume_url?: string | null;
  bio: string;
  career_interests: string[] | null;
  profiles?: ProfileRow | null;
};

type CompanyRow = {
  user_id: string;
  sector: string;
  size: string;
  website: string;
  location: string;
  transparency_score: number;
  verified: boolean;
  description: string;
  profiles?: ProfileRow | null;
};

type InternshipRow = {
  id: string;
  company_id: string;
  title: string;
  description: string;
  responsibilities: string[] | null;
  requirements: string[] | null;
  status: Internship['status'];
  location: string;
  type: Internship['type'];
  duration: string;
  stipend?: string | null;
  expires_at: string;
  match_score?: number | null;
  company_profiles?: (CompanyRow & { profiles?: ProfileRow | null }) | null;
};

type ApplicationRow = {
  id: string;
  student_id: string;
  internship_id: string;
  status: Application['status'];
  match_score: number;
  match_reason?: string | null;
  feedback?: string | null;
  created_at: string;
  updated_at: string;
  documents?: Application['documents'] | null;
};

type NotificationRow = {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: Notification['type'];
  read: boolean;
  created_at: string;
};

const toProfile = (row: ProfileRow): UserProfile => ({
  id: row.id,
  email: row.email,
  role: row.role,
  full_name: row.full_name,
  avatar_url: row.avatar_url || undefined,
  createdAt: row.created_at,
});

const toStudent = (row: StudentRow): StudentProfile => ({
  ...(row.profiles ? toProfile(row.profiles) : MOCK_STUDENT),
  id: row.user_id,
  universityId: row.university_id,
  department: row.department,
  gpa: row.gpa,
  skills: row.skills || [],
  resumeUrl: row.resume_url || undefined,
  bio: row.bio,
  careerInterests: row.career_interests || [],
});

const toCompany = (row: CompanyRow): CompanyProfile => ({
  ...(row.profiles ? toProfile(row.profiles) : MOCK_COMPANY),
  id: row.user_id,
  sector: row.sector,
  size: row.size,
  website: row.website,
  location: row.location,
  transparencyScore: row.transparency_score,
  verified: row.verified,
  description: row.description,
});

const toInternship = (row: InternshipRow): Internship => ({
  id: row.id,
  companyId: row.company_id,
  companyName: row.company_profiles?.profiles?.full_name || 'Company',
  title: row.title,
  description: row.description,
  responsibilities: row.responsibilities || [],
  requirements: row.requirements || [],
  status: row.status,
  location: row.location,
  type: row.type,
  duration: row.duration,
  stipend: row.stipend || undefined,
  expiresAt: row.expires_at,
  matchScore: row.match_score ?? 80,
});

const toApplication = (row: ApplicationRow): Application => ({
  id: row.id,
  studentId: row.student_id,
  internshipId: row.internship_id,
  status: row.status,
  matchScore: row.match_score,
  matchReason: row.match_reason || undefined,
  feedback: row.feedback || undefined,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  documents: row.documents || undefined,
});

const toNotification = (row: NotificationRow): Notification => ({
  id: row.id,
  userId: row.user_id,
  title: row.title,
  message: row.message,
  type: row.type,
  read: row.read,
  createdAt: row.created_at,
});

export const createProfileForAuthUser = async (input: {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
}) => {
  if (!isSupabaseConfigured) return;

  await supabase.from('profiles').upsert({
    id: input.id,
    email: input.email,
    full_name: input.fullName,
    role: input.role,
  });

  if (input.role === 'STUDENT') {
    await supabase.from('student_profiles').upsert({
      user_id: input.id,
      university_id: 'univ-demo',
      department: 'Computer Science',
      gpa: 0,
      skills: [],
      bio: '',
      career_interests: [],
    });
  }

  if (input.role === 'COMPANY') {
    await supabase.from('company_profiles').upsert({
      user_id: input.id,
      sector: 'Technology',
      size: '1-50',
      website: '',
      location: '',
      transparency_score: 0,
      verified: false,
      description: '',
    });
  }
};

export const getProfile = async (userId: string): Promise<UserProfile | null> => {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
  if (error || !data) return null;
  return toProfile(data as ProfileRow);
};

export const getStudentProfile = async (userId: string): Promise<StudentProfile> => {
  if (!isSupabaseConfigured) return MOCK_STUDENT;
  const { data, error } = await supabase
    .from('student_profiles')
    .select('*, profiles(*)')
    .eq('user_id', userId)
    .maybeSingle();
  if (error || !data) return MOCK_STUDENT;
  return toStudent(data as StudentRow);
};

export const getCompanyProfile = async (userId: string): Promise<CompanyProfile> => {
  if (!isSupabaseConfigured) return MOCK_COMPANY;
  const { data, error } = await supabase
    .from('company_profiles')
    .select('*, profiles(*)')
    .eq('user_id', userId)
    .maybeSingle();
  if (error || !data) return MOCK_COMPANY;
  return toCompany(data as CompanyRow);
};

export const getUsers = async (): Promise<UserProfile[]> => {
  if (!isSupabaseConfigured) return MOCK_USERS;
  const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
  if (error || !data) return MOCK_USERS;
  return (data as ProfileRow[]).map(toProfile);
};

export const getInternships = async (): Promise<Internship[]> => {
  if (!isSupabaseConfigured) return MOCK_INTERNSHIPS;
  const { data, error } = await supabase
    .from('internships')
    .select('*, company_profiles(*, profiles(*))')
    .order('created_at', { ascending: false });
  if (error || !data || data.length === 0) return MOCK_INTERNSHIPS;
  return (data as InternshipRow[]).map(toInternship);
};

export const getApplications = async (studentId?: string): Promise<Application[]> => {
  if (!isSupabaseConfigured) return MOCK_APPLICATIONS;
  let query = supabase.from('applications').select('*').order('created_at', { ascending: false });
  if (studentId) query = query.eq('student_id', studentId);
  const { data, error } = await query;
  if (error || !data || data.length === 0) return MOCK_APPLICATIONS;
  return (data as ApplicationRow[]).map(toApplication);
};

export const getNotifications = async (userId?: string): Promise<Notification[]> => {
  if (!isSupabaseConfigured || !userId) return MOCK_NOTIFICATIONS;
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error || !data || data.length === 0) return MOCK_NOTIFICATIONS;
  return (data as NotificationRow[]).map(toNotification);
};

export const submitApplication = async (input: {
  studentId: string;
  internshipId: string;
  coverNote: string;
  resumeUrl: string;
  matchScore?: number;
}) => {
  if (!isSupabaseConfigured) return { ok: false, reason: 'Supabase is not configured.' };

  const { error } = await supabase.from('applications').insert({
    student_id: input.studentId,
    internship_id: input.internshipId,
    status: 'SUBMITTED',
    match_score: input.matchScore ?? 80,
    match_reason: input.coverNote,
    documents: input.resumeUrl ? [{ name: 'Resume link', url: input.resumeUrl }] : [],
  });

  return error ? { ok: false, reason: error.message } : { ok: true };
};
