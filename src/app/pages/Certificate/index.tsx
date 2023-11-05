import { Toast, hash_file } from '@esign-web/libs/utils'
import { actions, selectors } from '@esign-web/redux/document'
import SearchSharpIcon from '@mui/icons-material/SearchSharp'
import { Box, Fade, InputBase, Typography } from '@mui/material'
import { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CertificateTable } from './_Table'
import './styles.scss'
import MButton from 'src/app/components/Button'
import { useNavigate } from 'react-router-dom'
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle'
import Cert from 'src/assets/cert.svg'
import { FallbackLoading } from 'src/app/components/Loading'

const CeritificatePage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const uploadingDocuments = useSelector(selectors.getUploadingDocuments)
  const uploadRef = useRef<HTMLInputElement>(null)

  const onChangeFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let file = e.target.files?.[0]
    if (!file) return
    if (!file.type.split('/').includes('pdf') && !file.type.split('/').includes('image')) {
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

    const payload = {
      id: hash_file(file),
      upload_type: 'certificate',
      name: file.name,
      status: 'uploading',
      size: file.size,
      type: file.type,
      file: file,
    }

    dispatch(actions.uploadDocumentRender(payload))
    dispatch(actions.documenStartUploading(payload))
    e.target.value = ''
  }

  return (
    <Fade in>
      <Box id="document-page" sx={{ flex: 1, width: '100%', padding: '5px 5px 0px 5px', overflow: 'hidden' }}>
        <Box className="secondary">
          <input id="upload_cert" type="file" ref={uploadRef} onChange={onChangeFile} style={{ display: 'none' }} accept="application/pdf,image/*" />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px', marginBottom: '20px ' }}>
          <Box sx={{ flex: '1', height: '47px' }}>
            <Box
              sx={{
                border: '1px solid var(--gray3)',
                borderRadius: '7px',
                height: '100%',
                width: '50%',
                display: 'flex',
                alignItems: 'center',
                paddingLeft: '8px',
                gap: '15px',
              }}
            >
              <SearchSharpIcon sx={{ fontSize: '34px', color: 'var(--dark3)' }} />
              <InputBase
                sx={{
                  width: '100%',
                  height: '100%',
                  fontSize: '1.85rem',
                  paddingRight: '30px',
                  color: 'var(--dark3)',
                  '& .MuiInputBase-input': {
                    '&::placeholder': {
                      color: 'var(--dark3) !important',
                      fontSize: '1.85rem !important',
                      opacity: 0.9,
                    },
                  },
                }}
                placeholder="Search certificates, hash, tags"
              />
            </Box>
          </Box>
          <Box>
            <MButton
              sx={{
                backgroundColor: 'var(--white)',
                border: '1px solid var(--gray3)',
                display: 'flex',
                alignItems: 'center',
                borderRadius: '12px',
                justifyContent: 'center',
                gap: '0.6rem',
                width: 'fit-content',
                marginRight: '40px',
                padding: '8px 20px',
              }}
              onClick={() => {
                navigate('/certificant')
              }}
            >
              <img src={Cert} alt="metamask" width="31px" height="31px" />
              <Typography
                sx={{
                  color: '#095C9E',
                  fontWeight: 'bold',
                  fontSize: '2rem',
                }}
              >
                Certificants
              </Typography>
            </MButton>
          </Box>
        </Box>

        <CertificateTable />
      </Box>
    </Fade>
  )
}
export default CeritificatePage
