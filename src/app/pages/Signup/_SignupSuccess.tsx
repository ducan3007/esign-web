import { Box, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

export const SignupSuccessPage = () => {
  return (
    <Box
      sx={{
        padding: '1.8rem',
      }}
    >
     <Typography
        sx={{
          fontWeight: 'bold',
          color: 'var(--orange)',
          fontSize: '3.5rem',
        }}
      >
        Sign up successfully!
      </Typography>
      <Typography
        sx={{
          fontWeight: 'bold',
          color: 'var(--blue3)',
          fontSize: '2.5rem',
        }}
      >
        Please check your email to verify your account. If you don't see the email, please check your spam folder.
      </Typography>
    </Box>
  )
}
