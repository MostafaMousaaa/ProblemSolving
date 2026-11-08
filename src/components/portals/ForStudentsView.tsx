import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, Clock, ShieldCheck, QrCode, Search, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';

interface ForStudentsViewProps {
  onSearchTrips: () => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
}

export const ForStudentsView: React.FC<ForStudentsViewProps> = ({ onSearchTrips, onOpenAuth }) => {
  const { language, isRTL, t } = useLanguage();
  const { user, role } = useAuth();
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <div className="py-12 sm:py-20 bg-slate-50 min-h-[80vh]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-[#0062FF] font-bold text-xs uppercase tracking-wider">
            <GraduationCap className="w-4 h-4 text-amber-500" />
            <span>{language === 'ar' ? 'بوابة طلاب الجامعات' : 'University Students Hub'}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            {language === 'ar' ? 'مشوارك من طيبة للأقصر بعد 3:00 عصراً أصبح مضموناً' : 'Your Return Journey from Tuba to Luxor is Guaranteed'}
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {language === 'ar'
              ? 'صممت HarryUp خصيصاً لتمنحك راحة البال بعد انتهاء محاضراتك. احجز مقعدك في حافلات سوبر جيت والمشغلين المعتمدين بضغطة زر وتسلّم تذكرتك الرقمية فوراً.'
              : 'HarryUp was engineered to eliminate transit anxiety after university lectures conclude at 3:00 PM. Book your verified coach seat in seconds.'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onSearchTrips}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0062FF] hover:bg-blue-700 text-white font-bold text-sm shadow-md"
            >
              <Search className="w-4 h-4" />
              <span>{t('findYourJourney')}</span>
            </button>

            {!user && (
              <button
                onClick={() => onOpenAuth('register')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-sm hover:bg-slate-50"
              >
                <span>{language === 'ar' ? 'إنشاء حساب طالب' : 'Register Student Account'}</span>
              </button>
            )}
          </div>
        </div>

        {/* 3 Main Pillars for Students */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0062FF] flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">
              {language === 'ar' ? 'انتهاء زمن الانتظار' : 'Zero Queue Waiting'}
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {language === 'ar'
                ? 'لا داعي للوقوف في طوابير المواقف تحت أشعة الشمس. احجز مقعدك وأنت داخل قاعة المحاضرات واخرج مباشرة إلى نقطة ركوب الحافلة.'
                : 'No more standing in queues under the hot sun. Book directly from your lecture hall and walk right to the bus.'}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">
              {language === 'ar' ? 'سائقون ومركبات مرخصة' : 'Authorized Operators'}
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {language === 'ar'
                ? 'جميع الحافلات وسائقو سوبر جيت المعتمدون مسجلون ومفحوصون إدارياً لضمان سلامتك وأمان طريقك.'
                : 'All coaches, SuperJet fleets, and licensed captains are verified for your security.'}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">
              {language === 'ar' ? 'تذكرة QR ذكية' : 'Digital QR Boarding'}
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {language === 'ar'
                ? 'تصلك تذكرة رقمية برمز QR على هاتفك. أظهرها للكابتن عند الصعود لتأكيد حجزك في ثوان معدودة.'
                : 'Get an instant digital ticket with unique reference and QR pass scannable by the captain upon boarding.'}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
