import { Box, Typography } from '@mui/material'
import { fontWeight } from 'html2canvas/dist/types/css/property-descriptors/font-weight'
import { useEffect } from 'react'

export const CertTemplateVerifyPage = (props) => {
  const {
    state = {
      data: [],
      matched: '',
    },
  } = props

  console.log('state', state)

  if (state.length === 0) return <></>
  if (state.data.length === 0) return <></>

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
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--blue3)' }}>Author</Typography>
              <Typography sx={{ fontSize: '2rem' }}>Email: {item?.user?.email}</Typography>
              <Typography sx={{ fontSize: '2rem' }}>Address: {item?.issuer_address}</Typography>
              <Typography sx={{ fontSize: '2rem', marginBottom: '20px' }}>
                Name: {item?.user?.first_name} {item?.user?.last_name}
              </Typography>

              <Typography sx={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--blue3)' }}>Certificate</Typography>
              <Typography sx={{ fontSize: '2rem', letterSpacing: '0.5px' }}>Name: {item?.name}</Typography>
              <Typography sx={{ fontSize: '2rem', letterSpacing: '0.5px' }}>
                Hash:{' '}
                <span className={matched === 'hash256' ? 'matched' : ''} style={{ fontSize: '2rem', letterSpacing: '0.5px' }}>
                  {item?.hash256}
                </span>
              </Typography>
              <Typography sx={{ fontSize: '2rem', letterSpacing: '0.5px' }}>
                Original hash:
                <span className={matched === 'original_hash256' ? 'matched' : ''} style={{ fontSize: '2rem', letterSpacing: '0.5px' }}>
                  {' '}
                  {item?.original_hash256 || 'N/A'}
                </span>
              </Typography>

              <Typography sx={{ fontSize: '2rem' }}>
                Transaction:
                <span style={{ fontSize: '2rem', letterSpacing: '0.5px' }}> {item?.tx_hash || 'N/A'}</span>
              </Typography>

              <Typography sx={{ fontSize: '2rem' }}>Created: {new Date(item?.createdAt).toLocaleString()}</Typography>
              <Typography sx={{ fontSize: '2rem' }}>Updated: {new Date(item?.updatedAt).toLocaleString()}</Typography>

              <Typography sx={{ fontSize: '2rem', marginTop: '20px', fontWeight: 'bold', color: 'var(--blue3)' }}>Certificants</Typography>
              {item?.cert_template_certificant?.map((cert, index) => {
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
                    <Typography sx={{ fontSize: '2rem' }}>Email: {cert?.certificant_email}</Typography>
                    <Typography sx={{ fontSize: '2rem' }}>Status: {cert?.status}</Typography>
                    <Typography sx={{ fontSize: '2rem' }}>First name: {cert?.first_name}</Typography>
                    <Typography sx={{ fontSize: '2rem' }}>Last name: {cert?.last_name}</Typography>
                    <Typography sx={{ fontSize: '2rem' }}>Issue: {new Date(cert?.issued_date).toLocaleString()}</Typography>
                    <Typography sx={{ fontSize: '2rem' }}>Expire: {new Date(cert?.expired_date).toLocaleString()}</Typography>
                    <Typography sx={{ fontSize: '2rem' }}>
                      Revoke: {cert?.revoked_date ? new Date(cert?.revoked_date).toLocaleString() : 'N/A'}
                    </Typography>
                    <Typography sx={{ fontSize: '2rem' }}>Hash: {cert?.hash256}</Typography>
                    <Typography sx={{ fontSize: '2rem' }}>Transaction: {cert?.tx_hash || 'N/A'}</Typography>
                    <Typography sx={{ fontSize: '2rem' }}>
                      Time: {cert?.tx_timestamp ? new Date(cert?.expired_date).toLocaleString() : 'N/A'}
                    </Typography>
                  </Box>
                )
              })}
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <img src={item?.thumbnail} style={{ maxWidth: '100%', height: 'auto', marginTop: '15px' }} />
              </Box>

              <Box
                sx={{
                  display: 'flex',
                }}
              ></Box>
            </Box>
          </Box>
        )
      })}
    </Box>
  )
}

export const CertificantsVerifyPage = (props) => {
  const {
    state = {
      data: [],
      matched: '',
    },
  } = props

  if (state.length === 0) return <></>
  if (state.data === 0) return <></>

  return (
    <Box sx={{ width: '100%', padding: '5px' }}>
      {state?.data?.map((item) => {
        let matched = item?.matched
        let isRevoke = item?.status === 'REVOKED'
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
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: '2rem', marginBottom: '20px', fontWeight: 'bold', color: 'var(--blue3)' }}>Certificate Holder</Typography>
              <Typography sx={{ fontSize: '2rem' }}>First name: {item?.first_name}</Typography>
              <Typography sx={{ fontSize: '2rem' }}>Last name: {item?.last_name}</Typography>
              <Typography sx={{ fontSize: '2rem' }}>Email: {item?.certificant_email}</Typography>
              <Typography sx={{ fontSize: '2rem' }}>
                Status: {<span style={{ fontSize: '2.3rem', fontWeight: 'bold', color: isRevoke ? 'red' : 'green' }}>{item?.status}</span>}
              </Typography>
              <Typography sx={{ fontSize: '2rem' }}>Issue: {new Date(item?.issued_date).toLocaleString()}</Typography>
              <Typography sx={{ fontSize: '2rem' }}>Expire: {new Date(item?.expired_date).toLocaleString()}</Typography>
              <Typography sx={{ fontSize: '2rem' }}>Revoke: {item?.revoked_date ? new Date(item?.revoked_date).toLocaleString() : 'N/A'}</Typography>
              <Typography sx={{ fontSize: '2rem' }}>
                Hash:{' '}
                <span className={matched === 'hash256' ? 'matched' : ''} style={{ fontWeight: 'bold', fontSize: '2rem' }}>
                  {item?.hash256}
                </span>
              </Typography>
              <Typography sx={{ fontSize: '2rem' }}>Transaction: {item?.tx_hash || 'N/A'}</Typography>
              <Typography sx={{ fontSize: '2rem' }}>Issuer: {item?.certificate?.issuer_address || 'N/A'}</Typography>
              <Typography sx={{ fontSize: '2rem' }}>Time: {item?.tx_timestamp ? new Date(item?.expired_date).toLocaleString() : 'N/A'}</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <img src={item?.thumbnail} style={{ maxWidth: '100%', height: 'auto', marginTop: '15px' }} />
              </Box>
              <Box sx={{ display: 'flex' }}></Box>
            </Box>
          </Box>
        )
      })}
    </Box>
  )
}
