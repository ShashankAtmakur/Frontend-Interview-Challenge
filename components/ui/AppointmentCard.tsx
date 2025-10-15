import React from 'react';

interface Props {
  patientName: string;
  doctorName: string;
  type: string;
  start: string; // ISO
  end: string; // ISO
  timeFormat?: '12' | '24';
  height: number;
}

const getAppointmentColor = (type: string) => {
  switch (type.toLowerCase()) {
    case 'checkup':
      return 'bg-blue-500';
    case 'consultation':
      return 'bg-green-500';
    case 'follow-up':
      return 'bg-yellow-500';
    case 'procedure':
      return 'bg-purple-500';
    default:
      return 'bg-gray-500';
  }
};

export function AppointmentCard({ patientName, doctorName, type, start, end, timeFormat = '24', height }: Props) {
  const startTime = new Date(start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: timeFormat === '12' });
  const endTime = new Date(end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: timeFormat === '12' });
  const colorClass = getAppointmentColor(type);

  const isSmall = height < 50;

  return (
    <div
      className={`appointment-card rounded-lg p-2 text-white shadow-md overflow-hidden h-full flex flex-col ${colorClass} transition-all duration-200 hover:shadow-lg`}
    >
      <div className={`font-bold ${isSmall ? 'text-xs' : 'text-sm'} truncate`}>{patientName}</div>
      {!isSmall && <div className="text-xs opacity-90 truncate">{doctorName}</div>}
      <div className="text-xs opacity-80 mt-1 font-medium">{type}</div>
      {height > 70 && <div className="text-xs opacity-90 mt-auto">{startTime} - {endTime}</div>}
    </div>
  );
}

export default AppointmentCard;
