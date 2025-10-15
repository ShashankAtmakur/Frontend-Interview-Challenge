/**
 * DayView Component
 *
 * Displays appointments for a single day in a timeline format.
 */

"use client";

import React from 'react';
import { useAppointments } from '../hooks/useAppointments';
import { appointmentService } from '../services/appointmentService';
import { AppointmentCard } from './ui/AppointmentCard';
import { arrangeAppointments } from '../utils/appointmentUtils';
import { Appointment } from '../types';

interface DayViewProps {
  doctorId: string;
  date: Date;
  timeFormat?: '12' | '24';
}

export function DayView({ doctorId, date, timeFormat = '24' }: DayViewProps) {
  const { appointments, timeSlots, loading } = useAppointments({ doctorId, date, view: 'day' });
  const doctor = appointmentService.getDoctorById(doctorId);

  if (loading) return <div className="p-4 dark:text-gray-300">Loading...</div>;

  const hasAppointments = appointments && appointments.length > 0;
  const weekday = date.toLocaleDateString(undefined, { weekday: 'long' }).toLowerCase();
  const working = doctor?.workingHours?.[weekday as keyof typeof doctor.workingHours];
  const calendarStartHour = 8;
  const calendarEndHour = 18;

  function minutesFromStart(dt: Date) {
    const d = new Date(dt);
    return (d.getHours() - calendarStartHour) * 60 + d.getMinutes();
  }

  const SLOT_HEIGHT = 40; // px
  const SLOT_DURATION = 30; // minutes
  const SLOT_PADDING_BOTTOM = 1;
  const containerHeight = (timeSlots.length + SLOT_PADDING_BOTTOM) * SLOT_HEIGHT;
  const endOfCalendar = new Date(date);
  endOfCalendar.setHours(calendarEndHour, 0, 0, 0);
  const today = new Date();
  const isToday = today.toDateString() === date.toDateString();

  let currentTop: number | null = null;
  if (isToday) {
    const minutesNow = (today.getHours() - calendarStartHour) * 60 + today.getMinutes();
    currentTop = Math.round((minutesNow / SLOT_DURATION) * SLOT_HEIGHT);
  }

  const arrangedAppointments = arrangeAppointments(appointments as Appointment[], minutesFromStart, SLOT_HEIGHT, SLOT_DURATION);

  return (
    <div className="grid grid-cols-12 gap-4">
      {!hasAppointments && (
        <div className="col-span-12 p-4 text-center text-gray-600 dark:text-gray-400">
          <div className="text-lg font-medium mb-2">No appointments for {doctor?.name ?? 'this doctor'} on {date.toLocaleDateString()}</div>
          {working ? (
            <div className="text-sm">Working hours: {working.start} - {working.end}</div>
          ) : (
            <div className="text-sm">Not working on this day</div>
          )}
        </div>
      )}
      <div className="col-span-2 relative border-r border-gray-200 dark:border-gray-700 pr-2" style={{ height: containerHeight }}>
        {timeSlots.map((slot, idx) => (
          <div
            key={slot.start.toISOString()}
            className="text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 flex items-center justify-end pr-2"
            style={{ position: 'absolute', left: 0, right: 0, top: `${idx * SLOT_HEIGHT}px`, height: SLOT_HEIGHT }}
          >
            {slot.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: timeFormat === '12' })}
          </div>
        ))}
        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-end pr-2" style={{ position: 'absolute', left: 0, right: 0, top: `${timeSlots.length * SLOT_HEIGHT}px`, height: SLOT_HEIGHT }}>
          {endOfCalendar.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: timeFormat === '12' })}
        </div>
      </div>

      <div className="col-span-10">
        <div className="relative border rounded-md dark:border-gray-700" style={{ height: containerHeight }}>
          {timeSlots.map((slot, idx) => (
            <div
              key={slot.start.toISOString()}
              className="h-10 border-b dark:border-gray-700"
              style={{ position: 'absolute', left: 0, right: 0, top: `${idx * SLOT_HEIGHT}px` }}
            />
          ))}
          <div className="h-10 border-b dark:border-gray-700" style={{ position: 'absolute', left: 0, right: 0, top: `${timeSlots.length * SLOT_HEIGHT}px` }} />

          <div className="absolute inset-0 z-10">
            {isToday && currentTop !== null && currentTop >= 0 && currentTop <= containerHeight && (
              <div style={{ position: 'absolute', left: 0, right: 0, top: `${currentTop}px` }}>
                <div className="h-0.5 bg-currentTime-light dark:bg-currentTime-dark" />
              </div>
            )}
            {arrangedAppointments.map(({ appointment: apt, width, left, top, height }) => {
              const populated = appointmentService.getPopulatedAppointment(apt) as any;
              const patientName = populated?.patient?.name ?? 'Unknown';
              const doctorName = populated?.doctor?.name ?? 'Unknown';

              return (
                <div
                  key={apt.id}
                  style={{
                    position: 'absolute',
                    left: `${left}%`,
                    width: `${width}%`,
                    top: `${top}px`,
                    height: `${height}px`,
                    padding: '0 2px',
                    boxSizing: 'border-box',
                  }}
                >
                  <AppointmentCard
                    patientName={patientName}
                    doctorName={doctorName}
                    type={apt.type}
                    start={apt.startTime}
                    end={apt.endTime}
                    timeFormat={timeFormat}
                    height={height}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

