import React, { useEffect, useState } from 'react';
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

import { useAuth } from '../../components/AuthProvider/AuthProvider';

function LogInComponent() {

  const navigate = useNavigate();
  const { token: authToken, login: handleLogin } = useAuth();

  useEffect(() => {
    if( authToken ){
      navigate('/search-problem');
    }
  }, []);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({
    email: '',
    password: '',
  });

  const resetFormData = () => {
    setFormData({
      email: '',
      password: ''
    });
  };
  const resetFieldErrors = () => {
    setFieldErrors({
      email: '',
      password: ''
    });
    setError('');
  };

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
    // {userId, handle, email, token} 
    const loginInfo = await handleLogin(formData.email, formData.password);
    setLoading(false);

    if( !loginInfo ){
      setError("Something very ugly happened! Please try again later.");
    }else if(  loginInfo.error ){
      setError(loginInfo.error.message); /////////////// expecting error.message
    }else{
      resetFormData();
      resetFieldErrors();
      // Redirect to home page on success
      navigate('/search-problem');
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
          Log in to your account
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
              'Log In'
            )}
          </Button>
          <Grid container justifyContent="center">
            <Grid item>
              <Button 
                color="primary" 
                variant="text"
                sx={{ textTransform: 'none' }}
                onClick={() => navigate('/signup')}
                disabled={loading}
              >
                Don't have an account?
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}

export default LogInComponent;