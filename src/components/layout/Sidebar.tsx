import React from 'react';
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  Search, 
  Users, 
  MessageSquare, 
  Database, 
  CheckCircle, 
  ShieldCheck, 
  Settings, 
  LogOut,
  Bell,
  Menu,
  X,
  Sparkles,
  GraduationCap
} from 'lucide-react';
import { UserRole } from '../../types';
import { cn } from '../../lib/utils';

interface SidebarProps {
  role: UserRole;
  activeItem: string;
  onNavigate: (item: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onLogout: () => void;
}

const NAVIGATION_ITEMS: Record<UserRole, { id: string; label: string; icon: any }[]> = {
  STUDENT: [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'jobs', label: 'Internships', icon: Search },
    { id: 'applications', label: 'My Applications', icon: FileText },
    { id: 'simulator', label: 'AI Simulator', icon: Sparkles },
    { id: 'tests', label: 'Test Results', icon: CheckCircle },
    { id: 'mentorship', label: 'Mentorship', icon: Users },
    { id: 'experiences', label: 'Experiences', icon: Database },
    { id: 'profile', label: 'Profile', icon: Settings },
  ],
  COMPANY: [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'create_job', label: 'Post Internship', icon: Briefcase },
    { id: 'manage_jobs', label: 'Manage Posts', icon: LayoutDashboard },
    { id: 'applicants', label: 'Applicants', icon: Users },
    { id: 'interviews', label: 'Interviews', icon: MessageSquare },
    { id: 'transparency', label: 'Transparency', icon: ShieldCheck },
    { id: 'profile', label: 'Profile', icon: Settings },
  ],
  UNIVERSITY_ADMIN: [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'student_records', label: 'Student Records', icon: FileText },
    { id: 'company_verification', label: 'Partnerships', icon: ShieldCheck },
    { id: 'reports', label: 'Analytics', icon: Database },
  ],
  PLATFORM_ADMIN: [
    { id: 'dashboard', label: 'System Overview', icon: LayoutDashboard },
    { id: 'user_management', label: 'User Control', icon: Users },
    { id: 'verification', label: 'Verifications', icon: CheckCircle },
    { id: 'moderation', label: 'Moderation', icon: ShieldCheck },
    { id: 'analytics', label: 'Global Stats', icon: Database },
  ],
};

export const Sidebar: React.FC<SidebarProps> = ({ role, activeItem, onNavigate, isOpen, setIsOpen, onLogout }) => {
  const items = NAVIGATION_ITEMS[role] || [];

  return (
    <aside 
      className={cn(
        "bg-slate-900 text-white flex flex-col h-screen fixed lg:sticky top-0 z-50 transition-all duration-300",
        isOpen ? "w-[280px]" : "w-0 lg:w-[80px]"
      )}
    >
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0">
             <GraduationCap className="w-5 h-5 text-white" />
          </div>
          {isOpen && <span className="text-xl font-display font-black tracking-tighter">StuTrack</span>}
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden text-slate-400">
          <X className="w-6 h-6" />
        </button>
      </div>

      <nav className="flex-1 mt-6 px-4 space-y-1 overflow-y-auto">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              onNavigate(item.id);
              if (window.innerWidth < 1024) setIsOpen(false);
            }}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group",
              activeItem === item.id 
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/40" 
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            )}
          >
            <item.icon className={cn("w-5 h-5 shrink-0", activeItem === item.id ? "text-white" : "group-hover:text-white")} />
            {isOpen && <span className="font-semibold text-sm">{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {isOpen && <span className="font-semibold text-sm">Logout</span>}
        </button>
      </div>
    </aside>
  );
};
