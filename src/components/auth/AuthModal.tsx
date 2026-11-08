import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { X, GraduationCap, Car, Shield, AlertCircle, CheckCircle2 } from 'lucide-react';
import { UserRole } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  initialMode: 'login' | 'register';
  initialRole?: 'student' | 'driver';
  onClose: () => void;
  onSuccess: (role: UserRole) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode,
  initialRole = 'student',
  onClose,
  onSuccess
}) => {
  const { language, t } = useLanguage();
  const { login, registerStudent, registerDriver } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [selectedRole, setSelectedRole] = useState<'student' | 'driver'>(initialRole);

  // Common Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Student specific
  const [university, setUniversity] = useState('جامعة الأقصر (كليات مجمع طيبة)');
  const [faculty, setFaculty] = useState('كلية الحاسبات والمعلومات والذكاء الاصطناعي');
  const [studentIdNumber, setStudentIdNumber] = useState('');

  // Driver specific
  const [companyName, setCompanyName] = useState('مشغل سوبر جيت المعتمد بالأقصر');
  const [vehicleType, setVehicleType] = useState('حافلة سوبر جيت مكيفة (49 راكب)');
  const [vehiclePlate, setVehiclePlate] = useState('ص ق ج 8492');
  const [licenseNumber, setLicenseNumber] = useState('DL-LX-9482');

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [driverPendingSuccess, setDriverPendingSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'login') {
      if (!email.trim() || !password.trim()) {
        setError(language === 'ar' ? 'يرجى إدخال البريد الإلكتروني وكلمة المرور' : 'Please provide email and password');
        return;
      }
      setIsLoading(true);
      const res = await login(email, selectedRole);
      setIsLoading(false);
      if (res.success) {
        onSuccess(selectedRole);
        onClose();
      } else {
        setError(res.error || 'فشل تسجيل الدخول');
      }
    } else {
      // Register
      if (password !== confirmPassword) {
        setError(language === 'ar' ? 'كلمات المرور غير متطابقة' : 'Passwords do not match');
        return;
      }

      setIsLoading(true);

      if (selectedRole === 'student') {
        const res = await registerStudent({
          name,
          email,
          phone,
          university,
          faculty,
          studentIdNumber
        });
        setIsLoading(false);
        if (res.success) {
          onSuccess('student');
          onClose();
        } else {
          setError(res.error || 'حدث خطأ أثناء التسجيل');
        }
      } else {
        // Driver register
        const res = await registerDriver({
          name,
          email,
          phone,
          companyName,
          vehicleType,
          vehiclePlate,
          licenseNumber,
          driverRole: 'fleet_driver'
        });
        setIsLoading(false);
        if (res.success) {
          setDriverPendingSuccess(true);
          setTimeout(() => {
            onSuccess('driver');
            onClose();
          }, 2000);
        } else {
          setError(res.error || 'حدث خطأ أثناء التسجيل');
        }
      }
    }
  };

  const handleQuickDemo = (role: 'student' | 'driver' | 'admin') => {
    if (role === 'student') {
      setEmail('student@harryup.app');
      setPassword('password123');
      setSelectedRole('student');
    } else if (role === 'driver') {
      setEmail('driver@harryup.app');
      setPassword('password123');
      setSelectedRole('driver');
    } else {
      setEmail('admin@harryup.app');
      setPassword('password123');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <div>
            <h3 className="text-xl font-black text-slate-900">
              {mode === 'login' ? t('navLogin') : t('navRegister')}
            </h3>
            <p className="text-xs text-slate-500">
              {language === 'ar' ? 'منصة HarryUp لحجز رحلات الجامعات بالأقصر' : 'HarryUp Transportation Platform'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          
          {driverPendingSuccess ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-slate-900">
                {language === 'ar' ? 'تم تسجيل حساب السائق بنجاح!' : 'Driver Registered Successfully!'}
              </h4>
              <p className="text-sm text-slate-600">
                {language === 'ar'
                  ? 'حسابك الآن قيد المراجعة والاعتماد من قبل الإدارة. جاري تحويلك إلى لوحة التحكم.'
                  : 'Your account is pending administrator verification. Redirecting to driver dashboard.'}
              </p>
            </div>
          ) : (
            <>
              {/* Mode Switcher (Login / Register) */}
              <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
                <button
                  type="button"
                  onClick={() => { setMode('login'); setError(''); }}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                    mode === 'login' ? 'bg-white text-[#0062FF] shadow-xs' : 'text-slate-600'
                  }`}
                >
                  {t('navLogin')}
                </button>
                <button
                  type="button"
                  onClick={() => { setMode('register'); setError(''); }}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                    mode === 'register' ? 'bg-white text-[#0062FF] shadow-xs' : 'text-slate-600'
                  }`}
                >
                  {t('navRegister')}
                </button>
              </div>

              {/* Role Selection Tabs */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedRole('student')}
                  className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-sm font-bold transition-all ${
                    selectedRole === 'student'
                      ? 'border-[#0062FF] bg-blue-50/80 text-[#0062FF]'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <GraduationCap className="w-4 h-4 text-amber-500" />
                  <span>{language === 'ar' ? 'حساب طالب' : 'Student'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('driver')}
                  className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-sm font-bold transition-all ${
                    selectedRole === 'driver'
                      ? 'border-amber-500 bg-amber-50/80 text-amber-700'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Car className="w-4 h-4 text-amber-600" />
                  <span>{language === 'ar' ? 'سائق / مشغل' : 'Driver / Fleet'}</span>
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Quick Preset Buttons for Instant Testing */}
              {mode === 'login' && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                  <p className="font-bold text-slate-600 mb-2">
                    {language === 'ar' ? 'بيانات دخول تجريبية سريعة:' : 'Quick Demo Credentials:'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleQuickDemo('student')}
                      className="px-2.5 py-1 rounded bg-white border border-blue-200 text-[#0062FF] font-semibold hover:bg-blue-50"
                    >
                      طالب (student@harryup.app)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickDemo('driver')}
                      className="px-2.5 py-1 rounded bg-white border border-amber-200 text-amber-700 font-semibold hover:bg-amber-50"
                    >
                      سائق (driver@harryup.app)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickDemo('admin')}
                      className="px-2.5 py-1 rounded bg-white border border-purple-200 text-purple-700 font-semibold hover:bg-purple-50"
                    >
                      مسؤول (admin@harryup.app)
                    </button>
                  </div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3.5">
                
                {/* Registration only fields */}
                {mode === 'register' && (
                  <>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">
                        {language === 'ar' ? 'الاسم الكامل *' : 'Full Name *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={language === 'ar' ? 'مثال: أحمد طارق' : 'e.g. Ahmed Tarek'}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0062FF]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">
                        {language === 'ar' ? 'رقم الهاتف المحمول (مصر) *' : 'Phone Number (Egypt) *'}
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="01012345678"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0062FF]"
                      />
                    </div>

                    {/* Student specifics */}
                    {selectedRole === 'student' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-slate-700">
                            {language === 'ar' ? 'الجامعة' : 'University'}
                          </label>
                          <input
                            type="text"
                            value={university}
                            onChange={(e) => setUniversity(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 text-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-slate-700">
                            {language === 'ar' ? 'الكلية' : 'Faculty'}
                          </label>
                          <input
                            type="text"
                            value={faculty}
                            onChange={(e) => setFaculty(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 text-xs"
                          />
                        </div>
                      </div>
                    )}

                    {/* Driver specifics */}
                    {selectedRole === 'driver' && (
                      <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/80 space-y-3">
                        <div className="text-xs text-amber-900 font-bold">
                          {language === 'ar' ? 'بيانات الكابتن والمركبة (تخضع للاعتماد الإداري)' : 'Vehicle & Operator Verification'}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700">شركة النقل / المشغل</label>
                            <input
                              type="text"
                              value={companyName}
                              onChange={(e) => setCompanyName(e.target.value)}
                              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700">نوع الحافلة</label>
                            <input
                              type="text"
                              value={vehicleType}
                              onChange={(e) => setVehicleType(e.target.value)}
                              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700">رقم اللوحة المعدنية</label>
                            <input
                              type="text"
                              value={vehiclePlate}
                              onChange={(e) => setVehiclePlate(e.target.value)}
                              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700">رقم رخصة القيادة</label>
                            <input
                              type="text"
                              value={licenseNumber}
                              onChange={(e) => setLicenseNumber(e.target.value)}
                              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Email and Password */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    {language === 'ar' ? 'البريد الإلكتروني *' : 'Email Address *'}
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@harryup.app"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0062FF]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    {language === 'ar' ? 'كلمة المرور *' : 'Password *'}
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0062FF]"
                  />
                </div>

                {mode === 'register' && (
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">
                      {language === 'ar' ? 'تأكيد كلمة المرور *' : 'Confirm Password *'}
                    </label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0062FF]"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-6 rounded-xl bg-[#0062FF] hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all mt-4"
                >
                  {isLoading
                    ? (language === 'ar' ? 'جاري التحقق...' : 'Loading...')
                    : mode === 'login'
                    ? (language === 'ar' ? 'دخول المنصة' : 'Log In')
                    : (language === 'ar' ? 'إنشاء حساب جديد' : 'Create Account')}
                </button>
              </form>
            </>
          )}

        </div>

      </div>
    </div>
  );
};
