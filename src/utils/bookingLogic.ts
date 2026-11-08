/**
 * Pure booking, seat validation, and Egyptian pricing logic
 */

export function calculateAvailableSeats(totalSeats: number, bookedSeats: number): number {
  if (totalSeats < 0) return 0;
  const remaining = totalSeats - Math.max(0, bookedSeats);
  return Math.max(0, remaining);
}

export function validateSeatBooking(requestedSeats: number, availableSeats: number): { valid: boolean; error?: string } {
  if (!Number.isInteger(requestedSeats) || requestedSeats <= 0) {
    return { valid: false, error: 'Seats must be at least 1' };
  }
  if (requestedSeats > 10) {
    return { valid: false, error: 'Maximum 10 seats per booking for students' };
  }
  if (requestedSeats > availableSeats) {
    return { valid: false, error: `Only ${availableSeats} seat(s) available` };
  }
  return { valid: true };
}

export function calculateTotalPrice(
  seats: number,
  pricePerSeat: number,
  serviceFeePercentage: number = 0
): { basePrice: number; fee: number; total: number } {
  const basePrice = Math.max(0, seats) * Math.max(0, pricePerSeat);
  const fee = Math.round((basePrice * Math.max(0, serviceFeePercentage)) / 100);
  const total = basePrice + fee;
  return { basePrice, fee, total };
}

export function generateBookingReference(prefix: string = 'HU'): string {
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  const numPart = Math.floor(100 + Math.random() * 900);
  return `${prefix}-${numPart}-${randomPart}`;
}

/**
 * Checks whether a booking can be cancelled based on departure time and policy cutoff
 */
export function isCancellationAllowed(
  departureDate: string,
  departureTime: string,
  cutoffHours: number = 1,
  currentTimestampMs: number = Date.now()
): boolean {
  try {
    const [hours, minutes] = departureTime.split(':').map(Number);
    const [year, month, day] = departureDate.split('-').map(Number);
    const departureDateObj = new Date(year, month - 1, day, hours, minutes, 0);

    const diffHours = (departureDateObj.getTime() - currentTimestampMs) / (1000 * 60 * 60);
    return diffHours >= cutoffHours;
  } catch {
    return false;
  }
}

export function formatEgyptianPrice(amount: number, lang: 'ar' | 'en' = 'ar'): string {
  if (lang === 'ar') {
    return `${amount} ج.م`;
  }
  return `${amount} EGP`;
}

export function formatEgyptianTime(time24: string, lang: 'ar' | 'en' = 'ar'): string {
  if (!time24 || !time24.includes(':')) return time24;
  const [hStr, mStr] = time24.split(':');
  const h = parseInt(hStr, 10);
  const m = mStr.padStart(2, '0');
  
  if (isNaN(h)) return time24;
  
  const period = h >= 12 ? (lang === 'ar' ? 'م' : 'PM') : (lang === 'ar' ? 'ص' : 'AM');
  const hour12 = h % 12 === 0 ? 12 : h % 12;

  return `${hour12}:${m} ${period}`;
}
