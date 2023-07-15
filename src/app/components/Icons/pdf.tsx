import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { SvgIconProps } from '@mui/material';

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
