"use client";

import { Event } from '@/types/event';

interface CompletedEventListProps {
  events: Event[];
  onDeleteEvent: (id: string) => void;
  onRestoreEvent: (id: string) => void;
}

export const CompletedEventList: React.FC<CompletedEventListProps> = ({ 
  events, 
  onDeleteEvent,
  onRestoreEvent
}) => {
  const formatCompletedDateTime = (date: string, time: string) => {
    const eventDate = new Date(`${date}T${time}`);
    return eventDate.toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatCompletedTime = (completedAt?: Date) => {
    if (!completedAt) return 'Auto-completed';
    
    const now = new Date();
    const diff = now.getTime() - completedAt.getTime();
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  if (events.length === 0) {
    return (
      <div className="bg-slate-900/80 backdrop-blur-xl border border-green-500/20 rounded-2xl shadow-2xl shadow-green-500/10 p-8 text-center">
        <div className="text-6xl mb-4">✅</div>
        <h3 className="text-xl font-bold text-white font-mono mb-2">NO COMPLETED EVENTS</h3>
        <p className="text-green-300/70 font-mono">
          Completed events will appear here after they finish
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl border border-green-500/20 rounded-2xl shadow-2xl shadow-green-500/10 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-green-500/20 border border-green-500/30 rounded-xl flex items-center justify-center">
          <span className="text-green-400 text-xl">✅</span>
        </div>
        <div>
          <h2 className="text-xl font-bold text-white font-mono">COMPLETED_EVENTS</h2>
          <p className="text-sm text-green-400/70 font-mono">// {events.length.toString().padStart(2, '0')} archived targets</p>
        </div>
      </div>
      
      <div className="space-y-4">
        {events.map((event, index) => (
          <div
            key={event.id}
            className="relative p-6 rounded-2xl border border-green-500/20 bg-green-500/5 transition-all duration-300 group hover:shadow-lg hover:shadow-green-500/20 hover:border-green-500/40"
          >
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">✓</span>
            </div>
            
            <div className="flex items-start justify-between">
              <div className="flex-grow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-xs font-mono text-green-400/70 bg-green-500/10 px-2 py-1 rounded border border-green-500/20">
                    [{(index + 1).toString().padStart(2, '0')}]
                  </div>
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <h3 className="text-lg font-bold font-mono uppercase text-green-400">
                    {event.name}
                  </h3>
                  <span className="px-3 py-1 bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-mono font-bold rounded-full">
                    [COMPLETED]
                  </span>
                </div>
                
                <div className="flex items-center gap-3 text-sm mb-3 p-3 rounded-lg border border-green-500/20 bg-green-500/5">
                  <span className="text-green-400 font-mono text-xs">[EVENT_TIME]</span>
                  <span className="text-green-300 font-mono">{formatCompletedDateTime(event.date, event.time)}</span>
                </div>
                
                {event.description && (
                  <div className="flex items-start gap-3 text-sm mb-4 p-3 rounded-lg border border-green-500/20 bg-green-500/5">
                    <span className="text-purple-400 font-mono text-xs whitespace-nowrap">[DESC]</span>
                    <span className="text-green-200 font-mono">{event.description}</span>
                  </div>
                )}
                
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl text-sm border border-green-500/30 bg-green-500/10">
                  <span className="text-green-400 font-mono text-xs">[COMPLETED]</span>
                  <span className="text-green-400 font-mono font-bold">{formatCompletedTime(event.completedAt)}</span>
                  <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </div>
              
              <div className="ml-6 flex gap-2">
                <button
                  onClick={() => {
                    if (confirm(`[RESTORE_CONFIRM]\nTarget: ${event.name.toUpperCase()}\n\nRestore to upcoming events?`)) {
                      onRestoreEvent(event.id);
                    }
                  }}
                  className="p-3 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 border border-blue-500/20 hover:border-blue-500/30 rounded-xl transition-all group-hover:opacity-100 opacity-50"
                  title="[RESTORE_EVENT]"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    if (confirm(`[DELETE_CONFIRM]\nTarget: ${event.name.toUpperCase()}\n\nPermanently delete this completed event?`)) {
                      onDeleteEvent(event.id);
                    }
                  }}
                  className="p-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 hover:border-red-500/30 rounded-xl transition-all group-hover:opacity-100 opacity-50"
                  title="[DELETE_EVENT]"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
