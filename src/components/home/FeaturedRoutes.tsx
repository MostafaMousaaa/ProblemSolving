import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import { MapPin, Clock, ArrowRight, ArrowLeft, Bus, Sparkles } from 'lucide-react';
import { formatEgyptianPrice } from '../../utils/bookingLogic';

interface FeaturedRoutesProps {
  onSelectRoute: (from: string, to: string) => void;
}

export const FeaturedRoutes: React.FC<FeaturedRoutesProps> = ({ onSelectRoute }) => {
  const { language, isRTL, t } = useLanguage();
  const { routes } = useData();

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <section id="routes" className="py-16 sm:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#0062FF] font-bold text-xs uppercase tracking-wider">
            {language === 'ar' ? 'شبكة الخطوط النشطة' : 'Active Campus Network'}
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {t('featuredRoutesTitle')}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            {t('featuredRoutesSub')}
          </p>
        </div>

        {/* Routes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {routes.map((route) => {
            return (
              <div
                key={route.id}
                className="bg-slate-50/70 hover:bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Badges */}
                  <div className="flex items-center justify-between mb-4">
                    {route.popular ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                        <Sparkles className="w-3 h-3 text-amber-600" />
                        <span>{t('popularBadge')}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-[#0062FF] text-xs font-semibold">
                        <Bus className="w-3 h-3" />
                        <span>{language === 'ar' ? 'خط مباشر' : 'Direct Line'}</span>
                      </span>
                    )}

                    <span className="text-xs font-semibold text-slate-400">
                      {route.estimatedDuration}
                    </span>
                  </div>

                  {/* Route points */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-start gap-2.5">
                      <div className="w-3 h-3 rounded-full bg-[#0062FF] mt-1 shrink-0"></div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                          {language === 'ar' ? 'من' : 'From'}
                        </p>
                        <p className="text-sm font-bold text-slate-800">
                          {language === 'ar' ? route.fromNameAr : route.fromNameEn}
                        </p>
                      </div>
                    </div>

                    <div className="border-s-2 border-dashed border-slate-300 ms-1.5 h-4"></div>

                    <div className="flex items-start gap-2.5">
                      <div className="w-3 h-3 rounded-full bg-amber-500 mt-1 shrink-0"></div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                          {language === 'ar' ? 'إلى' : 'To'}
                        </p>
                        <p className="text-sm font-bold text-slate-800">
                          {language === 'ar' ? route.toNameAr : route.toNameEn}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price and Action */}
                <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500 block">
                      {t('startingFrom')}
                    </span>
                    <span className="text-lg font-black text-slate-900">
                      {formatEgyptianPrice(route.basePrice, language)}
                    </span>
                  </div>

                  <button
                    onClick={() => onSelectRoute(route.fromCity, route.toCity)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0062FF] hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all"
                  >
                    <span>{language === 'ar' ? 'عرض الرحلات' : 'View Trips'}</span>
                    <ArrowIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Regulatory & Sample Data Disclaimer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-slate-400 max-w-2xl mx-auto">
            {language === 'ar'
              ? 'تنويه: المسارات والمواعيد المعروضة تمثل الخطوط الجامعية النشطة لغرض التنظيم والعرض، وتخضع الجداول لتوافر الحافلات والمشغلين المعتمدين.'
              : 'Notice: Sample routes and schedules represent active campus transit lines for organization purposes. Actual schedules depend on authorized operator availability.'}
          </p>
        </div>

      </div>
    </section>
  );
};
