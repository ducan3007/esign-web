import { Box, Typography } from '@mui/material';

interface DefaultHeaderProps {
  title?: string;
  to?: string;
}
export const DefaultHeader = (props: DefaultHeaderProps) => {
  switch (props.to) {
    case '/document/sign':
      return (
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '2rem' }}>
          fasdf.pdf
        </Box>
      );
    default:
      return (
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '2rem' }}>
          <Typography variant="h6" sx={{ color: 'var(--dark3)', fontWeight: 'bold', fontSize: '2.4rem' }}>
            {props.title}
          </Typography>
        </Box>
      );
  }
};
