import { Box, CircularProgress, LinearProgress } from '@mui/material';

export const LoadingOverlay = (props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh',
        backgroundColor: 'var(--dark1)',
        opacity: '0.5',
        zIndex: '100',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {props.children}
    </Box>
  );
};
