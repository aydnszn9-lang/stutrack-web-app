import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Briefcase, GraduationCap, LogIn, ShieldCheck, UserCheck, UserPlus } from 'lucide-react';
import { UserRole } from '../../types';
import { cn } from '../../lib/utils';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';
import { createProfileForAuthUser } from '../../services/supabaseData';
import { Card, Button } from '../common/UI';

interface AuthSimulationProps {
  onLogin: (role: UserRole) => void;
}

export const AuthSimulation: React.FC<AuthSimulationProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'landing' | 'login' | 'register'>('landing');
  const [selectedRole, setSelectedRole] = useState<UserRole>('STUDENT');
  const [fullName, setFullName] = useState('Demo User');
  const [email, setEmail] = useState('student@example.com');
  const [password, setPassword] = useState('Password123!');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const roles = [
    {
      role: 'STUDENT' as UserRole,
      label: 'Student',
      desc: 'Browse jobs, track applications, and use AI features.',
      icon: GraduationCap,
      color: 'bg-indigo-600',
      shadow: 'shadow-indigo-200',
    },
    {
      role: 'COMPANY' as UserRole,
      label: 'Company',
      desc: 'Post internships, manage candidates, and build scores.',
      icon: Briefcase,
      color: 'bg-slate-900',
      shadow: 'shadow-slate-200',
    },
    {
      role: 'UNIVERSITY_ADMIN' as UserRole,
      label: 'University',
      desc: 'Verify records, manage partnerships, and view stats.',
      icon: ShieldCheck,
      color: 'bg-emerald-600',
      shadow: 'shadow-emerald-200',
    },
    {
      role: 'PLATFORM_ADMIN' as UserRole,
      label: 'Platform',
      desc: 'System moderation, user control, and global analytics.',
      icon: UserCheck,
      color: 'bg-blue-600',
      shadow: 'shadow-blue-200',
    },
  ];

  const submitAuth = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (!isSupabaseConfigured) {
        onLogin(selectedRole);
        return;
      }

      if (mode === 'login') {
        const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
        if (authError) throw authError;
        const metadataRole = data.user?.user_metadata?.role as UserRole | undefined;
        onLogin(metadataRole || selectedRole);
        return;
      }

      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: selectedRole,
          },
        },
      });

      if (authError) throw authError;
      if (data.user) {
        await createProfileForAuthUser({
          id: data.user.id,
          email,
          fullName,
          role: selectedRole,
        });
      }
      onLogin(selectedRole);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (mode !== 'landing') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <Card className="grid w-full max-w-5xl overflow-hidden lg:grid-cols-[1fr_1.15fr]">
          <div className="bg-slate-950 p-8 text-white lg:p-10">
            <button
              onClick={() => setMode('landing')}
              className="mb-10 flex items-center gap-2 text-sm font-bold text-slate-300 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600">
              <GraduationCap className="h-8 w-8" />
            </div>
            <h1 className="font-display text-3xl font-black tracking-tight">StuTrack</h1>
            <p className="mt-4 max-w-sm text-sm font-medium leading-relaxed text-slate-300">
              {mode === 'login'
                ? 'Sign in with Supabase Auth or use the selected demo role while the backend data is being filled.'
                : 'Create a Supabase Auth account and attach the role StuTrack should use for dashboard access.'}
            </p>
          </div>

          <form onSubmit={submitAuth} className="space-y-6 p-8 lg:p-10">
            <div>
              <div className="flex items-center gap-3">
                {mode === 'login' ? <LogIn className="h-6 w-6 text-indigo-600" /> : <UserPlus className="h-6 w-6 text-indigo-600" />}
                <h2 className="font-display text-2xl font-black text-slate-900">
                  {mode === 'login' ? 'Login' : 'Register'}
                </h2>
              </div>
              <p className="mt-2 text-sm font-medium text-slate-500">
                Supabase project: zcfbvesrowvjbfasmuxa
              </p>
            </div>

            {error && (
              <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm font-bold text-rose-700">
                {error}
              </div>
            )}

            {mode === 'register' && (
              <label className="block space-y-2">
                <span className="text-xs font-black uppercase tracking-widest text-slate-400">Full name</span>
                <input
                  required
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium outline-none ring-indigo-500/10 transition-all focus:ring-4"
                />
              </label>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block space-y-2">
                <span className="text-xs font-black uppercase tracking-widest text-slate-400">Email</span>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium outline-none ring-indigo-500/10 transition-all focus:ring-4"
                />
              </label>
              <label className="block space-y-2">
                <span className="text-xs font-black uppercase tracking-widest text-slate-400">Password</span>
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium outline-none ring-indigo-500/10 transition-all focus:ring-4"
                />
              </label>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">Role</span>
              <div className="grid gap-3 sm:grid-cols-2">
                {roles.map((item) => (
                  <button
                    key={item.role}
                    type="button"
                    onClick={() => setSelectedRole(item.role)}
                    className={cn(
                      'flex items-center gap-3 rounded-2xl border p-4 text-left transition-all',
                      selectedRole === item.role
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-200',
                    )}
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    <span className="font-bold">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <Button className="w-full py-4" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Connecting...' : mode === 'login' ? 'Login to Dashboard' : 'Create Account'}
            </Button>
            <button
              type="button"
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="w-full text-center text-sm font-bold text-indigo-600 hover:text-indigo-800"
            >
              {mode === 'login' ? 'Need an account? Register' : 'Already registered? Login'}
            </button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50/30 p-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center">
        <div className="mb-4 flex items-center justify-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 shadow-xl shadow-indigo-200">
            <GraduationCap className="h-7 w-7 text-white" />
          </div>
          <span className="font-display text-3xl font-black tracking-tighter text-slate-900">StuTrack</span>
        </div>
        <h1 className="mb-2 font-display text-3xl font-bold text-slate-900">Welcome to StuTrack</h1>
        <p className="text-slate-500">Login, register, or pick a role to explore the full ecosystem.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button icon={LogIn} onClick={() => setMode('login')}>Login</Button>
          <Button icon={UserPlus} variant="outline" onClick={() => setMode('register')}>Register</Button>
        </div>
      </motion.div>

      <div className="grid w-full max-w-7xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {roles.map((item, index) => (
          <Card
            key={item.role}
            className="flex cursor-pointer flex-col items-center border-2 border-transparent p-8 text-center hover:border-indigo-600/20"
            onClick={() => onLogin(item.role)}
          >
            <div className={cn('mb-6 flex h-16 w-16 items-center justify-center rounded-2xl text-white transition-transform group-hover:scale-110', item.color, item.shadow)}>
              <item.icon className="h-8 w-8" />
            </div>
            <h3 className="mb-3 font-display text-xl font-bold">{item.label}</h3>
            <p className="mb-8 text-sm leading-relaxed text-slate-500">{item.desc}</p>
            <Button className="mt-auto w-full" variant={index === 0 ? 'primary' : 'outline'}>
              Access as {item.label}
            </Button>
          </Card>
        ))}
      </div>

      <p className="mt-8 text-xs font-medium text-slate-400">Prototype v1.0 - Supabase connected</p>
    </div>
  );
};
