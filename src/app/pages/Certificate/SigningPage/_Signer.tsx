import { Avatar, Box, Dialog, DialogContent, DialogTitle, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import MButton from 'src/app/components/Button'
import Cert from 'src/assets/cert.svg'

export type signersProps = {
  id?: string
  name?: string
  email?: string
  avatar?: string
  firstName?: string
  lastName?: string
  color?: string
  signers?: any
}

function RenderSigners(props: any) {
  const [searchParams] = useSearchParams()
  const documentId = searchParams.get('id')
  const { setSelectedSignerId, selectedSigner, cert } = props
  const [open, setOpen] = useState(false)

  const handleOpen = (signer: any) => {
    setOpen(true)
  }

  const handleSave = () => {}

  return (
    <Box
      sx={{
        width: '100%',
        marginBottom: cert?.status === 'REVOKED' || !props.is_hidden ? '0px' : '25px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {!cert?.status && Object.keys(selectedSigner).length === 0 && (
        <MButton
          disableRipple
          onClick={() => {
            setOpen(true)
          }}
          sx={{
            width: '100%',
            backgroundColor: 'var(--blue3)',
            borderRadius: '5px',
            border: '1px solid var(--blue3)',
            padding: '5px 12px',
            color: 'var(--orange)',
            transition: 'all 0.4s ease-in-out',
          }}
        >
          <Typography
            sx={{
              color: 'var(--white)',
              fontSize: '1.85rem',
              fontWeight: 'bold',
              letterSpacing: '2px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            Issue
          </Typography>
        </MButton>
      )}

      {!cert?.status && Object.keys(selectedSigner).length > 0 && (
        <Box
          onClick={() => {
            setOpen(true)
          }}
          sx={{
            marginBottom: '13px',
            width: '100%',
            height: '52px',
            position: 'relative',
            border: `2px solid ${selectedSigner.color}`,
            backgroundColor: `${rgba(selectedSigner.color, 0.5)}`,
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            padding: '2px 0px',
            cursor: 'pointer',
            ':hover': {
              backgroundColor: `${rgba(selectedSigner.color, 0.7)}`,
            },
            transition: '0.2s ease-in-out',
          }}
        >
          <Avatar
            sx={{
              color: 'var(--white)',
              fontSize: '2.1rem',
              fontWeight: 'bold',
              alignSelf: 'center',
              marginLeft: '8px',
              backgroundColor: 'var(--blue3)',
            }}
          >
            {selectedSigner.firstName.toUpperCase().charAt(0)}
          </Avatar>
          <Box sx={{ display: 'flex', flexDirection: 'column', padding: '0 9px', width: '238px' }}>
            <Box
              sx={{
                flex: 1,
                height: '50%',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              <span
                style={{
                  fontSize: '1.6rem',
                  fontWeight: 'bold',
                  color: 'var(--blue3)',
                }}
              >{`${selectedSigner.firstName} ${selectedSigner.lastName}`}</span>
            </Box>
            <Box
              sx={{
                flex: 1.5,
                height: '50%',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {selectedSigner.email}
            </Box>
          </Box>
          <img src={Cert} style={{ marginRight: '10px' }} alt="metamask" width="38px" height="38px" />
        </Box>
      )}

      {cert?.status === 'ISSUED' && !props.isHidden && (
        <AlertDialog
          title="Are you sure you want to REVOKED this certificate ?"
          content=""
          callBack={async () => {
            try {
              await baseApi.post('cert/revoke/' + documentId)
              window.location.reload()
            } catch (error) {}
          }}
        >
          <MButton
            disableRipple
            sx={{
              width: '100%',
              backgroundColor: 'var(--red1)',
              borderRadius: '5px',
              border: '1px solid var(--red1)',
              padding: '5px 12px',
              color: 'var(--orange)',
              transition: 'all 0.4s ease-in-out',
            }}
          >
            <Typography
              sx={{
                color: 'var(--white)',
                fontSize: '1.85rem',
                fontWeight: 'bold',
                letterSpacing: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              Revoke
            </Typography>
          </MButton>
        </AlertDialog>
      )}

      {/* _______________________________Dialog __________________________________ */}
      <Dialog
        disableEscapeKeyDown
        open={open}
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            setOpen(false)
          }
        }}
        sx={{
          '& .MuiDialog-paper': {
            width: 1200,
            maxHeight: 850,
            maxWidth: 'none',
            borderRadius: '15px',
            boxShadow: 'none',
          },
          '& .MuiBackdrop-root': { backgroundColor: 'rgba(0, 0, 0, 0.3)' },
        }}
      >
        {/* -----------------------------------------   Dialog Title  --------------------------------------------------- */}

        <DialogTitle sx={{ padding: '10px 60px 15px 80px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          {/* <IconSignature width={64} height={62} style={{ marginBottom: '15px' }} /> */}

          <Typography
            sx={{
              fontSize: '2.7rem',
              padding: '12px',
              color: 'var(--blue3)',
              fontWeight: 'bold',
            }}
          >
            Certificant Infomation
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ overflow: 'hidden' }}>
          {/* ----------------------------------------- Dialog  Content --------------------------------------------------- */}

          <Box sx={{ maxWidth: '950px', height: '100%', margin: '0 auto', position: 'relative', display: 'flex', flexDirection: 'column' }}>
            <RenderSignerAdd signers={selectedSigner} setOpen={setOpen} setSelectedSignerId={setSelectedSignerId} />

            <Box sx={{ padding: '0px 0px 15px 0px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px' }}></Box>

            <Box
              sx={{
                width: '100%',
                maxHeight: '700px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto',
                // border: '1px solid var(--color-gray1)',
                '&::-webkit-scrollbar': { width: '5px' },
                '&::-webkit-scrollbar-track': { background: 'transparent', marginBottom: '5px' },
                '&::-webkit-scrollbar-thumb': { background: 'var(--color-gray1)', borderRadius: '10px', border: '1px solid var(--white)' },
              }}
            >
              {/* -------------------------------------------- Mapping ----------------------------------------------------- */}
            </Box>
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '10px' }}>
              <MButton
                autoFocus
                onClick={() => {
                  document.getElementById('submit-certificant')?.click()
                }}
                sx={{ backgroundColor: 'var(--orange)' }}
              >
                <span style={{ color: 'var(--white)', fontWeight: 'bold' }}> Save </span>
              </MButton>
              <MButton
                onClick={() => {
                  setOpen(false)
                }}
                sx={{ backgroundColor: 'var(--dark5)' }}
              >
                <span style={{ color: 'var(--white)', fontWeight: 'bold' }}> Cancel</span>
              </MButton>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  )
}

export default RenderSigners

/* _________________________________ RenderSignerAdd ____________________________ */

import { baseApi, rgba } from '@esign-web/libs/utils'
import { yupResolver } from '@hookform/resolvers/yup'
import { SET_SIGNER, SET_SIGNER_2 } from 'libs/redux/certificate/src/lib/constants'
import { nanoid } from 'nanoid'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import TextFieldStandard from 'src/app/components/TextInput/Textstandard'
import * as yup from 'yup'
import AlertDialog from 'src/app/components/Dialog'

const RenderSignerAdd = (props: any) => {
  const { signers } = props
  const dispatch = useDispatch()
  const schema = yup.object().shape({
    email: yup.string().email('Invalid email').required('Email is required'),
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    issuedOn: yup.string().required('Issued On is required'),
    expiredOn: yup.string().required('Expired On is required'),
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
      email: '' || signers?.email,
      firstName: '' || signers?.firstName,
      lastName: '' || signers?.lastName,
      issuedOn: new Date().toISOString().slice(0, 16),
      expiredOn: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().slice(0, 16),
    },
  })

  const onSubmit: SubmitHandler<yup.InferType<typeof schema>> = (values) => {
    console.log('values', values)

    if (new Date(values.issuedOn).getTime() > new Date(values.expiredOn).getTime()) {
      setError('expiredOn', { type: 'manual', message: 'Expiry Time must be greater than Issued Time' })
      return
    }

    values.expiredOn = new Date(values.expiredOn).getTime() as any
    values.issuedOn = new Date(values.issuedOn).getTime() as any

    let id = nanoid()

    let data = {
      ...values,
      id,
      color: 'rgb(179,221,249)',
      fields: 0,
    }

    if (signers.id) {
      data.id = signers.id
      id = signers.id
    }

    dispatch({
      type: SET_SIGNER,
      payload: {
        [id]: data,
      },
    })

    dispatch({
      type: SET_SIGNER_2,
      payload: {
        [id]: data,
      },
    })

    props.setSelectedSignerId(id)

    reset()

    const input = document.getElementById('cljkseioj')
    if (input) {
      input.focus()
    }
    props.setOpen(false)
  }

  console.log('signers', signers)
  return (
    <Box
      component="form"
      sx={{
        width: '100%',
        maxWidth: '950px',
        display: 'flex',
        flexDirection: 'column',
        margin: '1px auto 5px auto',
        gap: '20px',
      }}
    >
      {/* ------------------------ Frist Name  ------------------------*/}
      <Box sx={{ flex: 1, backgroundColor: 'white' }}>
        <Controller
          name="firstName"
          control={control}
          rules={{ required: true }}
          render={({ field }) => <TextFieldStandard {...field} errors={errors} fullWidth name="firstName" label="First Name" fontSize="2.2rem" />}
        />
      </Box>
      {/* ------------------------ Last Name  ------------------------*/}
      <Box sx={{ flex: 1, alignItems: 'center' }}>
        <Controller
          name="lastName"
          control={control}
          rules={{ required: true }}
          render={({ field }) => <TextFieldStandard {...field} errors={errors} fullWidth name="lastName" label="Last Name" fontSize="2.2rem" />}
        />
      </Box>
      {/* ------------------------ Email  ------------------------*/}
      <Box sx={{ flex: 1.3, backgroundColor: 'white' }}>
        <Controller
          name="email"
          control={control}
          rules={{ required: true }}
          render={({ field }) => <TextFieldStandard {...field} errors={errors} fullWidth name="email" label="Email" fontSize="2.2rem" />}
        />
      </Box>

      <Box
        sx={{
          padding: '28px',
          borderRadius: '12px',
          backgroundColor: 'var(--ac)',
          marginTop: '12px',
          width: '60%',
        }}
      >
        <Box sx={{ flex: 1.3, backgroundColor: 'var(--ac)', marginTop: '12px' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              height: '56px',
              marginBottom: '5px',
              gap: '40px',
            }}
          >
            <Typography
              sx={{
                color: 'var(--blue3)',
                fontWeight: 'bold',
                fontSize: '2.2rem',
              }}
            >
              Begins on
            </Typography>

            <Controller
              name="issuedOn"
              control={control}
              // defaultValue={signers?.issuedOn ? new Date(signers?.issuedOn).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16)}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  {...field}
                  id="datetime-local"
                  type="datetime-local"
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-input': {
                      fontSize: 20,
                      fontWeight: 'bold',
                      color: 'var(--dark2)',
                      letterSpacing: '1px',
                    },
                    borderColor: 'transparent',
                  }}
                />
              )}
            />
          </Box>
        </Box>

        <Box sx={{ flex: 1.3, backgroundColor: 'var(--ac)', marginTop: '40px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', height: '56px', marginBottom: '5px', gap: '40px' }}>
            <Typography
              sx={{
                color: 'var(--blue3)',
                fontWeight: 'bold',
                fontSize: '2.2rem',
              }}
            >
              Expires on
            </Typography>

            <Controller
              name="expiredOn"
              control={control}
              // defaultValue={signers?.expiredOn ? new Date(signers?.expiredOn).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16)}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  {...field}
                  id="datetime-local"
                  type="datetime-local"
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-input': {
                      fontSize: 20,
                      fontWeight: 'bold',
                      color: 'var(--dark2)',
                      letterSpacing: '1px',
                    },
                    borderColor: 'transparent',
                  }}
                />
              )}
            />
          </Box>
        </Box>
        <span style={{ color: 'red', fontSize: '1.5rem' }}>{errors.expiredOn?.message}</span>
      </Box>
      <MButton id="submit-certificant" type="submit" onClick={handleSubmit(onSubmit)} sx={{ display: 'none' }}></MButton>
    </Box>
  )
}
