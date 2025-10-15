export class TimeSlot {
  constructor(public start: Date, public end: Date) {}

  overlaps(other: TimeSlot): boolean {
    return this.start < other.end && this.end > other.start;
  }
}

export function generateTimeSlots(date: Date, view: 'day' | 'week') {
  const slots: TimeSlot[] = [];
  if (view === 'day') {
    for (let hour = 8; hour < 18; hour++) {
      for (let minute of [0, 30]) {
        const start = new Date(date);
        start.setHours(hour, minute, 0, 0);
        const end = new Date(start);
        end.setMinutes(start.getMinutes() + 30);
        slots.push(new TimeSlot(start, end));
      }
    }
  }
  // For week view, you can generate slots for each day in the week if needed
  return slots;
}