import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { X, ShieldCheck, FileText } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  type: 'privacy' | 'terms';
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ isOpen, type, onClose }) => {
  const { language, t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#0062FF] flex items-center justify-center">
              {type === 'privacy' ? <ShieldCheck className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">
                {type === 'privacy' ? t('privacyPolicy') : t('termsConditions')}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'ar' ? 'سارية لجميع مستخدمي منصة HarryUp' : 'Applicable to all HarryUp users'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm text-slate-700 leading-relaxed">
          {type === 'privacy' ? (
            <>
              <h4 className="font-bold text-slate-900 text-base">
                {language === 'ar' ? '١. خصوصية بيانات الطلاب والركاب' : '1. Student Data Privacy'}
              </h4>
              <p>
                {language === 'ar'
                  ? 'تلتزم منصة HarryUp بحماية خصوصية بيانات الطلاب المسجلين وأرقام هواتفهم. لا يتم نشر أي أرقام هواتف شخصية بشكل علني، ولا تتاح بيانات التواصل إلا للكابتن المعتمد المسؤول عن الرحلة المحجوزة حصراً لتسهيل عملية التنسيق والصعود.'
                  : 'HarryUp is committed to protecting student personal data. Phone numbers are never exposed publicly. Contact details are solely shared with the verified driver of the confirmed journey to facilitate boarding coordination.'}
              </p>

              <h4 className="font-bold text-slate-900 text-base">
                {language === 'ar' ? '٢. فحص وتوثيق بيانات السائقين' : '2. Driver & Vehicle Documentation'}
              </h4>
              <p>
                {language === 'ar'
                  ? 'تخضع رخص القيادة ووثائق المركبات لفحص دقيق ومراجعة إدارية خاصة ولا يتم عرض وثائق السائقين للجمهور، بل يتم الاكتفاء بإظهار حالة الاعتماد واسم المشغل ورقم اللوحة.'
                  : 'Driver licenses and vehicle registration files are securely reviewed by the administration and are never exposed publicly.'}
              </p>

              <h4 className="font-bold text-slate-900 text-base">
                {language === 'ar' ? '٣. سياسة الدفع' : '3. Payment & Transactions'}
              </h4>
              <p>
                {language === 'ar'
                  ? 'لا نقوم بحفظ أو تخزين أي بيانات بطاقات ائتمانية. تتم المدفوعات إما نقداً عند الصعود أو عبر المحافظ الإلكترونية المعتمدة.'
                  : 'We do not store credit card credentials. Payments are made via cash on boarding or authorized mobile wallet channels.'}
              </p>
            </>
          ) : (
            <>
              <h4 className="font-bold text-slate-900 text-base">
                {language === 'ar' ? '١. سياسة حجز المقاعد وإلغائها' : '1. Seat Booking & Cancellation Policy'}
              </h4>
              <p>
                {language === 'ar'
                  ? 'يحق للطالب إلغاء الحجز مجاناً وبدون أي غرامات حتى ساعة واحدة (60 دقيقة) قبل الموعد المحدد لانطلاق الرحلة. عند الإلغاء، يعاد فتح المقعد تلقائياً وفورياً لزملائه الطلاب.'
                  : 'Students can cancel reservations free of charge up to 1 hour (60 minutes) prior to the departure schedule. Cancelled seats are immediately restored to public availability.'}
              </p>

              <h4 className="font-bold text-slate-900 text-base">
                {language === 'ar' ? '٢. التزام السائقين ومواعيد التحرك' : '2. Driver Commitments & Punctuality'}
              </h4>
              <p>
                {language === 'ar'
                  ? 'يلتزم الكابتن بالتحرك في الموعد المحدد والتوقف في نقاط الركوب والنزول المعتمدة بطيبة والأقصر. يمنع تحميل ركاب زيادة عن الطاقة الاستيعابية المرخصة للمركبة.'
                  : 'Drivers are committed to punctuality and authorized stops in Tuba and Luxor. Overcrowding beyond licensed seating capacity is strictly prohibited.'}
              </p>

              <h4 className="font-bold text-slate-900 text-base">
                {language === 'ar' ? '٣. استخدام رمز التذكرة (QR Code)' : '3. Digital QR Ticket Validation'}
              </h4>
              <p>
                {language === 'ar'
                  ? 'يجب على الطالب إبراز رمز التذكرة الرقمية على هاتفه للكابتن عند الصعود للمركبة لتأكيد الحضور وسلامة الرحلة.'
                  : 'Students must present their digital QR pass on their mobile screen to the driver upon boarding.'}
              </p>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#0062FF] hover:bg-blue-700 text-white font-bold text-sm"
          >
            {language === 'ar' ? 'فهمت ذلك' : 'Understood'}
          </button>
        </div>

      </div>
    </div>
  );
};
