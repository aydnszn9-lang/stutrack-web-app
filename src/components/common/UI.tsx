import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

export const Card = ({ children, className, id, onClick }: { children: React.ReactNode; className?: string; id?: string; onClick?: () => void; key?: string | number }) => (
  <motion.div 
    id={id}
    onClick={onClick}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={onClick ? { y: -2, transition: { duration: 0.2 } } : undefined}
    className={cn(
      "bg-white rounded-2xl border border-slate-200 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] overflow-hidden transition-shadow hover:shadow-lg", 
      onClick && "cursor-pointer",
      className
    )}
  >
    {children}
  </motion.div>
);

export const Badge = ({ 
  children, 
  variant = 'default' 
}: { 
  children: React.ReactNode; 
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'purple' 
}) => {
  const variants = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    warning: 'bg-amber-50 text-amber-700 border-amber-100',
    error: 'bg-rose-50 text-rose-700 border-rose-100',
    info: 'bg-blue-50 text-blue-700 border-blue-100',
    purple: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  };
  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border", variants[variant])}>
      {children}
    </span>
  );
};

export const Button = ({ 
  children, 
  variant = 'primary', 
  className, 
  icon: Icon,
  ...props 
}: { 
  children: React.ReactNode; 
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'; 
  className?: string; 
  icon?: any;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200',
    secondary: 'bg-slate-900 text-white hover:bg-slate-800 shadow-md shadow-slate-200',
    outline: 'bg-white border-2 border-slate-200 text-slate-700 hover:border-indigo-600 hover:text-indigo-600',
    danger: 'bg-rose-600 text-white hover:bg-rose-700 shadow-md shadow-rose-200',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900',
  };

  return (
    <button 
      className={cn(
        "px-4 py-2 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2", 
        variants[variant], 
        className
      )}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
};

export const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  title: string; 
  children: React.ReactNode 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-2xl w-full max-w-2xl relative z-10 shadow-2xl overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h3 className="font-display font-bold text-lg text-slate-900">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

import { X } from 'lucide-react';
