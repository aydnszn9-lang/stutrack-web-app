import React, { useState } from 'react';
import { 
  Building2, 
  ChevronRight, 
  Clock, 
  FileText, 
  MessageSquare, 
  MoreHorizontal,
  XCircle,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { Card, Badge, Button } from '../common/UI';
import { MOCK_APPLICATIONS, MOCK_INTERNSHIPS } from '../../mockData';
import { cn } from '../../lib/utils';

export const MyApplicationsView = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  const [activeTab, setActiveTab] = useState('Active');
  const visibleApplications = MOCK_APPLICATIONS.filter((app) => {
    if (activeTab === 'History') return ['REJECTED', 'WITHDRAWN', 'OFFER'].includes(app.status);
    if (activeTab === 'Saved') return app.status === 'DRAFT';
    return !['REJECTED', 'WITHDRAWN'].includes(app.status);
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900">My Applications</h1>
          <p className="text-slate-500 text-sm">Track your progress and respond to company requests.</p>
        </div>
        <div className="flex gap-2">
           {['Active', 'History', 'Saved'].map(t => (
             <button key={t} onClick={() => setActiveTab(t)} className={cn(
               "px-4 py-2 text-sm font-bold rounded-xl transition-all",
               t === activeTab ? "bg-indigo-600 text-white" : "text-slate-500 hover:bg-slate-100"
             )}>{t}</button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {visibleApplications.map((app) => {
          const job = MOCK_INTERNSHIPS.find(i => i.id === app.internshipId);
          
          const statusColors: Record<string, 'success' | 'info' | 'warning' | 'error' | 'default'> = {
             'INTERVIEW_SCHEDULED': 'success',
             'SUBMITTED': 'info',
             'UNDER_REVIEW': 'warning',
             'REJECTED': 'error',
             'DRAFT': 'default'
          };

          return (
            <Card key={app.id} className="p-6">
               <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 border border-slate-100">
                    <Building2 className="w-8 h-8 text-slate-400" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                       <Badge variant={statusColors[app.status] || 'default'}>
                         {app.status.replace('_', ' ')}
                       </Badge>
                       <span className="text-xs text-slate-400 font-medium">Applied on {app.createdAt}</span>
                    </div>
                    <h3 className="text-xl font-display font-bold text-slate-900 truncate tracking-tight">{job?.title}</h3>
                    <p className="text-slate-500 font-medium">{job?.companyName} • {job?.location}</p>
                  </div>

                  <div className="flex items-center gap-3 w-full lg:w-auto">
                     <Button 
                      variant="outline" 
                      className="flex-1 lg:flex-none"
                      onClick={() => onNavigate(`application_${app.id}`)}
                     >
                       Track Progress
                     </Button>
                     <button onClick={() => onNavigate(`application_${app.id}`)} className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all border border-slate-200">
                        <MoreHorizontal className="w-5 h-5" />
                     </button>
                  </div>
               </div>

               {app.status === 'INTERVIEW_SCHEDULED' && (
                 <div className="mt-6 pt-6 border-t border-slate-100 flex items-center gap-4 bg-emerald-50/30 p-4 rounded-xl">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                       <MessageSquare className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                       <span className="text-xs font-black text-emerald-700 uppercase tracking-widest">Next Step: Video Interview</span>
                       <p className="text-sm text-slate-600">Company requested an online technical interview for May 17th.</p>
                    </div>
                    <Button variant="primary" className="text-xs px-4 py-1.5" onClick={() => onNavigate(`application_${app.id}`)}>Confirm Slot</Button>
                 </div>
               )}
            </Card>
          );
        })}
      </div>

      {visibleApplications.length === 0 && (
        <Card className="p-8 text-center">
          <h3 className="font-display text-xl font-bold text-slate-900">No {activeTab.toLowerCase()} applications</h3>
          <p className="mt-2 text-sm font-medium text-slate-500">This section will fill as applications move through the workflow.</p>
          <Button className="mx-auto mt-6" onClick={() => onNavigate('jobs')}>Browse Internships</Button>
        </Card>
      )}
    </div>
  );
};
