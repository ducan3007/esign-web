import { Box } from '@mui/material';
import { Link } from 'react-router-dom';

export const SignupSuccessPage = () => {
  return (
    <Box>
      <h1>Signup Success</h1>
      <Link to="/login">Back To Login</Link>
    </Box>
  );
};
