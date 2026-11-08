import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ShieldCheck, Clock, Users, Coins, Sparkles, Check } from 'lucide-react';

export const Benefits: React.FC = () => {
  const { language, t } = useLanguage();

  const benefits = [
    {
      icon: Clock,
      title: t('benefit1Title'),
      desc: t('benefit1Desc'),
      color: 'text-[#0062FF]',
      bg: 'bg-blue-50'
    },
    {
      icon: Users,
      title: t('benefit2Title'),
      desc: t('benefit2Desc'),
      color: 'text-amber-500',
      bg: 'bg-amber-50'
    },
    {
      icon: ShieldCheck,
      title: t('benefit3Title'),
      desc: t('benefit3Desc'),
      color: 'text-emerald-500',
      bg: 'bg-emerald-50'
    },
    {
      icon: Coins,
      title: t('benefit4Title'),
      desc: t('benefit4Desc'),
      color: 'text-purple-500',
      bg: 'bg-purple-50'
    }
  ];

  return (
    <section className="py-16 sm:py-24 bg-slate-50/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Heading and Story Context */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/70 text-amber-800 font-bold text-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'حل رقمي مبتكر في الأقصر' : 'TravelTech Innovation in Luxor'}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              {t('benefitsTitle')}
            </h2>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {language === 'ar'
                ? 'أنشئت منصة HarryUp استجابة لمعاناة طلاب الجامعات اليومية في العودة من طيبة إلى الأقصر بعد انتهاء المحاضرات عند الساعة 3:00 عصراً، لنخلق تجربة تنقل مريحة، منظمة، وشفافة تلائم تطلعات الطلاب وتدعم كباتن النقل.'
                : 'HarryUp was established specifically to solve the daily student transit squeeze traveling from Tuba to Luxor after university lectures conclude at 3:00 PM on weekdays, providing a dignified and reliable transit marketplace.'}
            </p>

            <ul className="space-y-3 pt-2">
              {[
                language === 'ar' ? 'تنسيق مباشر مع حافلات سوبر جيت والمشغلين المعتمدين' : 'Direct coordination with verified SuperJet & coach operators',
                language === 'ar' ? 'حماية من التكدس والزيادات العشوائية' : 'Protection against transit chaos and unfair surge pricing',
                language === 'ar' ? 'تأكيد الحجز برمز QR وتذكرة إلكترونية' : 'Instant digital pass with verification QR Code'
              ].map((bullet, i) => (
                <li key={i} className="flex items-center gap-3 text-sm font-semibold text-slate-800">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column: 4 Grid Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {benefits.map((b, idx) => {
              const Icon = b.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow"
                >
                  <div className={`w-12 h-12 rounded-xl ${b.bg} ${b.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    {b.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {b.desc}
                  </p>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
