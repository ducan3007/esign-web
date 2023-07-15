import { Box, BoxProps } from '@mui/material';

export const FlexBox = (props: BoxProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        ...props.sx,
      }}
    >
      {props.children}
    </Box>
  );
};
