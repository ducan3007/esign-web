import { Box } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { RenderSignature } from './__RenderSignature';
import { RenderPDF } from './__RenderPDF';
import './styles.scss';
import { NotFoundPage } from '../../404NotFound';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions, selectors } from '@esign-web/redux/document';

export const DocumentSignningPage = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const documentId = searchParams.get('id');
  const documentFromStore = useSelector(selectors.getDoucmentFromStore(documentId));

  if (!documentId) return <NotFoundPage />;

  console.log('documentFromStore', documentFromStore);

  // useEffect(() => {
  //   dispatch(actions.getD);
  // }, []);

  return (
    <Box id="signing-container" sx={{ flex: 1, width: '100%', overflow: 'hidden' }}>
      <Box></Box>
      <Box sx={{ display: 'flex' }}>
        <RenderSignature />

        <Box sx={{ flex: 1 }}>
          <Box
            sx={{
              height: '4rem',
              width: '100%',
              backgroundColor: 'var(--orange)',
            }}
          ></Box>
          <RenderPDF documentId={documentId} />
        </Box>
      </Box>
    </Box>
  );
};
