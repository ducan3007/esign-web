import { Box } from '@mui/material';
import MButton from 'src/app/components/Button';
import UploadFileIcon from '@mui/icons-material/UploadFile';

import './styles.scss';
import { FlexBox } from 'src/app/components/Box';

export const DocumentPage = () => {
  return (
    <Box id="document-page" sx={{ flex: 1, width: '100%' }}>
      <Box className="secondary">
        <MButton
          disableRipple
          sx={{
            backgroundColor: 'var(--orange1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.6rem',
            width: 'fit-content',
          }}
        >
          <UploadFileIcon sx={{ fontSize: '2.2rem' }} />
          <span style={{ color: 'var(--white)', fontSize: '1.5rem', fontWeight: 'bold' }}>UPLOAD DOCUMENT</span>
        </MButton>
      </Box>
      <Box className="table"></Box>
    </Box>
  );
};
