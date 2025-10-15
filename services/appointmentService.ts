import {
  MOCK_DOCTORS,
  MOCK_APPOINTMENTS,
  MOCK_PATIENTS,
  getDoctorById as dataGetDoctorById,
  getPatientById as dataGetPatientById,
  getAppointmentsByDoctorAndDate as dataGetAppointmentsByDoctorAndDate,
  getAppointmentsByDoctorAndDateRange as dataGetAppointmentsByDoctorAndDateRange,
} from '../data/mockData';

import type { Appointment, Doctor, Patient, PopulatedAppointment } from '../types';

class AppointmentServiceClass {
  getAllDoctors(): Doctor[] {
    return MOCK_DOCTORS;
  }

  getDoctorById(id: string): Doctor | undefined {
    return dataGetDoctorById(id);
  }

  getPatientById(id: string): Patient | undefined {
    return dataGetPatientById(id);
  }

  getAppointmentsByDoctor(doctorId: string): Appointment[] {
    return MOCK_APPOINTMENTS.filter(a => a.doctorId === doctorId);
  }

  getAppointmentsByDoctorAndDate(doctorId: string, date: Date): Appointment[] {
    return dataGetAppointmentsByDoctorAndDate(doctorId, date);
  }

  getAppointmentsByDoctorAndDateRange(doctorId: string, startDate: Date, endDate: Date): Appointment[] {
    return dataGetAppointmentsByDoctorAndDateRange(doctorId, startDate, endDate);
  }

  getPopulatedAppointment(appointment: Appointment): PopulatedAppointment | null {
    const patient = this.getPatientById(appointment.patientId);
    const doctor = this.getDoctorById(appointment.doctorId);
    if (!patient || !doctor) return null;
    return { ...appointment, patient, doctor } as PopulatedAppointment;
  }
}

export const appointmentService = new AppointmentServiceClass();

export default appointmentService;
