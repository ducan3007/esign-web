import { StandardTextFieldProps, TextField } from '@mui/material';
import React from 'react';
import { ControllerRenderProps } from 'react-hook-form';

interface MTextFieldProps extends StandardTextFieldProps {
  errors?: any;
  field?: ControllerRenderProps<any>;
  fontSize?: string;
  helperText?: string;
}

const TextFieldStandard = (props: MTextFieldProps, ref: any) => {
  const { field = {}, errors = {}, name, label, fontSize = '1.6rem', helperText = '1.6rem' } = props;

  return (
    <TextField
      {...field}
      {...props}
      sx={{
        '& .MuiInputBase-root': {
          ':after': { borderBottom: '3px solid var(--blue3)' },
        },
        '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottomColor: 'var(--blue3)' },
        ...props.sx,
      }}
      InputLabelProps={{
        sx: {
          color: 'var(--dark1)',
          fontSize: fontSize,
          fontWeight: 'bold',
          '&.Mui-focused': { color: errors.email ? 'var(--error)' : 'var(--blue3)' },
        },
        ...props.InputLabelProps,
      }}
      InputProps={{ sx: { color: 'var(--dark)', fontSize: fontSize, padding: '0.2rem 0' }, ...props.InputProps }}
      FormHelperTextProps={{ sx: { color: 'var(--error)', fontSize: helperText } }}
      error={errors[`${name}`] ? true : false}
      helperText={errors[`${name}`]?.message}
      label={label}
      variant="standard"
    />
  );
};

export default React.forwardRef(TextFieldStandard);
