"use client";

import { AddEventModal } from '@/components/AddEventModal';
import { EventList } from '@/components/EventList';
import { CompletedEventList } from '@/components/CompletedEventList';
import { useEvents } from '@/hooks/useEvents';
import { useNotifications } from '@/hooks/useNotifications';
import { usePersistentNotifications } from '@/hooks/usePersistentNotifications';
import { 
  Navbar, 
  NavBody, 
  NavItems, 
  MobileNav, 
  MobileNavHeader, 
  MobileNavMenu, 
  MobileNavToggle
} from '@/components/ResizableNavbar';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import React from 'react';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { WavyBackground } from '@/components/Hero';
import { Calendar, Clock, AlertTriangle, Filter } from 'lucide-react';

export default function Events() {
  const { isAuthenticated, user, logout, loading } = useAuth();
  const router = useRouter();
  
  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  const {
    addEvent,
    deleteEvent,
    getUpcomingEvents,
    getCompletedEvents,
    getEventsWithin24Hours,
    getNextEvent,
    getTimeUntilEvent,
    markEventAsCompleted,
    markEventAsIncomplete,
    currentTime,
    events
  } = useEvents();

  const upcomingEvents = getUpcomingEvents();
  const completedEvents = getCompletedEvents();
  const eventsWithin24Hours = getEventsWithin24Hours();
  const nextEvent = getNextEvent();

  // Mobile menu state
  const [isOpen, setIsOpen] = useState(false);
  // Add Event Modal state
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  // View toggle state
  const [view, setView] = useState<'upcoming' | 'completed'>('upcoming');

  // Filter state
  const [filter, setFilter] = useState<'all' | 'critical' | 'upcoming'>('all');

  // Navigation items
  const navItems = [
    { name: "Dashboard", link: "/dashboard" },
    { name: "Events", link: "/events" },
  ];

  // Enable notifications and sound alerts
  useNotifications(eventsWithin24Hours, getTimeUntilEvent);
  
  // Enable persistent notifications for event time arrivals
  usePersistentNotifications(events, getTimeUntilEvent);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-32 w-32 border-4 border-cyan-400 border-t-transparent"></div>
          <div className="mt-4 text-cyan-300 font-mono">LOADING EVENTS...</div>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  // Filter events based on selected filter
  const getFilteredEvents = () => {
    switch (filter) {
      case 'critical':
        return eventsWithin24Hours;
      case 'upcoming':
        return upcomingEvents.filter(event => {
          const eventDateTime = new Date(`${event.date}T${event.time}`);
          const now = new Date();
          const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
          return eventDateTime > in24Hours;
        });
      default:
        return upcomingEvents;
    }
  };

  const filteredEvents = getFilteredEvents();

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Futuristic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-slate-900 to-black"></div>
      <div className="absolute inset-0">
        <WavyBackground/>
      </div>
      
      {/* ResizableNavbar */}
      <Navbar className="bg-transparent fixed top-5 z-50">
        {/* Desktop Navbar */}
        <NavBody className="backdrop-blur-xl text-white border-0 bg-black/30">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/25">
                <span className="text-black text-lg font-bold">⚡</span>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
                NOTIFIO
              </h1>
            </div>
          </div>

          {/* Navigation Items */}
          <NavItems items={navItems} className="text-cyan-300 hover:text-white" />

          {/* Right Side */}
          <div className="flex items-center space-x-4 relative z-50">
            <div className="flex items-center space-x-2 text-sm text-cyan-400">
              <span>Welcome, {user?.name}</span>
            </div>
            <button 
              onClick={() => {
                console.log('Logout button clicked!');
                logout();
              }}
              className="relative z-50 flex items-center space-x-1 px-3 py-2 text-red-400 hover:text-red-300 font-medium transition-colors cursor-pointer hover:bg-red-500/10 rounded-lg border border-transparent hover:border-red-500/20 pointer-events-auto"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </NavBody>

        {/* Mobile Navbar */}
        <MobileNav className="bg-transparent backdrop-blur-xl text-white border-0">
          <MobileNavHeader>
            {/* Mobile Logo */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <span className="text-black text-sm font-bold">⚡</span>
                </div>
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
                  Notifio
                </h1>
                <div className="text-xs text-blue-400/70 font-mono">v2.0.47</div>
              </div>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="flex items-center space-x-4">
              <div className="text-xs text-cyan-400/80 font-mono bg-blue-900/30 px-2 py-1 rounded-full border border-blue-500/20">
                {currentTime.toLocaleString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
              <MobileNavToggle isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
            </div>
          </MobileNavHeader>

          {/* Mobile Menu */}
          <MobileNavMenu isOpen={isOpen} onClose={() => setIsOpen(false)} className="bg-slate-900/95 backdrop-blur-xl border border-blue-500/20">
            {navItems.map((item, idx) => (
              <a
                key={idx}
                href={item.link}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-cyan-300 hover:text-white hover:bg-blue-500/10 rounded-lg transition-colors duration-200 border border-blue-500/10 hover:border-blue-500/30"
              >
                {item.name}
              </a>
            ))}
            <div className="mt-4 pt-4 border-t border-blue-500/20">
              <button 
                onClick={logout}
                className="flex items-center space-x-2 w-full px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
      
      <main className="relative z-10 pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Events Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              <span className="text-white">EVENT</span>
              <span className="block bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-pulse">
                TIMELINE
              </span>
            </h1>
            <p className="text-lg text-blue-200/80 max-w-2xl mx-auto mb-6 font-light">
              Complete overview of all your scheduled temporal anchors
              <span className="block text-cyan-400/70 text-base mt-2 font-mono">
                // Chronological event management system
              </span>
            </p>
          </div>

          {/* Stats & Filters Bar */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            {/* Stats Cards */}
            <div className="bg-slate-900/80 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-4 shadow-2xl shadow-blue-500/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-mono text-cyan-400/70 uppercase tracking-wider mb-1">TOTAL</p>
                  <p className="text-2xl font-bold text-white font-mono">{upcomingEvents.length}</p>
                </div>
                <Calendar className="w-8 h-8 text-blue-400" />
              </div>
            </div>

            <div className="bg-slate-900/80 backdrop-blur-xl border border-red-500/20 rounded-2xl p-4 shadow-2xl shadow-red-500/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-mono text-red-400/70 uppercase tracking-wider mb-1">CRITICAL</p>
                  <p className="text-2xl font-bold text-white font-mono">{eventsWithin24Hours.length}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
            </div>

            <div className="bg-slate-900/80 backdrop-blur-xl border border-green-500/20 rounded-2xl p-4 shadow-2xl shadow-green-500/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-mono text-green-400/70 uppercase tracking-wider mb-1">NEXT</p>
                  <p className="text-sm font-bold text-white truncate">
                    {nextEvent ? nextEvent.name : 'NONE'}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-green-400" />
              </div>
            </div>

            {/* Filter Controls */}
            <div className="bg-slate-900/80 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-4 shadow-2xl shadow-purple-500/10">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-mono text-purple-400/70 uppercase tracking-wider">FILTER</span>
                </div>
              </div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as 'all' | 'critical' | 'upcoming')}
                className="w-full bg-black/50 border border-purple-500/30 rounded-lg text-white text-sm font-mono p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="all">ALL EVENTS</option>
                <option value="critical">CRITICAL ONLY</option>
                <option value="upcoming">FUTURE ONLY</option>
              </select>
            </div>
          </div>

          {/* View Toggle */}
          <div className="mb-6">
            <div className="bg-slate-900/80 backdrop-blur-xl border border-cyan-500/20 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex bg-black/30 p-1 rounded-lg border border-cyan-500/20">
                    <button
                      onClick={() => setView('upcoming')}
                      className={`px-4 py-2 rounded-md font-mono text-sm transition-all ${
                        view === 'upcoming'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          : 'text-gray-400 hover:text-cyan-400'
                      }`}
                    >
                      [UPCOMING] ({upcomingEvents.length})
                    </button>
                    <button
                      onClick={() => setView('completed')}
                      className={`px-4 py-2 rounded-md font-mono text-sm transition-all ${
                        view === 'completed'
                          ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                          : 'text-gray-400 hover:text-green-400'
                      }`}
                    >
                      [COMPLETED] ({completedEvents.length})
                    </button>
                  </div>
                  
                  {view === 'upcoming' && (
                    <React.Fragment>
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                      <span className="text-cyan-300 font-mono font-medium">
                        DISPLAYING {filteredEvents.length} EVENTS
                      </span>
                      <span className="text-cyan-400/60 text-sm font-mono">
                        [{filter.toUpperCase()} MODE]
                      </span>
                    </React.Fragment>
                  )}
                  
                  {view === 'completed' && (
                    <React.Fragment>
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-green-300 font-mono font-medium">
                        ARCHIVED EVENTS: {completedEvents.length}
                      </span>
                    </React.Fragment>
                  )}
                </div>
                <button
                  onClick={() => setIsAddEventModalOpen(true)}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-300 rounded-lg font-mono font-medium hover:from-cyan-500/30 hover:to-blue-500/30 transition-all"
                >
                  [ADD_EVENT] +
                </button>
              </div>
            </div>
          </div>

          {/* Events Content */}
          <div className="space-y-8">
            {view === 'upcoming' ? (
              // Upcoming Events View
              filteredEvents.length > 0 ? (
                <EventList 
                  events={filteredEvents}
                  eventsWithin24Hours={eventsWithin24Hours}
                  onDeleteEvent={deleteEvent}
                  getTimeUntilEvent={getTimeUntilEvent}
                />
              ) : (
                <div className="bg-slate-900/80 backdrop-blur-xl border border-yellow-500/20 rounded-2xl p-8 shadow-2xl shadow-yellow-500/10 text-center">
                  <div className="text-6xl mb-4">📅</div>
                  <h3 className="text-xl font-bold text-white font-mono mb-2">NO UPCOMING EVENTS</h3>
                  <p className="text-yellow-300/70 font-mono mb-4">
                    {filter === 'all' 
                      ? 'No upcoming events scheduled'
                      : 'No events match the current filter criteria'
                    }
                  </p>
                  <div className="space-y-2">
                    {filter !== 'all' && (
                      <button
                        onClick={() => setFilter('all')}
                        className="inline-block px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 text-yellow-300 rounded-lg font-mono font-medium hover:from-yellow-500/30 hover:to-orange-500/30 transition-all mr-2"
                      >
                        [SHOW_ALL]
                      </button>
                    )}
                    <button
                      onClick={() => setIsAddEventModalOpen(true)}
                      className="inline-block px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-300 rounded-lg font-mono font-medium hover:from-cyan-500/30 hover:to-blue-500/30 transition-all"
                    >
                      [CREATE_EVENT] +
                    </button>
                  </div>
                </div>
              )
            ) : (
              // Completed Events View
              <CompletedEventList 
                events={completedEvents}
                onDeleteEvent={deleteEvent}
                onRestoreEvent={markEventAsIncomplete}
              />
            )}
          </div>

          {/* Quick Navigation */}
          <div className="mt-12 text-center">
            <button
              onClick={() => router.push('/dashboard')}
              className="px-6 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-300 rounded-xl font-mono font-bold hover:from-purple-500/30 hover:to-pink-500/30 transition-all"
            >
              [RETURN_TO_DASHBOARD] 🏠
            </button>
          </div>
        </div>
      </main>

      {/* Floating Add Event Button */}
      <button
        onClick={() => setIsAddEventModalOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-full shadow-2xl shadow-cyan-500/50 flex items-center justify-center transition-all duration-300 transform hover:scale-110 z-50 group"
      >
        <span className="text-white text-2xl font-bold group-hover:rotate-90 transition-transform duration-300">+</span>
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-20 animate-pulse"></div>
      </button>

      {/* Add Event Modal */}
      <AddEventModal
        isOpen={isAddEventModalOpen}
        onClose={() => setIsAddEventModalOpen(false)}
        onAddEvent={addEvent}
      />
    </div>
  );
}
