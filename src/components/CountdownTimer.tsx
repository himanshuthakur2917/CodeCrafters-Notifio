"use client";

import { Event } from '@/types/event';

interface CountdownTimerProps {
  nextEvent: Event | null;
  getTimeUntilEvent: (event: Event) => { days: number; hours: number; minutes: number; seconds: number } | null;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ nextEvent, getTimeUntilEvent }) => {
  if (!nextEvent) {
    return (
      <div className="relative bg-slate-900/80 backdrop-blur-xl border border-gray-500/20 rounded-2xl shadow-2xl p-8 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20 rounded-2xl"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gray-500/20 border border-gray-500/30 rounded-xl flex items-center justify-center">
              <span className="text-2xl text-gray-400">💭</span>
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold font-mono text-gray-400">COUNTDOWN_IDLE</h2>
              <p className="text-gray-500 text-sm font-mono">// Awaiting temporal targets</p>
            </div>
          </div>
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-gray-500/20 border border-gray-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl text-gray-500">📅</span>
            </div>
            <p className="text-xl font-semibold mb-2 text-gray-400 font-mono">NO_TARGETS_ACQUIRED</p>
            <p className="text-gray-500 font-mono text-sm">// Initialize event to activate countdown protocol</p>
          </div>
        </div>
      </div>
    );
  }

  const timeRemaining = getTimeUntilEvent(nextEvent);
  
  if (!timeRemaining) {
    return (
      <div className="bg-gradient-to-r from-red-500 to-orange-600 rounded-lg shadow-md p-6 text-white">
        <h2 className="text-2xl font-bold mb-4">Next Event Countdown</h2>
        <div className="text-center py-8">
          <p className="text-lg">Event has started or passed!</p>
          <p className="text-xl font-bold">{nextEvent.name}</p>
        </div>
      </div>
    );
  }

  const { days, hours, minutes, seconds } = timeRemaining;

  const formatDateTime = (date: string, time: string) => {
    const eventDate = new Date(`${date}T${time}`);
    return eventDate.toLocaleString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Determine urgency level for styling
  const totalHours = days * 24 + hours;
  let borderColor = 'border-cyan-500/30';
  let shadowColor = 'shadow-cyan-500/20';
  let bgColor = 'bg-slate-900/80';
  let pulseClass = '';
  let statusColor = 'text-cyan-400';
  let statusText = 'NOMINAL';
  
  if (totalHours <= 1) {
    borderColor = 'border-red-500/50';
    shadowColor = 'shadow-red-500/30';
    pulseClass = 'animate-pulse';
    statusColor = 'text-red-400';
    statusText = 'CRITICAL';
  } else if (totalHours <= 24) {
    borderColor = 'border-orange-500/40';
    shadowColor = 'shadow-orange-500/25';
    statusColor = 'text-orange-400';
    statusText = 'WARNING';
  } else if (totalHours <= 72) {
    borderColor = 'border-yellow-500/35';
    shadowColor = 'shadow-yellow-500/20';
    statusColor = 'text-yellow-400';
    statusText = 'ALERT';
  }

  return (
    <div className={`relative ${bgColor} backdrop-blur-xl border ${borderColor} rounded-2xl shadow-2xl ${shadowColor} p-8 text-white overflow-hidden ${pulseClass}`}>
      <div className="absolute inset-0 bg-black/20 rounded-2xl"></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 bg-cyan-500/20 border border-cyan-500/30 rounded-xl flex items-center justify-center`}>
              <span className="text-cyan-400 text-2xl">⚡</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold font-mono text-white">COUNTDOWN_ACTIVE</h2>
              <p className="text-cyan-400/70 text-sm font-mono">// Target acquisition locked</p>
            </div>
          </div>
          <div className={`px-3 py-1 border rounded-full text-xs font-mono font-bold ${borderColor} ${statusColor}`}>
            [{statusText}]
          </div>
        </div>
        
        <div className="text-center mb-8 p-4 border border-blue-500/20 rounded-xl bg-black/20">
          <h3 className="text-2xl font-bold mb-3 font-mono text-white">[{nextEvent.name.toUpperCase()}]</h3>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full">
            <span className="text-blue-400">⚡</span>
            <span className="text-sm font-mono text-blue-300">{formatDateTime(nextEvent.date, nextEvent.time)}</span>
          </div>
          {nextEvent.description && (
            <p className="text-blue-200/80 mt-3 text-sm font-mono">// {nextEvent.description}</p>
          )}
        </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-6">
        <div className="bg-black/30 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-4">
          <div className="text-4xl md:text-5xl font-bold font-mono text-cyan-400">{days.toString().padStart(2, '0')}</div>
          <div className="text-xs font-mono text-cyan-400/70 uppercase">DAYS</div>
        </div>
        <div className="bg-black/30 backdrop-blur-sm border border-blue-500/20 rounded-xl p-4">
          <div className="text-4xl md:text-5xl font-bold font-mono text-blue-400">{hours.toString().padStart(2, '0')}</div>
          <div className="text-xs font-mono text-blue-400/70 uppercase">HOURS</div>
        </div>
        <div className="bg-black/30 backdrop-blur-sm border border-purple-500/20 rounded-xl p-4">
          <div className="text-4xl md:text-5xl font-bold font-mono text-purple-400">{minutes.toString().padStart(2, '0')}</div>
          <div className="text-xs font-mono text-purple-400/70 uppercase">MINS</div>
        </div>
        <div className="bg-black/30 backdrop-blur-sm border border-pink-500/20 rounded-xl p-4">
          <div className="text-4xl md:text-5xl font-bold font-mono text-pink-400">{seconds.toString().padStart(2, '0')}</div>
          <div className="text-xs font-mono text-pink-400/70 uppercase">SECS</div>
        </div>
      </div>

        {totalHours <= 24 && (
          <div className="text-center p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
            <div className="inline-flex items-center gap-3">
              <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
              <span className="font-mono font-bold text-red-400">
                [{totalHours <= 1 ? 'CRITICAL_ALERT' : 'WARNING_STATUS'}]
              </span>
              <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
