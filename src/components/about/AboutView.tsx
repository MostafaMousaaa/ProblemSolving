import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Target, Compass, Sparkles, Users, Bus, Clock, ShieldCheck, Heart } from 'lucide-react';

export const AboutView: React.FC = () => {
  const { language, t } = useLanguage();

  return (
    <div className="py-12 sm:py-20 bg-slate-50 min-h-[80vh]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/70 text-[#0062FF] font-bold text-xs uppercase tracking-wider">
            {language === 'ar' ? 'قصتنا ورؤيتنا' : 'Our Story & Vision'}
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            {language === 'ar' ? 'عن منصة HarryUp' : 'About HarryUp'}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            {language === 'ar'
              ? 'منصة نقل رقمية مصرية بدأت من قلب الأقصر لحل أزمة تنقل طلاب الجامعات وربط الركاب بمشغلي النقل وسائقي سوبر جيت المعتمدين.'
              : 'An Egyptian digital transportation platform born in Luxor to resolve university student transit bottlenecks and bridge passengers with authorized operators.'}
          </p>
        </div>

        {/* The Problem Section */}
        <div className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              {language === 'ar' ? 'المشكلة التي بدأت منها فكرتنا' : 'The Transportation Challenge'}
            </h2>
          </div>
          <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
            {language === 'ar'
              ? 'يواجه آلاف طلاب جامعة الأقصر ومجمع كليات طيبة (كليات الحاسبات والمعلومات، الآثار، الفنون الجميلة، الألسن، والجامعة التكنولوجية) أزمة مواصلات متكررة يومياً بعد الساعة 3:00 عصراً. مع انتهاء المحاضرات دفعة واحدة، يضطر الطلاب للانتظار فترات طويلة في المواقف في ظل قلة الحافلات المنظمة وعدم معرفة أوقات الوصول أو المقاعد المتاحة.'
              : 'Thousands of university students in Luxor and Tuba face a severe transit bottleneck every weekday after 3:00 PM when lectures end simultaneously. Students endure long waiting times in severe heat, unclear bus schedules, and disorganized return journeys.'}
          </p>
        </div>

        {/* Mission and Vision Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Mission */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4 relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#0062FF] flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              {language === 'ar' ? 'رسالتنا (Our Mission)' : 'Our Mission'}
            </h3>
            <blockquote className="text-slate-700 italic border-s-4 border-[#0062FF] ps-4 text-sm sm:text-base leading-relaxed">
              "{language === 'ar'
                ? 'تيسير التنقل اليومي من خلال ربط الركاب بمشغلي النقل عبر منصة رقمية سهلة وموثوقة.'
                : 'Making everyday transportation easier by connecting passengers with transportation providers through a simple digital platform.'}"
            </blockquote>
          </div>

          {/* Vision */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4 relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              {language === 'ar' ? 'رؤيتنا (Our Vision)' : 'Our Vision'}
            </h3>
            <blockquote className="text-slate-700 italic border-s-4 border-amber-500 ps-4 text-sm sm:text-base leading-relaxed">
              "{language === 'ar'
                ? 'بناء تجربة نقل أذكى وأكثر ترابطاً في صعيد مصر وجميع محافظات الجمهورية.'
                : 'Building a smarter and more connected transportation experience across Egypt.'}"
            </blockquote>
          </div>

        </div>

        {/* Value Proposition for both sides */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50/70 rounded-2xl p-6 sm:p-8 border border-blue-200/80 space-y-3">
            <div className="flex items-center gap-2 text-[#0062FF] font-bold text-lg">
              <Users className="w-5 h-5" />
              <h4>{language === 'ar' ? 'القيمة المضافة للطلاب' : 'Value for Students'}</h4>
            </div>
            <ul className="space-y-2 text-sm text-slate-700">
              <li>• {language === 'ar' ? 'حجز مسبق ومضمون للمقعد قبل مغادرة الجامعة.' : 'Guaranteed seat reservation before leaving campus.'}</li>
              <li>• {language === 'ar' ? 'معرفة موعد التحرك الدقيق واسم الكابتن ورقم الحافلة.' : 'Exact departure times, operator identity, and plate numbers.'}</li>
              <li>• {language === 'ar' ? 'توفير الوقت والجهد وتجنب الزحام والانتظار المرهق.' : 'Elimination of exhausting queue lines and transit stress.'}</li>
            </ul>
          </div>

          <div className="bg-amber-50/70 rounded-2xl p-6 sm:p-8 border border-amber-200/80 space-y-3">
            <div className="flex items-center gap-2 text-amber-800 font-bold text-lg">
              <Bus className="w-5 h-5" />
              <h4>{language === 'ar' ? 'القيمة المضافة لكباتن ومشغلي النقل' : 'Value for Drivers & Operators'}</h4>
            </div>
            <ul className="space-y-2 text-sm text-slate-700">
              <li>• {language === 'ar' ? 'إشغال كامل للمقاعد ورفع كفاءة الرحلات.' : 'Higher seat occupancy and predictable trip schedules.'}</li>
              <li>• {language === 'ar' ? 'قائمة ركاب رقمية منظمة ومسح سريع عبر الـ QR.' : 'Organized digital passenger manifest with fast QR check-in.'}</li>
              <li>• {language === 'ar' ? 'زيادة الدخل وتأكيد الحجوزات مسبقاً.' : 'Increased revenue with upfront confirmed student demand.'}</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
};
