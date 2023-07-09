import { Box, Typography } from '@mui/material';
import Signify from 'src/assets/signify.svg';

export const SignifyLogo = (props: any) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0rem',
      }}
    >
      <img
        src={Signify}
        style={{
          width: props.width ?? '175px',
          height: props.height ?? '175px',
        }}
        alt="Login Background"
      />
      {!props.noText && (
        <Typography color="var(--white)" variant="h1" fontFamily="Varela Round" fontWeight="bold">
          signify
        </Typography>
      )}
    </Box>
  );
};
