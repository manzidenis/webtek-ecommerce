import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import axiosInstance from '../../utils/axiosInstance';

const defaultTheme = createTheme();

export default function SignIn() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState('');

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email || !password) {
      setError('All fields are required');
      setOpen(true);
      return;
    }

    try {
      const response = await axiosInstance.post('/auth/login', {
        email,
        password,
      });
      if (response.status === 200) {
        localStorage.setItem('token', response.data.authenticationResponse.token);
        if (response.data.user.role === "ADMIN") {
          navigate('/dashboard');
        } else {
          navigate('/');
        }
      }
    } catch (error) {
      setError('Failed to sign in. Please try again.');
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Box
        sx={{
          backgroundImage: 'url(https://unsplash.com/photos/round-white-watch-with-white-band-2cFZ_FB08UM)', // Replace with your desired background image URL
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Container component="main" maxWidth="md">
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              boxShadow: 3,
              borderRadius: 2,
              backgroundColor: 'background.paper',
              overflow: 'hidden',
              width: '100%',
            }}
          >
            <Box
              sx={{
                width: '40%',
                backgroundColor: 'primary.main',
                color: 'white',
                padding: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography component="h1" variant="h3" sx={{ mb: 2 }}>
                HAHA SHOP
              </Typography>
              <Typography component="h2" variant="h5">
                Welcome to our shop!
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                Experience the best shopping experience with us. Sign in to continue.
              </Typography>
            </Box>
            <Box
              sx={{
                width: '60%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: 4,
              }}
            >
              <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
                Sign in
              </Typography>
              <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign In
                </Button>
                <Grid container>
                  <Grid item>
                    <Link href="/signup" variant="body2">
                      {"Don't have an account? Sign Up"}
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Box>
        </Container>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}
