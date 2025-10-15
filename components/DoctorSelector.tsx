"use client";

import React from 'react';
import appointmentService from '../services/appointmentService';
import { Doctor } from '../types';

interface Props {
  value?: string;
  onChange: (id: string) => void;
}

export function DoctorSelector({ value, onChange }: Props) {
  const doctors = appointmentService.getAllDoctors();

  return (
    <div className="relative w-full">
      <select 
        id="doctor"
        value={value} 
        onChange={e => onChange(e.target.value)} 
        className="w-full appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md pl-3 pr-10 py-2 text-left text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
      >
        <option value="">-- Select a doctor --</option>
        {doctors.map((d: Doctor) => (
          <option key={d.id} value={d.id}>
            {d.name} — {d.specialty}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
      </div>
    </div>
  );
}

export default DoctorSelector;
