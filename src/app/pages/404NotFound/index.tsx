import { Box, Typography } from '@mui/material';
import MButton from 'src/app/components/Button';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link } from 'react-router-dom';
export const NotFoundPage = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '5rem',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100vw',
      }}
    >
      <Typography sx={{ color: 'var(--orange)' }} variant="h1">
        404 Not Found
      </Typography>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <MButton sx={{ backgroundColor: 'var(--orange)', borderRadius: '10rem', padding: '2rem' }}>
          <Typography sx={{ color: 'var(--white)' }} variant="h4">
            Back to Home Page
          </Typography>
        </MButton>
      </Link>
    </Box>
  );
};
