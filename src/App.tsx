import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import './App.css';
import { authService } from './services/authService';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';

// Eagerly loaded components (used immediately)
import AppLayout from './components/Navigation/AppLayout';
import LoginPage from './components/Auth/LoginPage';
import SignUpPage from './components/Auth/SignUpPage';

// Lazy loaded components (loaded on demand)
const LandingPage = React.lazy(() => import('./components/Landing/LandingPage'));
const Dashboard = React.lazy(() => import('./components/Dashboard/Dashboard'));
const DataSources = React.lazy(() => import('./components/DataSources'));
const ETLPipeline = React.lazy(() => import('./components/ETLPipeline/ETLPipeline'));
const AIInsights = React.lazy(() => import('./components/AIInsights/AIInsights'));
const Analytics = React.lazy(() => import('./components/Analytics/Analytics'));
const TeamWorkspace = React.lazy(() => import('./components/TeamWorkspace/TeamWorkspace'));
const FileUpload = React.lazy(() => import('./components/FileUpload/EnhancedFileUpload'));
const AboutPage = React.lazy(() => import('./components/About/AboutPage'));
const ContactPage = React.lazy(() => import('./components/Contact/ContactPage'));

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

// Loading component for lazy loaded routes
const LoadingFallback = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="100vh"
  >
    <CircularProgress />
  </Box>
);

function App() {
  // Check if user is authenticated
  const isAuthenticated = authService.isAuthenticated();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NotificationProvider>
        <AuthProvider>
          <Router>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
          {/* Landing page - public route */}
          <Route path="/" element={<LandingPage />} />

          {/* Public pages */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />

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
            </Suspense>
          </Router>
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
