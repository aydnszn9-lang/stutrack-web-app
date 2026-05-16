import React from 'react';
import { 
  Users, 
  ShieldAlert, 
  Search, 
  CheckCircle, 
  XSquare, 
  BarChart3, 
  Database,
  ArrowUpRight,
  UserCheck,
  Building2,
  Flag
} from 'lucide-react';
import { Card, Badge, Button } from '../common/UI';

export const AdminDashboardView = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Users', value: '45,204', sub: '+12% growth', icon: Users, color: 'text-indigo-600' },
          { label: 'Moderation Queue', value: '124', sub: 'Action needed', icon: ShieldAlert, color: 'text-rose-600' },
          { label: 'Active Jobs', value: '3,842', sub: 'Across 12 sectors', icon: Building2, color: 'text-emerald-600' },
          { label: 'Verifications', value: '89', sub: 'Pending approval', icon: UserCheck, color: 'text-blue-600' },
        ].map((stat, i) => (
          <Card key={i} className="p-6">
            <div className="flex justify-between items-start">
               <div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</div>
                  <div className="text-3xl font-display font-black text-slate-900">{stat.value}</div>
                  <div className="text-[10px] font-bold text-slate-400 mt-2 flex items-center gap-1">
                     <ArrowUpRight className="w-3 h-3 text-emerald-500" /> {stat.sub}
                  </div>
               </div>
               <div className={cn("p-2 bg-slate-50 rounded-xl", stat.color)}>
                  <stat.icon className="w-5 h-5" />
               </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section>
           <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-display font-bold text-slate-900">User Growth</h2>
              <Button variant="outline" className="text-xs" onClick={() => onNavigate('analytics')}>Export CSV</Button>
           </div>
           <Card className="p-6 h-[400px] flex items-center justify-center bg-slate-50/50 border-dashed border-2">
              <div className="text-center">
                 <BarChart3 className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                 <p className="text-slate-400 font-medium">System Metrics Visualization</p>
              </div>
           </Card>
        </section>

        <section>
           <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-display font-bold text-slate-900">Recent Flags & Reports</h2>
              <button onClick={() => onNavigate('moderation')} className="text-sm font-bold text-indigo-600 hover:underline">Full Audit Log</button>
           </div>
           <div className="space-y-4">
              {[
                { type: 'Experience Review', reason: 'Spam / Offensive', user: 'Alex J.', id: 'EXP-923', status: 'PENDING' },
                { type: 'Job Listing', reason: 'Misleading Info', user: 'Tech Corp', id: 'JOB-112', status: 'URGENT' },
                { type: 'Company Profile', reason: 'Fake Account', user: 'Scam Inc', id: 'CMP-441', status: 'PENDING' },
              ].map((flag, i) => (
                <Card key={i} className="p-4 flex items-center justify-between group overflow-hidden relative">
                   <div className="flex items-center gap-4 relative z-10">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center",
                        flag.status === 'URGENT' ? "bg-rose-100 text-rose-600" : "bg-slate-100 text-slate-600"
                      )}>
                        <Flag className="w-5 h-5" />
                      </div>
                      <div>
                         <div className="text-sm font-bold text-slate-900 leading-none mb-1">{flag.type}</div>
                         <div className="text-xs text-slate-500">{flag.reason} • Reported by <span className="font-bold underline">{flag.user}</span></div>
                      </div>
                   </div>
                   <div className="flex flex-col items-end gap-2 relative z-10">
                      <Badge variant={flag.status === 'URGENT' ? 'error' : 'warning'}>{flag.status}</Badge>
                      <Button variant="ghost" className="text-[10px] h-6 px-2 border border-slate-200" onClick={() => onNavigate('moderation')}>Review</Button>
                   </div>
                   {flag.status === 'URGENT' && (
                     <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rotate-45 transform translate-x-12 -translate-y-12" />
                   )}
                </Card>
              ))}
           </div>
        </section>
      </div>
    </div>
  );
};

import { cn } from '../../lib/utils';
