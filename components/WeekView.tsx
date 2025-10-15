/**
 * WeekView Component
 *
 * Renders a Monday-Sunday grid with 30-minute time slots and appointment cards.
 */

'use client';

import React from 'react';
import { useAppointments } from '../hooks/useAppointments';
import { addDays, format, startOfWeek, startOfDay, endOfDay, isSameDay } from 'date-fns';
import appointmentService from '../services/appointmentService';
import { AppointmentCard } from './ui/AppointmentCard';
import { arrangeAppointments } from '../utils/appointmentUtils';
import { Appointment } from '../types';

interface WeekViewProps {
  doctorId: string;
  weekStart: Date;
  timeFormat?: '12' | '24';
}

export function WeekView({ doctorId, weekStart, timeFormat = '24' }: WeekViewProps) {
  const SLOT_HEIGHT = 40; // px, keep consistent with DayView
  const SLOT_DURATION = 30; // minutes

  const start = startOfWeek(weekStart, { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));
  const weekEnd = addDays(start, 6);

  const { appointments, timeSlots, loading } = useAppointments({
    doctorId,
    date: start,
    startDate: start,
    endDate: weekEnd,
    view: 'week',
  });

  if (loading) return <div className="p-4 dark:text-gray-300">Loading...</div>;

  const SLOT_PADDING_BOTTOM = 1;
  const containerHeight = (timeSlots.length + SLOT_PADDING_BOTTOM) * SLOT_HEIGHT;
  const endOfCalendar = new Date(start);
  endOfCalendar.setHours(18, 0, 0, 0);

  function minutesFromStart(dt: Date) {
    const d = new Date(dt);
    return (d.getHours() - 8) * 60 + d.getMinutes();
  }

  return (
    <div className="week-view">
      <div className="grid grid-cols-8 gap-2 items-center mb-2">
        <div className="col-span-1" />
        {days.map(day => (
          <div key={day.toDateString()} className="text-center font-medium dark:text-gray-300">
            {format(day, 'EEE dd')}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-8">
        {/* left time labels - absolute positioned */}
        <div className="col-span-1 relative border-r border-gray-200 dark:border-gray-700 pr-2" style={{ height: containerHeight }}>
          {timeSlots.map((slot, idx) => (
            <div key={slot.start.toISOString()} className="text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 flex items-center justify-end pr-2" style={{ position: 'absolute', left: 0, right: 0, top: `${idx * SLOT_HEIGHT}px`, height: SLOT_HEIGHT }}>
              {slot.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: timeFormat === '12' })}
            </div>
          ))}
          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-end pr-2" style={{ position: 'absolute', left: 0, right: 0, top: `${timeSlots.length * SLOT_HEIGHT}px`, height: SLOT_HEIGHT }}>
            {endOfCalendar.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: timeFormat === '12' })}
          </div>
        </div>

        {/* days columns */}
        <div className="col-span-7">
          <div className="grid grid-cols-7">
            {days.map(day => {
              const today = new Date();
              const isToday = isSameDay(day, today);

              const dayAppointments = appointments.filter(apt => {
                const aptStart = new Date(apt.startTime);
                const dayStart = startOfDay(day);
                return aptStart >= dayStart && aptStart < endOfDay(day);
              });

              const arrangedAppointments = arrangeAppointments(dayAppointments as Appointment[], minutesFromStart, SLOT_HEIGHT, SLOT_DURATION);

              return (
                <div key={day.toDateString()} className={`relative border-l dark:border-gray-700 ${isToday ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`} style={{ height: containerHeight }}>
                  {/* grid rows */}
                  {timeSlots.map((slot, idx) => (
                    <div key={slot.start.toISOString()} className="h-10 border-b dark:border-gray-700" style={{ position: 'absolute', left: 0, right: 0, top: `${idx * SLOT_HEIGHT}px` }} />
                  ))}
                  <div className="h-10 border-b dark:border-gray-700" style={{ position: 'absolute', left: 0, right: 0, top: `${timeSlots.length * SLOT_HEIGHT}px` }} />

                  {/* current time indicator for today's column */}
                  {isToday && (() => {
                    const minutesNow = (today.getHours() - 8) * 60 + today.getMinutes();
                    const top = Math.round((minutesNow / 30) * SLOT_HEIGHT);
                    if (top >= 0 && top <= containerHeight) {
                      return (
                        <div key={`now-${day.toDateString()}`} style={{ position: 'absolute', left: 0, right: 0, top: `${top}px` }}>
                          <div className="h-0.5 bg-currentTime-light dark:bg-currentTime-dark" />
                        </div>
                      );
                    }
                    return null;
                  })()}

                  {/* appointments for this day - position absolutely */}
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
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
