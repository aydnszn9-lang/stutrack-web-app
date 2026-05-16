import React from 'react';
import { Bell, Search, Menu, User } from 'lucide-react';
import { UserRole } from '../../types';

interface HeaderProps {
  role: UserRole;
  userName: string;
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ role, userName, onMenuClick }) => {
  const roleLabels: Record<UserRole, string> = {
    STUDENT: 'Student',
    COMPANY: 'Company',
    UNIVERSITY_ADMIN: 'University Admin',
    PLATFORM_ADMIN: 'Platform Admin'
  };

  return (
    <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-40 px-4 md:px-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="lg:hidden text-slate-600">
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
            {roleLabels[role]}
          </span>
          <h2 className="text-slate-900 font-bold hidden sm:block">Welcome back, {userName.split(' ')[0]}</h2>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-6">
        <div className="hidden md:flex items-center bg-slate-100 rounded-full px-4 py-1.5 focus-within:ring-2 ring-indigo-500/20 transition-all border border-transparent focus-within:border-indigo-200">
          <Search className="w-4 h-4 text-slate-400 mr-2" />
          <input 
            type="text" 
            placeholder="Search dashboard..." 
            className="bg-transparent border-none text-sm focus:outline-none w-48 text-slate-900" 
          />
        </div>
        
        <button
          onClick={() => window.alert('Notifications are available in the prototype header. Live notification data will be connected with the backend.')}
          className="relative text-slate-400 hover:text-slate-900 transition-colors p-2 rounded-full hover:bg-slate-50"
          title="View notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="flex items-center gap-3 pl-3 sm:pl-6 sm:border-l border-slate-100">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-bold text-slate-900">{userName}</div>
            <div className="text-[10px] text-slate-400 font-mono">ID: {role.toLowerCase().slice(0,3)}-{Math.floor(Math.random() * 9000 + 1000)}</div>
          </div>
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 font-bold border border-indigo-200">
            {userName.split(' ').map(n => n[0]).join('')}
          </div>
        </div>
      </div>
    </header>
  );
};
