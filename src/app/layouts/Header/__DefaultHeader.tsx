import { selectors as authSelectors } from '@esign-web/redux/auth'
import { selectors } from '@esign-web/redux/document'
import { selectors as certSelector } from '@esign-web/redux/certificate'
import { selectors as walletSelectors } from '@esign-web/redux/wallet'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import { Box, Typography } from '@mui/material'
import moment from 'moment'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import MButton from 'src/app/components/Button'
import { SignIcon } from 'src/app/components/Icon'
import { MTooltip } from 'src/app/components/Tooltip'

interface DefaultHeaderProps {
  title?: string
  to?: string
}

const DocumentSignHeader = () => {
  const documentDetail = useSelector(selectors.getDocumentDetail)
  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', paddingLeft: '6px' }}>
      <Box
        sx={{
          flex: 1,
        }}
      >
        <Typography sx={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--dark2)' }}>{documentDetail?.name}</Typography>
        <Box
          sx={{
            display: 'flex',
            gap: '66px',
          }}
        >
          <Typography sx={{ fontSize: '1.2rem', color: 'var(--gray6)' }}>Modified</Typography>
          <Typography sx={{ fontSize: '1.2rem', color: 'var(--gray6)' }}>
            {moment(documentDetail?.updatedAt).format('L')} - {moment(documentDetail?.updatedAt).format('hh:mm A')}
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            gap: '20px',
          }}
        >
          <Typography sx={{ fontSize: '1.2rem', color: 'var(--gray6)' }}>SHA2 Fingerprint</Typography>
          <Typography sx={{ fontSize: '1.2rem', color: 'var(--gray6)' }}> {documentDetail?.hash256}</Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex' }}></Box>
    </Box>
  )
}

const DocumentHeader = () => {
  return (
    <Box sx={{ flex: 1, display: 'flex', paddingLeft: '20px', alignItems: 'center' }}>
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
    <Box sx={{ flex: 1, display: 'flex', paddingLeft: '20px', alignItems: 'center' }}>
      <MButton
        onClick={() => {
          const ele = document.getElementById('upload_cert')
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
        <UploadFileIcon sx={{ fontSize: '2.5rem' }} />
        <span style={{ color: 'var(--white)', fontSize: '1.6rem', fontWeight: 'bold', letterSpacing: '1px' }}>Upload Certificate</span>
      </MButton>
    </Box>
  )
}

const WalletHeader = () => {
  const contractState = useSelector(walletSelectors.getWalletState)
  const authState = useSelector(authSelectors.getAuthState)
  const [provider, setProvider] = useState()

  return (
    <Box sx={{ flex: 1, display: 'flex', paddingLeft: '20px', alignItems: 'center' }}>
      <Typography sx={{ fontSize: '2.4rem', fontWeight: 'bold', letterSpacing: '1px', color: 'var(--blue3)' }}>Signing Address</Typography>
      <MTooltip
        color="var(--white)"
        title={
          <Typography sx={{ fontSize: '1.5rem', color: 'var(--white)' }}>
            Signing Address is the address that the Smart Contract allows to sign the Document
          </Typography>
        }
      >
        <HelpOutlineIcon
          sx={{ color: 'var(--blue3)', fontSize: '2.4rem', marginLeft: '10px', textAlign: 'center', alignContent: 'center', fontWeight: 'bold' }}
        ></HelpOutlineIcon>
      </MTooltip>
    </Box>
  )
}

const DocumentInfoHeader = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const documentId = searchParams.get('id')
  return (
    <Box sx={{ flex: 1, display: 'flex', paddingLeft: '20px', alignItems: 'center' }}>
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
        <Typography sx={{ fontSize: '2rem', fontWeight: 'bold', letterSpacing: '1px', color: 'var(--dark)' }}>Sign now</Typography>
      </MButton>
    </Box>
  )
}

const CertificateInfoHeader = () => {
  const certDetail = useSelector(certSelector.getCertDetail)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const documentId = searchParams.get('id')
  return (
    <Box sx={{ flex: 1, display: 'flex', paddingLeft: '20px', alignItems: 'center' }}>
      <MButton
        onClick={() => {
          navigate(`/certificate/sign?id=${documentId}`)
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
        <Typography sx={{ fontSize: '2rem', fontWeight: 'bold', letterSpacing: '1px', color: 'var(--dark)' }}>Issue</Typography>
      </MButton>
    </Box>
  )
}

const CertificateSignHeader = () => {
  const certDetail = useSelector(certSelector.getCertDetail)
  console.log("certDetail,certDetail",certDetail)

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', paddingLeft: '6px' }}>
      <Box
        sx={{
          flex: 1,
        }}
      >
        <Typography sx={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--dark2)' }}>{certDetail?.name}</Typography>
        <Box
          sx={{
            display: 'flex',
            gap: '66px',
          }}
        >
          <Typography sx={{ fontSize: '1.2rem', color: 'var(--gray6)' }}>Modified</Typography>
          <Typography sx={{ fontSize: '1.2rem', color: 'var(--gray6)' }}>
            {moment(certDetail?.updatedAt).format('L')} - {moment(certDetail?.updatedAt).format('hh:mm A')}
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            gap: '20px',
          }}
        >
          <Typography sx={{ fontSize: '1.2rem', color: 'var(--gray6)' }}>SHA2 Fingerprint</Typography>
          <Typography sx={{ fontSize: '1.2rem', color: 'var(--gray6)' }}> {certDetail?.hash256}</Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex' }}></Box>
    </Box>
  )
}

const CertificantHeader = () => {
  return <Box></Box>
}

export const DefaultHeader = (props: DefaultHeaderProps) => {
  switch (props.to) {
    case '/document/sign':
      return <DocumentSignHeader />
    case '/document':
      return <DocumentHeader />

    case '/document/info':
      return <DocumentInfoHeader />

    case '/certificate/detail':
      return <CertificateInfoHeader />

    case '/certificate/sign':
      return <CertificateSignHeader />

    case '/certificant/detail':
      return <CertificantHeader />

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
