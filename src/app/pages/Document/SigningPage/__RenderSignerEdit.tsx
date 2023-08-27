import { getRandomColor } from '@esign-web/libs/utils'
import { actions } from '@esign-web/redux/document'
import { yupResolver } from '@hookform/resolvers/yup'
import CheckSharpIcon from '@mui/icons-material/CheckSharp'
import ClearRoundedIcon from '@mui/icons-material/ClearRounded'
import MailOutlineSharpIcon from '@mui/icons-material/MailOutlineSharp'
import PersonOutlineSharpIcon from '@mui/icons-material/PersonOutlineSharp'
import { Avatar, Box, IconButton } from '@mui/material'
import { sign } from 'crypto'
import { useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import TextFieldFilled from 'src/app/components/TextInput/Textfilled'
import * as yup from 'yup'

type Signers = {
  id: string
  color: string
  firstName: string
  lastName: string
  email: string
  setEnableEdit?: any
  signers?: any
}

export const RenderSignerEdit = (props: Signers) => {
  const dispatch = useDispatch()

  const schema = yup.object().shape({
    email: yup.string().email('Invalid email').required('Email is required'),
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
  })

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: props.email.trim(),
      firstName: props.firstName.trim(),
      lastName: props.lastName.trim(),
    },
  })

  const onSubmit: SubmitHandler<yup.InferType<typeof schema>> = (values) => {
    console.log('values', values)
    console.log(values)

    // if (props.signers[`${values.email}`] && values.email !== props.email) {
    //   setError('email', {
    //     type: 'manual',
    //     message: 'Email already added',
    //   })
    //   return
    // }

    for (let key in props.signers) {
      if (values.email === props.signers[key].email && props.signers[key].id !== props.id) {
        setError('email', {
          type: 'manual',
          message: 'Email already added',
        })
        return
      }
    }

    const signerClone: any = Object.assign({}, props.signers)
    signerClone[`${props.id}`] = {
      color: props.color,
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      id: props.id,
    }
    dispatch(actions.updateAllSigners(signerClone))
    reset()
    props.setEnableEdit(false)
  }

  const onInvalid = (errors) => console.error(errors)

  // console.log('signer', signer)
  console.log('errors', errors)
  return (
    <Box
      sx={{
        width: 'calc(100% - 4px)',
        maxWidth: '950px',
        height: 'fit-content',
        border: `1px solid var(--gray3)`,
        backgroundColor: '#F4F4F4',
        borderRadius: '99px',
        display: 'flex',
        // alignItems: 'center',
        padding: '5px 5px 5px 20px',
        marginBottom: '7px',
        marginLeft: 'auto',
        marginRight: 'auto',
        gap: '10px',
      }}
      component="form"
    >
      <Avatar sx={{ color: 'var(--white)', fontSize: '2.1rem', fontWeight: 'bold', alignSelf: 'center' }}></Avatar>

      {/* ------------------------ Frist Name  ------------------------*/}

      <Box sx={{ flex: 1, backgroundColor: 'white' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            border: errors.firstName ? '1px solid var(--error)' : '1px solid var(--color-gray1)',
          }}
        >
          <PersonOutlineSharpIcon sx={{ fontSize: '2.7rem', color: 'var(--dark3)', marginLeft: '8px' }} />
          <Controller
            name="firstName"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextFieldFilled
                {...field}
                InputProps={{ sx: { color: 'var(--dark)', fontSize: '1.6rem', padding: '0' } }}
                sx={{
                  '& .MuiInputBase-root': {
                    ':after': { borderBottom: 'none' },
                    ':before': { content: 'none' },
                    backgroundColor: 'var(--white)',
                    '&:hover': { backgroundColor: 'var(--white)' },
                    '& .MuiInputBase-input': { '&:focus': { backgroundColor: 'var(--white)' }, paddingLeft: '8px' },
                  },
                  '& .MuiFormLabel-root': { left: -3 },
                  '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottomColor: 'none' },
                }}
                label={'First name'}
                name="firstName"
                errors={errors.firstName ? { firstName: {} } : {}}
              />
            )}
          />
        </Box>
        <span style={{ color: 'red' }}>{errors.firstName?.message}</span>
      </Box>

      {/* ------------------------ Last Name ----------------------------- */}

      <Box
        sx={{
          flex: 1,
          alignItems: 'center',
        }}
      >
        <Box sx={{ border: errors.lastName ? '1px solid var(--error)' : '1px solid var(--color-gray1)' }}>
          <Controller
            name="lastName"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextFieldFilled
                {...field}
                InputProps={{ sx: { color: 'var(--dark)', fontSize: '1.6rem', padding: '0' } }}
                sx={{
                  '& .MuiInputBase-root': {
                    ':after': { borderBottom: 'none' },
                    ':before': { content: 'none' },
                    backgroundColor: 'white',
                    '&:hover': { backgroundColor: 'white' },
                    '& .MuiInputBase-input': { '&:focus': { backgroundColor: 'white' } },
                    borderRadius: '0px',
                  },
                  '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottomColor: 'none' },
                  width: '100%',
                }}
                label={'Last name'}
                name="lastName"
                errors={errors.lastName ? { lastName: {} } : {}}
              />
            )}
          />
        </Box>
        <span style={{ color: 'red' }}>{errors.lastName?.message}</span>
      </Box>

      {/* ------------------------ Email ------------------------ */}
      <Box sx={{ flex: 1.4, backgroundColor: 'white' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            border: errors.email ? '1px solid var(--error)' : '1px solid var(--color-gray1)',
          }}
        >
          <MailOutlineSharpIcon sx={{ fontSize: '2.7rem', color: 'var(--dark3)', marginLeft: '8px' }} />
          <Controller
            name="email"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextFieldFilled
                {...field}
                InputProps={{ sx: { color: 'var(--dark)', fontSize: '1.6rem', padding: '0' } }}
                sx={{
                  '& .MuiInputBase-root': {
                    ':after': { borderBottom: 'none' },
                    ':before': { content: 'none' },
                    backgroundColor: 'var(--white)',
                    '&:hover': { backgroundColor: 'var(--white)' },
                    '& .MuiInputBase-input': { '&:focus': { backgroundColor: 'var(--white)' }, paddingLeft: '8px' },
                  },
                  '& .MuiFormLabel-root': { left: -3 },
                  '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottomColor: 'none' },
                  width: '100%',
                }}
                label={'Email'}
                name="email"
                errors={errors.email ? { email: {} } : {}}
              />
            )}
          />
        </Box>
        <span style={{ color: 'red' }}>{errors.email?.message}</span>
      </Box>
      {/* ------------------------ Actions ------------------------ */}
      <Box sx={{ alignSelf: 'center' }}>
        <IconButton onClick={handleSubmit(onSubmit, onInvalid)} sx={{ margin: '0 0 0 0', padding: '5px' }}>
          <CheckSharpIcon sx={{ fontSize: '2.8rem', color: 'var(--blue3)' }} />
        </IconButton>
        <IconButton
          sx={{ margin: '0 0 0 0', padding: '7px' }}
          onClick={() => {
            props.setEnableEdit(false)
          }}
        >
          <ClearRoundedIcon sx={{ color: 'var(--error)', fontSize: '2.8rem' }} />
        </IconButton>
      </Box>
    </Box>
  )
}
