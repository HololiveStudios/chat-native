export const theme = {
  colors: {
    background: '#121B22',
    surface: '#1F2937',
    messageReceived: '#202C33',
    messageSent: '#005C4B',
    primary: '#00A884',
    secondary: '#8696A0',
    text: '#E9EDEF',
    textSecondary: '#8696A0',
    border: '#2A3942',
    error: '#FF6B6B',
    success: '#00A884',
    warning: '#FFB020',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
  typography: {
    heading: {
      fontSize: 24,
      fontWeight: '700' as const,
      color: '#E9EDEF',
    },
    subheading: {
      fontSize: 18,
      fontWeight: '600' as const,
      color: '#E9EDEF',
    },
    body: {
      fontSize: 16,
      fontWeight: '400' as const,
      color: '#E9EDEF',
    },
    caption: {
      fontSize: 12,
      fontWeight: '400' as const,
      color: '#8696A0',
    },
  },
};