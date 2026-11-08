import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { Bus, Users, Wallet, ShieldCheck, PlusCircle, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';

interface ForDriversViewProps {
  onOpenRegister: () => void;
  onOpenDashboard: () => void;
}

export const ForDriversView: React.FC<ForDriversViewProps> = ({ onOpenRegister, onOpenDashboard }) => {
  const { language, isRTL, t } = useLanguage();
  const { user, role } = useAuth();
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <div className="py-12 sm:py-20 bg-slate-50 min-h-[80vh]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-xs uppercase tracking-wider">
            <Bus className="w-4 h-4 text-amber-600" />
            <span>{language === 'ar' ? 'بوابة السائقين ومشغلي النقل' : 'Captains & Fleet Operators'}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            {language === 'ar' ? 'انضم لمنظومة النقل الذكي لجامعات الأقصر' : 'Empower Your Fleet with HarryUp Platform'}
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {language === 'ar'
              ? 'سواء كنت كابتن حافلة سوبر جيت، مشغل أسطول سياحي، أو سائق ميكروباص معتمد، تمنحك HarryUp نظاماً رقمياً متكاملاً لملء مقاعدك وتنظيم رحلاتك وزيادة دخلك اليومي.'
              : 'Whether operating SuperJet coaches, tourist minibuses, or verified microbuses, HarryUp connects you directly with student passenger demand.'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {role === 'driver' ? (
              <button
                onClick={onOpenDashboard}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-md"
              >
                <span>{language === 'ar' ? 'الانتقال للوحة تحكم الكابتن' : 'Open Driver Dashboard'}</span>
                <ArrowIcon className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onOpenRegister}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-md"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{language === 'ar' ? 'تسجيل كابتن / مشغل جديد' : 'Register Operator Account'}</span>
              </button>
            )}
          </div>
        </div>

        {/* 3 Driver Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">
              {language === 'ar' ? 'طلب طلابي مضمون' : 'Guaranteed Passenger Demand'}
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {language === 'ar'
                ? 'تنسيق مسبق لحجوزات مئات الطلاب بعد 3 عصراً، مما يضمن انطلاق حافلتك بكامل طاقتها الاستيعابية دون إهدار وقت.'
                : 'Full seat occupancy coordinated during university exit hours without idle waiting at station curbs.'}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0062FF] flex items-center justify-center">
              <Bus className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">
              {language === 'ar' ? 'منافستو رقمي ومسح سريع' : 'Digital QR Check-in'}
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {language === 'ar'
                ? 'كشف حضور رقمي على هاتفك. تحقق من كود تذكرة الطالب عند الصعود بلمسة واحدة.'
                : 'Real-time passenger manifest on your mobile device. Confirm boarding and passenger attendance effortlessly.'}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Wallet className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">
              {language === 'ar' ? 'تحصيل مرن للأموال' : 'Flexible Revenue Collection'}
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {language === 'ar'
                ? 'تحصيل نقدي مباشر عند الصعود أو عبر المحافظ الإلكترونية، مع تقارير وإحصائيات دقيقة لإيراداتك اليومية.'
                : 'Collect cash fares directly upon boarding or via mobile wallets, with transparent daily earnings tracking.'}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
