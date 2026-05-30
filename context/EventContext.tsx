import React, { createContext, useState, useContext, ReactNode } from 'react';
import { CalendarEvent } from '@/types';
import { MOCK_CALENDAR } from '@/constants/mockData';

interface EventContextType {
  events: CalendarEvent[];
  setEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
  addEvent: (event: CalendarEvent) => void;
  toggleEventCompletion: (id: string) => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export function EventProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<CalendarEvent[]>(MOCK_CALENDAR);

  const addEvent = (event: CalendarEvent) => {
    setEvents((prev) => [...prev, event]);
  };

  const toggleEventCompletion = (id: string) => {
    setEvents((prev) =>
      prev.map((ev) =>
        ev.id === id ? { ...ev, completed: !ev.completed } : ev
      )
    );
  };

  return (
    <EventContext.Provider value={{ events, setEvents, addEvent, toggleEventCompletion }}>
      {children}
    </EventContext.Provider>
  );
}

export function useEvents() {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
}
