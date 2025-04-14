import React, { useState } from 'react';
import { 
  Box,
  Button,
  Container,
  CssBaseline,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid2';

function ExperimentComponent() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    handle: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({
    email: '',
    password: '',
    handle: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear field-specific error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors({
        ...fieldErrors,
        [name]: ''
      });
    }
    
    // Clear general error when user modifies any field
    if (error) {
      setError('');
    }
  };

  const validateForm = () => {
    const errors = {
      email: '',
      password: '',
      handle: ''
    };
    let isValid = true;

    // Email validation
    if (!formData.email) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    // Handle validation
    if (!formData.handle) {
      errors.handle = 'Handle is required';
      isValid = false;
    } else if (formData.handle.length < 3) {
      errors.handle = 'Handle must be at least 3 characters';
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // First validate the form
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Simulate API call with a timeout
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate various error scenarios
          if (formData.email === 'test@example.com') {
            reject(new Error('Email already in use'));
          } else if (formData.handle === 'admin') {
            reject(new Error('This handle is not available'));
          } else {
            resolve();
          }
        }, 1500); // 1.5 seconds delay to simulate network request
      });
      
      console.log('Signup successful:', formData);
      // Redirect to home page on success
      navigate('/home');
    } catch (err) {
      console.error('Signup failed:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Paper elevation={3} sx={{ mt: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h4" sx={{ mb: 1 }}>
          Code Buddy
        </Typography>
        <Typography component="h2" variant="h6" sx={{ mb: 3 }}>
          Create an account
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
            error={!!fieldErrors.email}
            helperText={fieldErrors.email}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
            error={!!fieldErrors.password}
            helperText={fieldErrors.password}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="handle"
            label="Handle"
            type="text"
            id="handle"
            autoComplete="username"
            value={formData.handle}
            onChange={handleChange}
            disabled={loading}
            error={!!fieldErrors.handle}
            helperText={fieldErrors.handle}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Sign Up'
            )}
          </Button>
          <Grid container justifyContent="center">
            <Grid item>
              <Button 
                color="primary" 
                variant="text"
                sx={{ textTransform: 'none' }}
                onClick={() => navigate('/login')}
                disabled={loading}
              >
                Already have an account?
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}

export default ExperimentComponent;