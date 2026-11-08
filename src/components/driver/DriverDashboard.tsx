import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Trip, Booking, DriverProfile } from '../../types';
import { formatEgyptianPrice, formatEgyptianTime } from '../../utils/bookingLogic';
import {
  LayoutDashboard,
  CalendarPlus,
  Bus,
  Users,
  Wallet,
  Bell,
  User,
  HelpCircle,
  LogOut,
  Clock,
  MapPin,
  Check,
  X,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  PlusCircle,
  FileSpreadsheet
} from 'lucide-react';

interface DriverDashboardProps {
  onLogout: () => void;
  initialSubTab?: string;
}

export const DriverDashboard: React.FC<DriverDashboardProps> = ({
  onLogout,
  initialSubTab = 'overview'
}) => {
  const { language, isRTL, t } = useLanguage();
  const { user } = useAuth();
  const { trips, bookings, createTrip, updateTripStatus, cancelTrip, markPassengerBoarded } = useData();

  const driverProfile = user as DriverProfile;
  const isApproved = driverProfile?.verificationStatus === 'approved';

  const [activeTab, setActiveTab] = useState<string>(initialSubTab);
  const [successMsg, setSuccessMsg] = useState<string>('');

  // Create Trip Form state
  const [fromLocation, setFromLocation] = useState('طيبة (Tuba)');
  const [fromLocationAr, setFromLocationAr] = useState('مجمع كليات طيبة (جامعة الأقصر)');
  const [toLocation, setToLocation] = useState('الأقصر (Luxor)');
  const [toLocationAr, setToLocationAr] = useState('محطة قطارات الأقصر - الميدان الرئيسي');
  const [departureDate, setDepartureDate] = useState(new Date().toISOString().split('T')[0]);
  const [departureTime, setDepartureTime] = useState('15:30'); // Default after 3:00 PM
  const [estimatedArrivalTime, setEstimatedArrivalTime] = useState('16:05');
  const [totalSeats, setTotalSeats] = useState<number>(45);
  const [pricePerSeat, setPricePerSeat] = useState<number>(20);
  const [vehicleType, setVehicleType] = useState(driverProfile?.vehicleType || 'حافلة سوبر جيت مكيفة (49 راكب)');
  const [vehiclePlate, setVehiclePlate] = useState(driverProfile?.vehiclePlate || 'ص ق ج 8492');
  const [pickupPointAr, setPickupPointAr] = useState('الموقف المخصص لأتوبيسات الجامعة أمام البوابة الرئيسية بطيبة');
  const [dropoffPointAr, setDropoffPointAr] = useState('محطة قطارات الأقصر - الميدان الرئيسي');
  const [notes, setNotes] = useState('تحرك فوري بعد خروج المحاضرات - التكييف يعمل بكفاءة');

  // Filter trips for this driver
  const myTrips = trips.filter(t => t.driverId === user?.id || t.driverPhone === user?.phone || t.isDemo);
  const myTripIds = myTrips.map(t => t.id);
  const myBookings = bookings.filter(b => myTripIds.includes(b.tripId));

  // Compute metrics
  const totalReservedSeats = myBookings.filter(b => b.status === 'confirmed').reduce((acc, b) => acc + b.seatsBooked, 0);
  const totalAvailableSeats = myTrips.filter(t => t.status === 'scheduled').reduce((acc, t) => acc + t.availableSeats, 0);
  const totalCompletedTrips = myTrips.filter(t => t.status === 'completed').length;
  const totalBookedValue = myBookings.filter(b => b.status === 'confirmed').reduce((acc, b) => acc + b.totalPrice, 0);

  const handleCreateTripSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = createTrip({
      driverId: user?.id || 'usr_driver_default',
      driverName: user?.name || 'كابتن محمود السيد',
      driverPhone: user?.phone || '01198765432',
      companyName: driverProfile?.companyName || 'سوبر جيت - مشغل معتمد بالأقصر',
      fromLocation,
      fromLocationAr,
      toLocation,
      toLocationAr,
      departureDate,
      departureTime,
      estimatedArrivalTime,
      totalSeats,
      pricePerSeat,
      vehicleType,
      vehiclePlate,
      pickupPoint: pickupPointAr,
      pickupPointAr,
      dropoffPoint: dropoffPointAr,
      dropoffPointAr,
      notes
    });

    if (res.success) {
      setSuccessMsg(language === 'ar' ? 'تم نشر الرحلة بنجاح وتفعيل الحجز المباشر للطلاب!' : 'Trip published successfully!');
      setActiveTab('my-trips');
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  const sidebarItems = [
    { id: 'overview', icon: LayoutDashboard, label: t('dashboardOverview') },
    { id: 'my-trips', icon: Bus, label: t('publishedTrips'), count: myTrips.length },
    { id: 'create-trip', icon: CalendarPlus, label: t('createNewTrip') },
    { id: 'passengers', icon: Users, label: t('passengerManifest'), count: myBookings.filter(b => b.status === 'confirmed').length },
    { id: 'earnings', icon: Wallet, label: t('earningsOverview') },
    { id: 'notifications', icon: Bell, label: t('notifications') },
    { id: 'profile', icon: User, label: t('myProfile') },
    { id: 'support', icon: HelpCircle, label: t('helpSupport') },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Verification Status Warning if Pending */}
        {!isApproved && (
          <div className="mb-6 bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 sm:p-5 flex items-start gap-3 shadow-xs">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-amber-900 text-sm">
                {t('driverStatusPending')}
              </h4>
              <p className="text-xs text-amber-700">
                {t('driverStatusPendingDesc')}
              </p>
            </div>
          </div>
        )}

        {/* Driver Welcome Header */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                <Bus className="w-3.5 h-3.5 text-amber-600" />
                <span>{t('driverDashboard')}</span>
              </span>
              {isApproved && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{t('driverStatusApproved')}</span>
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              {user?.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              {driverProfile?.companyName || 'مشغل نقل معتمد بالأقصر'} • {driverProfile?.vehicleType}
            </p>
          </div>

          <button
            onClick={() => setActiveTab('create-trip')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t('createNewTrip')}</span>
          </button>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Main Grid */}
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
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100/70 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && item.count > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-black ${
                      isActive ? 'bg-slate-950 text-amber-400' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {item.count}
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

          {/* Tab Content */}
          <main className="lg:col-span-9 space-y-6">
            
            {/* OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                
                {/* 4 Stat Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
                    <span className="text-xs font-bold text-slate-500 block mb-1">{t('publishedTrips')}</span>
                    <span className="text-2xl sm:text-3xl font-black text-slate-900">{myTrips.length}</span>
                  </div>

                  <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
                    <span className="text-xs font-bold text-slate-500 block mb-1">{t('totalReservedSeats')}</span>
                    <span className="text-2xl sm:text-3xl font-black text-[#0062FF]">{totalReservedSeats}</span>
                  </div>

                  <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
                    <span className="text-xs font-bold text-slate-500 block mb-1">{t('availableSeatsCount')}</span>
                    <span className="text-2xl sm:text-3xl font-black text-emerald-600">{totalAvailableSeats}</span>
                  </div>

                  <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
                    <span className="text-xs font-bold text-slate-500 block mb-1">{t('estimatedEarnings')}</span>
                    <span className="text-xl sm:text-2xl font-black text-amber-600">{formatEgyptianPrice(totalBookedValue, language)}</span>
                  </div>
                </div>

                {/* Active Trips Quick List */}
                <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 text-base">{t('publishedTrips')}</h3>
                    <button onClick={() => setActiveTab('my-trips')} className="text-xs text-[#0062FF] font-bold hover:underline">
                      {language === 'ar' ? 'إدارة كل الرحلات' : 'Manage All'}
                    </button>
                  </div>

                  <div className="space-y-3">
                    {myTrips.map(trip => (
                      <div key={trip.id} className="p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                              {trip.departureDate} • {formatEgyptianTime(trip.departureTime, language)}
                            </span>
                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                              trip.status === 'scheduled' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {trip.status}
                            </span>
                          </div>
                          <h4 className="font-bold text-slate-900 text-sm">
                            {trip.fromLocationAr} ↔ {trip.toLocationAr}
                          </h4>
                          <p className="text-xs text-slate-500">
                            {trip.pickupPointAr}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-start sm:text-end">
                            <span className="text-xs text-slate-400 block">{language === 'ar' ? 'المقاعد' : 'Seats'}</span>
                            <span className="text-sm font-black text-slate-800">
                              {trip.availableSeats} / {trip.totalSeats} {language === 'ar' ? 'متبقي' : 'left'}
                            </span>
                          </div>

                          <button
                            onClick={() => setActiveTab('passengers')}
                            className="px-3 py-1.5 rounded-lg bg-blue-50 text-[#0062FF] hover:bg-blue-100 text-xs font-bold"
                          >
                            {language === 'ar' ? 'المنافستو' : 'Manifest'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* CREATE A NEW TRIP */}
            {activeTab === 'create-trip' && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5">
                <div>
                  <h3 className="text-lg font-black text-slate-900">{t('createTripTitle')}</h3>
                  <p className="text-xs text-slate-500">
                    {language === 'ar'
                      ? 'حدد تفاصيل الرحلة، موعد التحرك، وعدد المقاعد الشاغرة لتتاح فوراً لطلاب الجامعة.'
                      : 'Set departure schedules, capacity, and pickup locations for immediate student booking.'}
                  </p>
                </div>

                <form onSubmit={handleCreateTripSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">{t('fromLocation')} *</label>
                      <input
                        type="text"
                        required
                        value={fromLocationAr}
                        onChange={(e) => setFromLocationAr(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">{t('toLocation')} *</label>
                      <input
                        type="text"
                        required
                        value={toLocationAr}
                        onChange={(e) => setToLocationAr(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">{t('travelDate')} *</label>
                      <input
                        type="date"
                        required
                        value={departureDate}
                        onChange={(e) => setDepartureDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">{t('departureTime')} (وقت التحرك) *</label>
                      <input
                        type="time"
                        required
                        value={departureTime}
                        onChange={(e) => setDepartureTime(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">وقت الوصول التقريبي</label>
                      <input
                        type="time"
                        value={estimatedArrivalTime}
                        onChange={(e) => setEstimatedArrivalTime(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">إجمالي سعة المقاعد المتاحة للطلاب *</label>
                      <input
                        type="number"
                        min="1"
                        max="60"
                        required
                        value={totalSeats}
                        onChange={(e) => setTotalSeats(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">سعر المقعد بالجنيه المصري (EGP) *</label>
                      <input
                        type="number"
                        min="5"
                        max="150"
                        required
                        value={pricePerSeat}
                        onChange={(e) => setPricePerSeat(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold text-[#0062FF]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">{t('pickupPoint')} (نقطة التجمع بطيبة) *</label>
                      <input
                        type="text"
                        required
                        value={pickupPointAr}
                        onChange={(e) => setPickupPointAr(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">{t('dropoffPoint')} (نقطة النزول بالأقصر) *</label>
                      <input
                        type="text"
                        required
                        value={dropoffPointAr}
                        onChange={(e) => setDropoffPointAr(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">ملاحظات إضافية للركاب</label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="مثال: تحرك فوري عند اكتمال العدد، تكييف شغال..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm shadow-md transition-all mt-2"
                  >
                    {language === 'ar' ? 'نشر الرحلة للطلاب الآن' : 'Publish Trip Now'}
                  </button>
                </form>
              </div>
            )}

            {/* MY TRIPS LIST & CONTROLS */}
            {activeTab === 'my-trips' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-base">{t('publishedTrips')}</h3>
                </div>

                {myTrips.map(trip => (
                  <div key={trip.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3">
                      <div>
                        <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                          {trip.departureDate} • {formatEgyptianTime(trip.departureTime, language)}
                        </span>
                        <h4 className="text-base font-black text-slate-900 mt-1">
                          {trip.fromLocationAr} ↔ {trip.toLocationAr}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          trip.status === 'scheduled' ? 'bg-emerald-100 text-emerald-800' : trip.status === 'completed' ? 'bg-blue-100 text-blue-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {trip.status}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-600">
                      <div>
                        <span className="text-slate-400 block">{language === 'ar' ? 'المقاعد الشاغرة' : 'Available Seats'}</span>
                        <span className="font-bold text-emerald-600 text-sm">{trip.availableSeats} / {trip.totalSeats}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">{language === 'ar' ? 'سعر المقعد' : 'Price per seat'}</span>
                        <span className="font-bold text-[#0062FF] text-sm">{formatEgyptianPrice(trip.pricePerSeat, language)}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">{language === 'ar' ? 'رقم اللوحة' : 'Plate'}</span>
                        <span className="font-bold text-slate-800 text-sm">{trip.vehiclePlate}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">{language === 'ar' ? 'نوع المركبة' : 'Vehicle'}</span>
                        <span className="font-bold text-slate-800 text-sm truncate">{trip.vehicleType}</span>
                      </div>
                    </div>

                    {/* Trip Status Controls */}
                    <div className="pt-2 border-t flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="text-slate-500">
                        {trip.pickupPointAr}
                      </div>

                      <div className="flex items-center gap-2">
                        {trip.status === 'scheduled' && (
                          <>
                            <button
                              onClick={() => updateTripStatus(trip.id, 'boarding')}
                              className="px-2.5 py-1.5 rounded-lg bg-blue-50 text-[#0062FF] font-bold hover:bg-blue-100"
                            >
                              بدء صعود الركاب
                            </button>
                            <button
                              onClick={() => updateTripStatus(trip.id, 'completed')}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 font-bold hover:bg-emerald-100"
                            >
                              إنهاء الرحلة
                            </button>
                            <button
                              onClick={() => cancelTrip(trip.id)}
                              className="px-2.5 py-1.5 rounded-lg border border-rose-200 text-rose-600 font-bold hover:bg-rose-50"
                            >
                              إلغاء الرحلة
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* PASSENGER MANIFEST & BOARDING CHECK-IN */}
            {activeTab === 'passengers' && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{t('passengerManifest')}</h3>
                    <p className="text-xs text-slate-500">
                      {language === 'ar'
                        ? 'كشف بأسماء الطلاب الحاجزين وأرقام هواتفهم للتأكد من صعودهم ومسح التذاكر.'
                        : 'Student passenger list for boarding verification and contact.'}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-[#0062FF] font-black text-xs">
                    {myBookings.filter(b => b.status === 'confirmed').length} {language === 'ar' ? 'حجز مؤكد' : 'Confirmed'}
                  </span>
                </div>

                {myBookings.length === 0 ? (
                  <div className="text-center py-10 text-slate-400 text-sm">
                    {language === 'ar' ? 'لا يوجد ركاب حتى الآن في الرحلات التابعة لك.' : 'No passengers booked yet.'}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-start">
                      <thead className="text-xs text-slate-400 bg-slate-50 border-y">
                        <tr>
                          <th className="py-2.5 px-3 text-start">رقم التذكرة</th>
                          <th className="py-2.5 px-3 text-start">اسم الطالب</th>
                          <th className="py-2.5 px-3 text-start">رقم الهاتف</th>
                          <th className="py-2.5 px-3 text-start">المقاعد</th>
                          <th className="py-2.5 px-3 text-start">المبلغ والدفع</th>
                          <th className="py-2.5 px-3 text-start">تأكيد الصعود</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {myBookings.map(b => (
                          <tr key={b.id} className="hover:bg-slate-50">
                            <td className="py-3 px-3 font-mono font-bold text-xs text-[#0062FF]">{b.id}</td>
                            <td className="py-3 px-3 font-bold text-slate-900 text-xs">{b.studentName}</td>
                            <td className="py-3 px-3 text-xs text-slate-600" dir="ltr">{b.studentPhone}</td>
                            <td className="py-3 px-3 text-xs font-bold">{b.seatsBooked}</td>
                            <td className="py-3 px-3 text-xs">
                              <span className="font-bold text-slate-900">{formatEgyptianPrice(b.totalPrice, language)}</span>
                              <span className="block text-[10px] text-slate-400">{b.paymentMethod}</span>
                            </td>
                            <td className="py-3 px-3">
                              <button
                                onClick={() => markPassengerBoarded(b.id, !b.boarded)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                                  b.boarded
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'
                                }`}
                              >
                                {b.boarded ? '✓ تم الصعود' : 'تأكيد الصعود'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* EARNINGS OVERVIEW */}
            {activeTab === 'earnings' && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{t('earningsOverview')}</h3>
                  <p className="text-xs text-slate-500">
                    {language === 'ar'
                      ? 'تفاصيل الإيرادات المقدرة والمحصلة نقداً أو عبر المحافظ الإلكترونية.'
                      : 'Estimated booking value and cash collection breakdown.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                    <span className="text-xs text-amber-800 font-bold block">{language === 'ar' ? 'إجمالي الحجوزات المؤكدة' : 'Total Booked Value'}</span>
                    <span className="text-2xl font-black text-amber-900">{formatEgyptianPrice(totalBookedValue, language)}</span>
                  </div>

                  <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                    <span className="text-xs text-blue-800 font-bold block">{language === 'ar' ? 'المقاعد المؤكدة' : 'Reserved Seats'}</span>
                    <span className="text-2xl font-black text-[#0062FF]">{totalReservedSeats} {language === 'ar' ? 'مقعد' : 'seats'}</span>
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                    <span className="text-xs text-emerald-800 font-bold block">{language === 'ar' ? 'الرحلات المكتملة' : 'Completed Trips'}</span>
                    <span className="text-2xl font-black text-emerald-900">{totalCompletedTrips}</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                  <p className="font-bold text-slate-800 mb-1">{language === 'ar' ? 'ملاحظة للمشغلين:' : 'Operator Note:'}</p>
                  <p>
                    {language === 'ar'
                      ? 'يتم تحصيل قيمة التذاكر نقداً من الطلاب عند الصعود إلى الحافلة مباشرة أو عبر فودافون كاش وإنستاباي دون استقطاع أي عمولة إضافية من الطالب.'
                      : 'Fares are collected directly in cash upon boarding or via mobile wallet transfers without extra student fees.'}
                  </p>
                </div>
              </div>
            )}

            {/* DRIVER PROFILE */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                <h3 className="font-bold text-slate-900 text-base">{t('myProfile')}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-slate-50 rounded-xl border">
                    <span className="text-xs text-slate-400 block">الاسم</span>
                    <span className="font-bold text-slate-800">{user?.name}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border">
                    <span className="text-xs text-slate-400 block">شركة النقل</span>
                    <span className="font-bold text-slate-800">{driverProfile?.companyName}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border">
                    <span className="text-xs text-slate-400 block">رقم اللوحة</span>
                    <span className="font-bold text-slate-800">{driverProfile?.vehiclePlate}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border">
                    <span className="text-xs text-slate-400 block">رقم الرخصة</span>
                    <span className="font-bold text-slate-800">{driverProfile?.licenseNumber}</span>
                  </div>
                </div>
              </div>
            )}

          </main>

        </div>

      </div>
    </div>
  );
};
