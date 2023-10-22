import { actions } from '@esign-web/redux/auth'
import { yupResolver } from '@hookform/resolvers/yup'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { Box, IconButton, InputAdornment, Typography } from '@mui/material'
import { useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import MButton from 'src/app/components/Button'
import TextFieldStandard from 'src/app/components/TextInput/Textstandard'
import * as yup from 'yup'

interface Props {
  setIsSignupSuccess: (value: boolean) => void
}

const signUpSchema = yup.object().shape({
  email: yup.string().email('Email must be in the format email@example.com').required('Email is required'),
  password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
  firstName: yup.string().required('First Name is required'),
  lastName: yup.string().required('Last Name is required'),
  confirmPassword: yup
    .string()
    .nullable() // allow null as a valid value
    .required('Confirm Password is required')
    .min(6, 'Confirm Password must be at least 6 characters')
    .oneOf([yup.ref('password')], 'Passwords must match')
})

export const SignupForm = (props: Props) => {
  const dispatch = useDispatch()
  const [showPassword, setShowPassword] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({ resolver: yupResolver(signUpSchema) })

  const onSubmit: SubmitHandler<yup.InferType<typeof signUpSchema>> = (values) => {
    console.log(values)
    dispatch(actions.signup(values))
    props.setIsSignupSuccess(true)
  }





  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'row',
          gap: '5rem',
          alignItems: 'center'
        }}
      >
        <Controller
          name="firstName"
          control={control}
          defaultValue=""
          rules={{ required: true }}
          render={({ field }) => <TextFieldStandard {...field} errors={errors} fullWidth name="firstName" label="First Name" fontSize="2.2rem" />}
        />

        <Controller
          name="lastName"
          control={control}
          defaultValue=""
          rules={{ required: true }}
          render={({ field }) => <TextFieldStandard {...field} errors={errors} fullWidth name="lastName" label="Last Name" fontSize="2.2rem" />}
        />
      </Box>

      <Controller
        name="email"
        control={control}
        defaultValue=""
        rules={{ required: true }}
        render={({ field }) => <TextFieldStandard {...field} errors={errors} name="email" label="Email" fontSize="2.2rem" />}
      />

      <Controller
        name="password"
        control={control}
        defaultValue=""
        rules={{ required: true, minLength: 6 }}
        render={({ field }) => (
          <TextFieldStandard
            {...field}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                    {showPassword ? (
                      <VisibilityOff fontSize="large" sx={{ marginRight: '0.8rem' }} />
                    ) : (
                      <Visibility fontSize="large" sx={{ marginRight: '0.8rem' }} />
                    )}
                  </IconButton>
                </InputAdornment>
              )
            }}
            errors={errors}
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            fontSize="2.2rem"
          />
        )}
      />

      <Controller
        name="confirmPassword"
        control={control}
        defaultValue=""
        rules={{ required: true, minLength: 6 }}
        render={({ field }) => (
          <TextFieldStandard {...field} errors={errors} name="confirmPassword" label="Confirm Password" type="password" fontSize="2.2rem" />
        )}
      />

      <Box sx={{ display: 'flex', justifyContent: 'right', alignItems: 'center', marginTop: '2rem', gap: '1rem' }}>
        <MButton
          type="submit"
          sx={{ padding: '1rem 1.8rem', borderRadius: '99rem', backgroundColor: 'var(--blue3)', fontSize: '1.6rem', fontWeight: 400, boxShadow: 'var(--shadow3)', display: 'block' }}
        >
          <Typography color="var(--white)" variant="h4">
            Get Started
          </Typography>
        </MButton>
      </Box>
    </Box>
  )
}
