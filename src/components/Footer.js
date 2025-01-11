import React from 'react';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
// react icons

import {
  flexBetweenCenter,
  fullWidthFlex,
} from 'themes/commonStyles';


const Footer = () => {
  return (
    <Box
      sx={{
        ...fullWidthFlex,
        borderTop: '1px solid #ddd',
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            ...flexBetweenCenter,
            width: '100%',
          }}
        >
          <Stack>
            <Paper>
              <Link href="#"> 2024 HAHA Copyright </Link>
            </Paper>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
