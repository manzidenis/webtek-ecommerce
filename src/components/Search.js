import React, { useState } from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import { FaSearch } from 'react-icons/fa';
import { setSearchTerm, fetchProducts } from '../redux/userSlice/productSlice';
import { useDispatch } from 'react-redux';

const Search = () => {
  const dispatch = useDispatch();

  const [searchTerm, setSearchTermState] = useState('');

  const handleSearchChange = (event) => {
    setSearchTermState(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    dispatch(setSearchTerm(searchTerm));
    dispatch(fetchProducts());
  };

  return (
    <Paper
      component="form"
      onSubmit={handleSearchSubmit}
      sx={{
        p: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: 400,
        border: '1px solid #ccc',
        borderRadius: 20,
      }}
    >
      <InputBase sx={{ ml: 1, flex: 1 }} placeholder="Search here" value={searchTerm}
        onChange={handleSearchChange}/>
      <IconButton type="submit" sx={{ p: '10px' }}>
        <FaSearch />
      </IconButton>
    </Paper>
  );
};

export default Search;
