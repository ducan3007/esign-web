import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { SvgIconProps } from '@mui/material';
import PdfImage from 'src/assets/pdf.png';

export const IconPDF = (props: SvgIconProps) => {
  return (
    <PictureAsPdfIcon
      sx={{
        color: 'var(--red)',
        fontSize: '2.4rem',
        ...props.sx,
      }}
    />
  );
};

export const IconPDFImage = (props: SvgIconProps) => {
  return (
    <img
      src={PdfImage}
      style={{
        width: props.width ?? '18px',
        height: props.height ?? '18px',
        ...props.style,
      }}
      alt="PDF"
    />
  );
};
