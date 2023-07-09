import ButtonBase from '@mui/material/ButtonBase';
import { ButtonBaseProps } from '@mui/material/ButtonBase';
import styled from '@emotion/styled';
import { SxProps } from '@mui/material';

interface Props extends ButtonBaseProps {
  content?: any;
  color?: any;
  style?: any;
  sx?: SxProps;
  handleClick?: () => void;
  children?: any;
}

const StyledButton = styled(ButtonBase)(({ theme }: any) => ({
  '&:hover': {
    opacity: 0.8,
  },
}));

const MButton = ({ color, sx, style, content, handleClick, children, ...props }: Props) => {
  return (
    <StyledButton sx={sx} style={style} {...props} onClick={handleClick}>
      {children}
    </StyledButton>
  );
};

export default MButton;
