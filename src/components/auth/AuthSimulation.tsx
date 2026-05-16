import React from 'react';
import { UserRole } from '../../types';
import { Card, Button } from '../common/UI';
import { GraduationCap, Briefcase, ShieldCheck, UserCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface AuthSimulationProps {
  onLogin: (role: UserRole) => void;
}

export const AuthSimulation: React.FC<AuthSimulationProps> = ({ onLogin }) => {
  const roles = [
    { 
      role: 'STUDENT' as UserRole, 
      label: 'Student', 
      desc: 'Browse jobs, track applications, and use AI features.', 
      icon: GraduationCap, 
      color: 'bg-indigo-600',
      shadow: 'shadow-indigo-200'
    },
    { 
      role: 'COMPANY' as UserRole, 
      label: 'Company', 
      desc: 'Post internships, manage candidates, and build scores.', 
      icon: Briefcase, 
      color: 'bg-slate-900',
      shadow: 'shadow-slate-200'
    },
    { 
      role: 'UNIVERSITY_ADMIN' as UserRole, 
      label: 'University', 
      desc: 'Verify records, manage partnerships, and view stats.', 
      icon: ShieldCheck, 
      color: 'bg-emerald-600',
      shadow: 'shadow-emerald-200'
    },
    { 
      role: 'PLATFORM_ADMIN' as UserRole, 
      label: 'Platform', 
      desc: 'System moderation, user control, and global analytics.', 
      icon: UserCheck, 
      color: 'bg-blue-600',
      shadow: 'shadow-blue-200'
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-50 to-indigo-50/30">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
           <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-200">
             <GraduationCap className="text-white w-7 h-7" />
           </div>
           <span className="text-3xl font-display font-black tracking-tighter text-slate-900">StuTrack</span>
        </div>
        <h1 className="text-3xl font-display font-bold text-slate-900 mb-2">Welcome to the Prototype</h1>
        <p className="text-slate-500">Pick a role to explore the full StuTrack ecosystem.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl w-full">
        {roles.map((item, i) => (
          <Card 
            key={item.role} 
            className="p-8 flex flex-col items-center text-center group cursor-pointer border-2 border-transparent hover:border-indigo-600/20"
            onClick={() => onLogin(item.role)}
          >
            <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-white transform transition-transform group-hover:scale-110", item.color, item.shadow)}>
              <item.icon className="w-8 h-8" />
            </div>
            <h3 className="font-display font-bold text-xl mb-3">{item.label}</h3>
            <p className="text-slate-500 text-sm mb-8 leading-relaxed">{item.desc}</p>
            <Button className="w-full mt-auto" variant={i === 0 ? 'primary' : 'outline'}>
              Access as {item.label}
            </Button>
          </Card>
        ))}
      </div>

      <p className="mt-8 text-xs text-slate-400 font-medium">Prototype v1.0 • Built with Google AI Studio</p>
    </div>
  );
};

import { cn } from '../../lib/utils';
