import { Box, Typography } from '@mui/material'
import { useEffect } from 'react'

export const DocumentVerifyPage = (props) => {
  const {
    state = {
      data: [],
      matched: '',
    },
  } = props

  if (state.data === 0) return <></>

  return (
    <Box sx={{ width: '100%', padding: '5px' }}>
      {state?.data?.map((item) => {
        let matched = item?.matched

        return (
          <Box
            key={item?.id}
            sx={{
              marginBottom: '50px',
              padding: '20px',
              backgroundColor: 'var(--ac)',
              borderRadius: '12px',
              display: 'flex',
              gap: '20px',
            }}
          >
            <Box
              sx={{
                flex: 1,
                minWidth: '1000px',
              }}
            >
              <Typography sx={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--blue3)' }}>Author</Typography>
              <Typography sx={{ fontSize: '2rem' }}>Email: {item?.user?.email}</Typography>
              <Typography sx={{ fontSize: '2rem', marginBottom: '20px' }}>
                Name: {item?.user?.first_name} {item?.user?.last_name}
              </Typography>
              <Typography sx={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--blue3)' }}>Document</Typography>
              <Typography sx={{ fontSize: '2rem', letterSpacing: '0.5px' }}>Name: {item?.name}</Typography>
              <Typography sx={{ fontSize: '2rem', letterSpacing: '0.5px' }}>
                Hash:{' '}
                <span className={matched === 'hash256' ? 'matched' : ''} style={{ fontSize: '2rem', letterSpacing: '0.5px' }}>
                  {item?.hash256}
                </span>
              </Typography>

              <Typography sx={{ fontSize: '2rem', letterSpacing: '0.5px' }}>
                Original hash:
                <span className={matched === 'orginial_hash_256' ? 'matched' : ''} style={{ fontSize: '2rem', letterSpacing: '0.5px' }}>
                  {' '}
                  {item?.orginial_hash_256 || 'N/A'}
                </span>
              </Typography>

              <Typography sx={{ fontSize: '2rem' }}>
                Final hash:
                <span className={matched === 'final_hash256' ? 'matched' : ''} style={{ fontSize: '2rem', letterSpacing: '0.5px' }}>
                  {' '}
                  {item?.final_hash256 || 'N/A'}
                </span>
              </Typography>

              <Typography sx={{ fontSize: '2rem' }}>
                Transaction:
                <span style={{ fontSize: '2rem', letterSpacing: '0.5px' }}> {item?.transaction_hash || 'N/A'}</span>
              </Typography>

              <Typography sx={{ fontSize: '2rem' }}>Created: {new Date(item?.createdAt).toLocaleString()}</Typography>
              <Typography sx={{ fontSize: '2rem' }}>Updated: {new Date(item?.updatedAt).toLocaleString()}</Typography>

              <Typography sx={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--blue3)' }}>Signers</Typography>
              {item?.document_signer?.map((signer, index) => {
                let status = signer?.is_signed ? 'Signed' : 'Not signed'
                return (
                  <Box
                    key={index}
                    sx={{
                      marginTop: '20px',
                      width: '940px',
                      padding: '20px',
                      borderRadius: '12px',
                      backgroundColor: 'var(--lightaa)',
                    }}
                  >
                    <Typography sx={{ fontSize: '2rem' }}>Email: {signer?.user_email}</Typography>
                    <Typography sx={{ fontSize: '2rem' }}>Status: {status}</Typography>
                    <Typography sx={{ fontSize: '2rem' }}>
                      Sign at: {signer?.signedAt ? new Date(signer?.signedAt).toLocaleString() : 'N/A'}
                    </Typography>
                    <Typography sx={{ fontSize: '2rem' }}>Tx Hash: {signer?.tx_hash || 'N/A'}</Typography>
                    <Typography sx={{ fontSize: '2rem' }}>
                      Tx Timestamp: {signer?.tx_timestamp ? new Date(signer?.tx_timestamp).toLocaleString() : 'N/A' || 'N/A'}
                    </Typography>
                    <Typography sx={{ fontSize: '2rem' }}>Address: {signer?.sign_address || 'N/A'}</Typography>
                  </Box>
                )
              })}
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
              }}
            >
              <img src={item?.thumbnail} style={{ width: '400px', marginTop: '15px', alignSelf: 'center' }} />
            </Box>
          </Box>
        )
      })}
    </Box>
  )
}
