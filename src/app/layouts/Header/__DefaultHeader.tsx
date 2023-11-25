import { selectors as authSelectors } from '@esign-web/redux/auth'
import { selectors } from '@esign-web/redux/document'
import { selectors as certSelector } from '@esign-web/redux/certificate'
import { selectors as sigSelector, actions as sigActions } from '@esign-web/redux/signatures'
import { selectors as documentSelectors } from '@esign-web/redux/document'
import { selectors as walletSelectors } from '@esign-web/redux/wallet'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import { Box, Typography } from '@mui/material'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import MButton from 'src/app/components/Button'
import { SignIcon } from 'src/app/components/Icon'
import { MTooltip } from 'src/app/components/Tooltip'
import { SET_CERT_DETAIL } from 'libs/redux/certificate/src/lib/constants'
import { Toast, baseApi } from '@esign-web/libs/utils'
import AlertDialog from 'src/app/components/Dialog'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'

interface DefaultHeaderProps {
  title?: string
  to?: string
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

    case '/verify':
      return <VerifyHeader />

    case '/signatures':
      return <SignatureHeader />

    case '/logs':
      return <AuditLogHeader />

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

const AuditLogHeader = () => {
  return (
    <Box sx={{ flex: 1, display: 'flex', paddingLeft: '20px', alignItems: 'center' }}>
      <Typography
        sx={{
          fontSize: '2.4rem',
          fontWeight: 'bold',
          letterSpacing: '1px',
          color: 'var(--blue3)',
        }}
      >
        Audit logs
      </Typography>
    </Box>
  )
}

const SignatureHeader = () => {
  const dispatch = useDispatch()

  return (
    <Box sx={{ flex: 1, display: 'flex', paddingLeft: '20px', alignItems: 'center' }}>
      <MButton
        onClick={() => {
          dispatch(sigActions.toggleModal({}))
        }}
        disableRipple
        sx={{
          backgroundColor: 'var(--blue3)',
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
        <span style={{ color: 'var(--white)', fontSize: '1.6rem', fontWeight: 'bold', letterSpacing: '1px' }}>Upload Signature</span>
      </MButton>
    </Box>
  )
}

const DocumentSignHeader = () => {
  const documentDetail = useSelector(selectors.getDocumentDetail)
  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', paddingLeft: '6px' }}>
      <Box sx={{ flex: 1 }}>
        <Typography sx={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--dark2)' }}>{documentDetail?.name}</Typography>
        <Box sx={{ display: 'flex', gap: '66px' }}>
          <Typography sx={{ fontSize: '1.2rem', color: 'var(--gray6)' }}>Modified</Typography>
          <Typography sx={{ fontSize: '1.2rem', color: 'var(--gray6)' }}>
            {moment(documentDetail?.updatedAt).format('L')} {moment(documentDetail?.updatedAt).format('hh:mm A')}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: '19px' }}>
          <Typography sx={{ fontSize: '1.2rem', color: 'var(--gray6)' }}>SHA2 Fingerprint</Typography>
          <Typography sx={{ fontSize: '1.2rem', color: 'var(--gray6)' }}> {documentDetail?.hash256}</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: '60px' }}>
          <Typography sx={{ fontSize: '1.2rem', color: 'var(--gray6)' }}>Sequence</Typography>
          <Typography sx={{ fontSize: '1.2rem', color: 'var(--gray6)' }}>{documentDetail?.sequence}</Typography>
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
          backgroundColor: 'var(--green16)',
          display: 'flex',
          alignItems: 'center',
          borderRadius: '9px',
          justifyContent: 'center',
          gap: '0.6rem',
          width: 'fit-content',
          padding: '10px 18px',
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
  const documentDetail = useSelector(selectors.getDocumentDetail)
  const authState = useSelector(authSelectors.getAuthState)
  const disabled = ['READY_TO_SIGN', 'SIGNED', 'COMPLETED'].includes(documentDetail?.status)
  const canMakeCopy = documentDetail?.user.email === authState?.data.email

  return (
    <Box sx={{ flex: 1, gap: '15px', display: 'flex', paddingLeft: '20px', alignItems: 'center' }}>
      <MButton
        onClick={() => {
          navigate(`/document/sign?id=${documentId}`)
        }}
        disableRipple
        sx={{
          width: '200px',
          borderRadius: '12px',
          backgroundColor: 'var(--orange22)',
          padding: '3.5px 6px',
          display: 'flex',
          gap: '12px',
        }}
      >
        <SignIcon color="var(--blue22)" width="35px" height="35px" />
        <Typography sx={{ fontSize: '1.9rem', fontWeight: 'bold', letterSpacing: '1px', color: 'var(--blue22)' }}>Sign now</Typography>
      </MButton>

      <AlertDialog
        title="Are you sure you want to make a copy of this document?"
        content=""
        no={'Confirm'}
        yes={'Cancel'}
        yesAction="close"
        disabled={!canMakeCopy}
        noAction={async () => {
          await baseApi.post('/document/clone', { documentId: documentId })
          Toast({ message: 'Clone Document Successfully', type: 'success' })
          window.location.reload()
        }}
      >
        <MButton
          disableRipple
          sx={{
            width: '200px',
            borderRadius: '12px',
            backgroundColor: 'var(--white)',
            border: '1px solid var(--gray3)',
            padding: '8px 6px',
            display: 'flex',
            gap: '12px',
          }}
          disabled={!canMakeCopy}
        >
          <Typography sx={{ fontSize: '1.8rem', fontWeight: 'bold', letterSpacing: '1px', color: 'var(--dark3)' }}>Make a copy</Typography>
        </MButton>
      </AlertDialog>

      <AlertDialog
        title="Are you sure you want to delete this document?"
        content=""
        disabled={disabled}
        callBack={async () => {
          try {
            await baseApi.delete(`/document/${documentId}`)
            window.location.href = '/document'
          } catch (error) {
            console.log(error)
          }
        }}
      >
        <MButton
          disableRipple
          sx={{
            width: '70px',
            borderRadius: '12px',
            backgroundColor: '#f5e9e9',
            padding: '8px 6px',
            display: 'flex',
            gap: '12px',
            cursor: disabled ? 'not-allowed' : 'pointer',
          }}
          disabled={disabled}
        >
          <DeleteOutlineRoundedIcon sx={{ fontSize: '2.9rem', color: disabled ? 'var(--gray3)' : 'var(--red1)' }} />
        </MButton>
      </AlertDialog>
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
          navigate(`/certificate/sign?type=template&id=${documentId}`)
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
        <Typography sx={{ fontSize: '2rem', fontWeight: 'bold', letterSpacing: '1px', color: 'var(--dark)' }}>Template</Typography>
      </MButton>
    </Box>
  )
}

const CertificateSignHeader = () => {
  const dispatch = useDispatch()
  const certDetail = useSelector(certSelector.getCertDetail)
  const [searchParams] = useSearchParams()
  const type = searchParams.get('type')

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', paddingLeft: '6px' }}>
      <Box
        sx={{
          flex: 1,
        }}
      >
        <Typography sx={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--blue3)' }}>
          {type && 'Template - '}
          {certDetail?.name}
        </Typography>
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

const VerifyHeader = () => {
  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', paddingLeft: '6px', paddingTop: '17px' }}>
      <Typography sx={{ fontSize: '2.2rem', color: 'var(--ligh-blue1)', fontWeight: 'bold', letterSpacing: '1px' }}>
        Authenticity of Email Addresses, Wallet Addresses and Documents
      </Typography>
    </Box>
  )
}
