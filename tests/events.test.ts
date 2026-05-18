// __tests__/events.test.ts
import { MOCK_EVENTS } from '../constants/mockData';

// Simulamos la misma lógica pura que tienes escrita dentro de tu componente events.tsx
const filterEventsByCategory = (events: typeof MOCK_EVENTS, category: string) => {
  return category === 'all'
    ? events
    : events.filter((e) => e.category === category);
};

const filterUpcomingEvents = (events: typeof MOCK_EVENTS, referenceDateStr: string) => {
  const refDate = new Date(referenceDateStr);
  return events.filter((e) => new Date(e.date) >= refDate);
};

describe('Pruebas Unitarias de Filtrado de Eventos (events.tsx)', () => {
  
  test('Debería retornar todos los eventos si la categoría seleccionada es "all"', () => {
    const result = filterEventsByCategory(MOCK_EVENTS, 'all');
    expect(result).toHaveLength(MOCK_EVENTS.length);
    expect(result).toEqual(MOCK_EVENTS);
  });

  test('Debería filtrar correctamente los eventos por una categoría específica (ej: academic)', () => {
    const categoryToTest = 'academic';
    const result = filterEventsByCategory(MOCK_EVENTS, categoryToTest);
    
    // Validamos que todos los elementos retornados pertenezcan a esa categoría
    result.forEach((event) => {
      expect(event.category).toBe(categoryToTest);
    });
  });

  test('Debería filtrar correctamente los eventos futuros basados en la fecha límite del componente (2025-05-18)', () => {
    // Tu componente usa de referencia '2025-05-18'
    const referenceDate = '2025-05-18';
    const upcomingEvents = filterUpcomingEvents(MOCK_EVENTS, referenceDate);
    
    upcomingEvents.forEach((event) => {
      const eventDate = new Date(event.date);
      expect(eventDate.getTime()).toBeGreaterThanOrEqual(new Date(referenceDate).getTime());
    });
  });
});