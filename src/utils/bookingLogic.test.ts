import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateAvailableSeats,
  validateSeatBooking,
  calculateTotalPrice,
  generateBookingReference,
  isCancellationAllowed,
  formatEgyptianPrice,
  formatEgyptianTime
} from './bookingLogic';

test('calculateAvailableSeats never returns negative numbers', () => {
  assert.equal(calculateAvailableSeats(14, 4), 10);
  assert.equal(calculateAvailableSeats(14, 14), 0);
  assert.equal(calculateAvailableSeats(14, 18), 0);
  assert.equal(calculateAvailableSeats(-5, 0), 0);
});

test('validateSeatBooking validates positive integer count within available limits', () => {
  const valid = validateSeatBooking(2, 5);
  assert.equal(valid.valid, true);

  const zeroSeats = validateSeatBooking(0, 5);
  assert.equal(zeroSeats.valid, false);

  const tooManySeats = validateSeatBooking(6, 5);
  assert.equal(tooManySeats.valid, false);

  const exceedsMaxStudentCap = validateSeatBooking(12, 20);
  assert.equal(exceedsMaxStudentCap.valid, false);
});

test('calculateTotalPrice computes base fare, service fee, and total accurately', () => {
  const resNoFee = calculateTotalPrice(2, 25, 0);
  assert.equal(resNoFee.basePrice, 50);
  assert.equal(resNoFee.fee, 0);
  assert.equal(resNoFee.total, 50);

  const resWithFee = calculateTotalPrice(2, 100, 5); // 5% fee on 200 = 10
  assert.equal(resWithFee.basePrice, 200);
  assert.equal(resWithFee.fee, 10);
  assert.equal(resWithFee.total, 210);
});

test('generateBookingReference formats with proper HU- prefix', () => {
  const ref = generateBookingReference();
  assert.match(ref, /^HU-\d{3}-[A-Z0-9]+$/);
});

test('isCancellationAllowed respects cutoff threshold', () => {
  // Base test with fixed timestamp
  const now = new Date('2026-11-08T12:00:00Z').getTime();
  
  // Trip in 3 hours -> allowed when cutoff is 1 hour
  const allowed = isCancellationAllowed('2026-11-08', '15:00', 1, now);
  // Trip in 30 minutes -> blocked when cutoff is 1 hour
  const blocked = isCancellationAllowed('2026-11-08', '12:30', 1, now);

  assert.equal(allowed, true);
  assert.equal(blocked, false);
});

test('formatEgyptianPrice and formatEgyptianTime format bilingual strings correctly', () => {
  assert.equal(formatEgyptianPrice(35, 'ar'), '35 ج.م');
  assert.equal(formatEgyptianPrice(35, 'en'), '35 EGP');

  assert.equal(formatEgyptianTime('15:30', 'ar'), '3:30 م');
  assert.equal(formatEgyptianTime('15:30', 'en'), '3:30 PM');
  assert.equal(formatEgyptianTime('09:15', 'en'), '9:15 AM');
});
