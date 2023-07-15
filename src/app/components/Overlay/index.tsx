import { Box, BoxProps } from '@mui/material';

export const Overlay = (props: BoxProps) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        zIndex: 1009,
        ...props.sx,
      }}
    >
      {props.children}
    </Box>
  );
};
