import { useEffect, useMemo, useState } from 'react';
import appointmentService from '../services/appointmentService';
import { Appointment, Doctor } from '../types';
import { generateTimeSlots } from '../domain/TimeSlot';
import { startOfWeek, addDays } from 'date-fns';

interface UseAppointmentsParams {
  doctorId?: string;
  date: Date;
  startDate?: Date;
  endDate?: Date;
  view: 'day' | 'week';
}

interface UseAppointmentsReturn {
  appointments: Appointment[];
  doctor?: Doctor;
  loading: boolean;
  error: string | null;
  timeSlots: Array<{ start: Date; end: Date }>;
}

export function useAppointments({ doctorId, date, startDate, endDate, view }: UseAppointmentsParams): UseAppointmentsReturn {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const doctor = useMemo(() => {
    if (!doctorId) return undefined;
    return appointmentService.getDoctorById(doctorId);
  }, [doctorId]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    try {
      if (!doctorId) {
        setAppointments([]);
        setLoading(false);
        return;
      }

      let data: Appointment[] = [];
      if (view === 'day') {
        data = appointmentService.getAppointmentsByDoctorAndDate(doctorId, date);
      } else {
        const weekBase = startDate || startOfWeek(date, { weekStartsOn: 1 });
        const weekStart = startOfWeek(weekBase, { weekStartsOn: 1 });
        const weekEnd = addDays(weekStart, 6);
        data = appointmentService.getAppointmentsByDoctorAndDateRange(doctorId, weekStart, weekEnd);
      }
      setAppointments(data);
    } catch (e) {
      setError((e as Error).message);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }, [doctorId, date, startDate, endDate, view]);

  const timeSlots = useMemo(() => {
    // time slots are per-day rows; generate for the provided date
    const slots = generateTimeSlots(date, 'day');
    return slots.map(s => ({ start: s.start, end: s.end }));
  }, [date]);

  return { appointments, doctor, loading, error, timeSlots };
}

export default useAppointments;
