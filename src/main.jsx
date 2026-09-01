import { createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#6366f1' },
    success: { main: '#22c55e' },
    error: { main: '#ef4444' },
    background: { default: '#0f172a', paper: '#1e293b' },
    text: { primary: '#e2e8f0', secondary: '#94a3b8' },
    divider: '#334155',
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { border: '1px solid #334155', backgroundImage: 'none' },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: '#334155' },
            '&:hover fieldset': { borderColor: '#6366f1' },
            '&.Mui-focused fieldset': { borderColor: '#6366f1' },
          },
        },
      },
    },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>
)
