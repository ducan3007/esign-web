import { selectors } from '@esign-web/redux/document'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import { Box, Typography } from '@mui/material'
import { useSelector } from 'react-redux'
import MButton from 'src/app/components/Button'
import { ethers } from 'ethers'
import KeyOutlinedIcon from '@mui/icons-material/KeyOutlined'
import moment from 'moment'
import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { SignIcon } from 'src/app/components/Icon'
interface DefaultHeaderProps {
  title?: string
  to?: string
}

const DocumentSignHeader = () => {
  const documentDetail = useSelector(selectors.getDocumentDetail)
  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        paddingLeft: '6px',
      }}
    >
      <Box
        sx={{
          flex: 1,
        }}
      >
        <Typography
          sx={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: 'var(--dark2)',
          }}
        >
          {documentDetail?.name}
        </Typography>
        <Typography
          sx={{
            fontSize: '1.2rem',
            fontWeight: 'bold',
            color: 'var(--gray6)',
          }}
        >
          Last modified: {moment(documentDetail?.updatedAt).format('DD MMM YYYY')} - {moment(documentDetail?.updatedAt).format('hh:mm A')}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex' }}>
        <Typography
          sx={{
            fontSize: '1.2rem',
            fontWeight: 'bold',
            color: 'var(--gray6)',
          }}
        >
          {documentDetail?.hash256}
        </Typography>
      </Box>
    </Box>
  )
}
const DocumentHeader = () => {
  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        paddingLeft: '20px',
        alignItems: 'center',
      }}
    >
      <MButton
        onClick={() => {
          const ele = document.getElementById('upload_document')
          if (ele) {
            ele.click()
          }
        }}
        disableRipple
        sx={{
          backgroundColor: 'var(--orange1)',
          display: 'flex',
          alignItems: 'center',
          borderRadius: '9px',
          justifyContent: 'center',
          gap: '12px',
          width: 'fit-content',
          padding: '10px 18px',
        }}
      >
        <UploadFileIcon sx={{ fontSize: '2.5rem' }} />
        <span style={{ color: 'var(--white)', fontSize: '1.6rem', fontWeight: 'bold', letterSpacing: '1px' }}>Upload Document</span>
      </MButton>
    </Box>
  )
}

const CerticateHeader = () => {
  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        paddingLeft: '20px',
        alignItems: 'center',
      }}
    >
      <MButton
        onClick={() => {
          const ele = document.getElementById('upload_document')
          if (ele) {
            ele.click()
          }
        }}
        disableRipple
        sx={{
          backgroundColor: 'var(--orange1)',
          display: 'flex',
          alignItems: 'center',
          borderRadius: '9px',
          justifyContent: 'center',
          gap: '0.6rem',
          width: 'fit-content',
          padding: '10px 30px',
        }}
      >
        <UploadFileIcon sx={{ fontSize: '2.8rem' }} />
        <span style={{ color: 'var(--white)', fontSize: '1.67rem', fontWeight: 'bold', letterSpacing: '1px' }}>Upload Certificate</span>
      </MButton>
    </Box>
  )
}

const WalletHeader = () => {
  useEffect(() => {
    ;(async () => {
      try {
        if (window.ethereum) {
          const provider = new ethers.JsonRpcProvider()
          const network = await provider.getNetwork()
          const contract = 
          console.log('network', network)
        }
      } catch (error) {}
    })()
  }, [])

  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        paddingLeft: '20px',
        alignItems: 'center',
      }}
    >
      <MButton
        disableRipple
        sx={{
          width: '240px',
          borderRadius: '12px',
          backgroundColor: 'var(--white)',
          border: '1px solid var(--gray3)',
          padding: '2px 6px',
          display: 'flex',
          gap: '12px',
        }}
      >
        <KeyOutlinedIcon
          sx={{
            fontSize: '33px',
            color: 'var(--dark)',
          }}
        />
        <Typography
          sx={{
            fontSize: '2rem',
            fontWeight: 'bold',
            letterSpacing: '1px',
            color: 'var(--dark)',
          }}
        >
          Update Address
        </Typography>
      </MButton>
    </Box>
  )
}

const DocumentInfoHeader = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const documentId = searchParams.get('id')
  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        paddingLeft: '20px',
        alignItems: 'center',
      }}
    >
      <MButton
        onClick={() => {
          navigate(`/document/sign?id=${documentId}`)
        }}
        disableRipple
        sx={{
          width: '200px',
          borderRadius: '12px',
          backgroundColor: 'var(--white)',
          border: '1px solid var(--gray3)',
          padding: '3.5px 6px',
          display: 'flex',
          gap: '12px',
        }}
      >
        <SignIcon width="40px" height="40px" />
        <Typography
          sx={{
            fontSize: '2rem',
            fontWeight: 'bold',
            letterSpacing: '1px',
            color: 'var(--dark)',
          }}
        >
          Sign now
        </Typography>
      </MButton>
    </Box>
  )
}

export const DefaultHeader = (props: DefaultHeaderProps) => {
  switch (props.to) {
    case '/document/sign':
      return <DocumentSignHeader />
    case '/document':
      return <DocumentHeader />

    case '/document/info':
      return <DocumentInfoHeader />

    case '/wallet':
      return <WalletHeader />

    case '/certificate':
      return <CerticateHeader />

    default:
      return (
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '2rem' }}>
          <Typography variant="h6" sx={{ color: 'var(--dark)', fontWeight: 'bold', fontSize: '2.4rem' }}>
            {props.title}
          </Typography>
        </Box>
      )
  }
}
