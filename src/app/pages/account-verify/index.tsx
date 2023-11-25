import { Box, Typography } from '@mui/material'
import MButton from 'src/app/components/Button'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Link, useSearchParams } from 'react-router-dom'
import { baseApi } from '@esign-web/libs/utils'

export const WelcometoEsign = () => {
  const [searchParams] = useSearchParams()

  const verifyToken = async () => {
    try {
      let token = searchParams.get('verify_token')
      if (token) {
        await baseApi.get('/auth/verify' + '?verify_token=' + token)
        window.location.href = '/login'
      }
    } catch (error) {}
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '5rem',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100vw',
      }}
    >
      <Typography sx={{ fontWeight: 'bold', color: 'var(--blue3)', fontSize: '5rem' }}>Welcome to Esign Platform!</Typography>
      <MButton onClick={verifyToken} sx={{ backgroundColor: 'var(--orange)', borderRadius: '10rem', padding: '2rem' }}>
        <Typography sx={{ color: 'var(--white)', fontWeight: 'bold', fontSize: '2.2rem' }}>Verify my account</Typography>
      </MButton>
    </Box>
  )
}
