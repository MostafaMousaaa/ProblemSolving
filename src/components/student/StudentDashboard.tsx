import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Trip, Booking } from '../../types';
import { formatEgyptianPrice, formatEgyptianTime, isCancellationAllowed } from '../../utils/bookingLogic';
import {
  LayoutDashboard,
  Search,
  BookmarkCheck,
  Calendar,
  History,
  Bell,
  User,
  HelpCircle,
  LogOut,
  MapPin,
  Clock,
  Bus,
  CheckCircle2,
  XCircle,
  AlertCircle,
  QrCode,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Filter
} from 'lucide-react';
import QRCode from 'qrcode';

interface StudentDashboardProps {
  onOpenBooking: (trip: Trip) => void;
  onLogout: () => void;
  initialSubTab?: string;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onOpenBooking,
  onLogout,
  initialSubTab = 'overview'
}) => {
  const { language, isRTL, t } = useLanguage();
  const { user } = useAuth();
  const { trips, bookings, cancelBooking, settings } = useData();

  const [activeTab, setActiveTab] = useState<string>(initialSubTab);

  // Search & Filter state for "Find a Trip"
  const [searchFrom, setSearchFrom] = useState('');
  const [searchTo, setSearchTo] = useState('');
  const [maxPrice, setMaxPrice] = useState<number>(50);
  const [timeFilter, setTimeFilter] = useState<string>('all');
  const [operatorFilter, setOperatorFilter] = useState<string>('all');

  // Selected booking for QR ticket viewing
  const [ticketBooking, setTicketBooking] = useState<Booking | null>(null);
  const [ticketQrSvg, setTicketQrSvg] = useState<string>('');
  const [cancelModalBooking, setCancelModalBooking] = useState<Booking | null>(null);
  const [cancelMsg, setCancelMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Student specific bookings
  const studentBookings = bookings.filter(b => b.studentId === user?.id || b.studentPhone === user?.phone);
  const upcomingBookings = studentBookings.filter(b => b.status === 'confirmed');
  const completedBookings = studentBookings.filter(b => b.status === 'completed');
  const cancelledBookings = studentBookings.filter(b => b.status === 'cancelled');

  const handleOpenTicket = async (b: Booking) => {
    setTicketBooking(b);
    try {
      const svg = await QRCode.toString(JSON.stringify({ ref: b.id, name: b.studentName, trip: b.tripId }), { type: 'svg', width: 160, margin: 1 });
      setTicketQrSvg(svg);
    } catch (e) {
      console.error(e);
    }
  };

  const handleConfirmCancel = () => {
    if (!cancelModalBooking) return;
    const res = cancelBooking(cancelModalBooking.id);
    if (res.success) {
      setCancelMsg({
        type: 'success',
        text: language === 'ar' ? 'تم إلغاء الحجز وإعادة المقاعد بنجاح' : 'Booking successfully cancelled'
      });
      setCancelModalBooking(null);
    } else {
      setCancelMsg({
        type: 'error',
        text: res.error || 'فشل إلغاء الحجز'
      });
    }
  };

  // Filtered trips
  const filteredTrips = trips.filter(trip => {
    if (trip.status === 'cancelled') return false;
    if (searchFrom && !trip.fromLocation.toLowerCase().includes(searchFrom.toLowerCase()) && !trip.fromLocationAr.includes(searchFrom)) {
      return false;
    }
    if (searchTo && !trip.toLocation.toLowerCase().includes(searchTo.toLowerCase()) && !trip.toLocationAr.includes(searchTo)) {
      return false;
    }
    if (trip.pricePerSeat > maxPrice) return false;
    if (operatorFilter !== 'all' && !trip.companyName.includes(operatorFilter)) return false;
    if (timeFilter === 'after3' && parseInt(trip.departureTime.split(':')[0], 10) < 15) return false;
    if (timeFilter === 'morning' && parseInt(trip.departureTime.split(':')[0], 10) >= 12) return false;
    return true;
  });

  const sidebarItems = [
    { id: 'overview', icon: LayoutDashboard, label: t('dashboardOverview') },
    { id: 'find-trip', icon: Search, label: t('findTrip') },
    { id: 'my-bookings', icon: BookmarkCheck, label: t('myBookings'), badge: upcomingBookings.length },
    { id: 'upcoming', icon: Calendar, label: t('upcomingTrips') },
    { id: 'history', icon: History, label: t('bookingHistory') },
    { id: 'notifications', icon: Bell, label: t('notifications') },
    { id: 'profile', icon: User, label: t('myProfile') },
    { id: 'support', icon: HelpCircle, label: t('helpSupport') },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Welcome Header */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#0062FF] text-xs font-bold mb-2">
              <span>{t('studentDashboard')}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              {t('studentWelcome')}، {user?.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              {(user as any)?.university || 'جامعة الأقصر - كليات مجمع طيبة'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('find-trip')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0062FF] hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-all"
            >
              <Search className="w-4 h-4" />
              <span>{t('findTrip')}</span>
            </button>
          </div>
        </div>

        {/* Cancel Feedback Banner */}
        {cancelMsg && (
          <div className={`mb-6 p-4 rounded-xl border text-sm font-semibold flex items-center justify-between ${
            cancelMsg.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}>
            <span>{cancelMsg.text}</span>
            <button onClick={() => setCancelMsg(null)} className="text-xs font-bold underline">
              {language === 'ar' ? 'إغلاق' : 'Dismiss'}
            </button>
          </div>
        )}

        {/* Dashboard Layout: Sidebar + Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Sidebar */}
          <aside className="lg:col-span-3 bg-white rounded-2xl p-3 border border-slate-200/80 shadow-xs space-y-1">
            {sidebarItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-[#0062FF] text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100/70 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-black ${
                      isActive ? 'bg-white text-[#0062FF]' : 'bg-blue-100 text-[#0062FF]'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            <hr className="my-2 border-slate-100" />

            <button
              onClick={onLogout}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>{t('navLogout')}</span>
            </button>
          </aside>

          {/* Main Content Area */}
          <main className="lg:col-span-9 space-y-6">
            
            {/* TAB: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                
                {/* 4 Key Stat Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
                    <span className="text-xs font-bold text-slate-500 block mb-1">{t('totalBookings')}</span>
                    <span className="text-2xl sm:text-3xl font-black text-slate-900">{studentBookings.length}</span>
                  </div>

                  <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
                    <span className="text-xs font-bold text-slate-500 block mb-1">{t('activeTrips')}</span>
                    <span className="text-2xl sm:text-3xl font-black text-[#0062FF]">{upcomingBookings.length}</span>
                  </div>

                  <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
                    <span className="text-xs font-bold text-slate-500 block mb-1">{t('completedTrips')}</span>
                    <span className="text-2xl sm:text-3xl font-black text-emerald-600">{completedBookings.length}</span>
                  </div>

                  <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
                    <span className="text-xs font-bold text-slate-500 block mb-1">{t('cancelledBookings')}</span>
                    <span className="text-2xl sm:text-3xl font-black text-slate-400">{cancelledBookings.length}</span>
                  </div>
                </div>

                {/* Upcoming Journey Alert Card */}
                {upcomingBookings.length > 0 && (
                  <div className="bg-gradient-to-r from-blue-600 to-[#0052cc] text-white rounded-2xl p-5 sm:p-6 shadow-md space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-bold">
                        {language === 'ar' ? 'رحلتك القادمة المؤكدة' : 'Next Confirmed Trip'}
                      </span>
                      <span className="font-mono text-xs text-amber-300 font-bold">
                        {upcomingBookings[0].id}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-black">
                          {upcomingBookings[0].tripDetails.fromLocationAr} ↔ {upcomingBookings[0].tripDetails.toLocationAr}
                        </h3>
                        <p className="text-xs text-blue-100 flex items-center gap-2 mt-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>
                            {formatEgyptianTime(upcomingBookings[0].tripDetails.departureTime, language)} - {upcomingBookings[0].tripDetails.departureDate}
                          </span>
                        </p>
                      </div>

                      <button
                        onClick={() => handleOpenTicket(upcomingBookings[0])}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-[#0062FF] font-bold text-xs shadow-xs hover:bg-blue-50 transition-colors self-start sm:self-auto"
                      >
                        <QrCode className="w-4 h-4" />
                        <span>{t('viewTicket')}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Recent Bookings Activity Table */}
                <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-900">{t('recentActivity')}</h3>
                    <button
                      onClick={() => setActiveTab('my-bookings')}
                      className="text-xs text-[#0062FF] font-bold hover:underline"
                    >
                      {language === 'ar' ? 'عرض الكل' : 'View All'}
                    </button>
                  </div>

                  {studentBookings.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 text-sm">
                      <Bus className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                      <p>{t('noBookingsYet')}</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-start">
                        <thead className="text-xs text-slate-400 bg-slate-50 border-y border-slate-100">
                          <tr>
                            <th className="py-2.5 px-3 font-semibold text-start">{language === 'ar' ? 'رقم الحجز' : 'Ref'}</th>
                            <th className="py-2.5 px-3 font-semibold text-start">{language === 'ar' ? 'المسار' : 'Route'}</th>
                            <th className="py-2.5 px-3 font-semibold text-start">{t('departureTime')}</th>
                            <th className="py-2.5 px-3 font-semibold text-start">{language === 'ar' ? 'المقاعد' : 'Seats'}</th>
                            <th className="py-2.5 px-3 font-semibold text-start">{language === 'ar' ? 'السعر' : 'Price'}</th>
                            <th className="py-2.5 px-3 font-semibold text-start">{language === 'ar' ? 'الحالة' : 'Status'}</th>
                            <th className="py-2.5 px-3 font-semibold text-start">{language === 'ar' ? 'إجراء' : 'Action'}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {studentBookings.slice(0, 5).map(booking => (
                            <tr key={booking.id} className="hover:bg-slate-50/50">
                              <td className="py-3 px-3 font-mono font-bold text-xs text-[#0062FF]">
                                {booking.id}
                              </td>
                              <td className="py-3 px-3 font-semibold text-slate-800 text-xs">
                                {booking.tripDetails.fromLocationAr.split(' ')[0]} ↔ {booking.tripDetails.toLocationAr.split(' ')[0]}
                              </td>
                              <td className="py-3 px-3 text-xs text-slate-600">
                                {formatEgyptianTime(booking.tripDetails.departureTime, language)}
                              </td>
                              <td className="py-3 px-3 text-xs font-bold text-slate-800">
                                {booking.seatsBooked}
                              </td>
                              <td className="py-3 px-3 text-xs font-bold text-slate-900">
                                {formatEgyptianPrice(booking.totalPrice, language)}
                              </td>
                              <td className="py-3 px-3">
                                <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-bold ${
                                  booking.status === 'confirmed'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : booking.status === 'cancelled'
                                    ? 'bg-slate-100 text-slate-500 line-through'
                                    : 'bg-blue-100 text-blue-800'
                                }`}>
                                  {booking.status}
                                </span>
                              </td>
                              <td className="py-3 px-3">
                                <button
                                  onClick={() => handleOpenTicket(booking)}
                                  className="text-xs font-bold text-[#0062FF] hover:underline"
                                >
                                  {language === 'ar' ? 'تذكرة' : 'Ticket'}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* TAB: FIND A TRIP */}
            {activeTab === 'find-trip' && (
              <div className="space-y-6">
                
                {/* Search & Filter Bar */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                      <Filter className="w-4 h-4 text-[#0062FF]" />
                      <span>{language === 'ar' ? 'تصفية وبحث الرحلات الجامعية' : 'Search & Filter Campus Trips'}</span>
                    </h3>
                    <button
                      onClick={() => {
                        setSearchFrom('');
                        setSearchTo('');
                        setMaxPrice(50);
                        setTimeFilter('all');
                        setOperatorFilter('all');
                      }}
                      className="text-xs text-slate-500 hover:text-slate-800 underline"
                    >
                      {language === 'ar' ? 'إعادة ضبط' : 'Reset'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">{t('fromLocation')}</label>
                      <input
                        type="text"
                        placeholder={language === 'ar' ? 'طيبة، مجمع الكليات...' : 'Tuba, Campus...'}
                        value={searchFrom}
                        onChange={(e) => setSearchFrom(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">{t('toLocation')}</label>
                      <input
                        type="text"
                        placeholder={language === 'ar' ? 'الأقصر، الكرنك...' : 'Luxor, Karnak...'}
                        value={searchTo}
                        onChange={(e) => setSearchTo(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">{language === 'ar' ? 'فترة الانطلاق' : 'Departure Window'}</label>
                      <select
                        value={timeFilter}
                        onChange={(e) => setTimeFilter(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-semibold"
                      >
                        <option value="all">{language === 'ar' ? 'جميع الأوقات' : 'All times'}</option>
                        <option value="after3">{language === 'ar' ? 'بعد 3:00 عصراً (وقت الذروة)' : 'After 3:00 PM (Peak)'}</option>
                        <option value="morning">{language === 'ar' ? 'صباحي (قبل 12 ظهراً)' : 'Morning'}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">{language === 'ar' ? 'الحد الأقصى للسعر' : 'Max Price'}: {maxPrice} EGP</label>
                      <input
                        type="range"
                        min="10"
                        max="50"
                        step="5"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                        className="w-full accent-[#0062FF] mt-2"
                      />
                    </div>
                  </div>
                </div>

                {/* Trip Results List */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
                    <span>{filteredTrips.length} {language === 'ar' ? 'رحلة متاحة مطابقة' : 'trips available'}</span>
                    <span>{language === 'ar' ? 'يتم تحديث المقاعد لحظياً' : 'Live seat tracking'}</span>
                  </div>

                  {filteredTrips.length === 0 ? (
                    <div className="bg-white rounded-2xl p-10 text-center border border-slate-200">
                      <Bus className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                      <p className="text-slate-600 font-bold text-sm">
                        {language === 'ar' ? 'لا توجد رحلات تطابق معايير البحث' : 'No trips found for the selected filters'}
                      </p>
                    </div>
                  ) : (
                    filteredTrips.map(trip => (
                      <div
                        key={trip.id}
                        className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0062FF] text-xs font-bold">
                              {trip.companyName}
                            </span>
                            <span className="text-xs text-slate-400">
                              {trip.vehicleType}
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-xl font-black text-slate-900">
                              {trip.fromLocationAr}
                            </span>
                            <span className="text-slate-400 font-bold">↔</span>
                            <span className="text-xl font-black text-slate-900">
                              {trip.toLocationAr}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                            <span className="flex items-center gap-1 font-bold text-amber-600">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{formatEgyptianTime(trip.departureTime, language)}</span>
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              <span>{trip.departureDate}</span>
                            </span>
                            <span className="text-slate-400">|</span>
                            <span>{trip.pickupPointAr}</span>
                          </div>
                        </div>

                        {/* Price & Book Button */}
                        <div className="flex items-center justify-between md:flex-col md:items-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                          <div className="text-start md:text-end">
                            <span className="text-xs text-slate-400 block">{language === 'ar' ? 'سعر المقعد' : 'Per seat'}</span>
                            <span className="text-xl font-black text-slate-900">
                              {formatEgyptianPrice(trip.pricePerSeat, language)}
                            </span>
                            <span className="text-[11px] font-bold text-emerald-600 block">
                              {trip.availableSeats} {language === 'ar' ? 'مقعد شاغر' : 'seats left'}
                            </span>
                          </div>

                          <button
                            disabled={trip.availableSeats <= 0}
                            onClick={() => onOpenBooking(trip)}
                            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                              trip.availableSeats > 0
                                ? 'bg-[#0062FF] hover:bg-blue-700 text-white'
                                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            }`}
                          >
                            {trip.availableSeats > 0 ? t('bookNow') : (language === 'ar' ? 'مكتمل العدد' : 'Sold Out')}
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

              </div>
            )}

            {/* TAB: MY BOOKINGS / UPCOMING / HISTORY */}
            {(activeTab === 'my-bookings' || activeTab === 'upcoming' || activeTab === 'history') && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-base">
                    {activeTab === 'upcoming' ? t('upcomingTrips') : activeTab === 'history' ? t('bookingHistory') : t('myBookings')}
                  </h3>
                </div>

                {studentBookings.length === 0 ? (
                  <div className="bg-white rounded-2xl p-10 text-center border border-slate-200">
                    <p className="text-slate-500 text-sm mb-3">{t('noBookingsYet')}</p>
                    <button
                      onClick={() => setActiveTab('find-trip')}
                      className="px-4 py-2 rounded-xl bg-[#0062FF] text-white text-xs font-bold"
                    >
                      {t('findTrip')}
                    </button>
                  </div>
                ) : (
                  studentBookings.map(b => {
                    const canCancel = isCancellationAllowed(
                      b.tripDetails.departureDate,
                      b.tripDetails.departureTime,
                      settings.cancellationCutoffHours
                    ) && b.status === 'confirmed';

                    return (
                      <div
                        key={b.id}
                        className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs text-[#0062FF] bg-blue-50 px-2 py-0.5 rounded">
                              {b.id}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                              b.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                            }`}>
                              {b.status}
                            </span>
                            <span className="text-xs text-slate-400">
                              {b.tripDetails.companyName}
                            </span>
                          </div>

                          <h4 className="text-base font-bold text-slate-900">
                            {b.tripDetails.fromLocationAr} ↔ {b.tripDetails.toLocationAr}
                          </h4>

                          <p className="text-xs text-slate-500 flex flex-wrap gap-3">
                            <span>{t('travelDate')}: {b.tripDetails.departureDate}</span>
                            <span>{t('departureTime')}: {formatEgyptianTime(b.tripDetails.departureTime, language)}</span>
                            <span>{language === 'ar' ? 'المقاعد المحجوزة' : 'Seats'}: {b.seatsBooked}</span>
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                          <button
                            onClick={() => handleOpenTicket(b)}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#0062FF] text-xs font-bold transition-colors"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                            <span>{t('viewTicket')}</span>
                          </button>

                          {canCancel && (
                            <button
                              onClick={() => setCancelModalBooking(b)}
                              className="px-3 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors"
                            >
                              {t('cancelBooking')}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* TAB: NOTIFICATIONS */}
            {activeTab === 'notifications' && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                <h3 className="font-bold text-slate-900 text-base">{t('notifications')}</h3>
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-100 text-xs space-y-1">
                    <div className="flex items-center justify-between font-bold text-[#0062FF]">
                      <span>{language === 'ar' ? 'تأكيد الحجز الفوري' : 'Instant Reservation Confirmed'}</span>
                      <span className="text-slate-400">منذ ساعة</span>
                    </div>
                    <p className="text-slate-600">
                      {language === 'ar'
                        ? 'تم حجز مقعدك بنجاح في حافلة سوبر جيت المنطلقة 3:15 م من طيبة إلى محطة الأقصر.'
                        : 'Your seat was confirmed on the 3:15 PM SuperJet bus from Tuba to Luxor.'}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-100 text-xs space-y-1">
                    <div className="flex items-center justify-between font-bold text-amber-800">
                      <span>{language === 'ar' ? 'تنبيه ذروة المحاضرات' : 'Lecture Peak Alert'}</span>
                      <span className="text-slate-400">أمس</span>
                    </div>
                    <p className="text-slate-600">
                      {language === 'ar'
                        ? 'تمت إضافة رحلتين إضافيتين لكباتن معتمدين بعد الساعة 3:30 م لتفادي التكدس.'
                        : 'Two extra verified trips were scheduled after 3:30 PM to ease student exit.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: PROFILE */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
                <h3 className="font-bold text-slate-900 text-base">{t('myProfile')}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-xs text-slate-400 block">{language === 'ar' ? 'الاسم' : 'Name'}</span>
                    <span className="font-bold text-slate-800">{user?.name}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-xs text-slate-400 block">{language === 'ar' ? 'البريد الإلكتروني' : 'Email'}</span>
                    <span className="font-bold text-slate-800">{user?.email}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-xs text-slate-400 block">{language === 'ar' ? 'رقم الهاتف' : 'Phone'}</span>
                    <span className="font-bold text-slate-800">{user?.phone}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-xs text-slate-400 block">{language === 'ar' ? 'الجامعة والكلية' : 'University & Faculty'}</span>
                    <span className="font-bold text-slate-800">{(user as any)?.university || 'جامعة الأقصر - طيبة'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: SUPPORT */}
            {activeTab === 'support' && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                <h3 className="font-bold text-slate-900 text-base">{t('helpSupport')}</h3>
                <p className="text-sm text-slate-600">
                  {language === 'ar'
                    ? 'فريق دعم HarryUp متواجد طوال أيام الأسبوع لدعم الطلاب والكباتن في مجمع طيبة والأقصر.'
                    : 'HarryUp Support is available 7 days a week to support students and drivers in Luxor.'}
                </p>
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 text-xs text-blue-900 space-y-2">
                  <p><strong>{language === 'ar' ? 'خط الدعم الساخن:' : 'Helpline:'}</strong> 01000000001</p>
                  <p><strong>{language === 'ar' ? 'البريد الإلكتروني:' : 'Email:'}</strong> support@harryup.app</p>
                </div>
              </div>
            )}

          </main>

        </div>

      </div>

      {/* Ticket Modal */}
      {ticketBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-4 text-center">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-xs font-bold text-[#0062FF]">{ticketBooking.id}</span>
              <button onClick={() => setTicketBooking(null)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>
            {ticketQrSvg ? (
              <div 
                className="mx-auto w-36 h-36 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"
                dangerouslySetInnerHTML={{ __html: ticketQrSvg }}
              />
            ) : null}
            <div className="text-xs text-slate-600 space-y-1">
              <p className="font-bold text-slate-900 text-sm">
                {ticketBooking.tripDetails.fromLocationAr} ↔ {ticketBooking.tripDetails.toLocationAr}
              </p>
              <p>{formatEgyptianTime(ticketBooking.tripDetails.departureTime, language)} | {ticketBooking.seatsBooked} {language === 'ar' ? 'مقعد' : 'seats'}</p>
              <p className="text-amber-600 font-bold">{formatEgyptianPrice(ticketBooking.totalPrice, language)} ({ticketBooking.paymentMethod})</p>
            </div>
            <button
              onClick={() => setTicketBooking(null)}
              className="w-full py-2 bg-[#0062FF] text-white rounded-xl text-xs font-bold"
            >
              {language === 'ar' ? 'إغلاق' : 'Close'}
            </button>
          </div>
        </div>
      )}

      {/* Cancellation Confirmation Modal */}
      {cancelModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h4 className="font-black text-slate-900 text-base">
              {language === 'ar' ? 'تأكيد إلغاء الحجز' : 'Confirm Booking Cancellation'}
            </h4>
            <p className="text-xs text-slate-600">
              {language === 'ar'
                ? `هل أنت متأكد من إلغاء الحجز رقم ${cancelModalBooking.id}؟ سيتم إعادة فتح المقاعد فوراً لزملائك الطلاب.`
                : `Are you sure you want to cancel booking ${cancelModalBooking.id}? Your reserved seats will be released.`}
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setCancelModalBooking(null)}
                className="flex-1 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700"
              >
                {language === 'ar' ? 'تراجع' : 'No, Keep'}
              </button>
              <button
                onClick={handleConfirmCancel}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs"
              >
                {language === 'ar' ? 'نعم، إلغاء الحجز' : 'Yes, Cancel Booking'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
