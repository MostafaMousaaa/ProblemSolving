import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  isRTL: boolean;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  ar: {
    // Brand & General
    brandName: 'HarryUp',
    brandTagline: 'مشوارك بقى أسهل مع HarryUp',
    taglineSub: 'منصة النقل الذكي لطلاب الجامعات - تربطك بالحافلات وشركات النقل بين طيبة والأقصر بأمان وسهولة.',
    findYourJourney: 'احجز مشوارك الآن',
    joinAsDriver: 'انضم ككابتن / شركة نقل',
    superjetNote: 'منصة تربط الركاب بمشغلي سوبر جيت وشركات النقل المعتمدة في الأقصر',
    demoModeBanner: 'بيئة تجريبية تفاعلية: يمكنك التبديل بين حساب الطالب، السائق، والمسؤول لتجربة المنصة كاملة.',

    // Navigation
    navHome: 'الرئيسية',
    navHowItWorks: 'كيف يعمل',
    navStudents: 'للطلاب',
    navDrivers: 'للسائقين',
    navRoutes: 'المسارات',
    navAbout: 'عن HarryUp',
    navContact: 'اتصل بنا',
    navLogin: 'تسجيل الدخول',
    navRegister: 'إنشاء حساب',
    navLogout: 'تسجيل الخروج',
    navDashboard: 'لوحة التحكم',
    navQuickDemoRole: 'تبديل الحساب التجريبي',

    // Hero & Search
    heroTitle: 'مشوارك بقى أسهل مع HarryUp',
    heroDesc: 'ابحث عن الرحلات المتاحة بعد الساعة 3 عصراً، احجز مقعدك، وتنقل بكل راحة وأمان بين جامعتك ومنزلك.',
    fromLocation: 'مكان المغادرة',
    toLocation: 'الوجهة',
    travelDate: 'تاريخ السفر',
    departureTime: 'وقت المغادرة',
    passengersCount: 'عدد المقاعد',
    searchTrips: 'بحث عن رحلات',
    quickRoutes: 'مسارات سريعة:',
    tubaToLuxor: 'طيبة ↔ الأقصر',
    luxorToTuba: 'الأقصر ↔ طيبة',
    newTuba: 'مدينة طيبة الجديدة',
    downtownLuxor: 'وسط الأقصر (المحطة)',

    // How it works
    howItWorksTitle: 'كيف تعمل منصة HarryUp؟',
    howItWorksSub: 'ثلاث خطوات بسيطة تضمن لك رحلة مريحة وموثوقة',
    stepStudent1Title: 'ابحث عن الرحلات',
    stepStudent1Desc: 'حدد وجهتك ووقت المغادرة المناسب لجدولك الدراسي، خاصة في ساعات الذروة بعد الثالثة عصراً.',
    stepStudent2Title: 'اختر الرحلة وعدد المقاعد',
    stepStudent2Desc: 'قارن بين مشغلي النقل المعتمدين وسيارات سوبر جيت والميكروباص واختر الأنسب لك.',
    stepStudent3Title: 'احجز وتسلّم تذكرتك فوراً',
    stepStudent3Desc: 'احصل على رمز الحجز وQR Code لتأكيد صعودك مع الكابتن بكل سلاسة.',

    stepDriver1Title: 'سجل حسابك أو شركتك',
    stepDriver1Desc: 'أدخل بياناتك وبيانات المركبة للتأكد من مطابقتها لمعايير الأمان واعتمادها من الإدارة.',
    stepDriver2Title: 'انشر الرحلات المتاحة',
    stepDriver2Desc: 'حدد مواعيد الانطلاق وسعر المقعد والمسار والقدرة الاستيعابية للحافلة.',
    stepDriver3Title: 'أدر الحجوزات والركاب',
    stepDriver3Desc: 'تابع قائمة الركاب المؤكدين، تحقق من تذاكر الـ QR عند الصعود، واستلم أرباحك.',

    // Benefits
    benefitsTitle: 'لماذا يفضل الطلاب HarryUp؟',
    benefit1Title: 'حجز فوري ومؤكد',
    benefit1Desc: 'لا مزيد من الوقوف طويلاً في حرارة الصيف أو انتظار المواصلات بعد انتهاء المحاضرات.',
    benefit2Title: 'معلومات واضحة ومقاعد دقيقة',
    benefit2Desc: 'تعرف مسبقاً على نوع المركبة، رقم اللوحة، وقت التحرك الدقيق، وعدد المقاعد المتبقية.',
    benefit3Title: 'سائقون وشركات معتمدة',
    benefit3Desc: 'نتعامل مع مشغلي النقل المعتمدين وسائقي سوبر جيت المرخصين لضمان سلامتك.',
    benefit4Title: 'أسعار مناسبة للطلاب',
    benefit4Desc: 'تعريفة عادلة وشفافة بالجنيه المصري بدون أي زيادات عشوائية.',

    // Featured Routes
    featuredRoutesTitle: 'أهم المسارات الجامعية النشطة',
    featuredRoutesSub: 'خدمة مستمرة تربط المجمعات التعليمية والمدن الجامعية بقلب الأقصر',
    popularBadge: 'الأكثر طلباً بعد 3:00 م',
    estDuration: 'مدة الرحلة التقريبية',
    startingFrom: 'يبدأ من',
    availableNow: 'رحلات متاحة اليوم',

    // FAQ
    faqTitle: 'الأسئلة الشائعة',
    faqQ1: 'ما هي المشكلة الأساسية التي تحلها منصة HarryUp؟',
    faqA1: 'يواجه طلاب جامعة الأقصر وكليات طيبة صعوبة بالغة في العثور على وسيلة مواصلات منظمة بعد الساعة 3:00 عصراً بعد انتهاء المحاضرات، مما يسبب انتظاراً طويلاً وتكدساً. HarryUp تنظم وتنسق حافلات النقل المعتمدة وتتيح حجز المقعد مسبقاً.',
    faqQ2: 'هل يوجد تعاون رسمي مع سوبر جيت؟',
    faqA2: 'HarryUp توفر منصة تقنية مستقلة تمكّن السائقين وشركات النقل المعتمدة ومشغلي حافلات سوبر جيت المرخصين من تنظيم رحلاتهم. لا نمثل صفة قانونية حصرية لشركة سوبر جيت بل نعمل كنظام تشغيل رقمي مفتوح للمشغلين المصرح لهم.',
    faqQ3: 'كيف أدفع مقابل الحجز؟',
    faqA3: 'يمكن للطلاب الدفع نقداً عند الصعود للكابتن (Cash on Boarding)، أو عبر المحافظ الإلكترونية مثل فودافون كاش وإنستاباي بحسب الخيارات المعتمدة من مشغل الرحلة.',
    faqQ4: 'هل يمكنني إلغاء الحجز؟',
    faqA4: 'نعم، يمكن للطالب إلغاء الحجز مجاناً من لوحة التحكم قبل موعد انطلاق الرحلة بساعة واحدة على الأقل، ليتاح المقعد لزميل آخر.',

    // Student Dashboard
    studentDashboard: 'لوحة تحكم الطالب',
    studentWelcome: 'أهلاً بك',
    dashboardOverview: 'نظرة عامة',
    findTrip: 'البحث عن رحلة',
    myBookings: 'حجوزاتي',
    upcomingTrips: 'الرحلات القادمة',
    bookingHistory: 'سجل الحجوزات',
    notifications: 'الإشعارات',
    myProfile: 'ملفي الشخصي',
    helpSupport: 'المساعدة والدعم',
    totalBookings: 'إجمالي الحجوزات',
    activeTrips: 'رحلات نشطة قادمة',
    completedTrips: 'رحلات مكتملة',
    cancelledBookings: 'حجوزات ملغاة',
    recentActivity: 'آخر النشاطات',
    noBookingsYet: 'لا توجد حجوزات حتى الآن. ابدأ بالبحث عن رحلة الآن!',
    seatsLeft: 'مقاعد متبقية',
    operator: 'شركة النقل / المشغل',
    pickupPoint: 'نقطة الركوب',
    dropoffPoint: 'نقطة النزول',
    viewTicket: 'عرض التذكرة والـ QR',
    cancelBooking: 'إلغاء الحجز',
    bookNow: 'احجز الآن',

    // Booking Flow
    bookingStep1: 'تفاصيل الرحلة',
    bookingStep2: 'اختيار المقاعد',
    bookingStep3: 'المراجعة والدفع',
    bookingStep4: 'تأكيد الحجز',
    seatSelectPrompt: 'كم عدد المقاعد التي ترغب في حجزها؟',
    seatLimitNotice: 'الحد الأقصى 10 مقاعد لكل حجز لطلاب الجامعة.',
    priceSummary: 'ملخص السعر',
    ticketPricePerSeat: 'سعر المقعد:',
    serviceFee: 'رسوم المنصة:',
    totalAmount: 'الإجمالي للدفع:',
    paymentMethodPrompt: 'اختر طريقة الدفع المفضلة:',
    payCashOnBoarding: 'الدفع نقداً عند الصعود للكابتن',
    payVodafoneCash: 'فودافون كاش / إنستاباي',
    confirmBookingBtn: 'تأكيد الحجز النهائي',
    bookingSuccessTitle: 'تم تأكيد حجزك بنجاح!',
    bookingReferenceLabel: 'رقم الحجز الفريد:',
    qrTicketDesc: 'يرجى إبراز هذا الرمز (QR Code) أو رقم الحجز للكابتن عند الصعود للمركبة.',

    // Driver Dashboard
    driverDashboard: 'بوابة السائقين ومشغلي النقل',
    driverStatusPending: 'حسابك قيد المراجعة والاعتماد من قبل إدارة HarryUp',
    driverStatusPendingDesc: 'حرصاً على سلامة الطلاب، نقوم بمراجعة رخصة القيادة وبيانات المركبة قبل تفعيل نشر الرحلات العامة. (يمكنك نشر رحلات تجريبية الآن في بيئة العرض).',
    driverStatusApproved: 'حساب معتمد وموثق',
    publishedTrips: 'الرحلات المنشورة',
    totalReservedSeats: 'المقاعد المحجوزة',
    availableSeatsCount: 'المقاعد المتاحة',
    awaitingRequests: 'طلبات قيد المتابعة',
    createTripTitle: 'نشر رحلة جديدة',
    createNewTrip: 'إضافة رحلة جديدة',
    passengerManifest: 'قائمة الركاب والمنافستو',
    earningsOverview: 'ملخص الدخل والأرباح',
    estimatedEarnings: 'الأرباح المقدرة (بالجنيه)',
    completedJourneys: 'الرحلات المكتملة',
    markBoarded: 'تأكيد الصعود',
    boardedStatus: 'تم الصعود',
    notBoardedStatus: 'في الانتظار',
    completeTrip: 'إنهاء الرحلة',
    cancelTrip: 'إلغاء الرحلة',
    vehiclePlateLabel: 'رقم اللوحة',
    vehicleTypeLabel: 'نوع المركبة',

    // Admin Dashboard
    adminDashboard: 'لوحة تحكم المسؤول (Admin)',
    adminAccessOnly: 'لوحة محمية خاصة بإدارة وتشغيل منصة HarryUp',
    totalStudents: 'إجمالي الطلاب المسجلين',
    totalDrivers: 'إجمالي السائقين',
    totalOperators: 'شركات النقل المعتمدة',
    totalTripsSystem: 'إجمالي الرحلات في النظام',
    studentManagement: 'إدارة حسابات الطلاب',
    driverManagement: 'إدارة واعتماد السائقين',
    tripManagement: 'إدارة ومراقبة الرحلات',
    routeManagement: 'إدارة المسارات والخطوط',
    platformSettings: 'إعدادات المنصة والسياسات',
    approveDriverBtn: 'اعتماد وتوثيق الحساب',
    rejectDriverBtn: 'رفض الطلب',
    suspendAccountBtn: 'تعليق الحساب',
    activateAccountBtn: 'تنشيط الحساب',

    // Footer & Misc
    footerAbout: 'عن المنصة',
    footerAboutText: 'HarryUp منصة نقل مصرية نشأت في الأقصر لتسهيل تنقل طلاب الجامعات وحل أزمة المواصلات بعد الساعة 3 عصراً.',
    privacyPolicy: 'سياسة الخصوصية',
    termsConditions: 'الشروط والأحكام',
    allRightsReserved: 'جميع الحقوق محفوظة لمنصة HarryUp © 2026',
    egyptianPound: 'ج.م',
    luxorOffice: 'الأقصر، جمهورية مصر العربية'
  },
  en: {
    // Brand & General
    brandName: 'HarryUp',
    brandTagline: 'Your Journey, Made Easier.',
    taglineSub: 'The digital transportation platform connecting university students with SuperJet operators and authorized coaches between Tuba and Luxor.',
    findYourJourney: 'Find Your Journey',
    joinAsDriver: 'Join as a Driver',
    superjetNote: 'Connecting passengers with authorized SuperJet operators and licensed drivers in Luxor',
    demoModeBanner: 'Interactive Demo Mode: Instantly switch between Student, Driver, and Admin to test the full startup workflows.',

    // Navigation
    navHome: 'Home',
    navHowItWorks: 'How It Works',
    navStudents: 'For Students',
    navDrivers: 'For Drivers',
    navRoutes: 'Routes',
    navAbout: 'About Us',
    navContact: 'Contact',
    navLogin: 'Login',
    navRegister: 'Register',
    navLogout: 'Logout',
    navDashboard: 'Dashboard',
    navQuickDemoRole: 'Switch Demo Role',

    // Hero & Search
    heroTitle: 'Your Journey, Made Easier.',
    heroDesc: 'Find available journeys after 3:00 PM, book your seat, and travel with greater convenience through one simple platform.',
    fromLocation: 'Departure Location',
    toLocation: 'Destination',
    travelDate: 'Travel Date',
    departureTime: 'Departure Time',
    passengersCount: 'Number of Seats',
    searchTrips: 'Search Trips',
    quickRoutes: 'Quick Routes:',
    tubaToLuxor: 'Tuba ↔ Luxor',
    luxorToTuba: 'Luxor ↔ Tuba',
    newTuba: 'New Tuba City',
    downtownLuxor: 'Downtown Luxor (Station)',

    // How it works
    howItWorksTitle: 'How HarryUp Works',
    howItWorksSub: 'Three simple steps to ensure a comfortable and reliable journey',
    stepStudent1Title: 'Search Available Trips',
    stepStudent1Desc: 'Choose your route and departure time tailored for student schedules, especially during peak 3:00 PM hours.',
    stepStudent2Title: 'Select Your Preferred Journey',
    stepStudent2Desc: 'Compare authorized coaches, SuperJet vehicles, and microbuses, and pick the best option.',
    stepStudent3Title: 'Book & Receive QR Ticket',
    stepStudent3Desc: 'Confirm instantly with transparent pricing and present your QR code ticket upon boarding.',

    stepDriver1Title: 'Register Account & Fleet',
    stepDriver1Desc: 'Submit vehicle and operator details for safety verification and administrative approval.',
    stepDriver2Title: 'Publish Available Journeys',
    stepDriver2Desc: 'Set departure schedules, seat capacities, pickup points, and transparent EGP pricing.',
    stepDriver3Title: 'Manage Reservations & Passengers',
    stepDriver3Desc: 'View real-time manifests, verify QR passes, mark passengers as boarded, and track earnings.',

    // Benefits
    benefitsTitle: 'Why Students & Drivers Rely on HarryUp',
    benefit1Title: 'Guaranteed Seat Booking',
    benefit1Desc: 'No more standing for hours in hot weather or scrambling for transport after lectures end.',
    benefit2Title: 'Clear Journey Information',
    benefit2Desc: 'See vehicle plate, operator name, exact departure time, and real-time available seats beforehand.',
    benefit3Title: 'Authorized Transportation Providers',
    benefit3Desc: 'All drivers and SuperJet fleets are vetted and verified for reliable passenger safety.',
    benefit4Title: 'Fair & Transparent Student Pricing',
    benefit4Desc: 'Clear pricing in Egyptian Pounds (EGP) with zero unexpected price surges.',

    // Featured Routes
    featuredRoutesTitle: 'Featured University Routes',
    featuredRoutesSub: 'Continuous service connecting university campuses with downtown Luxor',
    popularBadge: 'High Demand after 3:00 PM',
    estDuration: 'Est. Duration',
    startingFrom: 'Starting from',
    availableNow: 'Trips Available Today',

    // FAQ
    faqTitle: 'Frequently Asked Questions',
    faqQ1: 'What core problem does HarryUp solve?',
    faqA1: 'Students at Luxor University and Tuba campuses face major transportation shortages after 3:00 PM when lectures conclude. HarryUp organizes authorized transportation providers to guarantee seats with seamless digital booking.',
    faqQ2: 'Does HarryUp have an exclusive partnership with SuperJet?',
    faqA2: 'HarryUp is an independent technology platform designed for authorized operators, licensed SuperJet drivers, and private coaches. We do not claim exclusive trademarks; our goal is empowering authorized drivers with modern tools.',
    faqQ3: 'How do students pay for trips?',
    faqA3: 'Students can pay with Cash on Boarding directly to the driver, or via electronic mobile wallets (Vodafone Cash, InstaPay) as configured by the trip operator.',
    faqQ4: 'Can I cancel my reservation?',
    faqA4: 'Yes, students can cancel free of charge directly from their dashboard up to 1 hour before departure time, instantly freeing up the seat for other students.',

    // Student Dashboard
    studentDashboard: 'Student Dashboard',
    studentWelcome: 'Welcome',
    dashboardOverview: 'Overview',
    findTrip: 'Find a Trip',
    myBookings: 'My Bookings',
    upcomingTrips: 'Upcoming Trips',
    bookingHistory: 'Booking History',
    notifications: 'Notifications',
    myProfile: 'My Profile',
    helpSupport: 'Help & Support',
    totalBookings: 'Total Bookings',
    activeTrips: 'Upcoming Journeys',
    completedTrips: 'Completed Journeys',
    cancelledBookings: 'Cancelled Bookings',
    recentActivity: 'Recent Activity',
    noBookingsYet: 'No bookings found yet. Search and book your first journey now!',
    seatsLeft: 'seats available',
    operator: 'Operator / Company',
    pickupPoint: 'Pickup Point',
    dropoffPoint: 'Dropoff Point',
    viewTicket: 'View Ticket & QR',
    cancelBooking: 'Cancel Booking',
    bookNow: 'Book Now',

    // Booking Flow
    bookingStep1: 'Trip Details',
    bookingStep2: 'Select Seats',
    bookingStep3: 'Review & Pay',
    bookingStep4: 'Confirmation',
    seatSelectPrompt: 'How many seats would you like to book?',
    seatLimitNotice: 'Maximum 10 seats per booking for students.',
    priceSummary: 'Price Summary',
    ticketPricePerSeat: 'Price per seat:',
    serviceFee: 'Platform fee:',
    totalAmount: 'Total Due:',
    paymentMethodPrompt: 'Select Payment Method:',
    payCashOnBoarding: 'Cash on Boarding (Pay to Driver)',
    payVodafoneCash: 'Vodafone Cash / InstaPay',
    confirmBookingBtn: 'Confirm Reservation',
    bookingSuccessTitle: 'Reservation Confirmed!',
    bookingReferenceLabel: 'Unique Booking Reference:',
    qrTicketDesc: 'Show this QR code or booking reference to the driver upon boarding the vehicle.',

    // Driver Dashboard
    driverDashboard: 'Driver & Operator Portal',
    driverStatusPending: 'Account Pending Verification by Administrator',
    driverStatusPendingDesc: 'For student safety, licenses and vehicle registrations are reviewed before public visibility. (You can test trip creation in this interactive demo).',
    driverStatusApproved: 'Verified & Authorized Driver',
    publishedTrips: 'Published Trips',
    totalReservedSeats: 'Reserved Seats',
    availableSeatsCount: 'Available Seats',
    awaitingRequests: 'Pending Requests',
    createTripTitle: 'Publish a New Journey',
    createNewTrip: 'Create New Trip',
    passengerManifest: 'Passenger Manifest',
    earningsOverview: 'Earnings Overview',
    estimatedEarnings: 'Estimated Earnings (EGP)',
    completedJourneys: 'Completed Trips',
    markBoarded: 'Mark Boarded',
    boardedStatus: 'Boarded',
    notBoardedStatus: 'Waiting',
    completeTrip: 'Mark Completed',
    cancelTrip: 'Cancel Trip',
    vehiclePlateLabel: 'Vehicle Plate',
    vehicleTypeLabel: 'Vehicle Type',

    // Admin Dashboard
    adminDashboard: 'Platform Administrator Dashboard',
    adminAccessOnly: 'Protected administrative management portal for HarryUp',
    totalStudents: 'Registered Students',
    totalDrivers: 'Registered Drivers',
    totalOperators: 'Authorized Operators',
    totalTripsSystem: 'Total System Trips',
    studentManagement: 'Student Management',
    driverManagement: 'Driver Verification & Management',
    tripManagement: 'Trip Monitoring',
    routeManagement: 'Route Management',
    platformSettings: 'Platform Settings & Policies',
    approveDriverBtn: 'Approve & Verify Driver',
    rejectDriverBtn: 'Reject Application',
    suspendAccountBtn: 'Suspend Account',
    activateAccountBtn: 'Activate Account',

    // Footer & Misc
    footerAbout: 'About Platform',
    footerAboutText: 'HarryUp is an Egyptian TravelTech platform born in Luxor to resolve university student transit bottlenecks after 3:00 PM.',
    privacyPolicy: 'Privacy Policy',
    termsConditions: 'Terms & Conditions',
    allRightsReserved: 'All rights reserved by HarryUp © 2026',
    egyptianPound: 'EGP',
    luxorOffice: 'Luxor, Arab Republic of Egypt'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('harryup_lang') as Language;
    return saved === 'en' ? 'en' : 'ar'; // Arabic default as requested!
  });

  const isRTL = language === 'ar';

  useEffect(() => {
    localStorage.setItem('harryup_lang', language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    setLanguageState(prev => (prev === 'ar' ? 'en' : 'ar'));
  };

  const t = (key: string): string => {
    return translations[language][key] || translations.ar[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, isRTL, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
