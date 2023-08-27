import { StandardTextFieldProps, TextField } from '@mui/material'
import React from 'react'
import { ControllerRenderProps } from 'react-hook-form'

interface MTextFieldProps extends StandardTextFieldProps {
  errors?: any
  field?: ControllerRenderProps<any>
  fontSize?: string
  helperText?: string
  backgroundColor?: string
}

const TextFieldFilled = (props: MTextFieldProps, ref: any) => {
  const { field = {}, errors = {}, name, label, fontSize = '1.6rem', helperText = '1.6rem' } = props

  return (
    <TextField
      {...field}
      {...props}
      sx={{
        '& .MuiInputBase-root': {
          ':after': { borderBottom: 'none' },
          ':before': { content: 'none' },
          backgroundColor: props.backgroundColor || 'var(--white)',
        },
        '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottomColor: 'none' },
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
      variant="filled"
    >
      {props.children}
    </TextField>
  )
}

export default React.forwardRef(TextFieldFilled)
