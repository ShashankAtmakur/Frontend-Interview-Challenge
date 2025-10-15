/**
 * Schedule Page
 *
 * Main page for the appointment scheduler.
 * This is where candidates will implement the calendar views.
 *
 * TODO for candidates:
 * 1. Import and use the ScheduleView component
 * 2. Set up state for selected doctor and date
 * 3. Handle view switching (day/week)
 */

'use client';

import { ScheduleView } from '@/components/ScheduleView';

export default function SchedulePage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Appointment Schedule</h1>
            <p className="text-gray-600 dark:text-gray-300">View and manage doctor appointments</p>
          </div>
        </header>

        <ScheduleView />
      </div>
    </main>
  );
}
