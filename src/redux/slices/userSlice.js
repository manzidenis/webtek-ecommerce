import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userId: null,
  firstname: '',
  lastname: '',
  email: '',
  phoneNumber: '',
  role: '',
  defaultAddress: null,
  profileImage: null,
  enabled: false,
  accountNonExpired: false,
  credentialsNonExpired: false,
  authorities: [],
  username: '',
  accountNonLocked: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      return { ...state, ...action.payload };
    },
    clearUser: (state) => {
      return initialState;
    },
    updateUserProfile: (state, action) => {
      const { firstname, lastname, phoneNumber } = action.payload;
      state.firstname = firstname;
      state.lastname = lastname;
      state.phoneNumber = phoneNumber;
    },
    updateUserProfileImage: (state, action) => {
      state.profileImage = action.payload;
    },
  },
});

export const { setUser, clearUser, updateUserProfile, updateUserProfileImage } = userSlice.actions;

export const selectUser = (state) => state.user;

export default userSlice.reducer;
