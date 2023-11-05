import { Box, Typography } from '@mui/material'

export const EmailVerifyPage = (props) => {
  const { state = [] } = props

  if (state.length === 0) return <></>
  return (
    <Box
      sx={{
        width: '60%',
        minWidth: '600px',
      }}
    >
      {state[0]?.wallet?.map((item) => {
        return (
          <Box
            sx={{
              marginBottom: '50px',
              padding: '20px',
              backgroundColor: 'var(--ac)',
              borderRadius: '12px',
            }}
          >
            <Typography sx={{ fontSize: '2rem' }}>
              Address: <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--orange)', letterSpacing: '0.5px' }}>{item?.email}</span>
            </Typography>
            <Typography sx={{ fontSize: '2rem' }}>Address: {item?.address}</Typography>
            <Typography sx={{ fontSize: '2rem', width: '600px', textOverflow: 'ellipsis', wordWrap: 'break-word', whiteSpace: 'nowrap' }}>
              Signature: {item?.signature}
            </Typography>
            <Typography sx={{ fontSize: '2rem' }}>Message</Typography>
            <textarea
              disabled
              style={{ marginTop: '7px', fontSize: '1.7rem', width: '620px', height: '200px', border: '1px solid var(--gray3)', borderRadius: '5px' }}
              value={item?.message}
            ></textarea>
          </Box>
        )
      })}
      {state[0]?.wallet?.length === 0 && <Typography sx={{ fontSize: '2.5rem', marginTop: '20px' }}>No address found</Typography>}
    </Box>
  )
}

export const AddressVerifyPage = (props) => {
  const { state = [] } = props

  if (state.length === 0) return <></>
  if (state.data && state.data.length === 0) return <></>

  return (
    <Box
      sx={{
        width: '60%',
        minWidth: '600px',
        marginBottom: '50px',
      }}
    >
      {state?.map((item) => {
        return (
          <Box
            sx={{
              marginBottom: '20px',
              padding: '20px',
              backgroundColor: 'var(--ac)',
              borderRadius: '12px',
            }}
          >
            <Typography sx={{ fontSize: '2rem' }}>
              Address: <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--orange)', letterSpacing: '0.5px' }}>{item?.address}</span>
            </Typography>
            <Typography sx={{ fontSize: '2rem' }}>Email: {item?.email}</Typography>
            <Typography sx={{ fontSize: '2rem', width: '600px', textOverflow: 'ellipsis', wordWrap: 'break-word', whiteSpace: 'nowrap' }}>
              Signature: {item?.signature}
            </Typography>
            <Typography sx={{ fontSize: '2rem' }}>Message: </Typography>
            <textarea
              disabled
              style={{ marginTop: '7px', fontSize: '1.7rem', width: '620px', height: '200px', border: '1px solid var(--gray3)', borderRadius: '5px' }}
              value={item?.message}
            ></textarea>
          </Box>
        )
      })}
    </Box>
  )
}
