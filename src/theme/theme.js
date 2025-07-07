// theme.js
import { createTheme } from '@mui/material/styles';

// Entergy + IBM Carbon Inspired Palette from 2025 Fact Sheet
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0072C3', // IBM Carbon Blue 60
      contrastText: '#FFFFFF'
    },
    secondary: {
      main: '#FF8200', // Entergy Orange
      contrastText: '#FFFFFF'
    },
    background: {
      default: '#FAFAFA', // Clean neutral background
      paper: '#FFFFFF'
    },
    text: {
      primary: '#21272A', // IBM Gray 100
      secondary: '#5A6872', // IBM Gray 70
    },
    success: {
      main: '#2ECC71', // Pale Green for Actuals
    },
    warning: {
      main: '#F1C21B', // IBM Yellow 40
    },
    error: {
      main: '#DA1E28', // IBM Red 60
    },
    info: {
      main: '#00539A', // Deep utility blue
    },
  },
  typography: {
    fontFamily: ['"IBM Plex Sans"', 'Roboto', 'Arial', 'sans-serif'].join(','),
    h1: { fontWeight: 600, fontSize: '2.5rem' },
    h2: { fontWeight: 500, fontSize: '2rem' },
    h3: { fontWeight: 500, fontSize: '1.75rem' },
    h6: { fontWeight: 600, fontSize: '1.125rem' },
    body1: { fontSize: '1rem' },
    button: { textTransform: 'none', fontWeight: 500 },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          padding: '8px 16px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          elevation: 0,
          boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

export default theme;
