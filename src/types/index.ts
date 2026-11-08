export type Language = 'ar' | 'en';

export type UserRole = 'student' | 'driver' | 'admin';

export type DriverStatus = 'pending_verification' | 'approved' | 'rejected' | 'suspended';

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export type TripStatus = 'scheduled' | 'boarding' | 'in_transit' | 'completed' | 'cancelled';

export type PaymentMethod = 'cash_on_boarding' | 'vodafone_cash' | 'instapay' | 'credit_card';

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
}

export interface StudentProfile extends User {
  role: 'student';
  university: string;
  faculty?: string;
  studentIdNumber?: string;
}

export interface DriverProfile extends User {
  role: 'driver';
  companyName: string; // e.g. "SuperJet Authorized Operator", "Luxor Express"
  driverRole: 'independent' | 'fleet_driver' | 'fleet_owner';
  vehicleType: string; // e.g. "SuperJet Coach (49 Seats)", "HiAce Microbus (14 Seats)"
  vehiclePlate: string;
  licenseNumber: string;
  verificationStatus: DriverStatus;
  verificationNotes?: string;
  rating?: number;
  totalTripsCompleted?: number;
}

export interface RouteItem {
  id: string;
  fromCity: string;
  fromNameAr: string;
  fromNameEn: string;
  toCity: string;
  toNameAr: string;
  toNameEn: string;
  estimatedDuration: string; // e.g. "35 mins"
  basePrice: number; // in EGP
  popular: boolean;
  active: boolean;
}

export interface Trip {
  id: string;
  driverId: string;
  driverName: string;
  driverPhone: string;
  companyName: string;
  fromLocation: string;
  fromLocationAr: string;
  toLocation: string;
  toLocationAr: string;
  departureDate: string; // YYYY-MM-DD
  departureTime: string; // HH:MM (Egyptian Time 24h)
  estimatedArrivalTime: string;
  totalSeats: number;
  availableSeats: number;
  pricePerSeat: number; // EGP
  vehicleType: string;
  vehiclePlate: string;
  pickupPoint: string;
  pickupPointAr: string;
  dropoffPoint: string;
  dropoffPointAr: string;
  notes?: string;
  status: TripStatus;
  createdAt: string;
  isDemo?: boolean;
}

export interface Booking {
  id: string; // e.g. "HU-2026-LX102"
  tripId: string;
  studentId: string;
  studentName: string;
  studentPhone: string;
  seatsBooked: number;
  seatNumbers?: number[];
  totalPrice: number; // EGP
  paymentMethod: PaymentMethod;
  paymentStatus: 'unpaid' | 'paid';
  status: BookingStatus;
  createdAt: string;
  tripDetails: {
    fromLocation: string;
    fromLocationAr: string;
    toLocation: string;
    toLocationAr: string;
    departureDate: string;
    departureTime: string;
    companyName: string;
    vehiclePlate: string;
    pickupPoint: string;
    pickupPointAr: string;
  };
  boarded?: boolean;
}

export interface NotificationItem {
  id: string;
  userId: string;
  titleAr: string;
  titleEn: string;
  messageAr: string;
  messageEn: string;
  timestamp: string;
  read: boolean;
  type: 'booking' | 'trip' | 'account' | 'system';
}

export interface PlatformSettings {
  allowCashOnBoarding: boolean;
  allowVodafoneCash: boolean;
  allowInstaPay: boolean;
  cancellationCutoffHours: number; // e.g. 1 hour before departure
  serviceFeePercentage: number;
  emergencyPhone: string;
  supportEmail: string;
}
