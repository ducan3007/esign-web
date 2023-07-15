import ButtonBase from '@mui/material/ButtonBase';
import { ButtonBaseProps } from '@mui/material/ButtonBase';
import styled from '@emotion/styled';
import { SxProps } from '@mui/material';

interface Props extends ButtonBaseProps {
  content?: any;
  color?: any;
  style?: any;
  sx?: SxProps;
  children?: any;
}

const StyledButton = styled(ButtonBase)(({ theme }: any) => ({
  '&:hover': {
    opacity: 0.8,
  },
}));

const MButton = ({ color, sx, style, content, children, ...props }: Props) => {
  const defaultSx: SxProps = {
    backgroundColor: 'var(--blue5)',
    color: 'var(--white)',
    fontSize: '1.6rem',
    fontWeight: 400,
    padding: '1rem 1.4rem',
    borderRadius: '0.5rem',
  };
  return (
    <StyledButton
      sx={{
        ...defaultSx,
        ...sx,
      }}
      style={style}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export const IconButton = (props: Props) => {
  return (
    <ButtonBase
      sx={{
        padding: '0',
        backgroundColor: 'var(--gray2)',
        color: 'var(--dark2)',
        borderRadius: '99rem',
        ':hover': {
          backgroundColor: 'var(--gray3)',
          opacity: 1,
        },
        ...props.sx,
      }}
      onClick={props.onClick}
    >
      {props.children}
    </ButtonBase>
  );
};

export default MButton;
