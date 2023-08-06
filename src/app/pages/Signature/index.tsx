import { Box } from '@mui/material';
import { nanoid } from 'nanoid';
import { useState } from 'react';

const SignaturePage = (props) => {
  const [sourceBoxes, setSourceBoxes] = useState();

  return (
    <Box
      sx={{
        display: 'flex',
        width: '1000px',
        height: '1000px',
        border: '1px solid var(--gray3)',
      }}
    >
      <Box
        onClick={() => {}}
        id={nanoid()}
        sx={{
          width: '50px',
          height: '50px',
          border: '1px solid var(--gray3)',
        }}
        onMouseDown={() => {}}
      >
        Box
      </Box>
    </Box>
  );
};
export default SignaturePage;
