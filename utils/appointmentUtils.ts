
import { Appointment } from '../types';

export interface ArrangedAppointment {
  appointment: Appointment;
  width: number;
  left: number;
  top: number;
  height: number;
}

// Function to calculate overlapping groups of appointments
function getOverlappingGroups(appointments: Appointment[]): Appointment[][] {
  if (appointments.length === 0) {
    return [];
  }

  const sortedAppointments = [...appointments].sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  const groups: Appointment[][] = [];
  let currentGroup: Appointment[] = [sortedAppointments[0]];

  for (let i = 1; i < sortedAppointments.length; i++) {
    const currentAppt = sortedAppointments[i];
    const lastApptInGroup = currentGroup[currentGroup.length - 1];

    if (new Date(currentAppt.startTime) < new Date(lastApptInGroup.endTime)) {
      currentGroup.push(currentAppt);
    } else {
      groups.push(currentGroup);
      currentGroup = [currentAppt];
    }
  }
  groups.push(currentGroup);
  return groups;
}

export const arrangeAppointments = (
  appointments: Appointment[],
  minutesFromStart: (date: Date) => number,
  slotHeight: number,
  slotDuration: number
): ArrangedAppointment[] => {
  const arranged: ArrangedAppointment[] = [];
  const groups = getOverlappingGroups(appointments);

  groups.forEach(group => {
    const columns: Appointment[][] = [];
    group.forEach(appointment => {
      let placed = false;
      for (const column of columns) {
        const lastInColumn = column[column.length - 1];
        if (new Date(appointment.startTime) >= new Date(lastInColumn.endTime)) {
          column.push(appointment);
          placed = true;
          break;
        }
      }
      if (!placed) {
        columns.push([appointment]);
      }
    });

    const groupWidth = 100 / columns.length;

    columns.forEach((column, colIndex) => {
      column.forEach(appointment => {
        const aptStart = new Date(appointment.startTime);
        const aptEnd = new Date(appointment.endTime);
        const topSlots = minutesFromStart(aptStart) / slotDuration;
        const heightSlots = (aptEnd.getTime() - aptStart.getTime()) / (1000 * 60 * slotDuration);
        
        arranged.push({
          appointment,
          width: groupWidth,
          left: colIndex * groupWidth,
          top: Math.max(0, Math.round(topSlots * slotHeight)),
          height: Math.max(28, Math.round(heightSlots * slotHeight)) + slotHeight,
        });
      });
    });
  });

  return arranged;
};
