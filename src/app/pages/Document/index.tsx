import { Toast, hash_file } from '@esign-web/libs/utils'
import { actions, selectors } from '@esign-web/redux/document'
import { Box, Fade } from '@mui/material'
import { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DocumentTable } from './__Table'
import './styles.scss'

const DocumentPage = () => {
  const dispatch = useDispatch()
  const uploadingDocuments = useSelector(selectors.getUploadingDocuments)
  const uploadRef = useRef<HTMLInputElement>(null)

  const EventHandlers = {
    onClearAll: () => {},
    onChangeFile: (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return
      if (file.type !== 'application/pdf') {
        Toast({
          message: (
            <div style={{ paddingLeft: '10px' }}>
              <div>File type is not supported</div> <div>Please upload PDF file.</div>
            </div>
          ),
          type: 'error',
        })
        return
      }
      const id = hash_file(file)

      if (uploadingDocuments[id]?.status === 'uploading') {
        Toast({
          message: (
            <div style={{ paddingLeft: '10px' }}>
              <div>File is already being uploaded.</div>
            </div>
          ),
          type: 'error',
        })
        return
      }
      const payload = {
        id: id,
        name: file.name,
        status: 'uploading',
        size: file.size,
        type: file.type,
        file: file,
      }

      dispatch(actions.uploadDocumentRender(payload))
      dispatch(actions.documenStartUploading(payload))
      e.target.value = ''
    },
  }

  console.log('>>Doc page Render ')

  return (
    <Fade in>
      <Box id="document-page" sx={{ flex: 1, width: '100%', padding: '5px 5px 0px 5px', overflow: 'hidden' }}>
        <Box className="secondary">
          {/* <MButton
            onClick={() => {
              uploadRef.current?.click()
            }}
            disableRipple
            sx={{
              backgroundColor: 'var(--orange1)',
              display: 'flex',
              alignItems: 'center',
              borderRadius: '8px',
              justifyContent: 'center',
              gap: '0.6rem',
              width: 'fit-content',
              padding: '12px 40px',
            }}
          >
            <UploadFileIcon sx={{ fontSize: '2.2rem' }} />
            <span style={{ color: 'var(--white)', fontSize: '1.5rem', fontWeight: 'bold' }}>Upload Document</span>
          </MButton> */}
          <input id="upload_document" type="file" ref={uploadRef} onChange={EventHandlers.onChangeFile} accept="application/pdf" style={{ display: 'none' }} />
        </Box>

        <DocumentTable />
        {/* <Loading /> */}
      </Box>
    </Fade>
  )
}

export default DocumentPage
