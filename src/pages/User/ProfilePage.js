import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Container, TextField, Button, Snackbar, Avatar, CircularProgress } from '@mui/material';
import axiosInstance from '../../utils/axiosInstance';
import { updateUserProfile, updateUserProfileImage, selectUser } from '../../redux/slices/userSlice';
import Header from 'components/Header';
import Footer from 'components/Footer';
import CssBaseline from '@mui/material/CssBaseline';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [profileImage, setProfileImage] = useState(user.profileImage || '');
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [firstName, setFirstName] = useState(user.firstname || '');
  const [lastName, setLastName] = useState(user.lastname || '');
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || '');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleProfileImageChange = (e) => {
    setProfileImageFile(e.target.files[0]);
  };

  const handleProfileImageUpload = async () => {
    if (!profileImageFile) return;

    setLoading(true);

    const formData = new FormData();
    formData.append('image', profileImageFile);

    try {
      const token = localStorage.getItem('token');
      const response = await axiosInstance.patch('/account/update-profile-image', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      const imageUrl = response.data.profileImage;
      dispatch(updateUserProfileImage(imageUrl));
      setProfileImage(imageUrl);
      setSnackbarMessage('Profile image updated successfully');
    } catch (error) {
      setSnackbarMessage('Failed to update profile image');
    } finally {
      setLoading(false);
      setSnackbarOpen(true);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      await axiosInstance.patch(
        '/account/update-profile',
        { firstname: firstName, lastname: lastName, phoneNumber },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      dispatch(updateUserProfile({ firstname: firstName, lastname: lastName, phoneNumber }));
      setSnackbarMessage('Profile updated successfully');
    } catch (error) {
      setSnackbarMessage('Failed to update profile');
    } finally {
      setSnackbarOpen(true);
    }
    setProfileImageFile(null);
  };

  const handleChangePassword = async () => {
    try {
      const token = localStorage.getItem('token');
      await axiosInstance.patch(
        '/account/change-password',
        { oldPassword, newPassword, confirmPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setSnackbarMessage('Password changed successfully');
      navigate('/logout');
    } catch (error) {
      setSnackbarMessage(error.response?.data || 'Failed to change password');
    } finally {
      setSnackbarOpen(true);
    }
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Box>
            <Header />
        </Box>
        <Container maxWidth="sm" sx={{ flexGrow: 1, mt: 5 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Avatar
              src={`${process.env.REACT_APP_BACKEND_APP_API}/images/${profileImage}`}
              alt="Profile Image"
              sx={{ width: 120, height: 120, margin: 'auto' }}
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleProfileImageChange}
              style={{ marginTop: '16px' }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleProfileImageUpload}
              sx={{ mt: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Update Profile Image'}
            </Button>
          </Box>
          <Box>
            <Typography variant="h5" gutterBottom>
              Update Profile Details
            </Typography>
            <TextField
              label="First Name"
              variant="outlined"
              fullWidth
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Last Name"
              variant="outlined"
              fullWidth
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Phone Number"
              variant="outlined"
              fullWidth
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button variant="contained" color="primary" onClick={handleProfileUpdate}>
              Update Profile
            </Button>
          </Box>
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              Change Password
            </Typography>
            <TextField
              label="Old Password"
              type="password"
              variant="outlined"
              fullWidth
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              label="New Password"
              type="password"
              variant="outlined"
              fullWidth
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Confirm Password"
              type="password"
              variant="outlined"
              fullWidth
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button variant="contained" color="primary" onClick={handleChangePassword}>
              Change Password
            </Button>
          </Box>
        </Container>
        <Footer />
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </React.Fragment>
  );
};

export default ProfilePage;
