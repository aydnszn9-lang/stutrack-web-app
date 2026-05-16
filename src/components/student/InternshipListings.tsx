import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  Search, 
  Filter, 
  ChevronRight, 
  Bookmark, 
  Star, 
  Building2,
  Calendar,
  DollarSign,
  Zap,
  Info,
  TrendingUp
} from 'lucide-react';
import { Card, Badge, Button, Modal } from '../common/UI';
import { MOCK_INTERNSHIPS, MOCK_COMPANY, MOCK_EXPERIENCES } from '../../mockData';
import { Internship } from '../../types';

export const InternshipListingsView = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState<Internship | null>(null);
  const [filterType, setFilterType] = useState('ALL');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);

  const filteredJobs = MOCK_INTERNSHIPS.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         job.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'ALL' || job.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Search & Filter Header */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search roles, companies, or keywords..." 
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 ring-indigo-500/20 focus:outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          {['ALL', 'REMOTE', 'HYBRID', 'ON_SITE'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-bold border transition-all whitespace-nowrap",
                filterType === type 
                  ? "bg-slate-900 text-white border-slate-900" 
                  : "bg-white text-slate-600 border-slate-200 hover:border-indigo-600 hover:text-indigo-600"
              )}
            >
              {type.replace('_', ' ')}
            </button>
          ))}
          <Button variant="outline" className="px-3" onClick={() => setShowAdvancedFilters((value) => !value)}>
             <Filter className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {showAdvancedFilters && (
        <Card className="p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="font-bold text-slate-900">Advanced filters</h3>
              <p className="text-sm font-medium text-slate-500">Use quick filters now; skill, stipend, and location filters will connect to backend data.</p>
            </div>
            <Button variant="ghost" onClick={() => { setSearchTerm(''); setFilterType('ALL'); }}>
              Reset Filters
            </Button>
          </div>
        </Card>
      )}

      {/* Stats Summary */}
      <div className="flex items-center justify-between text-sm text-slate-500 font-medium">
         <span>Showing {filteredJobs.length} opportunities</span>
         <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><TrendingUp className="w-4 h-4 text-emerald-500" /> Sorted by Match Score</span>
         </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
        {filteredJobs.map((job) => (
          <Card key={job.id} className="p-0 border-l-4 border-l-transparent hover:border-l-indigo-600 group">
            <div className="flex flex-col md:flex-row p-6 items-start md:items-center gap-6">
               <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 border border-slate-100 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors">
                  <Building2 className="w-8 h-8 text-slate-400 group-hover:text-indigo-600" />
               </div>
               
               <div className="flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <Badge variant="purple">{job.type.replace('_', ' ')}</Badge>
                    <Badge variant={job.matchScore! > 80 ? 'success' : 'default'}>Match: {job.matchScore}%</Badge>
                  </div>
                  <h3 className="text-xl font-display font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{job.title}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                    <span className="font-bold text-slate-700">{job.companyName}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {job.location}</span>
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {job.duration}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Ends {job.expiresAt}</span>
                  </div>
               </div>

               <div className="flex flex-col items-end gap-3 self-stretch justify-between">
                  <div className="flex items-center gap-2">
                     <button
                      onClick={() => setSavedJobIds((ids) => ids.includes(job.id) ? ids.filter(id => id !== job.id) : [...ids, job.id])}
                      className={cn(
                        "p-2 transition-colors",
                        savedJobIds.includes(job.id) ? "text-amber-500" : "text-slate-400 hover:text-amber-500"
                      )}
                      title={savedJobIds.includes(job.id) ? 'Remove saved internship' : 'Save internship'}
                    >
                        <Bookmark className={cn("w-5 h-5", savedJobIds.includes(job.id) && "fill-current")} />
                     </button>
                     <div className="text-right">
                        <div className="text-lg font-bold text-slate-900 tracking-tight">{job.stipend}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase">Stipend / Mo</div>
                     </div>
                  </div>
                  <div className="flex gap-2 w-full">
                     <Button variant="outline" onClick={() => setSelectedJob(job)}>View Details</Button>
                     <Button onClick={() => onNavigate(`apply_${job.id}`)}>Apply Now</Button>
                  </div>
               </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <Card className="p-8 text-center">
          <h3 className="font-display text-xl font-bold text-slate-900">No internships found</h3>
          <p className="mt-2 text-sm font-medium text-slate-500">Try a different keyword or reset the filters.</p>
          <Button className="mx-auto mt-6" onClick={() => { setSearchTerm(''); setFilterType('ALL'); }}>Reset Search</Button>
        </Card>
      )}

      {/* Detail Modal */}
      <Modal 
        isOpen={!!selectedJob} 
        onClose={() => setSelectedJob(null)} 
        title="Internship Details"
      >
        {selectedJob && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center p-3 shadow-sm">
                 <Building2 className="w-full h-full text-indigo-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">{selectedJob.title}</h2>
                <p className="text-slate-500 font-medium">{selectedJob.companyName} • {selectedJob.location}</p>
              </div>
              <div className="ml-auto text-right">
                 <div className="text-xs text-slate-400 font-bold uppercase mb-1">Company Rating</div>
                 <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-4 h-4 fill-current" /> 4.8
                 </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                 <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Type</div>
                 <div className="text-sm font-bold">{selectedJob.type}</div>
              </div>
              <div className="p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                 <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Duration</div>
                 <div className="text-sm font-bold">{selectedJob.duration}</div>
              </div>
              <div className="p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                 <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Stipend</div>
                 <div className="text-sm font-bold">{selectedJob.stipend}</div>
              </div>
              <div className="p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                 <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Transparency</div>
                 <div className="text-sm font-bold text-indigo-600">Level 4</div>
              </div>
            </div>

            <div className="space-y-4">
               <div>
                  <h3 className="font-bold text-slate-900 mb-2">Description</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{selectedJob.description}</p>
               </div>
               <div>
                  <h3 className="font-bold text-slate-900 mb-2">Responsibilities</h3>
                  <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                    {selectedJob.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
               </div>
               <div>
                  <h3 className="font-bold text-slate-900 mb-2">Requirements</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.requirements.map((req, i) => (
                      <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg">{req}</span>
                    ))}
                  </div>
               </div>
            </div>

            <div className="p-4 bg-indigo-600 rounded-2xl text-white flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-indigo-200">AI MATCH PREDICTION</div>
                <div className="text-lg font-bold">You are an Excellent fit!</div>
              </div>
              <div className="text-3xl font-black">{selectedJob.matchScore}%</div>
            </div>

            <div className="pt-4 flex gap-3">
               <Button variant="ghost" className="flex-1" onClick={() => onNavigate('simulator')}>Run Simulator</Button>
               <Button className="flex-[2]" onClick={() => onNavigate(`apply_${selectedJob.id}`)}>Submit Application</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
