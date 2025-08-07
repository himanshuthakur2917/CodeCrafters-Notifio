"use client";

import { useState, useEffect, useCallback } from 'react';
import { Event, NewEvent } from '@/types/event';
import { useAuth } from '@/contexts/AuthContext';
import { databaseService } from '@/lib/appwrite';
import { toast } from 'react-hot-toast';

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // Load events from Appwrite database when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserEvents();
    } else {
      setEvents([]);
    }
  }, [isAuthenticated, user]);

  // Update current time every second for real-time countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const loadUserEvents = async () => {
    if (!user) {
      console.log('No user found, skipping event loading');
      return;
    }

    try {
      setLoading(true);
      console.log('Loading events for user:', user.$id);
      const response = await databaseService.getUserEvents(user.$id);
      console.log('Events response:', response);
      const userEvents: Event[] = response.documents.map((doc: any) => ({
        id: doc.$id,
        name: doc.name,
        date: doc.date,
        time: doc.time,
        description: doc.description,
        createdAt: new Date(doc.createdAt)
      }));
      setEvents(userEvents);
      console.log('Loaded events:', userEvents);
    } catch (error: any) {
      console.error('Error loading events:', error);
      console.error('Error details:', error.message, error.code, error.type);
      toast.error(`Failed to load events: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const addEvent = useCallback(async (newEvent: NewEvent) => {
    if (!user) {
      toast.error('Please login to add events');
      console.error('No user found when trying to add event');
      return;
    }

    try {
      setLoading(true);
      console.log('Adding event for user:', user.$id);
      console.log('Event data:', newEvent);
      const response = await databaseService.createEvent(user.$id, newEvent);
      console.log('Create event response:', response);
      const event: Event = {
        id: response.$id,
        name: response.name,
        date: response.date,
        time: response.time,
        description: response.description,
        createdAt: new Date(response.createdAt)
      };
      setEvents(prev => [event, ...prev]);
      console.log('Event added successfully:', event);
      toast.success('Event added successfully!');
    } catch (error: any) {
      console.error('Error adding event:', error);
      console.error('Error details:', error.message, error.code, error.type);
      toast.error(`Failed to add event: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const deleteEvent = useCallback(async (id: string) => {
    if (!user) {
      toast.error('Please login to delete events');
      return;
    }

    try {
      setLoading(true);
      await databaseService.deleteEvent(id);
      setEvents(prev => prev.filter(event => event.id !== id));
      toast.success('Event deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Auto-complete events that have passed
  useEffect(() => {
    const now = new Date();
    const eventsToComplete: Event[] = [];
    
    events.forEach(event => {
      if (!event.completed) {
        const eventDateTime = new Date(`${event.date}T${event.time}`);
        if (eventDateTime <= now) {
          eventsToComplete.push({
            ...event,
            completed: true,
            completedAt: now
          });
        }
      }
    });
    
    if (eventsToComplete.length > 0) {
      setEvents(prev => 
        prev.map(event => {
          const completedEvent = eventsToComplete.find(e => e.id === event.id);
          return completedEvent || event;
        })
      );
    }
  }, [events, currentTime]);

  const getUpcomingEvents = useCallback(() => {
    const now = new Date();
    return events
      .filter(event => {
        if (event.completed) return false;
        const eventDateTime = new Date(`${event.date}T${event.time}`);
        return eventDateTime > now;
      })
      .sort((a, b) => {
        const aDateTime = new Date(`${a.date}T${a.time}`);
        const bDateTime = new Date(`${b.date}T${b.time}`);
        return aDateTime.getTime() - bDateTime.getTime();
      });
  }, [events]);

  const getCompletedEvents = useCallback(() => {
    return events
      .filter(event => event.completed)
      .sort((a, b) => {
        const aCompletedAt = a.completedAt || new Date(`${a.date}T${a.time}`);
        const bCompletedAt = b.completedAt || new Date(`${b.date}T${b.time}`);
        return bCompletedAt.getTime() - aCompletedAt.getTime(); // Most recent first
      });
  }, [events]);

  const getEventsWithin24Hours = useCallback(() => {
    const now = new Date();
    const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    
    return events.filter(event => {
      const eventDateTime = new Date(`${event.date}T${event.time}`);
      return eventDateTime > now && eventDateTime <= in24Hours;
    });
  }, [events]);

  const getNextEvent = useCallback(() => {
    const upcomingEvents = getUpcomingEvents();
    return upcomingEvents.length > 0 ? upcomingEvents[0] : null;
  }, [getUpcomingEvents]);

  const getTimeUntilEvent = useCallback((event: Event) => {
    const eventDateTime = new Date(`${event.date}T${event.time}`);
    const timeDiff = eventDateTime.getTime() - currentTime.getTime();
    
    if (timeDiff <= 0) return null;
    
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
    
    return { days, hours, minutes, seconds };
  }, [currentTime]);

  const markEventAsCompleted = useCallback((id: string) => {
    setEvents(prev => 
      prev.map(event => 
        event.id === id 
          ? { ...event, completed: true, completedAt: new Date() }
          : event
      )
    );
    toast.success('Event marked as completed!');
  }, []);

  const markEventAsIncomplete = useCallback((id: string) => {
    setEvents(prev => 
      prev.map(event => 
        event.id === id 
          ? { ...event, completed: false, completedAt: undefined }
          : event
      )
    );
    toast.success('Event restored to upcoming!');
  }, []);

  return {
    events,
    currentTime,
    loading,
    addEvent,
    deleteEvent,
    getUpcomingEvents,
    getCompletedEvents,
    getEventsWithin24Hours,
    getNextEvent,
    getTimeUntilEvent,
    markEventAsCompleted,
    markEventAsIncomplete
  };
};
