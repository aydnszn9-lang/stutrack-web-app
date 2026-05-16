import { 
  UserProfile, 
  StudentProfile, 
  CompanyProfile, 
  Internship, 
  Application, 
  TestResult, 
  Experience, 
  Mentor, 
  MentorshipRequest,
  InterviewSchedule,
  Notification
} from './types';

export const MOCK_USERS: UserProfile[] = [
  { id: 's1', email: 'student@example.com', role: 'STUDENT', full_name: 'Alex Johnson', createdAt: '2026-01-01' },
  { id: 'c1', email: 'hr@techflow.com', role: 'COMPANY', full_name: 'TechFlow HR', createdAt: '2026-01-01' },
  { id: 'u1', email: 'admin@university.edu', role: 'UNIVERSITY_ADMIN', full_name: 'Dr. Sarah Wilson', createdAt: '2026-01-01' },
  { id: 'p1', email: 'admin@stutrack.com', role: 'PLATFORM_ADMIN', full_name: 'Platform Admin', createdAt: '2026-01-01' },
];

export const MOCK_STUDENT: StudentProfile = {
  ...MOCK_USERS[0],
  universityId: 'univ1',
  department: 'Computer Science',
  gpa: 3.8,
  skills: ['React', 'TypeScript', 'Node.js', 'Python', 'Tailwind CSS'],
  bio: 'Passionate frontend developer looking for opportunities to build interactive user experiences.',
  careerInterests: ['Frontend Development', 'UI/UX Design', 'Fullstack Engineering'],
};

export const MOCK_COMPANY: CompanyProfile = {
  ...MOCK_USERS[1],
  sector: 'Technology',
  size: '100-500',
  website: 'https://techflow.com',
  location: 'San Francisco, CA',
  transparencyScore: 4.8,
  verified: true,
  description: 'TechFlow is a leading innovator in cloud solutions and enterprise software.',
};

export const MOCK_INTERNSHIPS: Internship[] = [
  {
    id: '1',
    companyId: 'c1',
    companyName: 'TechFlow',
    title: 'Frontend Engineering Intern',
    description: 'Work with React, TypeScript, and Tailwind to build modern web apps.',
    responsibilities: ['Build components', 'Fix UI bugs', 'Collaborate with designers'],
    requirements: ['React', 'TypeScript', 'CSS'],
    status: 'OPEN',
    location: 'Remote',
    type: 'REMOTE',
    duration: '3 Months',
    stipend: '$2000/mo',
    expiresAt: '2026-06-30',
    matchScore: 92
  },
  {
    id: '2',
    companyId: 'c2',
    companyName: 'DataViz Inc',
    title: 'Data Science Intern',
    description: 'Analyze large datasets and create meaningful visualizations.',
    responsibilities: ['Data cleanup', 'Model training', 'D3 visualization'],
    requirements: ['Python', 'SQL', 'D3.js'],
    status: 'OPEN',
    location: 'New York, NY',
    type: 'HYBRID',
    duration: '6 Months',
    stipend: '$2500/mo',
    expiresAt: '2026-07-15',
    matchScore: 65
  },
  {
    id: '3',
    companyId: 'c3',
    companyName: 'SecureNet',
    title: 'Cybersecurity Analyst Intern',
    description: 'Assist in monitoring and securing network infrastructure.',
    responsibilities: ['Log analysis', 'Pentesting support', 'Security reports'],
    requirements: ['Networking', 'Linux', 'Security+'],
    status: 'OPEN',
    location: 'London, UK',
    type: 'ON_SITE',
    duration: '4 Months',
    stipend: '£1800/mo',
    expiresAt: '2026-06-15',
    matchScore: 40
  },
  {
    id: '4',
    companyId: 'c1',
    companyName: 'TechFlow',
    title: 'DevOps Intern',
    description: 'Learn Jenkins, Docker, and Kubernetes in a production environment.',
    responsibilities: ['CI/CD maintenance', 'Cloud infra support'],
    requirements: ['Linux', 'Bash', 'Docker'],
    status: 'OPEN',
    location: 'Remote',
    type: 'REMOTE',
    duration: '3 Months',
    stipend: '$2200/mo',
    expiresAt: '2026-08-01',
    matchScore: 78
  }
];

export const MOCK_APPLICATIONS: Application[] = [
  {
    id: 'a1',
    studentId: 's1',
    internshipId: '1',
    status: 'INTERVIEW_SCHEDULED',
    matchScore: 92,
    matchReason: 'Excellent match between your React skills and the job requirements.',
    createdAt: '2026-05-10',
    updatedAt: '2026-05-12',
    documents: [{ name: 'Resume_Alex_J.pdf', url: '#' }]
  },
  {
    id: 'a2',
    studentId: 's1',
    internshipId: '2',
    status: 'SUBMITTED',
    matchScore: 65,
    matchReason: 'Strong Python background but limited D3.js experience.',
    createdAt: '2026-05-14',
    updatedAt: '2026-05-14'
  }
];

export const MOCK_TEST_RESULTS: TestResult[] = [
  { id: 't1', studentId: 's1', testName: 'General Aptitude', score: '88/100', verified: true, date: '2026-02-15', validUntil: '2027-02-15' },
  { id: 't2', studentId: 's1', testName: 'English Proficiency (TOEFL)', score: '105/120', verified: true, date: '2025-11-20', validUntil: '2027-11-20' },
  { id: 't3', studentId: 's1', testName: 'React Technical Skill', score: 'Top 5%', verified: true, date: '2026-04-05', validUntil: '2027-04-05' },
];

export const MOCK_EXPERIENCES: Experience[] = [
  {
    id: 'e1',
    studentId: 's2',
    studentName: 'Chris Evans',
    companyId: 'c1',
    companyName: 'TechFlow',
    rating: 5,
    review: 'Amazing culture and mentorship. I learned more in 3 months than in a year of college.',
    interviewQuestions: ['Explain the virtual DOM', 'How do you handle state?'],
    advice: 'Be curious and don\'t be afraid to ask for help.',
    isPublic: true,
    createdAt: '2025-12-15',
    likes: 12
  },
  {
    id: 'e2',
    studentId: 's3',
    studentName: 'Emily Blunt',
    companyId: 'c2',
    companyName: 'DataViz Inc',
    rating: 4,
    review: 'Solid projects, but fast-paced. Be ready to learn SQL on the fly.',
    interviewQuestions: ['Difference between INNER and LEFT join?', 'How to optimize a D3 chart?'],
    advice: 'Master SQL basics before arriving.',
    isPublic: true,
    createdAt: '2026-01-20',
    likes: 8
  }
];

export const MOCK_MENTORS: Mentor[] = [
  { id: 'm1', name: 'James Wilson', role: 'Staff Engineer', company: 'Google', expertise: ['Architecture', 'Career Growth'], avatarUrl: 'https://i.pravatar.cc/150?u=m1' },
  { id: 'm2', name: 'Linda Carter', role: 'Lead Designer', company: 'Airbnb', expertise: ['UI/UX', 'Product Thinking'], avatarUrl: 'https://i.pravatar.cc/150?u=m2' },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'n1', userId: 's1', title: 'Interview Scheduled', message: 'Your interview with TechFlow is set for tomorrow.', type: 'SUCCESS', read: false, createdAt: '2026-05-15 10:00:00' },
  { id: 'n2', userId: 's1', title: 'New Recommendation', message: 'A new DevOps Internship at TechFlow matches your profile.', type: 'INFO', read: true, createdAt: '2026-05-14 15:30:00' },
];

export const MOCK_INTERVIEWS: InterviewSchedule[] = [
  { 
    id: 'i1', 
    applicationId: 'a1', 
    candidateId: 's1', 
    date: '2026-05-17', 
    time: '14:00', 
    type: 'VIDEO', 
    location: 'Google Meet', 
    notes: 'Focus on React basics and project experience.' 
  }
];
