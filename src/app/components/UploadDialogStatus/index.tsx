import { actions, selectors } from '@esign-web/redux/document'
import ClearIcon from '@mui/icons-material/Clear'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { Box, Typography } from '@mui/material'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IconButton } from '../Button'
import { Overlay } from '../Overlay'
import { UploadDialogItem } from './_item.upload'

export const UploadStatusDialog = () => {
  const dispatch = useDispatch()
  const documentsStates = useSelector(selectors.getDocumentsStates)
  const uploadingDocuments = useSelector(selectors.getUploadingDocuments)
  const [open, setOpen] = useState(true)

  if (!documentsStates.uploading_documents) {
    return null
  }

  const fileUploading = Object.values(uploadingDocuments).filter((doc) => doc.status === 'uploading').length
  const filesUploaded = Object.values(uploadingDocuments).filter((doc) => doc.status === 'success').length
  const filesFailed = Object.values(uploadingDocuments).filter((doc) => doc.status === 'failed').length

  const handleEvents = {
    onClearAll: () => {
      dispatch(actions.uploadDocumentCancelAll({}))
    },
  }

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
            <Typography variant="h6" sx={{ color: 'var(--dark3)', letterSpacing: '0.25px', fontWeight: 'bold', fontSize: '1.4rem' }}>
              {fileUploading > 0 && `Uploading ${fileUploading} of ${fileUploading + fileUploading} files`}
              {fileUploading === 0 && `${filesUploaded} files uploaded, ${filesFailed} files failed`}
            </Typography>
          </Box>
          <Box sx={{ width: 'fit-content' }}>
            <IconButton sx={{ marginRight: '1rem' }} onClick={() => setOpen(!open)}>
              <KeyboardArrowUpIcon
                sx={{
                  transform: open ? 'rotate(-180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s ease-in-out',
                  fontSize: '3rem',
                }}
              />
            </IconButton>
            <IconButton onClick={handleEvents.onClearAll}>
              <ClearIcon sx={{ fontSize: '2.4rem', margin: '0.5rem' }} />
            </IconButton>
          </Box>
        </Box>

        <Box
          sx={{
            height: open ? 'fit-content' : '0px',
            maxHeight: '240px',
            overflow: 'auto',
            '&::-webkit-scrollbar': {
              width: '10px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'var(--gray4)',
              borderRadius: '50px',
              border: '1px solid var(--white)',
            },
          }}
        >
          {Object.values(uploadingDocuments).map((doc) => {
            return <UploadDialogItem key={doc.id} id={doc.id} status={doc.status} name={doc.name} error_message={doc.error_message} type={doc.type} />
          })}
        </Box>
      </Box>
    </Overlay>
  )
}
