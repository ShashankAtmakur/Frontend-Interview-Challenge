/**
 * ScheduleView Component
 *
 * Main component that orchestrates the schedule display.
 */

'use client';

import React, { useState } from 'react';
import { startOfDay, startOfWeek, format, parse } from 'date-fns';
import DoctorSelector from './DoctorSelector';
import { DayView } from './DayView';
import { WeekView } from './WeekView';
import { appointmentService } from '../services/appointmentService';
import { useTheme } from './ThemeProvider';
import { ChevronLeft, ChevronRight, Sun, Moon } from './icons';

export function ScheduleView() {
  const doctors = appointmentService.getAllDoctors();
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(doctors[0]?.id ?? '');
  const [view, setView] = useState<'day' | 'week'>('day');
  const [date, setDate] = useState(new Date());
  const [timeFormat, setTimeFormat] = useState<'12' | '24'>('24');
  const { theme, toggleTheme } = useTheme();

  // navigation helpers
  const goPrev = React.useCallback(() => setDate(d => {
    const delta = view === 'day' ? 1 : 7;
    const nd = new Date(d);
    nd.setDate(nd.getDate() - delta);
    return nd;
  }), [view]);
  const goNext = React.useCallback(() => setDate(d => {
    const delta = view === 'day' ? 1 : 7;
    const nd = new Date(d);
    nd.setDate(nd.getDate() + delta);
    return nd;
  }), [view]);
  const goToday = React.useCallback(() => {
    const now = new Date();
    const localStart = startOfDay(now);
    if (view === 'week') {
      const weekStart = startOfWeek(localStart, { weekStartsOn: 1 });
      setDate(weekStart);
    } else {
      setDate(localStart);
    }
  }, [view]);

  // keyboard shortcuts: left/right for prev/next, 't' for today
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
      if (e.key.toLowerCase() === 't') goToday();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [view, goPrev, goNext, goToday]);

  const selectedDoctor = appointmentService.getDoctorById(selectedDoctorId);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <header className="border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-48">
              <DoctorSelector value={selectedDoctorId} onChange={setSelectedDoctorId} />
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-gray-100 dark:bg-gray-700 p-1">
              <button 
                className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600" 
                onClick={goPrev} 
                aria-label="Previous"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </button>
              <button 
                className="px-4 py-2 text-sm font-semibold rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
                onClick={goToday} 
                aria-label="Today"
              >
                Today
              </button>
              <button 
                className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600" 
                onClick={goNext} 
                aria-label="Next"
              >
                <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
            {view === 'day' && (
              <input
                type="date"
                value={format(date, 'yyyy-MM-dd')}
                onChange={(e) => {
                  const parsed = parse(e.target.value, 'yyyy-MM-dd', new Date());
                  setDate(startOfDay(parsed));
                }}
                className="px-3 py-2 border rounded-md bg-white dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
              />
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 rounded-lg bg-secondary p-1">
              <button
                className={`px-3 py-1 text-sm rounded-md ${view === 'day' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
                onClick={() => setView('day')}
              >
                Day
              </button>
              <button
                className={`px-3 py-1 text-sm rounded-md ${view === 'week' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
                onClick={() => setView('week')}
              >
                Week
              </button>
            </div>
            <div className="flex items-center gap-1 rounded-lg bg-secondary p-1">
              <button
                className={`px-3 py-1 text-sm rounded-md ${timeFormat === '12' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
                onClick={() => setTimeFormat('12')}
                aria-pressed={timeFormat === '12'}
              >
                12h
              </button>
              <button
                className={`px-3 py-1 text-sm rounded-md ${timeFormat === '24' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
                onClick={() => setTimeFormat('24')}
                aria-pressed={timeFormat === '24'}
              >
                24h
              </button>
            </div>

          </div>
        </div>
      </header>
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">{selectedDoctor?.name ?? 'Select a doctor'}</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{selectedDoctor?.specialty}</p>
        {selectedDoctorId ? (
          view === 'day' ? (
            <DayView doctorId={selectedDoctorId} date={date} timeFormat={timeFormat} />
          ) : (
            <WeekView doctorId={selectedDoctorId} weekStart={date} timeFormat={timeFormat} />
          )
        ) : (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">Please select a doctor to see their schedule.</div>
        )}
      </div>
    </div>
  );
}
