import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import { UserCheck, Shield, Car, GraduationCap, RefreshCw, Globe } from 'lucide-react';

interface QuickRoleSwitcherProps {
  onNavigateTab?: (tab: string) => void;
}

export const QuickRoleSwitcher: React.FC<QuickRoleSwitcherProps> = ({ onNavigateTab }) => {
  const { user, role, switchDemoRole } = useAuth();
  const { language, toggleLanguage } = useLanguage();
  const { resetToDemoSeed } = useData();

  return (
    <aside aria-label="Demo switcher" className="bg-[#0b1a30] text-slate-200 border-b border-slate-800 text-xs py-1.5 px-3 sm:px-6 transition-all">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Left: Role indicator & Switch buttons */}
        <div className="flex items-center flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 font-semibold text-amber-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            {language === 'ar' ? 'وضع التجربة السريع (Live Demo):' : 'Interactive Demo Switcher:'}
          </span>

          <div className="flex items-center gap-1 bg-slate-900/80 p-0.5 rounded-lg border border-slate-700/60">
            <button
              onClick={() => {
                switchDemoRole('student');
                if (onNavigateTab) onNavigateTab('student-dashboard');
              }}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
                role === 'student'
                  ? 'bg-[#0062FF] text-white font-bold shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
              title="تجربة حساب الطالب"
            >
              <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'ar' ? 'طالب' : 'Student'}</span>
            </button>

            <button
              onClick={() => {
                switchDemoRole('driver');
                if (onNavigateTab) onNavigateTab('driver-dashboard');
              }}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
                role === 'driver'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
              title="تجربة حساب السائق المعتمد"
            >
              <Car className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'سائق معتمد' : 'Driver'}</span>
            </button>

            <button
              onClick={() => {
                switchDemoRole('admin');
                if (onNavigateTab) onNavigateTab('admin-dashboard');
              }}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
                role === 'admin'
                  ? 'bg-purple-600 text-white font-bold shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
              title="تجربة لوحة تحكم الإدارة"
            >
              <Shield className="w-3.5 h-3.5 text-amber-300" />
              <span>{language === 'ar' ? 'المسؤول' : 'Admin'}</span>
            </button>

            <button
              onClick={() => {
                switchDemoRole('guest');
                if (onNavigateTab) onNavigateTab('home');
              }}
              className={`px-2 py-1 rounded-md transition-all ${
                !user
                  ? 'bg-slate-700 text-white font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="تسجيل الخروج والرجوع كزائر"
            >
              <span>{language === 'ar' ? 'زائر' : 'Guest'}</span>
            </button>
          </div>
        </div>

        {/* Right: Quick actions (Language + Reset Seed) */}
        <div className="flex items-center gap-3">
          <button
            onClick={resetToDemoSeed}
            className="inline-flex items-center gap-1 text-slate-400 hover:text-amber-400 transition-colors"
            title="إعادة تعيين البيانات الأولية"
          >
            <RefreshCw className="w-3 h-3" />
            <span className="hidden sm:inline">{language === 'ar' ? 'استعادة البيانات' : 'Reset Data'}</span>
          </button>

          <button
            onClick={toggleLanguage}
            className="inline-flex items-center gap-1 bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded text-slate-200 border border-slate-700 transition-colors"
          >
            <Globe className="w-3 h-3 text-[#0062FF]" />
            <span className="font-semibold">{language === 'ar' ? 'English (EN)' : 'العربية (AR)'}</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
