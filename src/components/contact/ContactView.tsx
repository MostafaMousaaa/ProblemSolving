import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare, Clock } from 'lucide-react';

export const ContactView: React.FC = () => {
  const { language, t } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError(language === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields');
      return;
    }
    setError('');
    setSubmitted(true);
  };

  return (
    <div className="py-12 sm:py-20 bg-slate-50 min-h-[80vh]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/70 text-[#0062FF] font-bold text-xs uppercase tracking-wider">
            {language === 'ar' ? 'خدمة الطلاب والشركاء' : 'Support & Assistance'}
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            {language === 'ar' ? 'تواصل مع فريق HarryUp' : 'Contact HarryUp Support'}
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">
            {language === 'ar'
              ? 'فريق الدعم الفني وخدمة العملاء متواجد لمساعدتك والإجابة على أي استفسارات تخص الحجوزات أو انضمام المشغلين.'
              : 'Our support team is here to assist you with journey bookings, operator inquiries, and feedback.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Contact Details Card */}
          <div className="lg:col-span-5 bg-[#0b1a30] text-white rounded-2xl p-6 sm:p-8 space-y-8 shadow-xl">
            <div>
              <h3 className="text-xl font-bold mb-2">
                {language === 'ar' ? 'معلومات التواصل المعتمدة' : 'Official Support Channels'}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {language === 'ar'
                  ? 'نسعد باستقبال اقتراحات الطلاب واستفسارات أولياء الأمور وطلبات تسجيل السائقين.'
                  : 'We welcome student suggestions, inquiries, and driver registration requests.'}
              </p>
            </div>

            <div className="space-y-5 text-sm">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-[#0062FF] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-slate-400 text-xs">{language === 'ar' ? 'المقر الرئيسي' : 'Office Location'}</p>
                  <p className="font-semibold text-slate-200">
                    {language === 'ar' ? 'مجمع خدمات طيبة - الأقصر، جمهورية مصر العربية' : 'Tuba Services Hub, Luxor, Egypt'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-slate-400 text-xs">{language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}</p>
                  <p className="font-semibold text-slate-200">support@harryup.app</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-slate-400 text-xs">{language === 'ar' ? 'هاتف الدعم الموحد' : 'Helpline'}</p>
                  <p className="font-semibold text-slate-200" dir="ltr">+20 100 000 0001</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-slate-400 text-xs">{language === 'ar' ? 'ساعات العمل' : 'Working Hours'}</p>
                  <p className="font-semibold text-slate-200">
                    {language === 'ar' ? 'السبت إلى الخميس: 7:00 ص - 7:00 م' : 'Sat - Thu: 7:00 AM - 7:00 PM'}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-amber-300">
              {language === 'ar'
                ? 'ملاحظة: للحالات الطارئة المتعلقة برحلة جارية، يرجى التواصل برقم الكابتن المسجل على تذكرتك مباشرة.'
                : 'Notice: For in-transit emergencies, please call the captain phone number printed on your ticket.'}
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-slate-900">
                  {language === 'ar' ? 'تم استلام رسالتك بنجاح!' : 'Message Received Successfully!'}
                </h3>
                <p className="text-slate-600 text-sm max-w-md mx-auto">
                  {language === 'ar'
                    ? 'شكراً لتواصلك معنا. سيقوم أحد ممثلي فريق HarryUp بالرد عليك عبر البريد الإلكتروني في غضون 24 ساعة.'
                    : 'Thank you for reaching out. A HarryUp representative will reply to your email within 24 hours.'}
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setName('');
                    setEmail('');
                    setSubject('');
                    setMessage('');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-[#0062FF] text-white font-bold text-sm hover:bg-blue-700 transition-colors"
                >
                  {language === 'ar' ? 'إرسال رسالة أخرى' : 'Send Another Message'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {language === 'ar' ? 'أرسل لنا استفسارك' : 'Send Us a Message'}
                </h3>

                {error && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-semibold">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">
                      {language === 'ar' ? 'الاسم الكامل *' : 'Full Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={language === 'ar' ? 'مثال: محمد علي' : 'e.g. Mohamed Ali'}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0062FF]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">
                      {language === 'ar' ? 'البريد الإلكتروني *' : 'Email Address *'}
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0062FF]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    {language === 'ar' ? 'الموضوع' : 'Subject'}
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0062FF]"
                  >
                    <option value="">{language === 'ar' ? 'اختر موضوع الرسالة' : 'Select a topic'}</option>
                    <option value="student_inquiry">{language === 'ar' ? 'استفسار طالب حول رحلة' : 'Student trip inquiry'}</option>
                    <option value="driver_join">{language === 'ar' ? 'طلب انضمام سائق أو شركة نقل' : 'Driver / Fleet join request'}</option>
                    <option value="complaint">{language === 'ar' ? 'شكوى أو مقترح تحسين' : 'Feedback or Complaint'}</option>
                    <option value="other">{language === 'ar' ? 'أخرى' : 'Other'}</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    {language === 'ar' ? 'نص الرسالة *' : 'Your Message *'}
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={language === 'ar' ? 'اكتب تفاصيل استفسارك هنا...' : 'Write your details here...'}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0062FF]"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-6 rounded-xl bg-[#0062FF] hover:bg-blue-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>{language === 'ar' ? 'إرسال الرسالة' : 'Send Message'}</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
