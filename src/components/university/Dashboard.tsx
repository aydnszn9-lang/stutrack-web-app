import React from 'react';
import { 
  Users, 
  MapPin, 
  GraduationCap, 
  ShieldCheck, 
  TrendingUp, 
  CheckCircle2, 
  FileText,
  BarChart3,
  Search
} from 'lucide-react';
import { Card, Badge, Button } from '../common/UI';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { name: 'Computer Science', value: 400 },
  { name: 'Engineering', value: 300 },
  { name: 'Business', value: 300 },
  { name: 'Design', value: 200 },
];

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#3b82f6'];

export const UniversityDashboardView = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Active Students', value: '4.2k', icon: Users, color: 'text-indigo-600' },
          { label: 'Placed This Term', value: '852', icon: CheckCircle2, color: 'text-emerald-600' },
          { label: 'Partner Companies', value: '124', icon: ShieldCheck, color: 'text-blue-600' },
          { label: 'Pending Credits', value: '45', icon: FileText, color: 'text-amber-600' },
        ].map((stat, i) => (
          <Card key={i} className="p-6">
            <div className="flex justify-between items-start">
               <div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</div>
                  <div className="text-3xl font-display font-black text-slate-900">{stat.value}</div>
               </div>
               <div className={cn("p-2 bg-slate-50 rounded-xl", stat.color)}>
                  <stat.icon className="w-5 h-5" />
               </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <section>
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-display font-bold text-slate-900">Internship Placements by Department</h2>
                <Button variant="outline" className="text-xs" onClick={() => onNavigate('reports')}>Download Report</Button>
             </div>
             <Card className="p-6 flex flex-col md:flex-row items-center">
                <div className="w-full md:w-1/2 h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {data.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-full md:w-1/2 space-y-4">
                  {data.map((d, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                       <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                          <span className="text-sm font-bold text-slate-700">{d.name}</span>
                       </div>
                       <span className="text-sm font-black text-slate-900">{Math.round((d.value/1200) * 100)}%</span>
                    </div>
                  ))}
                </div>
             </Card>
          </section>

          <section>
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-display font-bold text-slate-900">Recent Records for Approval</h2>
                <button onClick={() => onNavigate('student_records')} className="text-sm font-bold text-indigo-600 hover:underline">Manage all</button>
             </div>
             <Card>
                <div className="overflow-x-auto">
                   <table className="w-full text-left">
                      <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                         <tr>
                            <th className="px-6 py-4">Student</th>
                            <th className="px-6 py-4">Company</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Action</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                         {[
                           { name: 'Chris Evans', dept: 'CS', comp: 'TechFlow', status: 'Pending Approval' },
                           { name: 'Emily Blunt', dept: 'Design', comp: 'DataViz Inc', status: 'In Review' },
                         ].map((rec, i) => (
                           <tr key={i} className="hover:bg-slate-50 transition-colors">
                              <td className="px-6 py-4">
                                 <div className="font-bold text-slate-900">{rec.name}</div>
                                 <div className="text-xs text-slate-500">{rec.dept} Dept</div>
                              </td>
                              <td className="px-6 py-4 text-sm font-medium text-slate-600">{rec.comp}</td>
                              <td className="px-6 py-4">
                                 <Badge variant="warning">{rec.status}</Badge>
                              </td>
                              <td className="px-6 py-4 text-right">
                                 <Button variant="outline" className="text-xs py-1" onClick={() => onNavigate('student_records')}>Review</Button>
                              </td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </Card>
          </section>
        </div>

        <div className="lg:col-span-4 space-y-8">
           <Card className="p-6 bg-slate-900 text-white border-none shadow-2xl relative overflow-hidden ring-4 ring-indigo-500/30">
              <h3 className="font-display font-bold text-lg mb-4 relative z-10">Partner Outlook</h3>
              <p className="text-slate-400 text-sm mb-6 relative z-10 leading-relaxed text-indigo-100/60">
                 3 new companies from the Tech Sector are requesting partnership verification this week.
              </p>
              <Button onClick={() => onNavigate('company_verification')} className="w-full bg-white text-slate-900 hover:bg-slate-100 border-none relative z-10">
                 Manage Requests
              </Button>
              <ShieldCheck className="absolute -right-8 -bottom-8 w-40 h-40 text-white/5 -rotate-12" />
           </Card>

           <section>
              <h2 className="text-xl font-display font-bold text-slate-900 mb-6">Placement Stats</h2>
              <div className="space-y-4">
                 {[
                   { label: 'Response Rate', value: '98%', p: 98, color: 'bg-emerald-500' },
                   { label: 'Avg Stipend', value: '$2.4k', p: 75, color: 'text-indigo-600' },
                 ].map((s, i) => (
                   <Card key={i} className="p-4">
                      <div className="flex justify-between items-center mb-1">
                         <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{s.label}</span>
                         <span className="text-sm font-black text-slate-900">{s.value}</span>
                      </div>
                      {typeof s.p === 'number' && (
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                           <div className={cn("h-full", s.color)} style={{ width: `${s.p}%` }} />
                        </div>
                      )}
                   </Card>
                 ))}
              </div>
           </section>
        </div>
      </div>
    </div>
  );
};

import { cn } from '../../lib/utils';
