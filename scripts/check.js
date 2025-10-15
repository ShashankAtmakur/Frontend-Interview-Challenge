// Simple runtime checks for TimeSlot overlaps and AppointmentService filters
const { TimeSlot } = require('../domain/TimeSlot');
const appointmentService = require('../services/appointmentService');

function assert(cond, msg) {
  if (!cond) {
    console.error('FAILED:', msg);
    process.exit(1);
  }
}

// TimeSlot overlap test
const aStart = new Date(2025, 9, 15, 9, 0);
const aEnd = new Date(2025, 9, 15, 10, 0);
const bStart = new Date(2025, 9, 15, 9, 30);
const bEnd = new Date(2025, 9, 15, 9, 45);
const slotA = new TimeSlot(aStart, aEnd);
const slotB = new TimeSlot(bStart, bEnd);
assert(slotA.overlaps(slotB), 'TimeSlot overlap should be true for overlapping intervals');

// AppointmentService filter test (day)
const doctorId = appointmentService.getAllDoctors()[0].id;
const appts = appointmentService.getAppointmentsByDoctor(doctorId);
assert(Array.isArray(appts), 'getAppointmentsByDoctor should return array');

console.log('All checks passed');
