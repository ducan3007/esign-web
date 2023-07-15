import { Box, Typography } from '@mui/material';
import { IconPDF } from '../Icons/pdf';

export const UploadDialogItem = () => {
  return (
    <Box
      sx={{
        backgroundColor: 'var(--blue4)',
        minHeight: '50px',
        margin: '1px',
        display: 'flex',
        alignContent: 'center',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Box>
        <IconPDF />
      </Box>
      <Box sx={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
        <span
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            wordWrap: 'break-word',
            whiteSpace: 'nowrap',
            fontSize: '1.6rem',
          }}
        >
          asdfd.pdf - dfesdf.sdmfkslej klsjdfkl df df d
        </span>
      </Box>
      <Box>Progress bar</Box>
    </Box>
  );
};
