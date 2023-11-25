import { selectors } from '@esign-web/redux/auth'
import { Box, Typography } from '@mui/material'
import moment from 'moment'
import { useSelector } from 'react-redux'

const AccountSettingsPage = () => {
  const authState = useSelector(selectors.getAuthState)
  console.log(authState)
  return (
    <Box sx={{ width: '100%', padding: '30px' }}>
      <Box sx={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
        <Typography sx={{ fontSize: '2.5rem', color: 'var(--dark2)', fontWeight: 'bold' }}>Email :</Typography>
        <Typography
          sx={{
            fontSize: '2.5rem',
            color: 'var(--blue3)',
            fontWeight: 'bold',
          }}
        >
          {authState?.data.email}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
        <Typography sx={{ fontSize: '2.5rem', color: 'var(--dark2)', fontWeight: 'bold' }}>First Name :</Typography>
        <Typography
          sx={{
            fontSize: '2.5rem',
            color: 'var(--blue3)',
            fontWeight: 'bold',
          }}
        >
          {authState?.data.first_name}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
        <Typography sx={{ fontSize: '2.5rem', color: 'var(--dark2)', fontWeight: 'bold' }}>Last Name :</Typography>
        <Typography
          sx={{
            fontSize: '2.5rem',
            color: 'var(--blue3)',
            fontWeight: 'bold',
          }}
        >
          {authState?.data.last_name}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
        <Typography sx={{ fontSize: '2.5rem', color: 'var(--dark2)', fontWeight: 'bold' }}>Created at :</Typography>
        <Typography
          sx={{
            fontSize: '2.5rem',
            color: 'var(--blue3)',
            fontWeight: 'bold',
          }}
        >
          {moment(authState?.data.created_at).format('DD/MM/YYYY')}
        </Typography>
      </Box>
    </Box>
  )
}
export default AccountSettingsPage
