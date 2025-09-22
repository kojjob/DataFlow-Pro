import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';

// Create a simple theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f5f7fa',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

// Dashboard component for authenticated users
const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Welcome to DataFlow Pro Dashboard
          </Typography>
          <Alert severity="success" sx={{ mb: 3 }}>
            🎉 Authentication is working! You are successfully logged in.
          </Alert>
          <Typography variant="h6" gutterBottom>
            User Information:
          </Typography>
          <Box sx={{ mb: 3 }}>
            <Typography><strong>Email:</strong> {user?.email}</Typography>
            <Typography><strong>Username:</strong> {user?.username}</Typography>
            <Typography><strong>Full Name:</strong> {user?.full_name}</Typography>
            <Typography><strong>Role:</strong> {user?.role}</Typography>
            <Typography><strong>Account Status:</strong> {user?.is_active ? 'Active' : 'Inactive'}</Typography>
            <Typography><strong>Email Verified:</strong> {user?.is_verified ? 'Yes' : 'No'}</Typography>
          </Box>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleLogout}
            size="large"
          >
            Logout
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

// Main authentication flow component
const AuthenticationTest: React.FC = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  if (loading) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Typography>Loading...</Typography>
        </Box>
      </Container>
    );
  }

  if (isAuthenticated && user) {
    return <Dashboard />;
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h3" align="center" gutterBottom>
          DataFlow Pro Authentication Test
        </Typography>
        <Typography variant="subtitle1" align="center" color="textSecondary" sx={{ mb: 4 }}>
          Testing complete authentication flow from frontend to backend
        </Typography>

        {showRegister ? (
          <Register
            onSwitchToLogin={() => setShowRegister(false)}
          />
        ) : (
          <Login
            onSwitchToRegister={() => setShowRegister(true)}
          />
        )}
      </Box>
    </Container>
  );
};

// Main App component
function TestApp() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AuthenticationTest />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default TestApp;