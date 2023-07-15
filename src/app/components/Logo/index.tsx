import { Box, Typography } from '@mui/material';
import Signify from 'src/assets/signify.svg';

export const SignifyLogo = (props: any) => {
  return (
    <Box
      className={props.className}
      sx={{
        display: 'flex',
        flexDirection: props.direction || 'column',
        alignItems: 'center',
        gap: '0rem',
        position: 'relative',
        overflow: 'hidden',
        ...props.sx,
      }}
    >
      {!props.noImg && (
        <img
          src={Signify}
          style={{
            width: props.width ?? '155px',
            height: props.height ?? '155px',
          }}
          alt="Login Background"
        />
      )}
      {!props.noText && (
        <Typography
          color={props.color || 'var(--white)'}
          variant={props.variant || 'h1'}
          fontFamily="Varela Round"
          fontWeight="bold"
        >
          {props.text || 'signify'}
        </Typography>
      )}
    </Box>
  );
};
