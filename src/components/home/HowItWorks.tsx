import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Search, CheckCircle2, QrCode, UserPlus, CalendarPlus, Users, ArrowRight, ArrowLeft } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const { language, isRTL, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'students' | 'drivers'>('students');

  const studentSteps = [
    {
      num: '01',
      icon: Search,
      title: t('stepStudent1Title'),
      desc: t('stepStudent1Desc'),
      highlight: language === 'ar' ? 'حل ذروة 3:00 عصراً' : 'Peak 3:00 PM Solution'
    },
    {
      num: '02',
      icon: CheckCircle2,
      title: t('stepStudent2Title'),
      desc: t('stepStudent2Desc'),
      highlight: language === 'ar' ? 'حافلات سوبر جيت وميكروباص' : 'SuperJet & Microbus Fleet'
    },
    {
      num: '03',
      icon: QrCode,
      title: t('stepStudent3Title'),
      desc: t('stepStudent3Desc'),
      highlight: language === 'ar' ? 'تذكرة رقمية فورية' : 'Instant Digital Pass'
    }
  ];

  const driverSteps = [
    {
      num: '01',
      icon: UserPlus,
      title: t('stepDriver1Title'),
      desc: t('stepDriver1Desc'),
      highlight: language === 'ar' ? 'اعتماد أمني وإداري' : 'Verification & Safety'
    },
    {
      num: '02',
      icon: CalendarPlus,
      title: t('stepDriver2Title'),
      desc: t('stepDriver2Desc'),
      highlight: language === 'ar' ? 'تحكم كامل بالمواعيد' : 'Schedule Autonomy'
    },
    {
      num: '03',
      icon: Users,
      title: t('stepDriver3Title'),
      desc: t('stepDriver3Desc'),
      highlight: language === 'ar' ? 'فحص الركاب وتأكيد الصعود' : 'QR Boarding Manifest'
    }
  ];

  const steps = activeTab === 'students' ? studentSteps : driverSteps;

  return (
    <section id="how-it-works" className="py-16 sm:py-24 bg-white border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#0062FF] font-bold text-xs uppercase tracking-wider">
            {language === 'ar' ? 'سهل وسريع' : 'Simple & Seamless'}
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {t('howItWorksTitle')}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            {t('howItWorksSub')}
          </p>

          {/* Toggle between Student & Driver steps */}
          <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 mt-4">
            <button
              onClick={() => setActiveTab('students')}
              className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'students'
                  ? 'bg-white text-[#0062FF] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {language === 'ar' ? 'للطلاب (Students)' : 'For Students'}
            </button>
            <button
              onClick={() => setActiveTab('drivers')}
              className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'drivers'
                  ? 'bg-white text-amber-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {language === 'ar' ? 'للسائقين والشركات (Drivers)' : 'For Drivers & Operators'}
            </button>
          </div>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative bg-slate-50/70 hover:bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs hover:shadow-md transition-all group"
              >
                {/* Step numbering */}
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                    activeTab === 'students' ? 'bg-blue-100/80 text-[#0062FF]' : 'bg-amber-100/80 text-amber-600'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-3xl font-black text-slate-300">
                    {step.num}
                  </span>
                </div>

                <div className="inline-block px-2.5 py-0.5 rounded text-xs font-bold bg-white border border-slate-200 text-slate-700 mb-3">
                  {step.highlight}
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {step.title}
                </h3>
                
                <p className="text-slate-600 text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
