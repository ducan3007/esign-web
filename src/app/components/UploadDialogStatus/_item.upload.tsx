import ErrorIcon from '@mui/icons-material/Error';
import { IconPDFImage } from '../Icons/pdf';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Box, Typography } from '@mui/material';
import { IconPDF } from '../Icons/pdf';
import { MTooltip } from '../Tooltip';
import { CircularProcess } from './_circularProcess';

interface Props {
  id: string;
  name?: string;
  status?: string;
  type?: string;
  error_message?: string;
}

export const UploadDialogItem = (props: Props) => {
  return (
    <Box
      sx={{
        backgroundColor: 'var(--white)',
        minHeight: '50px',
        display: 'flex',
        alignContent: 'center',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0px 18px 0px 5px',
        gap: '1rem',
        ':hover': {
          backgroundColor: 'var(--gray2)',
        },
      }}
    >
      <Box>
        <IconPDFImage style={{ marginTop: '0.5rem' }} />
      </Box>
      <Box sx={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
        <MTooltip
          title={props.name}
          fontWeight="500"
          fontSize="1.3rem"
          background="var(--dark4)"
          color="white"
          placement="top"
          disableHoverListener={props.name?.length! < 38}
        >
          <span
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              wordWrap: 'break-word',
              whiteSpace: 'nowrap',
              fontSize: '1.3rem',
              fontWeight: 'bold',
              letterSpacing: '0px',
            }}
          >
            {props.name?.trim()}
          </span>
        </MTooltip>
      </Box>
      <Box>
        {props.status === 'uploading' && <CircularProcess id={props.id} />}
        {props.status === 'success' && <CheckCircleIcon sx={{ color: 'var(--green3)', fontSize: '2.5rem' }} />}
        {props.status === 'failed' && (
          <MTooltip
            title={props.error_message}
            fontSize="1.3rem"
            background="var(--white)"
            fontWeight="bold"
            placement="top"
            color="var(--red)"
            disableHoverListener={!!!props.error_message}
            nowrap="true"
          >
            <ErrorIcon sx={{ color: 'var(--red)', fontSize: '2.6rem' }} />
          </MTooltip>
        )}
      </Box>
    </Box>
  );
};
