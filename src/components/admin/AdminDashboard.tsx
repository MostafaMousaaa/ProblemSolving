import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { DriverProfile, StudentProfile, Trip, Booking, RouteItem } from '../../types';
import { formatEgyptianPrice, formatEgyptianTime } from '../../utils/bookingLogic';
import {
  ShieldCheck,
  Users,
  Car,
  Bus,
  Calendar,
  Settings,
  BarChart3,
  Check,
  X,
  AlertCircle,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  LogOut,
  MapPin,
  Clock,
  Plus
} from 'lucide-react';

interface AdminDashboardProps {
  onLogout: () => void;
  initialSubTab?: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onLogout,
  initialSubTab = 'overview'
}) => {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const {
    trips,
    bookings,
    drivers,
    students,
    routes,
    settings,
    updateDriverStatus,
    toggleRouteActive,
    updateSettings,
    cancelTrip,
    cancelBooking
  } = useData();

  const [activeTab, setActiveTab] = useState<string>(initialSubTab);
  const [driverSearch, setDriverSearch] = useState('');
  const [studentSearch, setStudentSearch] = useState('');
  const [tripFilter, setTripFilter] = useState('all');

  // Stats
  const totalRevenue = bookings.filter(b => b.status === 'confirmed').reduce((acc, b) => acc + b.totalPrice, 0);
  const pendingDrivers = drivers.filter(d => d.verificationStatus === 'pending_verification');
  const approvedDrivers = drivers.filter(d => d.verificationStatus === 'approved');

  // Route create modal/form state
  const [showAddRoute, setShowAddRoute] = useState(false);
  const [newRouteFrom, setNewRouteFrom] = useState('');
  const [newRouteTo, setNewRouteTo] = useState('');
  const [newRouteDuration, setNewRouteDuration] = useState('30 دقيقة');
  const [newRoutePrice, setNewRoutePrice] = useState(20);

  const sidebarItems = [
    { id: 'overview', icon: BarChart3, label: t('dashboardOverview') },
    { id: 'drivers', icon: Car, label: t('driverManagement'), badge: pendingDrivers.length },
    { id: 'students', icon: Users, label: t('studentManagement'), count: students.length },
    { id: 'trips', icon: Bus, label: t('tripManagement'), count: trips.length },
    { id: 'bookings', icon: Calendar, label: language === 'ar' ? 'إدارة الحجوزات' : 'Bookings', count: bookings.length },
    { id: 'routes', icon: MapPin, label: t('routeManagement'), count: routes.length },
    { id: 'settings', icon: Settings, label: t('platformSettings') },
  ];

  return (
    <div className="min-h-screen bg-slate-100/70 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Admin Header */}
        <div className="bg-[#0b1a30] text-white rounded-2xl p-5 sm:p-6 shadow-md mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold mb-2 border border-purple-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t('adminDashboard')}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              {language === 'ar' ? 'لوحة القيادة والتحكم الإداري الكامل' : 'Platform Administration & Oversight'}
            </h1>
            <p className="text-xs text-slate-300">
              {t('adminAccessOnly')}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">
              {language === 'ar' ? 'المسؤول الحالي:' : 'Admin:'} {user?.name.split(' ')[0]}
            </span>
          </div>
        </div>

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
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-black bg-amber-500 text-slate-950 animate-pulse">
                      {item.badge} {language === 'ar' ? 'طلب' : 'new'}
                    </span>
                  )}
                  {item.count !== undefined && (
                    <span className={`text-xs ${isActive ? 'text-purple-200' : 'text-slate-400'}`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}

            <hr className="my-2 border-slate-100" />

            <button
              onClick={onLogout}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50"
            >
              <LogOut className="w-4 h-4" />
              <span>{t('navLogout')}</span>
            </button>
          </aside>

          {/* Main Area */}
          <main className="lg:col-span-9 space-y-6">
            
            {/* OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                
                {/* Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                    <span className="text-xs font-bold text-slate-500 block mb-1">{t('totalStudents')}</span>
                    <span className="text-2xl sm:text-3xl font-black text-slate-900">{students.length}</span>
                  </div>

                  <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                    <span className="text-xs font-bold text-slate-500 block mb-1">{t('totalDrivers')}</span>
                    <span className="text-2xl sm:text-3xl font-black text-amber-600">{drivers.length}</span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">({pendingDrivers.length} قيد المراجعة)</span>
                  </div>

                  <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                    <span className="text-xs font-bold text-slate-500 block mb-1">{t('totalTripsSystem')}</span>
                    <span className="text-2xl sm:text-3xl font-black text-[#0062FF]">{trips.length}</span>
                  </div>

                  <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                    <span className="text-xs font-bold text-slate-500 block mb-1">إجمالي الحجوزات والتعريفة</span>
                    <span className="text-xl sm:text-2xl font-black text-emerald-600">{formatEgyptianPrice(totalRevenue, language)}</span>
                  </div>
                </div>

                {/* Pending Driver Approval Alert if any */}
                {pendingDrivers.length > 0 && (
                  <div className="bg-amber-50 rounded-2xl p-5 border-2 border-amber-300 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-amber-900 font-bold">
                        <AlertCircle className="w-5 h-5 text-amber-600" />
                        <span>يوجد {pendingDrivers.length} سائق بانتظار الاعتماد الإداري</span>
                      </div>
                      <button
                        onClick={() => setActiveTab('drivers')}
                        className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs"
                      >
                        فحص الطلبات الآن
                      </button>
                    </div>
                  </div>
                )}

                {/* Recent Platform Reservations */}
                <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
                  <h3 className="font-bold text-slate-900 text-base">آخر الحجوزات على المنصة</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-start">
                      <thead className="bg-slate-50 text-slate-400 border-y">
                        <tr>
                          <th className="py-2.5 px-3 text-start">رقم الحجز</th>
                          <th className="py-2.5 px-3 text-start">اسم الطالب</th>
                          <th className="py-2.5 px-3 text-start">المسار</th>
                          <th className="py-2.5 px-3 text-start">المقاعد</th>
                          <th className="py-2.5 px-3 text-start">المبلغ</th>
                          <th className="py-2.5 px-3 text-start">الحالة</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {bookings.slice(0, 5).map(b => (
                          <tr key={b.id} className="hover:bg-slate-50">
                            <td className="py-2.5 px-3 font-mono font-bold text-[#0062FF]">{b.id}</td>
                            <td className="py-2.5 px-3 font-semibold text-slate-800">{b.studentName}</td>
                            <td className="py-2.5 px-3">{b.tripDetails.fromLocationAr.split(' ')[0]} ↔ {b.tripDetails.toLocationAr.split(' ')[0]}</td>
                            <td className="py-2.5 px-3 font-bold">{b.seatsBooked}</td>
                            <td className="py-2.5 px-3 font-bold text-slate-900">{formatEgyptianPrice(b.totalPrice, language)}</td>
                            <td className="py-2.5 px-3">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                {b.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* DRIVER MANAGEMENT & VERIFICATION */}
            {activeTab === 'drivers' && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{t('driverManagement')}</h3>
                    <p className="text-xs text-slate-500">
                      {language === 'ar'
                        ? 'مراجعة وتوثيق حسابات السائقين ومشغلي سوبر جيت للتأكد من رخص القيادة وصلاحية المركبات.'
                        : 'Review and verify driver accounts before public trip publishing.'}
                    </p>
                  </div>

                  <input
                    type="text"
                    placeholder={language === 'ar' ? 'بحث باسم السائق أو اللوحة...' : 'Search driver...'}
                    value={driverSearch}
                    onChange={(e) => setDriverSearch(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>

                <div className="space-y-3">
                  {drivers
                    .filter(d => !driverSearch || d.name.includes(driverSearch) || d.vehiclePlate.includes(driverSearch))
                    .map(driver => (
                      <div
                        key={driver.id}
                        className="p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-900 text-sm">{driver.name}</h4>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                              driver.verificationStatus === 'approved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : driver.verificationStatus === 'pending_verification'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}>
                              {driver.verificationStatus === 'approved' ? 'معتمد وموثق' : 'قيد المراجعة'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600">
                            {driver.companyName} • {driver.vehicleType} ({driver.vehiclePlate})
                          </p>
                          <p className="text-xs text-slate-400">
                            هاتف: {driver.phone} | رخصة: {driver.licenseNumber}
                          </p>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2">
                          {driver.verificationStatus !== 'approved' && (
                            <button
                              onClick={() => updateDriverStatus(driver.id, 'approved')}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>{t('approveDriverBtn')}</span>
                            </button>
                          )}

                          {driver.verificationStatus === 'approved' && (
                            <button
                              onClick={() => updateDriverStatus(driver.id, 'suspended')}
                              className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-xs"
                            >
                              {t('suspendAccountBtn')}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* STUDENT MANAGEMENT */}
            {activeTab === 'students' && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{t('studentManagement')}</h3>
                    <p className="text-xs text-slate-500">دليل الطلاب المسجلين بجامعة الأقصر ومجمع طيبة.</p>
                  </div>
                  <input
                    type="text"
                    placeholder="بحث باسم الطالب أو الجامعة..."
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-start">
                    <thead className="bg-slate-50 text-slate-400 border-y">
                      <tr>
                        <th className="py-2.5 px-3 text-start">اسم الطالب</th>
                        <th className="py-2.5 px-3 text-start">الجامعة / الكلية</th>
                        <th className="py-2.5 px-3 text-start">البريد والهاتف</th>
                        <th className="py-2.5 px-3 text-start">الرقم الجامعي</th>
                        <th className="py-2.5 px-3 text-start">الحالة</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {students
                        .filter(s => !studentSearch || s.name.includes(studentSearch) || s.university.includes(studentSearch))
                        .map(stu => (
                          <tr key={stu.id} className="hover:bg-slate-50">
                            <td className="py-3 px-3 font-bold text-slate-900">{stu.name}</td>
                            <td className="py-3 px-3 text-slate-700">{stu.university}</td>
                            <td className="py-3 px-3 text-slate-500">{stu.email} ({stu.phone})</td>
                            <td className="py-3 px-3 font-mono font-bold text-slate-600">{stu.studentIdNumber || 'LX-2024'}</td>
                            <td className="py-3 px-3">
                              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                                نشط
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TRIP MONITORING */}
            {activeTab === 'trips' && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-base">{t('tripManagement')}</h3>
                </div>

                <div className="space-y-3">
                  {trips.map(trip => (
                    <div key={trip.id} className="p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#0062FF]">{trip.companyName}</span>
                          <span className="text-xs text-slate-400">({trip.driverName})</span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm mt-0.5">
                          {trip.fromLocationAr} ↔ {trip.toLocationAr}
                        </h4>
                        <p className="text-xs text-slate-500">
                          {trip.departureDate} • {formatEgyptianTime(trip.departureTime, language)} | {trip.availableSeats}/{trip.totalSeats} مقاعد متاحة
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{formatEgyptianPrice(trip.pricePerSeat, language)}</span>
                        {trip.status !== 'cancelled' && (
                          <button
                            onClick={() => cancelTrip(trip.id)}
                            className="px-2.5 py-1 rounded-lg border border-rose-200 text-rose-600 text-xs font-bold hover:bg-rose-50"
                          >
                            إلغاء الرحلة
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ROUTE MANAGEMENT */}
            {activeTab === 'routes' && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-base">{t('routeManagement')}</h3>
                  <button
                    onClick={() => setShowAddRoute(!showAddRoute)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 text-white font-bold text-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>إضافة مسار جديد</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {routes.map(r => (
                    <div key={r.id} className="p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-sm">{r.fromNameAr} ↔ {r.toNameAr}</h4>
                          {r.popular && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                              ذروة 3:00 م
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500">{r.estimatedDuration} • يبدأ من {r.basePrice} ج.م</p>
                      </div>

                      <button
                        onClick={() => toggleRouteActive(r.id)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold ${
                          r.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {r.active ? 'نشط' : 'معطل'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SETTINGS */}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
                <h3 className="font-bold text-slate-900 text-base">{t('platformSettings')}</h3>
                
                <div className="space-y-4 text-sm">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <h4 className="font-bold text-slate-800">طرق الدفع المسموحة للطلاب</h4>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.allowCashOnBoarding}
                        onChange={(e) => updateSettings({ allowCashOnBoarding: e.target.checked })}
                      />
                      <span>الدفع نقداً عند الصعود للكابتن (Cash on Boarding)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.allowVodafoneCash}
                        onChange={(e) => updateSettings({ allowVodafoneCash: e.target.checked })}
                      />
                      <span>المحافظ الإلكترونية (فودافون كاش / إنستاباي)</span>
                    </label>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <h4 className="font-bold text-slate-800">سياسة إلغاء الحجز للطلاب</h4>
                    <div className="flex items-center gap-3">
                      <span>الحد الأقصى للإلغاء المجاني قبل الانطلاق:</span>
                      <select
                        value={settings.cancellationCutoffHours}
                        onChange={(e) => updateSettings({ cancellationCutoffHours: Number(e.target.value) })}
                        className="px-3 py-1.5 rounded-lg border text-xs font-bold"
                      >
                        <option value={1}>ساعة واحدة قبل الرحلة (60 دقيقة)</option>
                        <option value={2}>ساعتان قبل الرحلة</option>
                        <option value={3}>3 ساعات قبل الرحلة</option>
                      </select>
                    </div>
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
