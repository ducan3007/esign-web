import { Box, Fade, TextField, Typography } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import MButton from 'src/app/components/Button';
import LoginFrame from 'src/assets/SignUpInShapesBg-94a15d60.svg';
import AnimatedBlob from 'src/assets/aminated_blob.svg';

import { SignifyLogo } from 'src/app/components/Logo';
import './styles.scss';
import { Link } from 'react-router-dom';
import { SignupForm } from './components/SignupForm';
import { useState } from 'react';

export const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <Box className="wrapper">
      <Box className="left_container">
        <img src={LoginFrame} style={{ position: 'absolute', transform: 'scale(1.3)' }} alt="Login Background" />
        <SignifyLogo />
      </Box>
      <Box className="right_container">
        <img src={AnimatedBlob} alt="Login Background" />
        <Fade in>
          <Box className="right_container_content">
            <Box sx={{ marginBottom: '3rem' }}>
              <Typography color="var(--blue3)" variant="h2" fontWeight="bold">
                SIGN UP
              </Typography>
              <Typography variant="h2" fontWeight="bold">
                A NEW ACCOUNT
              </Typography>
            </Box>
            {/* ------------------------------ Signup Form -------------------------- */}
            <SignupForm />
            {/* ------------------------------ Signup Form -------------------------- */}
          </Box>
        </Fade>
        <Box
          sx={{
            position: 'absolute',
            bottom: '0',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '2rem',
          }}
        >
          <Typography
            sx={{
              fontSize: '2.0rem',
              color: 'var(--dark)',
              marginBottom: '1.7rem',
            }}
          >
            Already have an account?
          </Typography>
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <Typography
              sx={{
                fontSize: '2.2rem',
                color: 'var(--blue3)',
                marginBottom: '1.7rem',
                marginLeft: '1rem',
                fontWeight: 'bold',
                ':hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              Log in
            </Typography>
          </Link>
        </Box>
      </Box>
    </Box>
  );
};
