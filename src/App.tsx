import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserRole } from './types';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { AuthSimulation } from './components/auth/AuthSimulation';
import { StudentDashboardView } from './components/student/Dashboard';
import { InternshipListingsView } from './components/student/InternshipListings';
import { MyApplicationsView } from './components/student/MyApplications';
import { CompanyDashboardView } from './components/company/Dashboard';
import { UniversityDashboardView } from './components/university/Dashboard';
import { AdminDashboardView } from './components/admin/Dashboard';
import { Card, Badge, Button } from './components/common/UI';
import { MOCK_USERS, MOCK_STUDENT, MOCK_COMPANY, MOCK_INTERNSHIPS, MOCK_APPLICATIONS } from './mockData';
import { 
  Sparkles, 
  MessageSquare, 
  CheckCircle2, 
  Star,
  TrendingUp,
  Briefcase,
  Building2,
  Calendar,
  FileText,
  ShieldCheck,
  Users,
  BarChart3,
  Settings,
  ArrowLeft,
  Send
} from 'lucide-react';

const PrototypeNotice = ({ message, onClose }: { message: string; onClose: () => void }) => (
  <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-indigo-100 bg-indigo-50 px-5 py-4 text-sm text-indigo-900 shadow-sm md:flex-row md:items-center md:justify-between">
    <span className="font-semibold">{message}</span>
    <button onClick={onClose} className="text-xs font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-800">
      Dismiss
    </button>
  </div>
);

const PageHeader = ({ title, subtitle, icon: Icon, onBack }: { title: string; subtitle: string; icon: any; onBack?: () => void }) => (
  <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
    <div className="flex items-center gap-4">
      {onBack && (
        <button onClick={onBack} className="rounded-xl border border-slate-200 p-2 text-slate-500 transition-colors hover:border-indigo-200 hover:text-indigo-600">
          <ArrowLeft className="h-5 w-5" />
        </button>
      )}
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900">{title}</h1>
        <p className="text-sm font-medium text-slate-500">{subtitle}</p>
      </div>
    </div>
  </div>
);

const EmptyState = ({ title, body, actionLabel, onAction }: { title: string; body: string; actionLabel?: string; onAction?: () => void }) => (
  <Card className="p-8 text-center">
    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
      <Sparkles className="h-7 w-7" />
    </div>
    <h3 className="font-display text-xl font-bold text-slate-900">{title}</h3>
    <p className="mx-auto mt-2 max-w-xl text-sm font-medium leading-relaxed text-slate-500">{body}</p>
    {actionLabel && onAction && (
      <Button className="mx-auto mt-6" onClick={onAction}>{actionLabel}</Button>
    )}
  </Card>
);

export default function App() {
  const [role, setRole] = useState<UserRole | null>(null);
  const [activePage, setActivePage] = useState<string>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);

  const currentUser = useMemo(() => {
    if (role === 'STUDENT') return MOCK_STUDENT;
    if (role === 'COMPANY') return MOCK_COMPANY;
    return MOCK_USERS.find(u => u.role === role) || MOCK_USERS[0];
  }, [role]);

  if (!role) {
    return <AuthSimulation onLogin={(r) => { setRole(r); setActivePage('dashboard'); setNotice(null); }} />;
  }

  const showPrototypeNotice = (label: string) => {
    setNotice(`${label} is wired in the frontend prototype. It will save real data after Supabase integration.`);
  };

  const renderContent = () => {
    // Shared Student Pages
    if (role === 'STUDENT') {
      if (activePage.startsWith('job_')) {
        const job = MOCK_INTERNSHIPS.find(item => `job_${item.id}` === activePage);
        return (
          <div className="space-y-6">
            <PageHeader title={job?.title || 'Internship Details'} subtitle={job ? `${job.companyName} - ${job.location}` : 'Selected internship'} icon={Briefcase} onBack={() => setActivePage('jobs')} />
            {job ? (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <Card className="p-6 lg:col-span-2">
                  <h2 className="mb-3 font-display text-xl font-bold text-slate-900">Role Overview</h2>
                  <p className="text-sm font-medium leading-relaxed text-slate-600">{job.description}</p>
                  <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Badge variant="purple">{job.type.replace('_', ' ')}</Badge>
                    <Badge variant="info">{job.duration}</Badge>
                    <Badge variant="success">{job.matchScore}% Match</Badge>
                  </div>
                  <h3 className="mb-3 mt-8 font-bold text-slate-900">Requirements</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.requirements.map(req => <span key={req} className="rounded-lg bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">{req}</span>)}
                  </div>
                </Card>
                <Card className="p-6">
                  <div className="mb-6 flex items-center gap-3">
                    <Building2 className="h-8 w-8 text-indigo-600" />
                    <div>
                      <div className="font-bold text-slate-900">{job.companyName}</div>
                      <div className="text-xs font-medium text-slate-500">{job.stipend}</div>
                    </div>
                  </div>
                  <Button className="w-full" onClick={() => setActivePage(`apply_${job.id}`)}>Apply Now</Button>
                  <Button variant="outline" className="mt-3 w-full" onClick={() => setActivePage('simulator')}>Run Simulator</Button>
                </Card>
              </div>
            ) : <EmptyState title="Internship not found" body="This listing is no longer available in the current dataset." actionLabel="Back to Internships" onAction={() => setActivePage('jobs')} />}
          </div>
        );
      }

      if (activePage.startsWith('apply_')) {
        const job = MOCK_INTERNSHIPS.find(item => `apply_${item.id}` === activePage);
        return (
          <div className="space-y-6">
            <PageHeader title="Submit Application" subtitle={job ? `${job.title} at ${job.companyName}` : 'Application form'} icon={Send} onBack={() => setActivePage('jobs')} />
            <Card className="mx-auto max-w-3xl p-8">
              <div className="grid gap-6">
                <label className="space-y-2">
                  <span className="text-xs font-black uppercase tracking-widest text-slate-400">Cover note</span>
                  <textarea className="h-36 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium outline-none ring-indigo-500/10 transition-all focus:ring-4" placeholder="Tell the company why you are a strong fit..." />
                </label>
                <label className="space-y-2">
                  <span className="text-xs font-black uppercase tracking-widest text-slate-400">Resume link</span>
                  <input className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium outline-none ring-indigo-500/10 transition-all focus:ring-4" placeholder="https://..." />
                </label>
                <Button onClick={() => showPrototypeNotice('Application submission')}>Submit Application</Button>
              </div>
            </Card>
          </div>
        );
      }

      if (activePage.startsWith('application_')) {
        const application = MOCK_APPLICATIONS.find(item => `application_${item.id}` === activePage);
        const job = MOCK_INTERNSHIPS.find(item => item.id === application?.internshipId);
        return (
          <div className="space-y-6">
            <PageHeader title="Application Status" subtitle={job ? `${job.title} at ${job.companyName}` : 'Track your application'} icon={FileText} onBack={() => setActivePage('applications')} />
            {application ? (
              <Card className="p-8">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                  <Badge variant={application.status === 'INTERVIEW_SCHEDULED' ? 'success' : 'info'}>{application.status.replace('_', ' ')}</Badge>
                  <span className="text-sm font-black text-indigo-600">{application.matchScore}% match</span>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  {['Submitted', 'Company Review', application.status === 'INTERVIEW_SCHEDULED' ? 'Interview Scheduled' : 'Next Step Pending'].map((step, index) => (
                    <div key={step} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                      <div className="mb-2 text-xs font-black uppercase tracking-widest text-slate-400">Step {index + 1}</div>
                      <div className="font-bold text-slate-900">{step}</div>
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-sm font-medium leading-relaxed text-slate-600">{application.matchReason || 'No AI match explanation yet.'}</p>
                <Button className="mt-6" onClick={() => showPrototypeNotice('Interview confirmation')}>Confirm Next Step</Button>
              </Card>
            ) : <EmptyState title="Application not found" body="This application is not in the current dataset." actionLabel="Back to Applications" onAction={() => setActivePage('applications')} />}
          </div>
        );
      }

      switch (activePage) {
        case 'dashboard': return <StudentDashboardView onNavigate={setActivePage} />;
        case 'jobs': return <InternshipListingsView onNavigate={setActivePage} />;
        case 'applications': return <MyApplicationsView onNavigate={setActivePage} />;
        case 'profile':
          return (
            <div className="space-y-6">
              <PageHeader title="Student Profile" subtitle="Keep your profile ready for matching and applications." icon={Settings} />
              <Card className="p-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <div><div className="text-xs font-black uppercase tracking-widest text-slate-400">Name</div><div className="mt-1 font-bold text-slate-900">{MOCK_STUDENT.full_name}</div></div>
                  <div><div className="text-xs font-black uppercase tracking-widest text-slate-400">Department</div><div className="mt-1 font-bold text-slate-900">{MOCK_STUDENT.department}</div></div>
                  <div><div className="text-xs font-black uppercase tracking-widest text-slate-400">GPA</div><div className="mt-1 font-bold text-slate-900">{MOCK_STUDENT.gpa}</div></div>
                  <div><div className="text-xs font-black uppercase tracking-widest text-slate-400">Career Interests</div><div className="mt-1 font-bold text-slate-900">{MOCK_STUDENT.careerInterests.join(', ')}</div></div>
                </div>
                <div className="mt-8 flex flex-wrap gap-2">
                  {MOCK_STUDENT.skills.map(skill => (
                    <span key={skill}>
                      <Badge variant="purple">{skill}</Badge>
                    </span>
                  ))}
                </div>
                <Button className="mt-8" onClick={() => showPrototypeNotice('Profile update')}>Save Profile</Button>
              </Card>
            </div>
          );
        case 'simulator': 
          return (
            <div className="space-y-6">
              <Card className="p-8 bg-slate-900 text-white overflow-hidden relative border-none ring-4 ring-indigo-500/20">
                <div className="relative z-10">
                   <h2 className="text-2xl font-display font-bold mb-2">AI Internship Simulator</h2>
                   <p className="text-slate-400 mb-6 max-w-xl">
                      Run a simulated interview and get a real-time assessment of your hiring probability based on your current profile.
                   </p>
                   <Button variant="primary" onClick={() => showPrototypeNotice('AI simulator')}>Start New Simulation</Button>
                </div>
                <Sparkles className="absolute -right-10 -bottom-10 w-64 h-64 text-indigo-500/10" />
              </Card>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <Card className="p-6">
                    <h3 className="font-bold text-slate-900 mb-4">Past Simulations</h3>
                    <div className="space-y-4">
                       <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                          <div>
                             <div className="font-bold text-sm">Frontend Dev @ TechFlow</div>
                             <div className="text-xs text-slate-400">May 12, 2026</div>
                          </div>
                          <Badge variant="success">82% Possible</Badge>
                       </div>
                    </div>
                 </Card>
                 <Card className="p-6">
                    <h3 className="font-bold text-slate-900 mb-4">Improvement Areas</h3>
                    <div className="space-y-2">
                       {['Cloud Infrastructure', 'D3.js Visualization', 'System Design Basics'].map(s => (
                         <div key={s} className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                           <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" /> {s}
                         </div>
                       ))}
                    </div>
                 </Card>
              </div>
            </div>
          );
        case 'tests':
          return (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                 <h2 className="text-2xl font-display font-bold text-slate-900">Verified Test Results</h2>
                 <Button variant="outline" onClick={() => showPrototypeNotice('Test upload')}>Upload New Result</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {['General Aptitude', 'Technical: React', 'English Proficiency'].map((t, i) => (
                   <Card key={i} className="p-6 flex flex-col items-center text-center">
                      <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4">
                         <CheckCircle2 className="w-6 h-6 text-indigo-600" />
                      </div>
                      <h3 className="font-bold text-slate-900 leading-tight">{t}</h3>
                      <div className="text-3xl font-black text-indigo-600 my-4">{85 + i}%</div>
                      <Badge variant="success">Verified</Badge>
                      <Button variant="ghost" className="mt-6 text-xs w-full text-slate-400 hover:text-indigo-600" onClick={() => showPrototypeNotice('Consent management')}>Manage Consent</Button>
                   </Card>
                ))}
              </div>
            </div>
          );
        case 'mentorship':
          return (
            <div className="space-y-6">
               <h2 className="text-2xl font-display font-bold text-slate-900">Mentorship Hub</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-6 flex items-center gap-6">
                     <img src="https://i.pravatar.cc/150?u=m1" className="w-20 h-20 rounded-2xl border-4 border-indigo-50 shadow-sm shrink-0" alt="Mentor" />
                     <div className="flex-1">
                        <h3 className="font-bold text-lg text-slate-900">James Wilson</h3>
                        <p className="text-sm text-slate-500 mb-4 font-medium">Staff Engineer @ Google</p>
                        <div className="flex gap-2">
                           <Button variant="primary" className="text-xs px-4 py-1.5 h-auto" onClick={() => showPrototypeNotice('Mentor messaging')}>Message</Button>
                           <Button variant="outline" className="text-xs px-4 py-1.5 h-auto" onClick={() => showPrototypeNotice('Mentor scheduling')}>Schedule</Button>
                        </div>
                     </div>
                  </Card>
                  <Card className="p-6 bg-slate-950 text-white flex flex-col justify-center text-center relative overflow-hidden group">
                     <div className="relative z-10">
                        <h3 className="font-bold text-lg mb-2">Want a new Perspective?</h3>
                        <p className="text-xs text-slate-400 mb-6 max-w-[200px] mx-auto font-medium">Connect with 500+ industry experts from across the globe.</p>
                        <Button variant="primary" className="mx-auto bg-indigo-600" onClick={() => showPrototypeNotice('Mentor browsing')}>Browse Mentors</Button>
                     </div>
                     <Star className="absolute -right-8 -bottom-8 w-32 h-32 text-indigo-500/10 rotate-12 group-hover:rotate-0 transition-transform duration-500" />
                  </Card>
               </div>
            </div>
          );
        case 'experiences':
          return (
            <div className="space-y-6">
               <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <h2 className="text-2xl font-display font-bold text-slate-900">Experience Database</h2>
                  <Button variant="primary" onClick={() => showPrototypeNotice('Experience review')}>Add My Review</Button>
               </div>
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-1 space-y-4">
                     <Card className="p-6">
                        <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                           <TrendingUp className="w-5 h-5 text-indigo-600" /> Trending Companies
                        </h3>
                        <div className="space-y-3">
                           {['TechFlow', 'DataViz', 'SecureNet', 'Global Finance', 'InnovateX'].map(c => (
                             <div key={c} className="flex justify-between items-center group cursor-pointer hover:bg-slate-50 p-3 rounded-xl transition-all border border-transparent hover:border-slate-100">
                                <span className="text-sm font-bold text-slate-700">{c}</span>
                                <Badge variant="info">4.{Math.floor(Math.random() * 9)} Rating</Badge>
                             </div>
                           ))}
                        </div>
                     </Card>
                  </div>
                  <div className="lg:col-span-2 space-y-6">
                     {[1, 2, 3].map(i => (
                       <Card key={i} className="p-6 hover:border-indigo-200 transition-all cursor-pointer">
                          <div className="flex justify-between items-start mb-4">
                             <div className="flex gap-4">
                               <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 border border-slate-100">
                                  <Star className="w-6 h-6" />
                               </div>
                               <div>
                                  <h3 className="font-bold text-slate-900">Product Design Internship</h3>
                                  <p className="text-xs text-slate-500 font-medium">Airbnb • Summer 2025</p>
                               </div>
                             </div>
                             <div className="flex text-amber-400 gap-0.5">
                                {[1,2,3,4,5].map(s => <Star key={s} className="w-3.5 h-3.5 fill-current" />)}
                             </div>
                          </div>
                          <p className="text-sm text-slate-600 mb-6 leading-relaxed font-medium">
                            The culture was incredible. I was given real ownership of the hosting dashboard. The mentor sessions every Monday were the highlight of my week, providing invaluable feedback.
                          </p>
                          <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-t border-slate-50 pt-4">
                             <button onClick={() => showPrototypeNotice('Helpful vote')} className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors"><TrendingUp className="w-3.5 h-3.5" /> Helpful (24)</button>
                             <button onClick={() => showPrototypeNotice('Experience Q&A')} className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors"><MessageSquare className="w-3.5 h-3.5" /> View Q&A</button>
                          </div>
                       </Card>
                     ))}
                  </div>
               </div>
            </div>
          );
        default: return <StudentDashboardView onNavigate={setActivePage} />;
      }
    }

    // Role-specific Dashboards
    if (role === 'COMPANY') {
      switch (activePage) {
        case 'dashboard': return <CompanyDashboardView onNavigate={setActivePage} />;
        case 'create_job': 
          return (
            <Card className="max-w-4xl mx-auto p-10">
               <h2 className="text-3xl font-display font-black mb-1 text-slate-900 tracking-tight">Post New Internship</h2>
               <p className="text-slate-400 text-sm mb-10 font-medium">Fill in the details to find your next great intern.</p>
               <div className="space-y-8">
                  <div className="grid grid-cols-2 gap-8">
                     <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Job Title</label>
                        <input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 ring-indigo-500/10 outline-none font-medium transition-all" placeholder="e.g. Backend Developer" />
                     </div>
                     <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Department</label>
                        <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 ring-indigo-500/10 outline-none font-medium transition-all">
                           <option>Engineering</option>
                           <option>Design</option>
                           <option>Marketing</option>
                        </select>
                     </div>
                  </div>
                  <div className="space-y-3">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</label>
                     <textarea className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 ring-indigo-500/10 outline-none h-40 font-medium transition-all" placeholder="Tell us about the role..." />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                     <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</label>
                       <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 ring-indigo-500/10 outline-none font-medium transition-all">
                          <option>Remote</option>
                          <option>Hybrid</option>
                          <option>On-site</option>
                       </select>
                     </div>
                     <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Duration</label>
                       <input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 ring-indigo-500/10 outline-none font-medium transition-all" placeholder="e.g. 3 Months" />
                     </div>
                     <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Stipend</label>
                       <input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 ring-indigo-500/10 outline-none font-medium transition-all" placeholder="$2000/mo" />
                     </div>
                  </div>
                  <div className="pt-10 flex gap-6 border-t border-slate-100">
                     <Button variant="outline" className="flex-1 py-4 h-auto text-slate-600" onClick={() => showPrototypeNotice('Draft saving')}>Save Draft</Button>
                     <Button className="flex-[2] py-4 h-auto shadow-xl shadow-indigo-100" onClick={() => showPrototypeNotice('Internship publishing')}>Publish Listing</Button>
                  </div>
               </div>
            </Card>
          );
        case 'manage_jobs':
          return <RoleListPage title="Manage Internship Posts" subtitle="Review active listings, drafts, and expired posts." icon={Briefcase} rows={MOCK_INTERNSHIPS.map(job => [job.title, job.status, job.expiresAt])} onAction={showPrototypeNotice} />;
        case 'applicants':
          return <RoleListPage title="Applicants" subtitle="Review candidate matches and application stages." icon={Users} rows={['Alex Johnson|92% Match|Interview', 'Sarah Lee|86% Match|Shortlist', 'Kevin Hart|74% Match|Review'].map(row => row.split('|'))} onAction={showPrototypeNotice} />;
        case 'interviews':
          return <RoleListPage title="Interviews" subtitle="Manage interview slots and candidate communication." icon={Calendar} rows={['Alex Johnson|Today 14:00|Video', 'Sarah Lee|Tomorrow 10:00|Office'].map(row => row.split('|'))} onAction={showPrototypeNotice} />;
        case 'transparency':
          return <TransparencyPage onAction={showPrototypeNotice} />;
        case 'profile':
          return <CompanyProfilePage onAction={showPrototypeNotice} />;
        default: return <CompanyDashboardView onNavigate={setActivePage} />;
      }
    }
    
    if (role === 'UNIVERSITY_ADMIN') {
      switch (activePage) {
        case 'dashboard': return <UniversityDashboardView onNavigate={setActivePage} />;
        case 'student_records':
          return <RoleListPage title="Student Records" subtitle="Verify student internship records and academic credit." icon={FileText} rows={['Chris Evans|CS Dept|Pending Approval', 'Emily Blunt|Design Dept|In Review', 'Alex Johnson|CS Dept|Verified'].map(row => row.split('|'))} onAction={showPrototypeNotice} />;
        case 'company_verification':
          return <RoleListPage title="Partnership Requests" subtitle="Approve trusted companies for university internship programs." icon={ShieldCheck} rows={['TechFlow|Technology|Verified', 'DataViz Inc|Analytics|Pending', 'SecureNet|Security|Pending'].map(row => row.split('|'))} onAction={showPrototypeNotice} />;
        case 'reports':
          return <ReportsPage title="University Analytics" subtitle="Placement, department, and partner company reports." onAction={showPrototypeNotice} />;
        default: return <UniversityDashboardView onNavigate={setActivePage} />;
      }
    }

    if (role === 'PLATFORM_ADMIN') {
      switch (activePage) {
        case 'dashboard': return <AdminDashboardView onNavigate={setActivePage} />;
        case 'user_management':
          return <RoleListPage title="User Control" subtitle="Search, review, and manage platform users." icon={Users} rows={MOCK_USERS.map(user => [user.full_name, user.role, user.email])} onAction={showPrototypeNotice} />;
        case 'verification':
          return <RoleListPage title="Verifications" subtitle="Audit company, university, and identity checks." icon={CheckCircle2} rows={['TechFlow|Company|Approved', 'SecureNet|Company|Pending', 'Northbridge University|University|Review'].map(row => row.split('|'))} onAction={showPrototypeNotice} />;
        case 'moderation':
          return <RoleListPage title="Moderation" subtitle="Review reported experiences, jobs, and messages." icon={ShieldCheck} rows={['Experience Review|Spam / Offensive|Pending', 'Job Listing|Misleading Info|Urgent', 'Company Profile|Fake Account|Pending'].map(row => row.split('|'))} onAction={showPrototypeNotice} />;
        case 'analytics':
          return <ReportsPage title="Global Stats" subtitle="Platform-wide adoption, moderation, and placement metrics." onAction={showPrototypeNotice} />;
        default: return <AdminDashboardView onNavigate={setActivePage} />;
      }
    }

    return (
      <div className="flex items-center justify-center min-h-[400px] bg-white rounded-3xl border-2 border-dashed border-slate-200 text-slate-400 font-medium">
         The view for "{activePage}" will be available in the next prototype update.
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar 
        role={role} 
        activeItem={activePage} 
        onNavigate={setActivePage} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen}
        onLogout={() => setRole(null)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header 
          role={role} 
          userName={currentUser?.full_name || 'User'} 
          onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} 
        />

        <main className="p-4 md:p-10 flex-1 overflow-y-auto">
          {notice && <div className="max-w-7xl mx-auto"><PrototypeNotice message={notice} onClose={() => setNotice(null)} /></div>}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${role}-${activePage}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="max-w-7xl mx-auto"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

const RoleListPage = ({ title, subtitle, icon, rows, onAction }: { title: string; subtitle: string; icon: any; rows: string[][]; onAction: (label: string) => void }) => (
  <div className="space-y-6">
    <PageHeader title={title} subtitle={subtitle} icon={icon} />
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-slate-100 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Detail</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row, index) => (
              <tr key={`${row[0]}-${index}`} className="transition-colors hover:bg-slate-50">
                <td className="px-6 py-4 font-bold text-slate-900">{row[0]}</td>
                <td className="px-6 py-4 text-sm font-medium text-slate-600">{row[1]}</td>
                <td className="px-6 py-4"><Badge variant={String(row[2]).toLowerCase().includes('pending') || String(row[2]).toLowerCase().includes('urgent') ? 'warning' : 'success'}>{row[2]}</Badge></td>
                <td className="px-6 py-4 text-right"><Button variant="outline" className="ml-auto text-xs" onClick={() => onAction(`${title} action`)}>Review</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  </div>
);

const TransparencyPage = ({ onAction }: { onAction: (label: string) => void }) => (
  <div className="space-y-6">
    <PageHeader title="Transparency Center" subtitle="Track response speed, clarity, and candidate feedback quality." icon={ShieldCheck} />
    <div className="grid gap-6 md:grid-cols-3">
      {[
        ['Response Rate', '96%', 'Candidates receive timely answers.'],
        ['Average Feedback', '4.8/5', 'Applicants rate communication highly.'],
        ['Open Roles', '12', 'Listings are current and complete.'],
      ].map(card => (
        <Card key={card[0]} className="p-6">
          <div className="text-xs font-black uppercase tracking-widest text-slate-400">{card[0]}</div>
          <div className="my-3 font-display text-4xl font-black text-slate-900">{card[1]}</div>
          <p className="text-sm font-medium text-slate-500">{card[2]}</p>
        </Card>
      ))}
    </div>
    <EmptyState title="Transparency actions ready" body="Policy updates, SLA settings, and feedback templates are represented here for the frontend prototype." actionLabel="Update Transparency Settings" onAction={() => onAction('Transparency settings')} />
  </div>
);

const CompanyProfilePage = ({ onAction }: { onAction: (label: string) => void }) => (
  <div className="space-y-6">
    <PageHeader title="Company Profile" subtitle="Manage public company information shown to students." icon={Building2} />
    <Card className="p-8">
      <div className="grid gap-6 md:grid-cols-2">
        <div><div className="text-xs font-black uppercase tracking-widest text-slate-400">Company</div><div className="mt-1 font-bold text-slate-900">{MOCK_COMPANY.full_name}</div></div>
        <div><div className="text-xs font-black uppercase tracking-widest text-slate-400">Sector</div><div className="mt-1 font-bold text-slate-900">{MOCK_COMPANY.sector}</div></div>
        <div><div className="text-xs font-black uppercase tracking-widest text-slate-400">Location</div><div className="mt-1 font-bold text-slate-900">{MOCK_COMPANY.location}</div></div>
        <div><div className="text-xs font-black uppercase tracking-widest text-slate-400">Transparency</div><div className="mt-1 font-bold text-slate-900">{MOCK_COMPANY.transparencyScore}/5</div></div>
      </div>
      <p className="mt-8 text-sm font-medium leading-relaxed text-slate-600">{MOCK_COMPANY.description}</p>
      <Button className="mt-8" onClick={() => onAction('Company profile')}>Save Company Profile</Button>
    </Card>
  </div>
);

const ReportsPage = ({ title, subtitle, onAction }: { title: string; subtitle: string; onAction: (label: string) => void }) => (
  <div className="space-y-6">
    <PageHeader title={title} subtitle={subtitle} icon={BarChart3} />
    <div className="grid gap-6 md:grid-cols-3">
      {[
        ['Placement Rate', '72%'],
        ['Active Partners', '124'],
        ['Pending Reviews', '45'],
      ].map(metric => (
        <Card key={metric[0]} className="p-6">
          <div className="text-xs font-black uppercase tracking-widest text-slate-400">{metric[0]}</div>
          <div className="mt-3 font-display text-4xl font-black text-slate-900">{metric[1]}</div>
        </Card>
      ))}
    </div>
    <EmptyState title="Reports dashboard ready" body="Charts and exports are present at the route level; live data will connect through Supabase queries." actionLabel="Export Report" onAction={() => onAction(`${title} export`)} />
  </div>
);
