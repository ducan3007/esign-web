import { selectors } from '@esign-web/redux/auth';
import { Box, Fade, Typography } from '@mui/material';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { SignifyLogo } from 'src/app/components/Logo';
import LoginFrame from 'src/assets/SignUpInShapesBg-94a15d60.svg';
import AnimatedBlob from 'src/assets/aminated_blob.svg';

import { useSelector } from 'react-redux';
import { LoginForm } from 'src/app/components/FormLogin';
import { Overlay } from 'src/app/components/Overlay';
import './styles.scss';
import { AuthenticationTokenHOC } from 'src/app/protected.routes';

const LoginPage = () => {
  const { authenticating, error } = useSelector(selectors.getAuthState);
  const submitRef = useRef<HTMLButtonElement | null>();

  return (
    <>
      {authenticating && <Overlay />}
      <Box className="wrapper">
        <Box className="brand_side">
          <img src={LoginFrame} style={{ position: 'absolute', transform: 'scale(1.3)' }} alt="Login Background" />
          <SignifyLogo text="esign" />
        </Box>
        <Box className="login_side">
          <img src={AnimatedBlob} alt="Login Background" />

          <Fade in>
            <Box className="login_side_content">
              <Box sx={{ marginBottom: '3rem' }}>
                <Typography color="var(--blue3)" variant="h2" fontWeight="bold">
                  SIGN IN
                </Typography>
                <Typography variant="h2" fontWeight="bold">
                  TO YOUR ACCOUNT
                </Typography>
              </Box>
              {/* ------------------------------ Login Form -------------------------- */}
              <LoginForm authenticating={authenticating} error={error} />
              {/* ------------------------------ Login Form -------------------------- */}
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
            <Typography sx={{ fontSize: '1.8rem', color: 'var(--dark)', marginBottom: '1.7rem' }}>
              Don't have an account?
            </Typography>
            <Link to="/signup" style={{ textDecoration: 'none' }}>
              <Typography
                sx={{
                  fontSize: '2.0rem',
                  color: 'var(--blue3)',
                  marginBottom: '1.7rem',
                  marginLeft: '1rem',
                  fontWeight: 'bold',
                  ':hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Sign up now!
              </Typography>
            </Link>
          </Box>
        </Box>
      </Box>
    </>
  );
};
export default AuthenticationTokenHOC(LoginPage);
