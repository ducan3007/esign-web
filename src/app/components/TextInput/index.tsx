import styled from '@emotion/styled';
import InputBase, { InputBaseProps } from '@mui/material/InputBase';
import OutlinedInput from '@mui/material/OutlinedInput';

interface Props extends InputBaseProps {
  label?: string;
  type?: string;
}

// Now we want to
const StyledInput = styled(InputBase)(({ theme }: any) => ({
  '& .MuiInputBase-input': {
    border: '1px solid',
    borderColor: 'var(--color-gray1)',
    borderRadius: '0px',
  },
  '& .MuiInputBase-input:focus': {
    borderColor: 'var(--blue1)',
  },
  // width: '100%',
}));

const StyledOutlinedInput = styled(OutlinedInput)(({ theme }: any) => ({
  // CSS here
}));

const MInputBase = ({ label, type, ...props }: Props) => {
  return <StyledInput type={type ?? 'text'} {...props} />;
};

const MOutlinedInput = ({ label, ...props }: Props) => {
  return <StyledOutlinedInput position="start" {...props} />;
};

export { MInputBase, MOutlinedInput };
