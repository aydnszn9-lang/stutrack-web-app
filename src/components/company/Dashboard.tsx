import React from 'react';
import { 
  Users, 
  Briefcase, 
  Star, 
  TrendingUp, 
  Plus, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  Building2,
  MoreVertical
} from 'lucide-react';
import { Card, Badge, Button } from '../common/UI';
import { MOCK_COMPANY, MOCK_INTERNSHIPS } from '../../mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', apps: 12 },
  { name: 'Tue', apps: 19 },
  { name: 'Wed', apps: 15 },
  { name: 'Thu', apps: 22 },
  { name: 'Fri', apps: 25 },
];

export const CompanyDashboardView = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-slate-900 border-none relative overflow-hidden group">
           <div className="relative z-10">
              <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Active Listings</div>
              <div className="text-4xl font-display font-black text-white">12</div>
              <Button 
                variant="ghost" 
                className="mt-6 text-indigo-400 p-0 hover:bg-transparent hover:text-indigo-300 gap-1"
                onClick={() => onNavigate('create_job')}
              >
                <Plus className="w-4 h-4" /> Post New Role
              </Button>
           </div>
           <Briefcase className="absolute -right-4 -bottom-4 w-32 h-32 text-indigo-500/10 -rotate-12 group-hover:rotate-0 transition-transform duration-500" />
        </Card>

        <Card className="p-6 bg-indigo-600 border-none relative overflow-hidden group">
           <div className="relative z-10 text-white">
              <div className="text-indigo-100 text-xs font-bold uppercase tracking-widest mb-1">New Applicants</div>
              <div className="text-4xl font-display font-black">48</div>
              <Button 
                variant="ghost" 
                className="mt-6 text-white bg-white/10 hover:bg-white/20 px-4"
                onClick={() => onNavigate('applicants')}
              >
                Review Funnel
              </Button>
           </div>
           <Users className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10 -rotate-12 group-hover:rotate-0 transition-transform duration-500" />
        </Card>

        <Card className="p-6 bg-emerald-600 border-none relative overflow-hidden group">
           <div className="relative z-10 text-white">
              <div className="text-emerald-100 text-xs font-bold uppercase tracking-widest mb-1">Transparency Score</div>
              <div className="text-4xl font-display font-black">4.8<span className="text-lg text-emerald-200">/5.0</span></div>
              <Button 
                variant="ghost" 
                className="mt-6 text-white bg-white/10 hover:bg-white/20 px-4"
                onClick={() => onNavigate('transparency')}
              >
                View Analytics
              </Button>
           </div>
           <Star className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10 -rotate-12 group-hover:rotate-0 transition-transform duration-500" />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <section>
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-display font-bold text-slate-900">Application Flow</h2>
                <Badge variant="success">Online</Badge>
             </div>
             <Card className="p-6 h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                    <YAxis hide />
                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none' }} />
                    <Bar dataKey="apps" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
             </Card>
          </section>

          <section>
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-display font-bold text-slate-900">Recent Applicants</h2>
                <button onClick={() => onNavigate('applicants')} className="text-sm font-bold text-indigo-600 hover:underline">View all</button>
             </div>
             <Card className="overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-100 text-[10px] uppercase font-black text-slate-400 tracking-widest">
                    <tr>
                      <th className="px-6 py-4">Candidate</th>
                      <th className="px-6 py-4">Match</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { name: 'Alex Johnson', univ: 'MIT', match: 92, status: 'New' },
                      { name: 'Sarah Lee', univ: 'Stanford', match: 86, status: 'Shortlisted' },
                      { name: 'Kevin Hart', univ: 'Harvard', match: 74, status: 'Reviewing' },
                    ].map((app, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-900">{app.name}</div>
                          <div className="text-xs text-slate-500">{app.univ}</div>
                        </td>
                        <td className="px-6 py-4">
                           <div className="text-xs font-black text-indigo-600">{app.match}%</div>
                        </td>
                        <td className="px-6 py-4">
                           <Badge variant={app.status === 'Shortlisted' ? 'success' : 'default'}>{app.status}</Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <Button variant="ghost" className="p-2 border border-slate-200" onClick={() => onNavigate('applicants')}>
                              <ChevronRight className="w-4 h-4" />
                           </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </Card>
          </section>
        </div>

        <div className="lg:col-span-4 space-y-6">
           <section>
              <h2 className="text-xl font-display font-bold text-slate-900 mb-6">Upcoming Interviews</h2>
              <div className="space-y-4">
                {[
                  { name: 'Alex J.', time: '14:00 Today', type: 'Video' },
                  { name: 'Sarah L.', time: '10:00 Tomorrow', type: 'Office' },
                ].map((inv, i) => (
                  <Card key={i} className="p-4 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-xs font-bold">AJ</div>
                        <div>
                           <div className="text-sm font-bold">{inv.name}</div>
                           <div className="text-[10px] text-slate-500 font-medium">{inv.time} • {inv.type}</div>
                        </div>
                     </div>
                     <button onClick={() => onNavigate('interviews')} className="text-slate-400 hover:text-indigo-600">
                        <ChevronRight className="w-5 h-5" />
                     </button>
                  </Card>
                ))}
              </div>
           </section>

           <Card className="p-6 bg-slate-50 border-dashed border-2 border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                 <div className="p-2 bg-indigo-100 rounded-lg">
                    <Clock className="w-5 h-5 text-indigo-600" />
                 </div>
                 <h3 className="font-bold text-slate-900">Response Rate</h3>
              </div>
              <p className="text-xs text-slate-500 mb-4 font-medium leading-relaxed">
                 Your average response time is <b>1.2 days</b>. Keep it under 2 days to maintain your Transparency Level 4 badge.
              </p>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                 <div className="h-full bg-emerald-500 w-[92%]" />
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
};
