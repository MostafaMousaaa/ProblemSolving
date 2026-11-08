import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Trip,
  Booking,
  DriverProfile,
  StudentProfile,
  RouteItem,
  NotificationItem,
  PlatformSettings,
  PaymentMethod,
  TripStatus,
  DriverStatus
} from '../types';
import { DEMO_DRIVER, DEMO_PENDING_DRIVER, DEMO_STUDENT } from './AuthContext';
import { generateBookingReference, validateSeatBooking } from '../utils/bookingLogic';

interface DataContextType {
  trips: Trip[];
  bookings: Booking[];
  drivers: DriverProfile[];
  students: StudentProfile[];
  routes: RouteItem[];
  notifications: NotificationItem[];
  settings: PlatformSettings;
  
  // Trip actions
  createTrip: (tripData: Omit<Trip, 'id' | 'createdAt' | 'status' | 'availableSeats'>) => { success: boolean; error?: string };
  updateTripStatus: (tripId: string, status: TripStatus) => void;
  cancelTrip: (tripId: string) => void;

  // Booking actions
  createBooking: (params: {
    tripId: string;
    studentId: string;
    studentName: string;
    studentPhone: string;
    seatsBooked: number;
    paymentMethod: PaymentMethod;
  }) => { success: boolean; booking?: Booking; error?: string };
  cancelBooking: (bookingId: string) => { success: boolean; error?: string };
  markPassengerBoarded: (bookingId: string, boarded: boolean) => void;

  // Admin actions
  updateDriverStatus: (driverId: string, status: DriverStatus, notes?: string) => void;
  toggleRouteActive: (routeId: string) => void;
  updateSettings: (newSettings: Partial<PlatformSettings>) => void;
  resetToDemoSeed: () => void;
}

// Initial realistic routes connecting Tuba and Luxor
const INITIAL_ROUTES: RouteItem[] = [
  {
    id: 'rt_tuba_luxor_main',
    fromCity: 'طيبة (Tuba)',
    fromNameAr: 'مجمع كليات طيبة وجامعة الأقصر',
    fromNameEn: 'Tuba University Campuses Complex',
    toCity: 'الأقصر (Luxor)',
    toNameAr: 'محطة قطار الأقصر وميدان المحطة',
    toNameEn: 'Luxor Central Railway Station Square',
    estimatedDuration: '30-40 دقيقة',
    basePrice: 20,
    popular: true,
    active: true
  },
  {
    id: 'rt_luxor_tuba_morning',
    fromCity: 'الأقصر (Luxor)',
    fromNameAr: 'موقف العوامية وميدan التجارة',
    fromNameEn: 'Al-Awameya Terminal & Downtown Luxor',
    toCity: 'طيبة (Tuba)',
    toNameAr: 'مدينة طيبة الجديدة - جامعة الأقصر التكنولوجية',
    toNameEn: 'New Tuba City - Luxor Technological University',
    estimatedDuration: '35 دقيقة',
    basePrice: 20,
    popular: true,
    active: true
  },
  {
    id: 'rt_tuba_bayadiya',
    fromCity: 'طيبة (Tuba)',
    fromNameAr: 'المدينة الجامعية بطيبة',
    fromNameEn: 'Tuba University Dormitories',
    toCity: 'البياضية (Al-Bayadiya)',
    toNameAr: 'كوبري البياضية وطريق الكباش',
    toNameEn: 'Al-Bayadiya Bridge & Kebash Road',
    estimatedDuration: '25 دقيقة',
    basePrice: 15,
    popular: false,
    active: true
  },
  {
    id: 'rt_tuba_karnak',
    fromCity: 'طيبة (Tuba)',
    fromNameAr: 'بوابة كلية الحاسبات والمعلومات (طيبة)',
    fromNameEn: 'Faculty of Computers Gate (Tuba)',
    toCity: 'الكرنك (Karnak)',
    toNameAr: 'منطقة الكرنك والشارع السياحي',
    toNameEn: 'Karnak District & Corniche',
    estimatedDuration: '20 دقيقة',
    basePrice: 15,
    popular: true,
    active: true
  }
];

// Realistic trips focusing on the 3:00 PM rush as requested!
const INITIAL_TRIPS: Trip[] = [
  {
    id: 'trip_101',
    driverId: DEMO_DRIVER.id,
    driverName: DEMO_DRIVER.name,
    driverPhone: DEMO_DRIVER.phone,
    companyName: 'سوبر جيت - مشغل معتمد بالأقصر',
    fromLocation: 'طيبة (Tuba)',
    fromLocationAr: 'بوابة مجمع كليات طيبة (جامعة الأقصر)',
    toLocation: 'الأقصر (Luxor)',
    toLocationAr: 'محطة قطارات الأقصر - الميدان الرئيسي',
    departureDate: new Date().toISOString().split('T')[0],
    departureTime: '15:15', // 3:15 PM peak rush!
    estimatedArrivalTime: '15:50',
    totalSeats: 45,
    availableSeats: 12,
    pricePerSeat: 20,
    vehicleType: 'حافلة سوبر جيت مكيفة (49 راكب)',
    vehiclePlate: 'ص ق ج 8492',
    pickupPoint: 'الموقف المخصص لأتوبيسات الجامعة أمام البوابة الرئيسية بطيبة',
    pickupPointAr: 'الموقف المخصص لأتوبيسات الجامعة أمام البوابة الرئيسية بطيبة',
    dropoffPoint: 'محطة قطار الأقصر - ميدان صلاح الدين',
    dropoffPointAr: 'محطة قطار الأقصر - ميدان صلاح الدين',
    notes: 'تحرك فوري في تمام 3:15 م بعد خروج المحاضرات. التكييف مفعل وخدمة ممتازة.',
    status: 'scheduled',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    isDemo: true
  },
  {
    id: 'trip_102',
    driverId: DEMO_DRIVER.id,
    driverName: DEMO_DRIVER.name,
    driverPhone: DEMO_DRIVER.phone,
    companyName: 'سوبر جيت - مشغل معتمد بالأقصر',
    fromLocation: 'طيبة (Tuba)',
    fromLocationAr: 'مدينة طيبة الجديدة - كليات الحاسبات والآثار والطب',
    toLocation: 'الأقصر (Luxor)',
    toLocationAr: 'ميدان أبو الحجاج وموقف العوامية',
    departureDate: new Date().toISOString().split('T')[0],
    departureTime: '15:45', // 3:45 PM
    estimatedArrivalTime: '16:20',
    totalSeats: 45,
    availableSeats: 8,
    pricePerSeat: 20,
    vehicleType: 'حافلة سوبر جيت سياحي معتمدة',
    vehiclePlate: 'ص ق ج 8492',
    pickupPoint: 'أمام مجمع المطاعم والمدينة الطلابية بطيبة',
    pickupPointAr: 'أمام مجمع المطاعم والمدينة الطلابية بطيبة',
    dropoffPoint: 'ميدان سيدي أبو الحجاج بالأقصر',
    dropoffPointAr: 'ميدان سيدي أبو الحجاج بالأقصر',
    notes: 'الرحلة الثانية بعد انتهاء المعامل والسكاشن المسائية.',
    status: 'scheduled',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    isDemo: true
  },
  {
    id: 'trip_103',
    driverId: 'usr_driver_alt',
    driverName: 'كابتن عبد الرحيم القناوي',
    driverPhone: '01055566778',
    companyName: 'شركة حافلات طيبة إكسبريس',
    fromLocation: 'طيبة (Tuba)',
    fromLocationAr: 'مجمع كليات طيبة (جامعة الأقصر)',
    toLocation: 'الكرنك (Karnak)',
    toLocationAr: 'طريق الكباش وميدان التجارة بالأقصر',
    departureDate: new Date().toISOString().split('T')[0],
    departureTime: '16:15',
    estimatedArrivalTime: '16:45',
    totalSeats: 14,
    availableSeats: 4,
    pricePerSeat: 18,
    vehicleType: 'تويوتا هاي إس مكيف سياحي (14 راكب)',
    vehiclePlate: 'ي ن ق 1582',
    pickupPoint: 'بوابة الكلية التكنولوجية بطيبة',
    pickupPointAr: 'بوابة الكلية التكنولوجية بطيبة',
    dropoffPoint: 'شارع الهيلتون - الكرنك',
    dropoffPointAr: 'شارع الهيلتون - الكرنك',
    notes: 'تحرك سريع مباشر بدون توقفات كثيرة.',
    status: 'scheduled',
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    isDemo: true
  },
  {
    id: 'trip_104',
    driverId: DEMO_DRIVER.id,
    driverName: DEMO_DRIVER.name,
    driverPhone: DEMO_DRIVER.phone,
    companyName: 'سوبر جيت - مشغل معتمد بالأقصر',
    fromLocation: 'الأقصر (Luxor)',
    fromLocationAr: 'محطة قطارات الأقصر',
    toLocation: 'طيبة (Tuba)',
    toLocationAr: 'مجمع كليات جامعة الأقصر بطيبة',
    departureDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    departureTime: '07:45', // Morning return trip
    estimatedArrivalTime: '08:20',
    totalSeats: 45,
    availableSeats: 26,
    pricePerSeat: 20,
    vehicleType: 'حافلة سوبر جيت سياحي معتمدة',
    vehiclePlate: 'ص ق ج 8492',
    pickupPoint: 'محطة قطارات الأقصر - الرصيف الخارجي',
    pickupPointAr: 'محطة قطارات الأقصر - الرصيف الخارجي',
    dropoffPoint: 'البوابة الرئيسية لمجمع طيبة',
    dropoffPointAr: 'البوابة الرئيسية لمجمع طيبة',
    notes: 'رحلة صباحية لطلاب المحاضرات الأولى في الصباح الباكر.',
    status: 'scheduled',
    createdAt: new Date().toISOString(),
    isDemo: true
  }
];

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'HU-2026-LX842',
    tripId: 'trip_101',
    studentId: DEMO_STUDENT.id,
    studentName: DEMO_STUDENT.name,
    studentPhone: DEMO_STUDENT.phone,
    seatsBooked: 2,
    totalPrice: 40,
    paymentMethod: 'cash_on_boarding',
    paymentStatus: 'unpaid',
    status: 'confirmed',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    tripDetails: {
      fromLocation: 'طيبة (Tuba)',
      fromLocationAr: 'بوابة مجمع كليات طيبة (جامعة الأقصر)',
      toLocation: 'الأقصر (Luxor)',
      toLocationAr: 'محطة قطارات الأقصر - الميدان الرئيسي',
      departureDate: new Date().toISOString().split('T')[0],
      departureTime: '15:15',
      companyName: 'سوبر جيت - مشغل معتمد بالأقصر',
      vehiclePlate: 'ص ق ج 8492',
      pickupPoint: 'الموقف المخصص لأتوبيسات الجامعة أمام البوابة الرئيسية بطيبة',
      pickupPointAr: 'الموقف المخصص لأتوبيسات الجامعة أمام البوابة الرئيسية بطيبة'
    },
    boarded: false
  }
];

const INITIAL_SETTINGS: PlatformSettings = {
  allowCashOnBoarding: true,
  allowVodafoneCash: true,
  allowInstaPay: true,
  cancellationCutoffHours: 1, // 1 hour cutoff
  serviceFeePercentage: 0, // No extra fee for students!
  emergencyPhone: '01000000001',
  supportEmail: 'support@harryup.app'
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trips, setTrips] = useState<Trip[]>(() => {
    try {
      const stored = localStorage.getItem('harryup_trips');
      if (stored) return JSON.parse(stored);
    } catch {}
    return INITIAL_TRIPS;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const stored = localStorage.getItem('harryup_bookings');
      if (stored) return JSON.parse(stored);
    } catch {}
    return INITIAL_BOOKINGS;
  });

  const [drivers, setDrivers] = useState<DriverProfile[]>(() => {
    try {
      const stored = localStorage.getItem('harryup_drivers');
      if (stored) return JSON.parse(stored);
    } catch {}
    return [DEMO_DRIVER, DEMO_PENDING_DRIVER];
  });

  const [students, setStudents] = useState<StudentProfile[]>(() => {
    try {
      const stored = localStorage.getItem('harryup_students');
      if (stored) return JSON.parse(stored);
    } catch {}
    return [DEMO_STUDENT];
  });

  const [routes, setRoutes] = useState<RouteItem[]>(() => {
    try {
      const stored = localStorage.getItem('harryup_routes');
      if (stored) return JSON.parse(stored);
    } catch {}
    return INITIAL_ROUTES;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [settings, setSettings] = useState<PlatformSettings>(() => {
    try {
      const stored = localStorage.getItem('harryup_settings');
      if (stored) return JSON.parse(stored);
    } catch {}
    return INITIAL_SETTINGS;
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('harryup_trips', JSON.stringify(trips));
  }, [trips]);

  useEffect(() => {
    localStorage.setItem('harryup_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('harryup_drivers', JSON.stringify(drivers));
  }, [drivers]);

  useEffect(() => {
    localStorage.setItem('harryup_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('harryup_routes', JSON.stringify(routes));
  }, [routes]);

  useEffect(() => {
    localStorage.setItem('harryup_settings', JSON.stringify(settings));
  }, [settings]);

  // Create Trip
  const createTrip = (tripData: Omit<Trip, 'id' | 'createdAt' | 'status' | 'availableSeats'>) => {
    const newTrip: Trip = {
      ...tripData,
      id: `trip_${Date.now()}`,
      availableSeats: tripData.totalSeats,
      status: 'scheduled',
      createdAt: new Date().toISOString(),
      isDemo: false
    };

    setTrips(prev => [newTrip, ...prev]);
    return { success: true };
  };

  // Update Trip status
  const updateTripStatus = (tripId: string, status: TripStatus) => {
    setTrips(prev => prev.map(t => t.id === tripId ? { ...t, status } : t));
  };

  // Cancel Trip
  const cancelTrip = (tripId: string) => {
    setTrips(prev => prev.map(t => t.id === tripId ? { ...t, status: 'cancelled' } : t));
    // Auto-cancel related bookings
    setBookings(prev => prev.map(b => b.tripId === tripId ? { ...b, status: 'cancelled' } : b));
  };

  // Create Booking with transactional seat decrement and check
  const createBooking = (params: {
    tripId: string;
    studentId: string;
    studentName: string;
    studentPhone: string;
    seatsBooked: number;
    paymentMethod: PaymentMethod;
  }) => {
    const trip = trips.find(t => t.id === params.tripId);
    if (!trip) {
      return { success: false, error: 'الرحلة المطلوبة غير موجودة' };
    }

    // Validate seat booking
    const validation = validateSeatBooking(params.seatsBooked, trip.availableSeats);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    const bookingId = generateBookingReference('HU');
    const totalPrice = params.seatsBooked * trip.pricePerSeat;

    const newBooking: Booking = {
      id: bookingId,
      tripId: trip.id,
      studentId: params.studentId,
      studentName: params.studentName,
      studentPhone: params.studentPhone,
      seatsBooked: params.seatsBooked,
      totalPrice,
      paymentMethod: params.paymentMethod,
      paymentStatus: params.paymentMethod === 'cash_on_boarding' ? 'unpaid' : 'paid',
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      tripDetails: {
        fromLocation: trip.fromLocation,
        fromLocationAr: trip.fromLocationAr,
        toLocation: trip.toLocation,
        toLocationAr: trip.toLocationAr,
        departureDate: trip.departureDate,
        departureTime: trip.departureTime,
        companyName: trip.companyName,
        vehiclePlate: trip.vehiclePlate,
        pickupPoint: trip.pickupPoint,
        pickupPointAr: trip.pickupPointAr
      },
      boarded: false
    };

    // Safely update available seats
    setTrips(prev =>
      prev.map(t => {
        if (t.id === trip.id) {
          const remaining = Math.max(0, t.availableSeats - params.seatsBooked);
          return { ...t, availableSeats: remaining };
        }
        return t;
      })
    );

    setBookings(prev => [newBooking, ...prev]);

    return { success: true, booking: newBooking };
  };

  // Cancel Booking and safely restore seats
  const cancelBooking = (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) {
      return { success: false, error: 'الحجز غير موجود' };
    }
    if (booking.status === 'cancelled') {
      return { success: false, error: 'الحجز ملغى بالفعل' };
    }

    // Restore available seats on the trip
    setTrips(prev =>
      prev.map(t => {
        if (t.id === booking.tripId) {
          const restored = Math.min(t.totalSeats, t.availableSeats + booking.seatsBooked);
          return { ...t, availableSeats: restored };
        }
        return t;
      })
    );

    // Update booking status
    setBookings(prev =>
      prev.map(b => (b.id === bookingId ? { ...b, status: 'cancelled' } : b))
    );

    return { success: true };
  };

  // Mark Passenger Boarded
  const markPassengerBoarded = (bookingId: string, boarded: boolean) => {
    setBookings(prev =>
      prev.map(b => (b.id === bookingId ? { ...b, boarded } : b))
    );
  };

  // Admin: Update driver status
  const updateDriverStatus = (driverId: string, status: DriverStatus, notes?: string) => {
    setDrivers(prev =>
      prev.map(d => (d.id === driverId ? { ...d, verificationStatus: status, verificationNotes: notes } : d))
    );
  };

  // Admin: Toggle route active
  const toggleRouteActive = (routeId: string) => {
    setRoutes(prev =>
      prev.map(r => (r.id === routeId ? { ...r, active: !r.active } : r))
    );
  };

  // Admin: Update settings
  const updateSettings = (newSettings: Partial<PlatformSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Reset seed
  const resetToDemoSeed = () => {
    setTrips(INITIAL_TRIPS);
    setBookings(INITIAL_BOOKINGS);
    setDrivers([DEMO_DRIVER, DEMO_PENDING_DRIVER]);
    setStudents([DEMO_STUDENT]);
    setRoutes(INITIAL_ROUTES);
    setSettings(INITIAL_SETTINGS);
    localStorage.removeItem('harryup_trips');
    localStorage.removeItem('harryup_bookings');
    localStorage.removeItem('harryup_drivers');
    localStorage.removeItem('harryup_students');
    localStorage.removeItem('harryup_routes');
    localStorage.removeItem('harryup_settings');
  };

  return (
    <DataContext.Provider
      value={{
        trips,
        bookings,
        drivers,
        students,
        routes,
        notifications,
        settings,
        createTrip,
        updateTripStatus,
        cancelTrip,
        createBooking,
        cancelBooking,
        markPassengerBoarded,
        updateDriverStatus,
        toggleRouteActive,
        updateSettings,
        resetToDemoSeed
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
