import { DndContext } from '@dnd-kit/core';
import { selectors } from '@esign-web/redux/document';
import { Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { NotFoundPage } from '../../404NotFound';
import { RenderPDF } from './__RenderPDF';
import { RenderSignature } from './__RenderSignature';
import './styles.scss';
import { useEffect } from 'react';

export const DocumentSignningPage = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const documentId = searchParams.get('id');
  const documentFromStore = useSelector(selectors.getDoucmentFromStore(documentId));

  if (!documentId) return <NotFoundPage />;

  console.log('documentFromStore', documentFromStore);

  return (
    <DndContext>
      <Box id="signing-container" sx={{ flex: 1, width: '100%', overflow: 'hidden' }}>
        <Box></Box>
        <Box sx={{ display: 'flex' }}>
          <RenderSignature />
          <Box>
          </Box>

          <Box sx={{ flex: 1 }}>
            <RenderPDF documentId={documentId} />
          </Box>
        </Box>
      </Box>
    </DndContext>
  );
};
