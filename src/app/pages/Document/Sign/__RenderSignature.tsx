import { Box } from '@mui/material';
import { useState } from 'react';

export const RenderSignature = () => {
  const [signers, setSigners] = useState([]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid var(--gray3)',
        width: '250px',
        height: 'calc(100vh - 8rem)',
      }}
    >
      <Box
        sx={{
          flex: 1,
        }}
      >
        Signature
      </Box>
      <Box sx={{ flex: 1 }}>Signers</Box>
    </Box>
  );
};
