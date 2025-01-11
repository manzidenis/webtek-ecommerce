import React from 'react';
import { Grid, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            style={{ minHeight: '100vh', backgroundColor: '#f0f0f0' }}
        >
            <Grid item xs={12}>
                <Typography variant="h1" component="div" gutterBottom style={{ color: '#333', fontWeight: 'bold' }}>
                    404
                </Typography>
                <Typography variant="h4" component="div" gutterBottom style={{ color: '#555', marginBottom: 20 }}>
                    Oops! Page Not Found
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    component={Link}
                    to="/login"
                    style={{ textTransform: 'none', borderRadius: 20, padding: '10px 30px' }}
                >
                    Go to Login
                </Button>
                <Box mt={2}>
                    <Typography variant="body1" style={{ color: '#777' }}>
                        Alternatively, you can return to the{' '}
                        <Link to="/" style={{ color: '#007bff', textDecoration: 'none', fontWeight: 'bold' }}>
                            homepage
                        </Link>
                    </Typography>
                </Box>
            </Grid>
        </Grid>
    );
}

export default NotFound;
