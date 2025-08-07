"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import React from 'react';
import { Event } from '@/types/event';
import { toast } from 'react-hot-toast';

interface PersistentNotificationState {
  eventId: string;
  startTime: Date;
  isActive: boolean;
  intervalId?: NodeJS.Timeout;
  audioIntervalId?: NodeJS.Timeout;
}

export const usePersistentNotifications = (events: Event[], getTimeUntilEvent: (event: Event) => any) => {
  const [activeNotifications, setActiveNotifications] = useState<Map<string, PersistentNotificationState>>(new Map());
  const audioContextRef = useRef<AudioContext | null>(null);
  const notificationPermissionGranted = useRef(false);

  // Initialize audio context and request permissions
  useEffect(() => {
    const initAudio = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
    };

    const requestPermissions = async () => {
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        notificationPermissionGranted.current = permission === 'granted';
      }
    };

    const handleUserInteraction = () => {
      initAudio();
      requestPermissions();
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };

    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };
  }, []);

  // Play urgent notification sound
  const playUrgentSound = useCallback(() => {
    if (!audioContextRef.current) return;

    try {
      const context = audioContextRef.current;
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(context.destination);

      // Urgent sound: Higher frequency, longer duration
      oscillator.frequency.setValueAtTime(1200, context.currentTime);
      oscillator.type = 'square';

      gainNode.gain.setValueAtTime(0, context.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.15, context.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.8);

      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + 0.8);
    } catch (error) {
      console.warn('Could not play urgent sound:', error);
    }
  }, []);

  // Show persistent browser notification
  const showPersistentBrowserNotification = useCallback((event: Event) => {
    if (!notificationPermissionGranted.current) return null;

    const notification = new Notification(`🚨 EVENT NOW: ${event.name}`, {
      body: `${event.description || 'Your event is happening now!'}\n\nClick to stop notifications.`,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: `event-now-${event.id}`,
      requireInteraction: true,
      silent: false,
      actions: [
        {
          action: 'stop',
          title: 'Stop Notifications'
        },
        {
          action: 'snooze',
          title: 'Snooze 5 min'
        }
      ]
    });

    notification.onclick = () => {
      stopEventNotification(event.id);
      window.focus();
      notification.close();
    };

    return notification;
  }, []);

  // Show persistent toast notification
  const showPersistentToast = useCallback((event: Event, onStop: () => void) => {
    return toast(
      (t) => (
        <div className="flex flex-col gap-3 p-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl animate-pulse">🚨</span>
            <div>
              <div className="font-bold text-red-400 font-mono">EVENT NOW!</div>
              <div className="text-white font-mono">{event.name}</div>
            </div>
          </div>
          {event.description && (
            <div className="text-blue-200 text-sm font-mono">{event.description}</div>
          )}
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => {
                onStop();
                toast.dismiss(t.id);
              }}
              className="px-3 py-1 bg-red-500 text-white text-xs rounded font-mono hover:bg-red-600 transition-colors"
            >
              STOP NOTIFICATIONS
            </button>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                // Keep notification running, just close this toast
              }}
              className="px-3 py-1 bg-gray-600 text-white text-xs rounded font-mono hover:bg-gray-700 transition-colors"
            >
              MINIMIZE
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity, // Keep toast open until manually closed
        style: {
          background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
          border: '2px solid #ef4444',
          color: '#fff',
          maxWidth: '400px',
          animation: 'pulse 1s infinite'
        },
        position: 'top-center'
      }
    );
  }, []);

  // Start persistent notification for an event
  const startEventNotification = useCallback((event: Event) => {
    const notificationState: PersistentNotificationState = {
      eventId: event.id,
      startTime: new Date(),
      isActive: true
    };

    // Show browser notification
    const browserNotification = showPersistentBrowserNotification(event);

    // Show persistent toast with stop button
    const toastId = showPersistentToast(event, () => stopEventNotification(event.id));

    // Play sound every 10 seconds for 2 minutes
    const audioInterval = setInterval(() => {
      const elapsed = Date.now() - notificationState.startTime.getTime();
      if (elapsed >= 120000) { // 2 minutes = 120,000ms
        stopEventNotification(event.id);
        return;
      }
      playUrgentSound();
    }, 10000); // Every 10 seconds

    // Play initial sound
    playUrgentSound();

    // Auto-stop after 2 minutes
    const stopTimeout = setTimeout(() => {
      stopEventNotification(event.id);
    }, 120000); // 2 minutes

    notificationState.audioIntervalId = audioInterval;
    notificationState.intervalId = stopTimeout;

    setActiveNotifications(prev => new Map(prev.set(event.id, notificationState)));

    console.log(`Started 2-minute persistent notification for event: ${event.name}`);
  }, [playUrgentSound, showPersistentBrowserNotification, showPersistentToast]);

  // Stop persistent notification for an event
  const stopEventNotification = useCallback((eventId: string) => {
    setActiveNotifications(prev => {
      const newMap = new Map(prev);
      const notification = newMap.get(eventId);
      
      if (notification) {
        // Clear intervals and timeouts
        if (notification.audioIntervalId) {
          clearInterval(notification.audioIntervalId);
        }
        if (notification.intervalId) {
          clearTimeout(notification.intervalId);
        }
        
        newMap.delete(eventId);
        console.log(`Stopped persistent notification for event: ${eventId}`);
      }
      
      return newMap;
    });
  }, []);

  // Check for events that have reached their time
  useEffect(() => {
    const now = new Date();
    
    events.forEach(event => {
      if (event.completed) return;
      
      const eventDateTime = new Date(`${event.date}T${event.time}`);
      const timeDiff = eventDateTime.getTime() - now.getTime();
      
      // Event is happening now (within 1 minute of event time)
      const isEventNow = timeDiff <= 0 && timeDiff > -60000; // From 0 to -60 seconds
      
      if (isEventNow && !activeNotifications.has(event.id)) {
        startEventNotification(event);
      }
    });
  }, [events, activeNotifications, startEventNotification]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      activeNotifications.forEach((notification, eventId) => {
        stopEventNotification(eventId);
      });
    };
  }, []);

  return {
    activeNotifications: Array.from(activeNotifications.values()),
    stopEventNotification,
    startEventNotification
  };
};
