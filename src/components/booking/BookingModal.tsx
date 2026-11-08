import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Trip, Booking, PaymentMethod } from '../../types';
import { formatEgyptianPrice, formatEgyptianTime, calculateTotalPrice } from '../../utils/bookingLogic';
import { X, Check, Bus, MapPin, Clock, Calendar, Users, ShieldCheck, Printer, AlertCircle } from 'lucide-react';

interface BookingModalProps {
  trip: Trip | null;
  isOpen: boolean;
  onClose: () => void;
  onBookingComplete: (booking: Booking) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  trip,
  isOpen,
  onClose,
  onBookingComplete
}) => {
  const { language, isRTL, t } = useLanguage();
  const { user } = useAuth();
  const { createBooking } = useData();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [seats, setSeats] = useState<number>(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash_on_boarding');
  const [passengerName, setPassengerName] = useState(user?.name || 'أحمد طارق');
  const [passengerPhone, setPassengerPhone] = useState(user?.phone || '01012345678');
  
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [qrCodeSvg, setQrCodeSvg] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Sync user info if changed
  useEffect(() => {
    if (user) {
      setPassengerName(user.name);
      setPassengerPhone(user.phone);
    }
  }, [user]);

  // Reset when modal opens
  useEffect(() => {
    if (isOpen && trip) {
      setStep(1);
      setSeats(1);
      setError('');
      setConfirmedBooking(null);
      setQrCodeSvg('');
    }
  }, [isOpen, trip]);

  // Generate pure vector SVG QR Code when booking is confirmed
  useEffect(() => {
    if (confirmedBooking) {
      const qrPayload = JSON.stringify({
        ref: confirmedBooking.id,
        tripId: confirmedBooking.tripId,
        student: confirmedBooking.studentName,
        phone: confirmedBooking.studentPhone,
        seats: confirmedBooking.seatsBooked,
        totalEGP: confirmedBooking.totalPrice
      });

      QRCode.toString(qrPayload, { type: 'svg', margin: 1, width: 180 })
        .then(svg => setQrCodeSvg(svg))
        .catch(err => console.error('QR Gen error:', err));
    }
  }, [confirmedBooking]);

  if (!isOpen || !trip) return null;

  const { basePrice, fee, total } = calculateTotalPrice(seats, trip.pricePerSeat, 0);

  const handleConfirmReservation = () => {
    if (!passengerName.trim() || !passengerPhone.trim()) {
      setError(language === 'ar' ? 'يرجى كتابة اسم الراكب ورقم الهاتف للتواصل' : 'Please provide passenger name and phone number');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const res = createBooking({
      tripId: trip.id,
      studentId: user?.id || `guest_${Date.now()}`,
      studentName: passengerName,
      studentPhone: passengerPhone,
      seatsBooked: seats,
      paymentMethod
    });

    setIsSubmitting(false);

    if (res.success && res.booking) {
      setConfirmedBooking(res.booking);
      setStep(4);
      onBookingComplete(res.booking);
    } else {
      setError(res.error || 'فشل إتمام الحجز، تأكد من توافر المقاعد');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <span className="text-xs font-bold text-[#0062FF] uppercase tracking-wider block">
              {step === 4 ? (language === 'ar' ? 'تذكرة الحجز المؤكدة' : 'Confirmed Booking Pass') : (language === 'ar' ? 'خطوات حجز مقعد' : 'Seat Reservation')}
            </span>
            <h3 className="text-lg font-black text-slate-900 truncate max-w-sm">
              {trip.fromLocationAr} ↔ {trip.toLocationAr}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-slate-200 text-slate-600 flex items-center justify-center border border-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Multi-step progress bar (if not completed) */}
        {step < 4 && (
          <div className="px-6 pt-4 pb-1 bg-white border-b border-slate-100">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
              <span className={step >= 1 ? 'text-[#0062FF]' : ''}>1. {t('bookingStep1')}</span>
              <span className={step >= 2 ? 'text-[#0062FF]' : ''}>2. {t('bookingStep2')}</span>
              <span className={step >= 3 ? 'text-[#0062FF]' : ''}>3. {t('bookingStep3')}</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#0062FF] h-full transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: Review Trip Details */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-900 bg-blue-100/80 px-2.5 py-1 rounded-md">
                    {trip.companyName}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {language === 'ar' ? 'اللوحة:' : 'Plate:'} {trip.vehiclePlate}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 text-sm">
                  <div>
                    <span className="text-xs text-slate-500 block">{t('departureTime')}</span>
                    <span className="font-bold text-slate-900 text-base">
                      {formatEgyptianTime(trip.departureTime, language)}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block">{t('travelDate')}</span>
                    <span className="font-bold text-slate-900">
                      {trip.departureDate}
                    </span>
                  </div>
                </div>

                <div className="border-t border-blue-200/60 pt-2 space-y-1 text-xs">
                  <div className="flex items-start gap-1.5 text-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-[#0062FF] shrink-0 mt-0.5" />
                    <span><strong>{t('pickupPoint')}:</strong> {trip.pickupPointAr}</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>{t('dropoffPoint')}:</strong> {trip.dropoffPointAr}</span>
                  </div>
                </div>
              </div>

              {/* Seats and pricing highlights */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-xs text-slate-500 block">{language === 'ar' ? 'المقاعد الشاغرة حالياً' : 'Available Seats'}</span>
                  <span className="text-lg font-black text-emerald-600">
                    {trip.availableSeats} {language === 'ar' ? 'مقعد متاح' : 'seats left'}
                  </span>
                </div>
                <div className="text-end">
                  <span className="text-xs text-slate-500 block">{t('ticketPricePerSeat')}</span>
                  <span className="text-xl font-black text-[#0062FF]">
                    {formatEgyptianPrice(trip.pricePerSeat, language)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full py-3 rounded-xl bg-[#0062FF] hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all"
              >
                {language === 'ar' ? 'متابعة لاختيار المقاعد' : 'Continue to Seat Selection'}
              </button>
            </div>
          )}

          {/* STEP 2: Select Number of Seats */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="text-center space-y-1">
                <h4 className="font-bold text-slate-900 text-base">{t('seatSelectPrompt')}</h4>
                <p className="text-xs text-slate-500">{t('seatLimitNotice')}</p>
              </div>

              {/* Seat Counter Buttons */}
              <div className="flex items-center justify-center gap-4 py-4">
                <button
                  type="button"
                  disabled={seats <= 1}
                  onClick={() => setSeats(Math.max(1, seats - 1))}
                  className="w-12 h-12 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 font-bold text-xl text-slate-800 flex items-center justify-center border border-slate-300"
                >
                  -
                </button>
                <div className="text-center w-28">
                  <span className="text-4xl font-black text-slate-900">{seats}</span>
                  <span className="text-xs text-slate-500 block">{language === 'ar' ? 'مقعد' : 'seats'}</span>
                </div>
                <button
                  type="button"
                  disabled={seats >= Math.min(10, trip.availableSeats)}
                  onClick={() => setSeats(Math.min(Math.min(10, trip.availableSeats), seats + 1))}
                  className="w-12 h-12 rounded-xl bg-blue-50 hover:bg-blue-100 disabled:opacity-40 font-bold text-xl text-[#0062FF] flex items-center justify-center border border-blue-200"
                >
                  +
                </button>
              </div>

              {/* Live Fare Calculation */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>{seats} × {formatEgyptianPrice(trip.pricePerSeat, language)}</span>
                  <span>{formatEgyptianPrice(basePrice, language)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>{t('serviceFee')}</span>
                  <span className="text-emerald-600 font-bold">{language === 'ar' ? '0 ج.م (مجاناً للطلاب)' : '0 EGP (Free for Students)'}</span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between font-black text-base text-slate-900">
                  <span>{t('totalAmount')}</span>
                  <span className="text-[#0062FF]">{formatEgyptianPrice(total, language)}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50"
                >
                  {language === 'ar' ? 'رجوع' : 'Back'}
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="w-2/3 py-2.5 rounded-xl bg-[#0062FF] hover:bg-blue-700 text-white text-sm font-bold shadow-xs"
                >
                  {language === 'ar' ? 'متابعة للدفع' : 'Proceed to Review & Pay'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Review Passenger Info & Payment Method */}
          {step === 3 && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 text-sm">
                {language === 'ar' ? 'بيانات الراكب للتواصل مع الكابتن' : 'Passenger Contact Details'}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    {language === 'ar' ? 'اسم الراكب *' : 'Passenger Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={passengerName}
                    onChange={(e) => setPassengerName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    {language === 'ar' ? 'رقم الهاتف (للكابتن) *' : 'Phone Number *'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={passengerPhone}
                    onChange={(e) => setPassengerPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-bold text-slate-700">
                  {t('paymentMethodPrompt')}
                </label>

                <div className="grid grid-cols-1 gap-2">
                  <label
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'cash_on_boarding'
                        ? 'border-[#0062FF] bg-blue-50/70 text-slate-900'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash_on_boarding"
                      checked={paymentMethod === 'cash_on_boarding'}
                      onChange={() => setPaymentMethod('cash_on_boarding')}
                      className="text-[#0062FF] focus:ring-[#0062FF]"
                    />
                    <div>
                      <span className="font-bold text-sm block">{t('payCashOnBoarding')}</span>
                      <span className="text-xs text-slate-500">
                        {language === 'ar' ? 'تدفع نقداً للكابتن عند الصعود للمركبة بعد فحص التذكرة' : 'Pay cash to the driver upon boarding validation'}
                      </span>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'vodafone_cash'
                        ? 'border-amber-500 bg-amber-50/70 text-slate-900'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="vodafone_cash"
                      checked={paymentMethod === 'vodafone_cash'}
                      onChange={() => setPaymentMethod('vodafone_cash')}
                      className="text-amber-500 focus:ring-amber-500"
                    />
                    <div>
                      <span className="font-bold text-sm block">{t('payVodafoneCash')}</span>
                      <span className="text-xs text-slate-500">
                        {language === 'ar' ? 'التحويل لمحفظة الكابتن المعتمدة إلكترونياً' : 'Direct mobile wallet transfer to driver'}
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Total review banner */}
              <div className="p-3 bg-slate-900 text-white rounded-xl flex items-center justify-between text-sm">
                <span>{language === 'ar' ? 'المبلغ المستحق للدفع:' : 'Total Due:'}</span>
                <span className="text-amber-400 font-black text-lg">
                  {formatEgyptianPrice(total, language)}
                </span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-1/3 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50"
                >
                  {language === 'ar' ? 'رجوع' : 'Back'}
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleConfirmReservation}
                  className="w-2/3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-md flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>{isSubmitting ? (language === 'ar' ? 'جاري التأكيد...' : 'Confirming...') : t('confirmBookingBtn')}</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Confirmation Pass & QR Ticket */}
          {step === 4 && confirmedBooking && (
            <div className="space-y-5 print:p-0">
              
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                  <Check className="w-7 h-7" />
                </div>
                <h4 className="text-xl font-black text-slate-900">{t('bookingSuccessTitle')}</h4>
                <p className="text-xs text-slate-500">{t('qrTicketDesc')}</p>
              </div>

              {/* Clean Ticket Card */}
              <div className="bg-gradient-to-br from-slate-900 to-[#0b1a30] text-white rounded-2xl p-5 shadow-xl relative overflow-hidden border border-slate-800">
                
                {/* Decorative cutouts on sides */}
                <div className="flex items-center justify-between border-b border-slate-700/80 pb-3 mb-3">
                  <div>
                    <span className="text-xs text-amber-400 font-bold uppercase tracking-wider block">
                      {confirmedBooking.tripDetails.companyName}
                    </span>
                    <span className="text-lg font-black tracking-tight text-white">
                      {confirmedBooking.tripDetails.fromLocationAr} ↔ {confirmedBooking.tripDetails.toLocationAr}
                    </span>
                  </div>
                  <div className="text-end">
                    <span className="text-[10px] text-slate-400 block">{t('bookingReferenceLabel')}</span>
                    <span className="font-mono font-bold text-amber-300 text-sm">
                      {confirmedBooking.id}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 py-2 text-xs border-b border-slate-700/80">
                  <div>
                    <span className="text-slate-400 block">{t('travelDate')}</span>
                    <span className="font-bold text-slate-200">{confirmedBooking.tripDetails.departureDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">{t('departureTime')}</span>
                    <span className="font-bold text-amber-400">{formatEgyptianTime(confirmedBooking.tripDetails.departureTime, language)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">{language === 'ar' ? 'المقاعد' : 'Seats'}</span>
                    <span className="font-bold text-slate-200">{confirmedBooking.seatsBooked} {language === 'ar' ? 'مقعد' : 'seat(s)'}</span>
                  </div>
                </div>

                <div className="py-2 text-xs space-y-1">
                  <div className="text-slate-300">
                    <strong className="text-slate-400">{t('pickupPoint')}:</strong> {confirmedBooking.tripDetails.pickupPointAr}
                  </div>
                  <div className="text-slate-300">
                    <strong className="text-slate-400">{language === 'ar' ? 'اسم الراكب:' : 'Passenger:'}</strong> {confirmedBooking.studentName} ({confirmedBooking.studentPhone})
                  </div>
                </div>

                {/* QR Code Center */}
                <div className="mt-4 pt-3 border-t border-slate-700/80 flex flex-col items-center justify-center">
                  {qrCodeSvg ? (
                    <div
                      className="p-2 bg-white rounded-xl shadow-md w-36 h-36 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"
                      dangerouslySetInnerHTML={{ __html: qrCodeSvg }}
                    />
                  ) : (
                    <div className="w-36 h-36 bg-slate-800 rounded-xl flex items-center justify-center text-xs text-slate-400">
                      Generating QR...
                    </div>
                  )}
                  <span className="text-[11px] text-slate-400 mt-2 font-mono">
                    {confirmedBooking.id}
                  </span>
                </div>

                {/* Total and Payment Status */}
                <div className="mt-3 pt-3 border-t border-slate-700/80 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 block">{language === 'ar' ? 'طريقة الدفع' : 'Payment'}</span>
                    <span className="font-bold text-emerald-400">
                      {confirmedBooking.paymentMethod === 'cash_on_boarding'
                        ? (language === 'ar' ? 'نقداً للكابتن' : 'Cash on Boarding')
                        : 'Vodafone Cash'}
                    </span>
                  </div>
                  <div className="text-end">
                    <span className="text-slate-400 block">{language === 'ar' ? 'المبلغ المطلوب' : 'Amount'}</span>
                    <span className="text-base font-black text-amber-400">
                      {formatEgyptianPrice(confirmedBooking.totalPrice, language)}
                    </span>
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-800 font-bold text-sm hover:bg-slate-50 flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>{language === 'ar' ? 'طباعة / حفظ التذكرة' : 'Print Pass'}</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl bg-[#0062FF] hover:bg-blue-700 text-white font-bold text-sm"
                >
                  {language === 'ar' ? 'تم ومتابعة الرحلة' : 'Done & View Bookings'}
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
