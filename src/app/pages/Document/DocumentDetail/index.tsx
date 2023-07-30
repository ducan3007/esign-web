import { Box } from '@mui/material';
import { useParams, useSearchParams } from 'react-router-dom';
import { DocumentTable } from '../__Table';
import { useEffect } from 'react';
import { actions } from '@esign-web/redux/document';
import { useDispatch } from 'react-redux';

export const DocumentDetail = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  console.log('>>>>>>', searchParams.get('id'));

  useEffect(() => {
    dispatch(actions.documentGetAll());
  }, []);

  

  return (
    <Box sx={{ overflowY: 'auto', flex: 1, width: '100%' }}>
      <Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: '1rem',
            minHeight: '500px',
            width: '100%',
            padding: '1rem',
            backgroundColor: 'var(--gray2)',
          }}
        ></Box>
      </Box>
      <DocumentTable />
    </Box>
  );
};
