import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import { SvgIconProps } from '@mui/material'
import PdfImage from 'src/assets/pdf.png'
import Signature from 'src/assets/signatrue.svg'

export const IconPDF = (props: SvgIconProps) => {
  return (
    <PictureAsPdfIcon
      sx={{
        color: 'var(--red)',
        fontSize: '2.4rem',
        ...props.sx
      }}
    />
  )
}

export const IconPDFImage = (props: SvgIconProps) => {
  return (
    <img
      src={PdfImage}
      style={{
        width: props.width ?? '18px',
        height: props.height ?? '18px',
        ...props.style
      }}
      alt="PDF"
    />
  )
}

export const IconSignature = (props: SvgIconProps) => {
  return (
    <img
      src={Signature}
      style={{
        width: props.width ?? ' 6px',
        height: props.height ?? '36px',
        ...props.style
      }}
      alt="PDF"
    />
  )
}
