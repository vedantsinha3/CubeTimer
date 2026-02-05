export const theme = {
  colors: {
    background: '#1a1a2e',
    surface: '#16213e',
    surfaceLight: '#1f2b47',
    primary: '#e94560',
    secondary: '#0f3460',
    text: '#ffffff',
    textMuted: '#a0a0a0',
    success: '#4ade80',
    warning: '#fbbf24',
    error: '#ef4444',
    timerReady: '#4ade80',
    timerRunning: '#fbbf24',
  },
  fonts: {
    main: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.25rem',
    xl: '1.5rem',
    xxl: '2rem',
    timer: '6rem',
    timerMobile: '3.5rem',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
  },
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.3)',
    md: '0 4px 6px rgba(0, 0, 0, 0.3)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.3)',
  },
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
  },
} as const;

export type Theme = typeof theme;
