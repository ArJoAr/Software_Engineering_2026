import { CalendarEvent } from '@/types';

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  type: 'free' | 'busy' | 'study';
  title?: string;
  taskId?: string;
  isExam?: boolean;
}

export interface DayPlan {
  date: string;
  slots: TimeSlot[];
}

export interface StudyConfig {
  startHour: string; // '09:00'
  endHour: string;   // '20:00'
  estimates: Record<string, number>;
}

// Helper to pad numbers
const pad = (n: number) => n.toString().padStart(2, '0');

// Generate the next N days starting from a given date string
function getNextNDays(startDateStr: string, n: number): string[] {
  const dates: string[] = [];
  const start = new Date(startDateStr);
  for (let i = 0; i < n; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    dates.push(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`);
  }
  return dates;
}

// Convert "HH:MM" to minutes from midnight
function timeToMins(time: string): number {
  if (!time) return 0;
  const [h, m] = time.split(':').map(Number);
  return h * 60 + (m || 0);
}

function minsToTime(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${pad(h)}:${pad(m)}`;
}

export function generateStudyPlan(events: CalendarEvent[], config: StudyConfig): DayPlan[] {
  const today = new Date();
  const startDateStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;

  const planDays = getNextNDays(startDateStr, 7);
  const startMins = timeToMins(config.startHour);
  const endMins = timeToMins(config.endHour);
  
  // 1. Initialize days with 1-hour free slots
  const plan: DayPlan[] = planDays.map(date => {
    const slots: TimeSlot[] = [];
    for (let m = startMins; m < endMins; m += 60) {
      slots.push({
        id: `${date}-${m}`,
        startTime: minsToTime(m),
        endTime: minsToTime(m + 60),
        type: 'free',
      });
    }
    return { date, slots };
  });

  // 2. Block out classes and busy events
  const busyEvents = events.filter(e => e.type === 'class' || e.type === 'event' || e.type === 'google' || e.type === 'upf');
  
  for (const day of plan) {
    const dayBusy = busyEvents.filter(e => e.date === day.date);
    for (const busy of dayBusy) {
      const bStart = timeToMins(busy.time);
      const bEnd = busy.endTime ? timeToMins(busy.endTime) : bStart + 60;
      
      for (const slot of day.slots) {
        const sStart = timeToMins(slot.startTime);
        const sEnd = timeToMins(slot.endTime);
        
        // If there's overlap, mark slot as busy
        if (sStart < bEnd && sEnd > bStart) {
          slot.type = 'busy';
          slot.title = busy.title;
        }
      }
    }
  }

  // 3. Get pending tasks, prioritize exams over deadlines, then by earliest date
  const pendingTasks = events
    .filter(e => (e.type === 'exam' || e.type === 'deadline') && !e.completed)
    .sort((a, b) => {
      if (a.type === 'exam' && b.type !== 'exam') return -1;
      if (a.type !== 'exam' && b.type === 'exam') return 1;
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

  // 4. Allocate study hours
  for (const task of pendingTasks) {
    let hoursNeeded = config.estimates[task.id] || 0;
    const taskDate = new Date(task.date).getTime();

    // Iterate through days to find free slots before the task date
    for (const day of plan) {
      if (hoursNeeded <= 0) break;
      if (new Date(day.date).getTime() >= taskDate) {
        // Only study before the due date
        continue;
      }

      for (const slot of day.slots) {
        if (hoursNeeded <= 0) break;
        if (slot.type === 'free') {
          slot.type = 'study';
          slot.title = `Study: ${task.title}`;
          slot.taskId = task.id;
          slot.isExam = task.type === 'exam';
          hoursNeeded -= 1;
        }
      }
    }
  }

  return plan;
}
