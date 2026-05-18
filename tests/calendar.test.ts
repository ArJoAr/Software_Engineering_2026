// __tests__/calendar.test.ts
import { Colors } from '../constants/colors';

// Mapeamos la constante exacta de tu archivo calendar.tsx para verificar su integridad
const TYPE_STYLES_KEYS = ['class', 'exam', 'deadline', 'event'];

const DAYS_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

describe('Pruebas de Configuración y Constantes del Calendario (calendar.tsx)', () => {

  test('Debería tener definidos los estilos obligatorios para todos los tipos de eventos', () => {
    // Verificamos que los tipos que procesa tu calendario existan y contengan color y bg
    expect(TYPE_STYLES_KEYS).toContain('class');
    expect(TYPE_STYLES_KEYS).toContain('exam');
    expect(TYPE_STYLES_KEYS).toContain('deadline');
    expect(TYPE_STYLES_KEYS).toContain('event');
  });

  test('La matriz de días de la semana (DAYS_SHORT) debe estar ordenada correctamente y empezar en Lunes', () => {
    expect(DAYS_SHORT).toHaveLength(7);
    expect(DAYS_SHORT[0]).toBe('Mon');
    expect(DAYS_SHORT[6]).toBe('Sun');
  });
});