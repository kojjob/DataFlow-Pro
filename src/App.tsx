import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './App.css';
import AppLayout from './components/Navigation/AppLayout';
import Dashboard from './components/Dashboard/Dashboard';
import LoginPage from './components/Auth/LoginPage';
import SignUpPage from './components/Auth/SignUpPage';
import DataSources from './components/DataSources';
import ETLPipeline from './components/ETLPipeline/ETLPipeline';
import AIInsights from './components/AIInsights/AIInsights';
import Analytics from './components/Analytics/Analytics';
import TeamWorkspace from './components/TeamWorkspace/TeamWorkspace';
import FileUpload from './components/FileUpload/FileUpload';
import { authService } from './services/authService';

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
      light: '#764ba2',
      dark: '#1a237e',
    },
    secondary: {
      main: '#f50057',
    },
    success: {
      main: '#4caf50',
    },
    warning: {
      main: '#ff9800',
    },
    background: {
      default: '#f5f7fa',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        },
      },
    },
  },
});

function App() {
  // Check if user is authenticated
  const isAuthenticated = authService.isAuthenticated();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Landing page redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Authentication Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          {/* Protected Routes with Layout */}
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? (
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Other routes - placeholder for now */}
          <Route path="/analytics" element={<AppLayout><Analytics /></AppLayout>} />
          <Route path="/insights" element={<AppLayout><AIInsights /></AppLayout>} />
          <Route path="/sources" element={<AppLayout><DataSources /></AppLayout>} />
          <Route path="/etl" element={<AppLayout><ETLPipeline /></AppLayout>} />
          <Route path="/upload" element={<AppLayout><FileUpload /></AppLayout>} />
          <Route path="/performance" element={<AppLayout><Dashboard /></AppLayout>} />
          <Route path="/predictive" element={<AppLayout><Dashboard /></AppLayout>} />
          <Route path="/reports" element={<AppLayout><Dashboard /></AppLayout>} />
          <Route path="/team" element={<AppLayout><TeamWorkspace /></AppLayout>} />
          <Route path="/settings" element={<AppLayout><Dashboard /></AppLayout>} />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
