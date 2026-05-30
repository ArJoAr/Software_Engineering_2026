export interface Student {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: string;
  degree: string;
  faculty: string;
  year: number;
  email: string;
  photoUrl: string;
  studentIdNumber: string;
  enrollmentDate: string;
  campus: string;
}

export type EventCategory =
  | 'events'
  | 'academic'
  | 'sports'
  | 'culture'
  | 'announcements'
  | 'conference';

export interface CampusEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  endTime?: string;
  location: string;
  description: string;
  category: EventCategory;
  imageUrl?: string;
  organizer: string;
  capacity?: number;
  attendees?: number;
  isFavorited?: boolean;
  isJoined?: boolean;
  tags?: string[];
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  date: string;
  time: string;
  type: 'academic' | 'events' | 'announcements';
  isRead: boolean;
  relatedEventId?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  date: string;
  category: string;
  imageUrl?: string;
  source: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  endTime?: string;
  location?: string;
  type: 'class' | 'exam' | 'deadline' | 'event';
  subject?: string;
}

export interface QuickAccessItem {
  id: string;
  title: string;
  icon: string;
  route: string;
  color?: string;
}
