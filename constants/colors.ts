const shared = {
  primaryRed: '#C8102E',
  primaryRedDark: '#A00D24',
  primaryRedMid: '#E8C0CA',
  primaryGreen: '#00FF00',
  textOnRed: '#FFFFFF',
  success: '#34C759',
  successLight: '#E8F8ED',
  warning: '#FF9500',
  warningLight: '#FFF3E0',
  info: '#007AFF',
  infoLight: '#E5F1FF',
  academic: '#5856D6',
  overlay: 'rgba(0,0,0,0.5)',
  categoryColors: {
    academic: '#5856D6',
    events: '#FF6B35',
    sports: '#34C759',
    culture: '#AF52DE',
    announcements: '#007AFF',
    conference: '#FF9500',
  } as Record<string, string>,
  categoryBg: {
    academic: '#EEEEFF',
    events: '#FFF0EB',
    sports: '#E8F8ED',
    culture: '#F5EEFF',
    announcements: '#E5F1FF',
    conference: '#FFF3E0',
  } as Record<string, string>,
};

export const Colors = {
  ...shared,
  primaryRedLight: '#F9E6EA',
  academicLight: '#EEEEFF',
  background: '#F2F2F7',
  card: '#FFFFFF',
  cardBorder: '#E5E5EA',
  textPrimary: '#1C1C1E',
  textSecondary: '#6C6C70',
  textTertiary: '#AEAEB2',
  separator: '#E5E5EA',
};

export const DarkColors = {
  ...shared,
  primaryRedLight: '#3D0A12',
  academicLight: '#1C1C3A',
  background: '#000000',
  card: '#1C1C1E',
  cardBorder: '#2C2C2E',
  textPrimary: '#FFFFFF',
  textSecondary: '#AEAEB2',
  textTertiary: '#636366',
  separator: '#2C2C2E',
};

export type ColorTheme = typeof Colors;
