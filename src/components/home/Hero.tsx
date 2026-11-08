import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { MapPin, Calendar, Clock, Users, ArrowRight, ArrowLeft, Search, Sparkles, Bus, ShieldCheck } from 'lucide-react';

interface HeroProps {
  onSearch: (params: { from: string; to: string; date: string; time: string; seats: number }) => void;
  onJoinDriver: () => void;
  onFindJourney: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onSearch, onJoinDriver, onFindJourney }) => {
  const { language, isRTL, t } = useLanguage();

  const [from, setFrom] = useState('طيبة (Tuba)');
  const [to, setTo] = useState('الأقصر (Luxor)');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('15:00'); // Default to 3:00 PM as targeted
  const [seats, setSeats] = useState(1);

  const handleQuickRoute = (fromLoc: string, toLoc: string) => {
    setFrom(fromLoc);
    setTo(toLoc);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ from, to, date, time, seats });
  };

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-slate-50 pt-8 sm:pt-14 pb-16 lg:pb-24">
      {/* Decorative subtle background accents */}
      <div className="absolute top-0 end-0 -translate-y-12 translate-x-12 w-96 h-96 bg-blue-100/60 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 start-0 -translate-y-1/2 -translate-x-12 w-80 h-80 bg-amber-100/40 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Announcement Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-blue-200/80 shadow-xs text-xs sm:text-sm font-semibold text-slate-700">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span className="text-[#0062FF] font-bold">
              {language === 'ar' ? 'حل أزمة مواصلات ما بعد 3 عصراً' : 'Solving the 3:00 PM Transit Rush'}
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500">
              {language === 'ar' ? 'جامعة الأقصر وكليات طيبة' : 'Luxor University & Tuba'}
            </span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-10">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight sm:leading-tight">
            {language === 'ar' ? (
              <>
                مشوارك بقى أسهل مع <span dir="ltr" className="inline-block"><span className="text-[#0062FF]">Harry</span><span className="text-[#FFB800]">Up</span></span>
              </>
            ) : (
              <>
                Your Journey, <span className="text-[#0062FF]">Made</span> <span className="text-[#FFB800]">Easier.</span>
              </>
            )}
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed font-normal">
            {t('heroDesc')}
          </p>

          {/* Quick CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onFindJourney}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0062FF] hover:bg-blue-700 text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all"
            >
              <span>{t('findYourJourney')}</span>
              <ArrowIcon className="w-4 h-4" />
            </button>
            <button
              onClick={onJoinDriver}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-sm sm:text-base shadow-xs hover:shadow-md transition-all"
            >
              <Bus className="w-4 h-4 text-amber-500" />
              <span>{t('joinAsDriver')}</span>
            </button>
          </div>
        </div>

        {/* Transportation Search Box Widget */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200/90 p-4 sm:p-6 lg:p-8">
            
            {/* Quick route chips */}
            <div className="flex flex-wrap items-center gap-2 mb-5 text-xs sm:text-sm">
              <span className="text-slate-500 font-semibold">{t('quickRoutes')}</span>
              
              <button
                type="button"
                onClick={() => handleQuickRoute('طيبة (Tuba)', 'الأقصر (Luxor)')}
                className={`px-3 py-1.5 rounded-lg border font-semibold transition-all ${
                  from === 'طيبة (Tuba)' && to === 'الأقصر (Luxor)'
                    ? 'bg-blue-50 border-[#0062FF] text-[#0062FF]'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                {t('tubaToLuxor')}
              </button>

              <button
                type="button"
                onClick={() => handleQuickRoute('الأقصر (Luxor)', 'طيبة (Tuba)')}
                className={`px-3 py-1.5 rounded-lg border font-semibold transition-all ${
                  from === 'الأقصر (Luxor)' && to === 'طيبة (Tuba)'
                    ? 'bg-blue-50 border-[#0062FF] text-[#0062FF]'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                {t('luxorToTuba')}
              </button>

              <button
                type="button"
                onClick={() => handleQuickRoute('طيبة (Tuba)', 'الكرنك (Karnak)')}
                className={`px-3 py-1.5 rounded-lg border font-semibold transition-all ${
                  to === 'الكرنك (Karnak)'
                    ? 'bg-blue-50 border-[#0062FF] text-[#0062FF]'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                {language === 'ar' ? 'طيبة ↔ الكرنك' : 'Tuba ↔ Karnak'}
              </button>
            </div>

            {/* Main Search Inputs Grid */}
            <form onSubmit={handleFormSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
                
                {/* From Location */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    {t('fromLocation')}
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-[#0062FF] absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      value={from}
                      onChange={(e) => setFrom(e.target.value)}
                      className="w-full ps-9 pe-3 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0062FF] focus:border-transparent"
                    >
                      <option value="طيبة (Tuba)">طيبة (مجمع الكليات)</option>
                      <option value="الأقصر (Luxor)">الأقصر (وسط المدينة)</option>
                      <option value="الكرنك (Karnak)">الكرنك</option>
                      <option value="البياضية (Al-Bayadiya)">البياضية</option>
                    </select>
                  </div>
                </div>

                {/* Destination Location */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    {t('toLocation')}
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-amber-500 absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                      className="w-full ps-9 pe-3 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0062FF] focus:border-transparent"
                    >
                      <option value="الأقصر (Luxor)">الأقصر (محطة القطار / المحطة)</option>
                      <option value="طيبة (Tuba)">طيبة (مدينة طيبة الجديدة)</option>
                      <option value="الكرنك (Karnak)">الكرنك (الكورنيش)</option>
                      <option value="البياضية (Al-Bayadiya)">البياضية</option>
                    </select>
                  </div>
                </div>

                {/* Date */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    {t('travelDate')}
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full ps-9 pe-3 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0062FF]"
                    />
                  </div>
                </div>

                {/* Time */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    {t('departureTime')}
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full ps-9 pe-3 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0062FF]"
                    >
                      <option value="15:00">3:00 م (وقت الذروة)</option>
                      <option value="15:15">3:15 م</option>
                      <option value="15:30">3:30 م</option>
                      <option value="15:45">3:45 م</option>
                      <option value="16:00">4:00 م</option>
                      <option value="16:30">4:30 م</option>
                      <option value="07:30">7:30 ص (صباحي)</option>
                    </select>
                  </div>
                </div>

                {/* Search Button */}
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-[#0062FF] hover:bg-blue-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all h-[42px]"
                  >
                    <Search className="w-4 h-4" />
                    <span>{t('searchTrips')}</span>
                  </button>
                </div>

              </div>
            </form>

            {/* Bottom trust indicators */}
            <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{language === 'ar' ? 'سائقون ومركبات معتمدة ومفحوصة' : 'Vetted vehicles & authorized drivers'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>{language === 'ar' ? 'تحديث فوري لعدد المقاعد الشاغرة' : 'Live seat availability tracking'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700">
                  {language === 'ar' ? 'التعريفة بالجنيه المصري (EGP)' : 'Transparent EGP Pricing'}
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
