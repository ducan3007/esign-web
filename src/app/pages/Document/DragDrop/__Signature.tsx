import { Box } from '@mui/material'
import IconSVG from 'src/app/components/Icon'

export type ImageSignatureProps = {
  signatureDataRefs: any
  signature_id: string
  pageNumber: number
  data: any
}

export const SignatureImageType = (props: ImageSignatureProps) => {
  const { signature_id, signatureDataRefs, pageNumber } = props
  const url = signatureDataRefs.current[`page_${pageNumber}`][signature_id].signature_data.url
  if (!signatureDataRefs.current[`page_${pageNumber}`][signature_id].signature_data.url) {
    return (
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '5px',
        }}
      >
        <IconSVG type="signature" width="60px" />
        <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>Your signature</span>
      </Box>
    )
  }

  return <img src={url} alt="" style={{ width: '100%', height: '100%' }} />
}
