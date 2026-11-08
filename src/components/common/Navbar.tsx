import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { Logo } from './Logo';
import { Menu, X, Globe, User, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  onOpenAuth: (mode: 'login' | 'register', role?: 'student' | 'driver') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onNavigate, onOpenAuth }) => {
  const { language, toggleLanguage, t } = useLanguage();
  const { user, role, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: t('navHome') },
    { id: 'how-it-works', label: t('navHowItWorks') },
    { id: 'routes', label: t('navRoutes') },
    { id: 'for-students', label: t('navStudents') },
    { id: 'for-drivers', label: t('navDrivers') },
    { id: 'about', label: t('navAbout') },
    { id: 'contact', label: t('navContact') },
  ];

  const handleNavClick = (tabId: string) => {
    onNavigate(tabId);
    setMobileMenuOpen(false);
  };

  const getDashboardTab = () => {
    if (role === 'driver') return 'driver-dashboard';
    if (role === 'admin') return 'admin-dashboard';
    return 'student-dashboard';
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <Logo 
              size="md" 
              onClick={() => handleNavClick('home')} 
            />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? 'text-[#0062FF] bg-blue-50/80'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Desktop Action Area */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors"
              aria-label="Toggle language"
            >
              <Globe className="w-4 h-4 text-[#0062FF]" />
              <span>{language === 'ar' ? 'English' : 'العربية'}</span>
            </button>

            {/* Authenticated user menu vs Login/Register */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-800 text-sm font-semibold transition-all"
                >
                  <div className="w-7 h-7 rounded-full bg-[#0062FF] text-white flex items-center justify-center font-bold text-xs">
                    {user.name.charAt(0)}
                  </div>
                  <span className="max-w-[120px] truncate">{user.name.split(' ')[0]}</span>
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                </button>

                {userDropdownOpen && (
                  <div className={`absolute top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-1 ${
                    language === 'ar' ? 'left-0' : 'right-0'
                  }`}>
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-400 font-medium">
                        {role === 'driver' ? 'حساب سائق' : role === 'admin' ? 'حساب مسؤول' : 'حساب طالب'}
                      </p>
                      <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
                    </div>

                    <button
                      onClick={() => {
                        handleNavClick(getDashboardTab());
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-[#0062FF] transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-[#0062FF]" />
                      <span>{t('navDashboard')}</span>
                    </button>

                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                        handleNavClick('home');
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t('navLogout')}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:text-[#0062FF] hover:bg-blue-50/50 transition-colors"
                >
                  {t('navLogin')}
                </button>
                <button
                  onClick={() => onOpenAuth('register', 'student')}
                  className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-[#0062FF] hover:bg-blue-700 shadow-xs hover:shadow-md transition-all"
                >
                  {t('navRegister')}
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={toggleLanguage}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label="Change language"
            >
              <Globe className="w-5 h-5 text-[#0062FF]" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Open navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 shadow-xl animate-in fade-in">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`w-full text-start px-3 py-2.5 rounded-lg text-sm font-semibold ${
                  currentTab === link.id
                    ? 'text-[#0062FF] bg-blue-50'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </button>
            ))}

            <hr className="my-2 border-slate-100" />

            {user ? (
              <>
                <button
                  onClick={() => handleNavClick(getDashboardTab())}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-bold text-[#0062FF] bg-blue-50"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>{t('navDashboard')} ({user.name.split(' ')[0]})</span>
                </button>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                    handleNavClick('home');
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-rose-600 hover:bg-rose-50"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t('navLogout')}</span>
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('login');
                  }}
                  className="w-full py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 text-center"
                >
                  {t('navLogin')}
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('register', 'student');
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#0062FF] text-white text-sm font-bold text-center"
                >
                  {t('navRegister')}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
