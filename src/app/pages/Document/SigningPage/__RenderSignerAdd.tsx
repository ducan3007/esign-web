import { getRandomColor } from '@esign-web/libs/utils'
import { actions } from '@esign-web/redux/document'
import { selectors, actions as signatureActions } from '@esign-web/redux/signatures'
import { yupResolver } from '@hookform/resolvers/yup'
import MailOutlineSharpIcon from '@mui/icons-material/MailOutlineSharp'
import PersonOutlineSharpIcon from '@mui/icons-material/PersonOutlineSharp'
import { selectors as AuthSelectors } from '@esign-web/redux/auth'
import { Box, IconButton } from '@mui/material'
import { nanoid } from 'nanoid'
import { useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import MButton from 'src/app/components/Button'
import TextFieldFilled from 'src/app/components/TextInput/Textfilled'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import * as yup from 'yup'
import { MTooltip } from 'src/app/components/Tooltip'

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
})

export const RenderSignerAdd = (props: any) => {
  const dispatch = useDispatch()

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
    reset,
  } = useForm({ resolver: yupResolver(schema) })

  const onSubmit: SubmitHandler<yup.InferType<typeof schema>> = (values) => {
    console.log('values', values)
    console.log(values)

    for (let key in props.signers) {
      if (values.email === props.signers[key].email) {
        setError('email', {
          type: 'manual',
          message: 'Email already added',
        })
        return
      }
    }

    dispatch(
      actions.setSigners({
        id: nanoid(),
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName,
        color: getRandomColor(),
        fields: 0,
      })
    )
    reset()
    const input = document.getElementById('cljkseioj')
    if (input) {
      input.focus()
    }
  }

  return (
    <Box component="form" sx={{ width: '100%', maxWidth: '950px', display: 'flex', margin: '1px auto 5px auto', gap: '10px' }}>
      {/* ------------------------ Frist Name  ------------------------*/}
      <Box sx={{ flex: 1, backgroundColor: 'white' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            border: errors.firstName ? '1px solid var(--error)' : '1px solid var(--color-gray1)',
            height: '56px',
            marginBottom: '5px',
          }}
        >
          <PersonOutlineSharpIcon sx={{ fontSize: '2.7rem', color: 'var(--dark3)', marginLeft: '8px' }} />
          <Controller
            name="firstName"
            control={control}
            defaultValue=""
            rules={{ required: true }}
            render={({ field }) => (
              <TextFieldFilled
                {...field}
                id="cljkseioj"
                sx={{
                  '& .MuiInputBase-root': {
                    ':after': { borderBottom: 'none' },
                    ':before': { content: 'none' },
                    backgroundColor: props.backgroundColor || 'transparent',
                    '&:hover': { backgroundColor: 'transparent' },
                    '& .MuiInputBase-input': { '&:focus': { backgroundColor: 'white' }, paddingLeft: '8px' },
                    '& .MuiFilledInput-input': { paddingTop: '23px' },
                  },
                  '& .MuiFormLabel-root': { left: -3 },
                  '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottomColor: 'none' },
                  width: '90%',
                }}
                autoFocus
                InputProps={{ sx: { color: 'var(--dark)', fontSize: '1.6rem', padding: '0' } }}
                name="firstName"
                label="First name"
                errors={errors.firstName ? { firstName: {} } : {}}
              />
            )}
          />
        </Box>

        <span style={{ color: 'red' }}>{errors.firstName?.message}</span>
      </Box>

      {/* ------------------------ Last Name  ------------------------*/}
      <Box
        sx={{
          flex: 1,
          alignItems: 'center',
          border: errors.lastName ? '1px solid var(--error)' : '1px solid var(--color-gray1)',
          height: '56px',
        }}
      >
        <Controller
          name="lastName"
          control={control}
          defaultValue=""
          rules={{ required: true }}
          render={({ field }) => (
            <TextFieldFilled
              {...field}
              sx={{
                '& .MuiInputBase-root': {
                  ':after': { borderBottom: 'none' },
                  ':before': { content: 'none' },
                  backgroundColor: props.backgroundColor || 'transparent',
                  '&:hover': { backgroundColor: 'transparent' },
                  '& .MuiInputBase-input': { '&:focus': { backgroundColor: 'transparent' } },
                  borderRadius: '0px',
                },
                '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottomColor: 'none' },
                width: '95%',
                marginBottom: '5px',
              }}
              InputProps={{ sx: { color: 'var(--dark)', fontSize: '1.6rem', padding: '0' } }}
              label={'Last name'}
              name="lastName"
              errors={errors.lastName ? { lastName: {} } : {}}
            />
          )}
        />

        <span style={{ color: 'red', paddingTop: '2px' }}>{errors.lastName?.message}</span>
      </Box>

      {/* ------------------------ Email  ------------------------*/}
      <Box sx={{ flex: 1.3, backgroundColor: 'white' }}>
        <Controller
          name="email"
          control={control}
          defaultValue=""
          rules={{ required: true }}
          render={({ field }) => (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                border: errors.email ? '1px solid var(--error)' : '1px solid var(--color-gray1)',
                marginBottom: '5px',
              }}
            >
              <MailOutlineSharpIcon sx={{ fontSize: '2.7rem', color: 'var(--dark3)', marginLeft: '8px' }} />
              <TextFieldFilled
                {...field}
                sx={{
                  '& .MuiInputBase-root': {
                    ':after': { borderBottom: 'none' },
                    ':before': { content: 'none' },
                    backgroundColor: props.backgroundColor || 'transparent',
                    '&:hover': { backgroundColor: 'transparent' },
                    '& .MuiInputBase-input': { '&:focus': { backgroundColor: 'transparent' }, paddingLeft: '8px' },
                  },
                  '& .MuiFormLabel-root': { left: -3 },
                  '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottomColor: 'none' },
                  width: '90%',
                }}
                label={'Email'}
                InputProps={{ sx: { color: 'var(--dark)', fontSize: '1.6rem', padding: '0' } }}
                name="email"
                errors={errors.email ? { email: {} } : {}}
              />
            </Box>
          )}
        />

        <span style={{ color: 'red' }}>{errors.email?.message}</span>
      </Box>
      <Box sx={{ height: '56px', width: 'fit-content' }}>
        <MButton type="submit" onClick={handleSubmit(onSubmit)} sx={{ height: '100%', padding: '0 20px', backgroundColor: 'var(--orange)' }}>
          <span style={{ color: 'white', fontSize: '1.6rem', fontWeight: 'bold' }}>Add</span>
        </MButton>
      </Box>
    </Box>
  )
}

export const AutoSave = () => {
  const dispatch = useDispatch()
  const isSignatureAuto = useSelector(selectors.getAutoSave)
  const authState = useSelector(AuthSelectors.getAuthState)

  if (!authState) {
    return null
  }

  return (
    <MTooltip title={'Auto save'} fontSize="1.5rem" background="var(--white)" fontWeight="bold" color="var(--blue3)" nowrap="true">
      <IconButton
        sx={{
          marginRight: '10px',
        }}
        onClick={() => {
          dispatch(signatureActions.toggleAutoSave({}))
        }}
      >
        {!isSignatureAuto && <BookmarkBorderIcon sx={{ fontSize: '3.5rem' }} />}
        {isSignatureAuto && <BookmarkIcon sx={{ fontSize: '3.5rem', color: 'var(--orange)' }} />}
      </IconButton>
    </MTooltip>
  )
}
