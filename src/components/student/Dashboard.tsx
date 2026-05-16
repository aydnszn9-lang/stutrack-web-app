import React, { useState } from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { 
  BarChart3, 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Search, 
  Star, 
  TrendingUp, 
  Users, 
  ChevronRight,
  Sparkles,
  MessageSquare,
  FileText
} from 'lucide-react';
import { Card, Badge, Button } from '../common/UI';
import { MOCK_STUDENT, MOCK_INTERNSHIPS, MOCK_APPLICATIONS, MOCK_NOTIFICATIONS } from '../../mockData';
import { Application, Internship, Notification, StudentProfile } from '../../types';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const chartData = [
  { name: 'Jan', apps: 4 },
  { name: 'Feb', apps: 7 },
  { name: 'Mar', apps: 5 },
  { name: 'Apr', apps: 12 },
  { name: 'May', apps: 9 },
];

export const StudentDashboardView = ({
  onNavigate,
  student = MOCK_STUDENT,
  internships = MOCK_INTERNSHIPS,
  applications = MOCK_APPLICATIONS,
  notifications = MOCK_NOTIFICATIONS,
}: {
  onNavigate: (page: string) => void;
  student?: StudentProfile;
  internships?: Internship[];
  applications?: Application[];
  notifications?: Notification[];
}) => {
  return (
    <div className="space-y-8">
      {/* Welcome & Quick Summary */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <Card className="md:col-span-8 p-8 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white border-none relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-3xl font-display font-bold mb-2">Hello, {student.full_name}!</h1>
            <p className="text-indigo-100 max-w-md mb-6">
              You have an interview scheduled for tomorrow at 2:00 PM. Good luck!
            </p>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => onNavigate('jobs')} className="bg-white text-indigo-700 hover:bg-indigo-50 border-none">
                Browse Internships
              </Button>
              <Button onClick={() => onNavigate('simulator')} variant="ghost" className="text-white hover:bg-white/10">
                Run AI Interview
              </Button>
            </div>
          </div>
          <Sparkles className="absolute -right-8 -bottom-8 w-48 h-48 text-white/10 rotate-12" />
        </Card>
        <Card className="md:col-span-4 p-8 flex flex-col justify-center items-center text-center">
          <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Profile Integrity</div>
          <div className="relative w-24 h-24 mb-4">
             <svg className="w-full h-full" viewBox="0 0 36 36">
               <path className="text-slate-100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
               <path className="text-indigo-600" strokeWidth="3" strokeDasharray="85, 100" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
             </svg>
             <div className="absolute inset-0 flex items-center justify-center font-display font-bold text-2xl">85%</div>
          </div>
          <Button variant="outline" className="w-full text-xs py-1.5" onClick={() => onNavigate('profile')}>Complete Profile</Button>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Column */}
        <div className="lg:col-span-8 space-y-8">
          {/* Active Applications */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-display font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" /> Active Applications
              </h2>
              <button onClick={() => onNavigate('applications')} className="text-sm font-bold text-indigo-600 hover:underline">View all</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {applications.map((app) => {
                const job = internships.find(i => i.id === app.internshipId);
                return (
                  <Card key={app.id} className="p-5 hover:border-indigo-200 transition-all border-l-4 border-l-indigo-600">
                    <div className="flex justify-between items-start mb-3">
                      <Badge variant={app.status === 'INTERVIEW_SCHEDULED' ? 'success' : 'info'}>{app.status.replace('_', ' ')}</Badge>
                      <div className="text-xs font-black text-rose-500 uppercase">Match {app.matchScore}%</div>
                    </div>
                    <h3 className="font-bold text-slate-900 line-clamp-1">{job?.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 mb-4">
                      <span className="font-bold">{job?.companyName}</span>
                      <span>•</span>
                      <span>Updated {app.updatedAt}</span>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full text-xs font-bold" 
                      onClick={() => onNavigate(`application_${app.id}`)}
                    >
                      Track Status
                    </Button>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* Recommendations Table */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-display font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" /> AI Recommendations
              </h2>
              <button onClick={() => onNavigate('jobs')} className="text-sm font-bold text-indigo-600 hover:underline">See more</button>
            </div>
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <tbody className="divide-y divide-slate-100">
                    {internships.slice(2).map((job) => (
                      <tr key={job.id} className="group hover:bg-slate-50 transition-colors">
                        <td className="p-4 pl-6">
                          <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                            <Briefcase className="w-5 h-5 text-indigo-600 group-hover:text-white" />
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-slate-900">{job.title}</div>
                          <div className="text-xs text-slate-500">{job.companyName}</div>
                        </td>
                        <td className="p-4 text-xs font-bold text-slate-500">
                           <div className="flex items-center gap-1">
                             <MapPin className="w-3 h-3" /> {job.location}
                           </div>
                        </td>
                        <td className="p-4">
                          <div className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded w-fit capitalize">
                            {job.matchScore}% Match
                          </div>
                        </td>
                        <td className="p-4 pr-6 text-right">
                          <button 
                            onClick={() => onNavigate(`job_${job.id}`)}
                            className="p-2 border border-slate-200 rounded-lg hover:border-indigo-600 hover:text-indigo-600 transition-all"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </section>

          {/* Application Stats Chart */}
          <section>
             <h2 className="text-xl font-display font-bold text-slate-900 mb-6">Application Activity</h2>
             <Card className="p-6">
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                      <YAxis hide />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                      />
                      <Area type="monotone" dataKey="apps" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorApps)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
             </Card>
          </section>
        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-4 space-y-8">
          {/* Notifications */}
          <section>
            <h2 className="text-xl font-display font-bold text-slate-900 mb-6">New For You</h2>
            <Card className="divide-y divide-slate-100">
              {notifications.slice(0, 3).map((notif) => (
                <div key={notif.id} className="p-4 hover:bg-slate-50 transition-colors cursor-pointer">
                  <div className="flex gap-4">
                    <div className={cn(
                      "w-2 h-2 mt-1.5 rounded-full shrink-0",
                      notif.read ? "bg-slate-100" : "bg-indigo-600"
                    )} />
                    <div>
                      <div className="text-sm font-bold text-slate-900">{notif.title}</div>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{notif.message}</p>
                      <div className="text-[10px] text-slate-400 mt-2 font-medium">{notif.createdAt.split(' ')[0]}</div>
                    </div>
                  </div>
                </div>
              ))}
            </Card>
          </section>

          {/* Mentorship Quick Access */}
          <section>
             <h2 className="text-xl font-display font-bold text-slate-900 mb-6">Your Mentor</h2>
             <Card className="p-6 text-center">
                <div className="w-20 h-20 mx-auto rounded-2xl overflow-hidden mb-4 border-4 border-indigo-50 ring-1 ring-indigo-200">
                   <img src="https://i.pravatar.cc/150?u=mentor" alt="Mentor" className="w-full h-full object-cover" />
                </div>
                <h3 className="font-bold text-slate-900">James Wilson</h3>
                <p className="text-xs text-slate-500 mb-4">Staff Engineer @ Google</p>
                <div className="flex gap-2">
                  <Button variant="primary" className="flex-1 text-xs py-2" onClick={() => onNavigate('mentorship')}>Message</Button>
                  <Button variant="outline" className="flex-1 text-xs py-2" onClick={() => onNavigate('mentorship')}>Reschedule</Button>
                </div>
             </Card>
          </section>

          {/* Learning Progress */}
          <Card className="p-6 border-none bg-slate-900 text-white">
             <div className="flex items-center justify-between mb-4">
               <h3 className="font-bold text-sm">Skills Mastery</h3>
               <Sparkles className="w-4 h-4 text-amber-400" />
             </div>
             <div className="space-y-4">
                {[
                  { name: 'React', p: 85 },
                  { name: 'TypeScript', p: 60 },
                  { name: 'UI Design', p: 40 },
                ].map((s, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-[10px] font-bold mb-1 uppercase tracking-widest text-slate-400">
                      <span>{s.name}</span>
                      <span>{s.p}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                       <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${s.p}%` }}
                        transition={{ duration: 1, delay: i * 0.2 }}
                        className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" 
                       />
                    </div>
                  </div>
                ))}
             </div>
             <Button variant="ghost" className="w-full mt-6 text-indigo-400 hover:text-indigo-300 text-xs border border-slate-800" onClick={() => onNavigate('tests')}>
                View Learning Path
             </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};
