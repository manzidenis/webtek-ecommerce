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

export default function Signup() {
  const [firstname, setFirstname] = React.useState('');
  const [lastname, setLastname] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState('');

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if any field is empty
    if (!firstname || !lastname || !email || !phoneNumber || !password || !confirmPassword) {
      setError('All fields are required');
      setOpen(true);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setOpen(true);
      return;
    }

    const role = "USER";

    try {
      const response = await axiosInstance.post('/auth/register', {
        firstname,
        lastname,
        email,
        password,
        phoneNumber,
        role,
      });
      if (response.status === 200) {
        const data = response.data;
        if (data.token == null) {
          setError(data.message);
          setOpen(true);
        } else {
          navigate('/login');
        }
      }
    } catch (error) {
      setError('Failed to register. Please try again.');
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
          backgroundImage: 'url(https://source.unsplash.com/random)', // Replace with your desired background image URL
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Container component="main" maxWidth="sm">
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
              height: '100%', // Ensure the container fills the height
            }}
          >
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: 4,
              }}
            >
              <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
                Sign Up
              </Typography>
              <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="firstname"
                  label="Firstname"
                  name="firstname"
                  autoComplete="given-name"
                  autoFocus
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="lastname"
                  label="Lastname"
                  name="lastname"
                  autoComplete="family-name"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="phoneNumber"
                  label="Phone Number"
                  name="phoneNumber"
                  autoComplete="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="password"
                  label="Password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="confirmPassword"
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign Up
                </Button>
                <Grid container>
                  <Grid item xs>
                  </Grid>
                  <Grid item>
                    <Link href="/login" variant="body2">
                      {"I have an account? Login"}
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
