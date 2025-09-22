import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Link,
  IconButton,
  InputAdornment,
  Alert,
  Divider,
  Card,
  Stepper,
  Step,
  StepLabel,
  Checkbox,
  FormControlLabel,
  Grid
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  Business,
  Google,
  GitHub,
  LinkedIn,
  Analytics,
  CheckCircle,
  Phone
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authService } from '../../services/authService';

interface SignUpFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  organizationName: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  organizationName?: string;
  password?: string;
  confirmPassword?: string;
  agreeToTerms?: string;
}

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<SignUpFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    organizationName: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const steps = ['Personal Information', 'Organization Details', 'Create Password'];

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^\+?[\d\s-()]+$/;
    return phone.length >= 10 && phoneRegex.test(phone);
  };

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};

    switch (step) {
      case 0:
        if (!formData.firstName.trim()) {
          newErrors.firstName = 'First name is required';
        }
        if (!formData.lastName.trim()) {
          newErrors.lastName = 'Last name is required';
        }
        if (!formData.email.trim()) {
          newErrors.email = 'Email is required';
        } else if (!validateEmail(formData.email)) {
          newErrors.email = 'Please enter a valid email address';
        }
        if (formData.phone && !validatePhone(formData.phone)) {
          newErrors.phone = 'Please enter a valid phone number';
        }
        break;

      case 1:
        if (!formData.organizationName.trim()) {
          newErrors.organizationName = 'Organization name is required';
        }
        break;

      case 2:
        if (!formData.password) {
          newErrors.password = 'Password is required';
        } else if (!validatePassword(formData.password)) {
          newErrors.password = 'Password must be at least 8 characters with uppercase, lowercase, number, and special character';
        }
        if (!formData.confirmPassword) {
          newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        }
        if (!formData.agreeToTerms) {
          newErrors.agreeToTerms = 'You must agree to the terms and conditions';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleInputChange = (field: keyof SignUpFormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    });
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: undefined
      });
    }
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      agreeToTerms: event.target.checked
    });
    if (errors.agreeToTerms) {
      setErrors({
        ...errors,
        agreeToTerms: undefined
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep(activeStep)) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await authService.signUp({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        organizationName: formData.organizationName,
        password: formData.password
      });

      // User is automatically logged in after signup
      // Navigate directly to dashboard
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignUp = async (provider: string) => {
    try {
      // Implement social sign up logic
      console.log(`Sign up with ${provider}`);
      // This would typically redirect to OAuth provider
    } catch (err) {
      setError(`Failed to sign up with ${provider}`);
    }
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="First Name"
                  variant="outlined"
                  value={formData.firstName}
                  onChange={handleInputChange('firstName')}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="action" />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Last Name"
                  variant="outlined"
                  value={formData.lastName}
                  onChange={handleInputChange('lastName')}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="action" />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Email Address"
                  variant="outlined"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  error={!!errors.email}
                  helperText={errors.email}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="action" />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Phone Number (Optional)"
                  variant="outlined"
                  value={formData.phone}
                  onChange={handleInputChange('phone')}
                  error={!!errors.phone}
                  helperText={errors.phone}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone color="action" />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 1:
        return (
          <Box>
            <TextField
              fullWidth
              label="Organization Name"
              variant="outlined"
              value={formData.organizationName}
              onChange={handleInputChange('organizationName')}
              error={!!errors.organizationName}
              helperText={errors.organizationName || 'Enter your company or organization name'}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Business color="action" />
                  </InputAdornment>
                )
              }}
            />

            <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Your organization will include:
              </Typography>
              <Box sx={{ mt: 1 }}>
                {['Unlimited dashboards', 'Team collaboration', 'Advanced analytics', 'API access'].map((feature) => (
                  <Box key={feature} sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <CheckCircle sx={{ fontSize: 18, color: 'success.main', mr: 1 }} />
                    <Typography variant="body2">{feature}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        );

      case 2:
        return (
          <Box>
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              value={formData.password}
              onChange={handleInputChange('password')}
              error={!!errors.password}
              helperText={errors.password}
              sx={{ mb: 2 }}
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
            />

            <TextField
              fullWidth
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              variant="outlined"
              value={formData.confirmPassword}
              onChange={handleInputChange('confirmPassword')}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.agreeToTerms}
                  onChange={handleCheckboxChange}
                  color="primary"
                />
              }
              label={
                <Typography variant="body2">
                  I agree to the{' '}
                  <Link href="#" underline="hover" color="primary">
                    Terms and Conditions
                  </Link>
                  {' '}and{' '}
                  <Link href="#" underline="hover" color="primary">
                    Privacy Policy
                  </Link>
                </Typography>
              }
              sx={{ mt: 2 }}
            />
            {errors.agreeToTerms && (
              <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                {errors.agreeToTerms}
              </Typography>
            )}
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ width: '100%' }}
        >
          <Card
            elevation={3}
            sx={{
              p: 4,
              borderRadius: 3,
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
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
                Create Your Account
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Start your analytics journey today
              </Typography>
            </Box>

            {/* Stepper */}
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {/* Error Alert */}
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {/* Form Content */}
            <Box component="form" onSubmit={handleSubmit}>
              {getStepContent(activeStep)}

              {/* Navigation Buttons */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>

                {activeStep === steps.length - 1 ? (
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    sx={{
                      background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                      color: 'white',
                      px: 4,
                      py: 1.5,
                      '&:hover': {
                        background: 'linear-gradient(45deg, #5a67d8 30%, #6b4299 90%)',
                      }
                    }}
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{
                      background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                      color: 'white',
                      px: 4,
                      py: 1.5,
                      '&:hover': {
                        background: 'linear-gradient(45deg, #5a67d8 30%, #6b4299 90%)',
                      }
                    }}
                  >
                    Next
                  </Button>
                )}
              </Box>
            </Box>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                OR SIGN UP WITH
              </Typography>
            </Divider>

            {/* Social Sign Up Options */}
            <Grid container spacing={2}>
              <Grid size={{ xs: 4 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => handleSocialSignUp('google')}
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
                  onClick={() => handleSocialSignUp('github')}
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
                  onClick={() => handleSocialSignUp('linkedin')}
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
                Already have an account?{' '}
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => navigate('/login')}
                  sx={{
                    color: '#667eea',
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  Sign In
                </Link>
              </Typography>
            </Box>
          </Card>
        </motion.div>
      </Box>
    </Container>
  );
};

export default SignUpPage;