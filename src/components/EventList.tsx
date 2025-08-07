"use client";

import { Event } from '@/types/event';

interface EventListProps {
  events: Event[];
  eventsWithin24Hours: Event[];
  onDeleteEvent: (id: string) => void;
  getTimeUntilEvent: (event: Event) => { days: number; hours: number; minutes: number; seconds: number } | null;
}

export const EventList: React.FC<EventListProps> = ({ 
  events, 
  eventsWithin24Hours, 
  onDeleteEvent,
  getTimeUntilEvent 
}) => {
  const upcomingEvents = events;
  
  const isEventWithin24Hours = (eventId: string) => {
    return eventsWithin24Hours.some(event => event.id === eventId);
  };

  const formatDateTime = (date: string, time: string) => {
    const eventDate = new Date(`${date}T${time}`);
    return eventDate.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatTimeRemaining = (event: Event) => {
    const timeRemaining = getTimeUntilEvent(event);
    if (!timeRemaining) return 'Event has passed';

    const { days, hours, minutes, seconds } = timeRemaining;
    
    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  if (upcomingEvents.length === 0) {
    return (
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
            <span className="text-white text-lg">🗓️</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Upcoming Events</h2>
            <p className="text-sm text-gray-600">Your scheduled events will appear here</p>
          </div>
        </div>
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl text-gray-400">📅</span>
          </div>
          <p className="text-lg font-medium text-gray-800 mb-2">No events scheduled yet</p>
          <p className="text-gray-500">Create your first event to get started with smart reminders!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl border border-blue-500/20 rounded-2xl shadow-2xl shadow-blue-500/10 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-blue-500/20 border border-blue-500/30 rounded-xl flex items-center justify-center">
          <span className="text-blue-400 text-xl">⚡</span>
        </div>
        <div>
          <h2 className="text-xl font-bold text-white font-mono">EVENT_REGISTRY</h2>
          <p className="text-sm text-blue-400/70 font-mono">// {upcomingEvents.length.toString().padStart(2, '0')} temporal anchors detected</p>
        </div>
      </div>
      
      {/* Alert for events within 24 hours */}
      {eventsWithin24Hours.length > 0 && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
            <div className="font-mono font-bold text-red-400 text-sm uppercase tracking-wider">
              [CRITICAL_ALERT] {eventsWithin24Hours.length.toString().padStart(2, '0')} urgent targets detected
            </div>
            <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {upcomingEvents.map((event, index) => {
          const isUrgent = isEventWithin24Hours(event.id);
          
          return (
            <div
              key={event.id}
              className={`relative p-6 rounded-2xl border transition-all duration-300 group hover:shadow-2xl ${
                isUrgent 
                  ? 'bg-red-500/5 border-red-500/30 shadow-lg shadow-red-500/20 animate-pulse' 
                  : 'bg-black/20 border-blue-500/20 hover:border-cyan-500/40 hover:shadow-cyan-500/10'
              }`}
            >
              {isUrgent && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center animate-bounce">
                  <span className="text-white text-xs font-bold">⚡</span>
                </div>
              )}
              
              <div className="flex items-start justify-between">
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-xs font-mono text-cyan-400/70 bg-cyan-500/10 px-2 py-1 rounded border border-cyan-500/20">
                      [{(index + 1).toString().padStart(2, '0')}]
                    </div>
                    <div className={`w-2 h-2 rounded-full ${
                      isUrgent ? 'bg-red-400 animate-pulse' : 'bg-cyan-400'
                    }`}></div>
                    <h3 className={`text-lg font-bold font-mono uppercase ${
                      isUrgent ? 'text-red-400' : 'text-white'
                    }`}>
                      {event.name}
                    </h3>
                    {isUrgent && (
                      <span className="px-3 py-1 bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-mono font-bold rounded-full animate-pulse">
                        [URGENT]
                      </span>
                    )}
                  </div>
                  
                  <div className={`flex items-center gap-3 text-sm mb-3 p-3 rounded-lg border ${
                    isUrgent ? 'text-red-300 bg-red-500/5 border-red-500/20' : 'text-blue-300 bg-blue-500/5 border-blue-500/20'
                  }`}>
                    <span className="text-cyan-400 font-mono text-xs">[TIME]</span>
                    <span className="font-mono">{formatDateTime(event.date, event.time)}</span>
                  </div>
                  
                  {event.description && (
                    <div className={`flex items-start gap-3 text-sm mb-4 p-3 rounded-lg border ${
                      isUrgent ? 'text-red-200 bg-red-500/5 border-red-500/20' : 'text-blue-200 bg-blue-500/5 border-blue-500/20'
                    }`}>
                      <span className="text-purple-400 font-mono text-xs whitespace-nowrap">[DESC]</span>
                      <span className="font-mono">{event.description}</span>
                    </div>
                  )}
                  
                  <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-xl text-sm border ${
                    isUrgent 
                      ? 'bg-red-500/10 text-red-400 border-red-500/30' 
                      : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                  }`}>
                    <span className="font-mono text-xs">[T-MINUS]</span>
                    <span className="font-mono font-bold">{formatTimeRemaining(event)}</span>
                    <div className={`w-1 h-1 rounded-full animate-pulse ${
                      isUrgent ? 'bg-red-400' : 'bg-cyan-400'
                    }`}></div>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    if (confirm('[DELETE_CONFIRM]\nTarget: ' + event.name.toUpperCase() + '\n\nProceed with deletion?')) {
                      onDeleteEvent(event.id);
                    }
                  }}
                  className="ml-6 p-3 text-gray-400 hover:text-red-400 hover:bg-red-500/10 border border-gray-500/20 hover:border-red-500/30 rounded-xl transition-all group-hover:opacity-100 opacity-50"
                  title="[DELETE_EVENT]"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
