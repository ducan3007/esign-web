import { Box, Typography } from '@mui/material';
import { Overlay } from '../Overlay';
import MButton, { IconButton } from '../Button';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ClearIcon from '@mui/icons-material/Clear';

import { useState } from 'react';
import { UploadDialogItem } from './docs.item';

export const UploadStatusDialog = () => {
  const [open, setOpen] = useState(false);
  return (
    <Overlay sx={{ bottom: '0', right: '24px' }}>
      <Box
        sx={{
          width: '360px',
          maxHeight: '323px',
          //   minHeight: '53px',
          backgroundColor: 'var(--white)',
          borderRadius: '10px 10px 0px 0px',
          boxShadow: 'var(--dt-surface1-shadow,0 1px 2px 0 rgba(60,64,67,.3),0 1px 3px 1px rgba(60,64,67,.15))',
        }}
      >
        <Box
          sx={{
            height: '53px',
            border: '1px solid var(--gray2)',
            backgroundColor: 'var(--gray2)',
            borderRadius: '10px 10px 0px 0px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0 1.5rem 0 1.5rem',
          }}
        >
          <Box>
            <Typography
              variant="h6"
              sx={{ color: 'var(--dark3)', letterSpacing: '0.25px', fontWeight: 'bold', fontSize: '1.4rem' }}
            >
              Uploading 1 file
            </Typography>
          </Box>
          <Box
            sx={{
              width: 'fit-content',
            }}
          >
            <IconButton sx={{ marginRight: '1rem' }} onClick={() => setOpen(!open)}>
              <KeyboardArrowUpIcon
                sx={{
                  transform: open ? 'rotate(-180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s ease-in-out',
                  fontSize: '3rem',
                }}
              />
            </IconButton>
            <IconButton>
              <ClearIcon sx={{ fontSize: '2.4rem', margin: '0.5rem' }} />
            </IconButton>
          </Box>
        </Box>
        <Box sx={{ height: open ? 'fit-content' : '0px', transition: 'height 0.3s esae-in-out', overflow: 'hidden' }}>
          <UploadDialogItem />
        </Box>
      </Box>
    </Overlay>
  );
};
