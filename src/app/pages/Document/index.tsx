import { Toast, hash_file } from '@esign-web/libs/utils';
import { actions, selectors } from '@esign-web/redux/document';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { Box, Fade } from '@mui/material';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MButton from 'src/app/components/Button';
import { CircularProcess } from 'src/app/components/UploadDialogStatus/_circularProcess';
import './styles.scss';
import { DocumentTable } from './__Table';
import { DocumentSearch } from './__Search';
import { Loading } from 'src/app/components/Loading';

const DocumentPage = () => {
  const dispatch = useDispatch();
  const uploadingDocuments = useSelector(selectors.getUploadingDocuments);
  const uploadRef = useRef<HTMLInputElement>(null);

  const EventHandlers = {
    onClearAll: () => {},
    onChangeFile: (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (file.type !== 'application/pdf') {
        Toast({
          message: (
            <div style={{ paddingLeft: '10px' }}>
              <div>File type is not supported</div> <div>Please upload PDF file.</div>
            </div>
          ),
          type: 'error',
        });
        return;
      }
      const id = hash_file(file);

      if (uploadingDocuments[id]?.status === 'uploading') {
        Toast({
          message: (
            <div style={{ paddingLeft: '10px' }}>
              <div>File is already being uploaded.</div>
            </div>
          ),
          type: 'error',
        });
        return;
      }
      const payload = {
        id: id,
        name: file.name,
        status: 'uploading',
        size: file.size,
        type: file.type,
        file: file,
      };

      dispatch(actions.uploadDocumentRender(payload));
      dispatch(actions.documenStartUploading(payload));
      e.target.value = '';
    },
  };

  console.log('>>Doc page Render ');

  return (
    <Fade in>
      <Box id="document-page" sx={{ flex: 1, width: '100%', padding: '2rem', overflow: 'hidden' }}>
        <Box className="secondary">
          <MButton
            onClick={() => {
              uploadRef.current?.click();
            }}
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
          <input
            type="file"
            ref={uploadRef}
            onChange={EventHandlers.onChangeFile}
            accept="application/pdf"
            style={{ display: 'none' }}
          />
        </Box>

        <DocumentSearch />

        <DocumentTable />
        {/* <Loading /> */}
      </Box>
    </Fade>
  );
};

export default DocumentPage;
