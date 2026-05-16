export type UserRole = 'STUDENT' | 'COMPANY' | 'UNIVERSITY_ADMIN' | 'PLATFORM_ADMIN';

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  full_name: string;
  avatar_url?: string;
  createdAt: string;
}

export interface StudentProfile extends UserProfile {
  universityId: string;
  department: string;
  gpa: number;
  skills: string[];
  resumeUrl?: string;
  bio: string;
  careerInterests: string[];
}

export interface CompanyProfile extends UserProfile {
  sector: string;
  size: string;
  website: string;
  location: string;
  transparencyScore: number;
  verified: boolean;
  description: string;
}

export interface Internship {
  id: string;
  companyId: string;
  companyName: string;
  title: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  status: 'OPEN' | 'CLOSED' | 'DRAFT';
  location: string;
  type: 'REMOTE' | 'HYBRID' | 'ON_SITE';
  duration: string;
  stipend?: string;
  expiresAt: string;
  matchScore?: number; // Calculated per student
}

export type ApplicationStatus = 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'TEST_REQUESTED' | 'INTERVIEW_SCHEDULED' | 'OFFER' | 'REJECTED' | 'WITHDRAWN';

export interface Application {
  id: string;
  studentId: string;
  internshipId: string;
  status: ApplicationStatus;
  matchScore: number;
  matchReason?: string;
  feedback?: string;
  createdAt: string;
  updatedAt: string;
  documents?: { name: string; url: string }[];
}

export interface TestResult {
  id: string;
  studentId: string;
  testName: string;
  score: string;
  verified: boolean;
  date: string;
  validUntil: string;
}

export interface Experience {
  id: string;
  studentId: string;
  studentName: string;
  companyId: string;
  companyName: string;
  rating: number;
  review: string;
  interviewQuestions: string[];
  advice: string;
  isPublic: boolean;
  createdAt: string;
  likes: number;
}

export interface MentorshipRequest {
  id: string;
  mentorId: string;
  menteeId: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  message: string;
  createdAt: string;
}

export interface Mentor {
  id: string;
  name: string;
  role: string;
  company: string;
  expertise: string[];
  avatarUrl: string;
}

export interface InterviewSchedule {
  id: string;
  applicationId: string;
  candidateId: string;
  date: string;
  time: string;
  type: 'VIDEO' | 'IN_PERSON' | 'PHONE';
  location: string;
  notes?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  read: boolean;
  createdAt: string;
}
