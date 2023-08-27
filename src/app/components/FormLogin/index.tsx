import { actions } from '@esign-web/redux/auth'
import { yupResolver } from '@hookform/resolvers/yup'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { Box, CircularProgress, IconButton, InputAdornment, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import MButton from 'src/app/components/Button'
import TextFieldStandard from 'src/app/components/TextInput/Textstandard'
import * as yup from 'yup'

interface props {
  authenticating: boolean
  error: any
}

const schema = yup.object().shape({
  email: yup.string().email('Email must be in the format email@example.com').required('Email is required'),
  password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters')
})

export const LoginForm = (props: props) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  // useEffect(() => {
  //   return () => {
  //     dispatch(actions.resetAuthState())
  //   }
  // }, [])

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({ resolver: yupResolver(schema) })

  const onSubmit: SubmitHandler<yup.InferType<typeof schema>> = (values) => {
    console.log(values)
    dispatch(
      actions.login({
        email: values.email,
        password: values.password,
        callBack: () => {
          navigate('/dashboard')
        }
      })
    )
  }
  console.log(errors)

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
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
      <Typography
        variant="h4"
        sx={{
          color: 'var(--error)'
        }}
      >
        {props.error && 'Email or password is incorrect'}
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem' }}>
        <Typography sx={{ fontSize: '1.7rem', color: 'var(--blue3)', marginBottom: '1.7rem', fontWeight: 'bold' }}>Forgot your password?</Typography>
      </Box>

      <MButton
        type="submit"
        sx={{
          right: '0',
          padding: '1rem 1.8rem',
          // margin: '2rem 0 0 0',
          borderRadius: '99rem',
          backgroundColor: 'var(--blue3)',
          fontSize: '1.6rem',
          fontWeight: 400,
          boxShadow: 'var(--shadow3)',
          display: 'block'
        }}
      >
        {props.authenticating ? (
          <CircularProgress size={22} sx={{ color: 'var(--white)' }} />
        ) : (
          <Typography color="var(--white)" variant="h4" fontWeight="bold">
            Log in
          </Typography>
        )}
      </MButton>
    </Box>
  )
}
