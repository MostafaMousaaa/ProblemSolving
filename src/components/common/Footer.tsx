import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Logo } from './Logo';
import { MapPin, Phone, Mail, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
  onOpenLegal: (type: 'privacy' | 'terms') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenLegal }) => {
  const { language, t } = useLanguage();

  return (
    <footer className="bg-[#0b1a30] text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="md" />
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              {t('footerAboutText')}
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-amber-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{t('superjetNote')}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase">
              {language === 'ar' ? 'روابط سريعة' : 'Quick Links'}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-amber-400 transition-colors">
                  {t('navHome')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('how-it-works')} className="hover:text-amber-400 transition-colors">
                  {t('navHowItWorks')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('routes')} className="hover:text-amber-400 transition-colors">
                  {t('navRoutes')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-amber-400 transition-colors">
                  {t('navAbout')}
                </button>
              </li>
            </ul>
          </div>

          {/* For Users */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase">
              {language === 'ar' ? 'الخدمات' : 'Portals'}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => onNavigate('for-students')} className="hover:text-amber-400 transition-colors">
                  {t('navStudents')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('for-drivers')} className="hover:text-amber-400 transition-colors">
                  {t('navDrivers')}
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegal('privacy')} className="hover:text-amber-400 transition-colors">
                  {t('privacyPolicy')}
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegal('terms')} className="hover:text-amber-400 transition-colors">
                  {t('termsConditions')}
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase">
              {language === 'ar' ? 'التواصل والدعم' : 'Contact Us'}
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#0062FF] shrink-0 mt-0.5" />
                <span>{language === 'ar' ? 'الأقصر - مجمع كليات طيبة' : 'Luxor - Tuba Campuses Complex'}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>support@harryup.app</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+20 (100) 000-0001</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>{t('allRightsReserved')}</p>
          <p className="flex items-center gap-1">
            <span>{language === 'ar' ? 'صُمم في الأقصر لخدمة طلاب مصر' : 'Built in Luxor with'}</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
          </p>
        </div>
      </div>
    </footer>
  );
};
