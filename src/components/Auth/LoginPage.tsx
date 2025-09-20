import React, { useState } from 'react';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
  Link,
  IconButton,
  InputAdornment,
  Alert,
  Divider,
  Card,
  Grid
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Google,
  GitHub,
  LinkedIn,
  Analytics
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authService } from '../../services/authService';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await authService.login({
        email,
        password,
        rememberMe
      });
      navigate('/dashboard');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github' | 'linkedin') => {
    try {
      const loginUrl = await authService.getSocialLoginUrl(provider);
      window.location.href = loginUrl;
    } catch (error) {
      console.error(`${provider} login error:`, error);
      setError(`${provider} login is not available at the moment.`);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Animated Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            width: '200%',
            height: '200%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
            animation: 'slide 20s linear infinite',
            top: '-50%',
            left: '-50%'
          },
          '@keyframes slide': {
            '0%': { transform: 'translate(0, 0)' },
            '100%': { transform: 'translate(50px, 50px)' }
          }
        }}
      />

      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card
            elevation={24}
            sx={{
              p: 4,
              backdropFilter: 'blur(20px)',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: 4
            }}
          >
            {/* Logo and Title */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              >
                <Analytics
                  sx={{
                    fontSize: 60,
                    background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                    backgroundClip: 'text',
                    textFillColor: 'transparent',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 2
                  }}
                />
              </motion.div>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 'bold',
                  background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                  backgroundClip: 'text',
                  textFillColor: 'transparent',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1
                }}
              >
                DataFlow Pro
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Enterprise Analytics Platform
              </Typography>
            </Box>

            {/* Login Form */}
            <form onSubmit={handleSubmit}>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                >
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                  </Alert>
                </motion.div>
              )}

              <TextField
                fullWidth
                label="Email Address"
                variant="outlined"
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="action" />
                    </InputAdornment>
                  )
                }}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                sx={{ mb: 2 }}
              />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      sx={{
                        '&.Mui-checked': {
                          color: '#667eea'
                        }
                      }}
                    />
                  }
                  label="Remember me"
                />
                <Link
                  href="#"
                  sx={{
                    textDecoration: 'none',
                    color: '#667eea',
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  Forgot password?
                </Link>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading}
                sx={{
                  mb: 2,
                  py: 1.5,
                  background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                  boxShadow: '0 3px 5px 2px rgba(102, 126, 234, .3)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #5a6fd4 30%, #6b4392 90%)',
                  }
                }}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>

              <Divider sx={{ my: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  OR CONTINUE WITH
                </Typography>
              </Divider>

              {/* Social Login Options */}
              <Grid container spacing={2}>
                <Grid size={{ xs: 4 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => handleSocialLogin('google')}
                    sx={{
                      borderColor: '#e0e0e0',
                      color: '#757575',
                      '&:hover': {
                        borderColor: '#4285f4',
                        backgroundColor: 'rgba(66, 133, 244, 0.04)'
                      }
                    }}
                  >
                    <Google />
                  </Button>
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => handleSocialLogin('github')}
                    sx={{
                      borderColor: '#e0e0e0',
                      color: '#757575',
                      '&:hover': {
                        borderColor: '#333',
                        backgroundColor: 'rgba(51, 51, 51, 0.04)'
                      }
                    }}
                  >
                    <GitHub />
                  </Button>
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => handleSocialLogin('linkedin')}
                    sx={{
                      borderColor: '#e0e0e0',
                      color: '#757575',
                      '&:hover': {
                        borderColor: '#0077b5',
                        backgroundColor: 'rgba(0, 119, 181, 0.04)'
                      }
                    }}
                  >
                    <LinkedIn />
                  </Button>
                </Grid>
              </Grid>

              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Don't have an account?{' '}
                  <Link
                    component="button"
                    variant="body2"
                    onClick={() => navigate('/signup')}
                    sx={{
                      color: '#667eea',
                      textDecoration: 'none',
                      fontWeight: 'bold',
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    Sign Up
                  </Link>
                </Typography>
              </Box>
            </form>

            {/* Demo Notice */}
            <Box
              sx={{
                mt: 4,
                p: 2,
                bgcolor: 'rgba(102, 126, 234, 0.08)',
                borderRadius: 2,
                border: '1px solid rgba(102, 126, 234, 0.2)'
              }}
            >
              <Typography variant="caption" color="text.secondary" align="center" display="block">
                🔐 Demo Mode: Use any credentials to sign in
              </Typography>
            </Box>
          </Card>

          {/* Footer */}
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              © 2024 DataFlow Pro. All rights reserved.
            </Typography>
            <Box sx={{ mt: 1 }}>
              <Link
                href="#"
                sx={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  textDecoration: 'none',
                  mx: 1,
                  '&:hover': { color: 'white' }
                }}
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                sx={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  textDecoration: 'none',
                  mx: 1,
                  '&:hover': { color: 'white' }
                }}
              >
                Terms of Service
              </Link>
              <Link
                href="#"
                sx={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  textDecoration: 'none',
                  mx: 1,
                  '&:hover': { color: 'white' }
                }}
              >
                Contact Support
              </Link>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default LoginPage;