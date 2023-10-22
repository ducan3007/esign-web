import { baseApi } from '@esign-web/libs/utils'
import { Box, Typography } from '@mui/material'
import { SET_CERT_DETAIL } from 'libs/redux/certificate/src/lib/constants'
import { selectors as certSelector } from '@esign-web/redux/certificate'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import moment from 'moment'
export const CertificateDetailPage = (props: any) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const certDetail = useSelector(certSelector.getCertDetail)
  const [searchParams] = useSearchParams()
  const documentId = searchParams.get('id')
  const [enableUpdate , setEnableUpdate] = useState(false)

  useEffect(() => {
    ;(async () => {
      let res = await baseApi.get(`/cert/info/${documentId}`)
      let certs = res.data
      dispatch({ type: SET_CERT_DETAIL, payload: certs })
    })()

    return () => {
      dispatch({
        type: SET_CERT_DETAIL,
        payload: null,
      })
    }
  }, [])

  return (
    <Box
      sx={{
        overflowY: 'auto',
        height: '85vh',
        border: '1px solid red',
        flex: 1,
        width: '100%',
      }}
    >
      <Box
        sx={{
          border: '1px solid var(--gray3)',
          height: '600px',
          width: '100%',
          display: 'flex',
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            style={{
              borderRadius: '12px',
              backgroundColor: 'var(--ac)',
              objectFit: 'contain',
              padding: '20px',
              height: '500px',
              width: '700px',
            }}
            src={certDetail?.thumbnail}
          />
        </Box>
        <Box
          sx={{
            flex: 1,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              paddingTop: '20px',
            }}
          >
            <Box>
              <Typography sx={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--dark2)' }}> {certDetail?.name}</Typography>
              
            </Box>
            <Typography sx={{ fontSize: '1.3rem', fontWeight: '300', color: 'var(--dark2)' }}>
              {moment(certDetail?.created_at).format('L')} - {moment(certDetail?.created_at).format('hh:mm A')}
            </Typography>
            <Box sx={{ marginTop: '50px' }}>
              <Typography sx={{ fontSize: '2rem', color: 'var(--dark2)' }}>SHA2 Fingerprint</Typography>
            </Box>
            <Box sx={{ marginTop: '30px' }}>
              <Typography sx={{ fontSize: '2rem', color: 'var(--dark2)' }}>Transaction Hash</Typography>
            </Box>
            <Box sx={{ marginTop: '30px' }}>
              <Typography sx={{ fontSize: '2rem', color: 'var(--dark2)' }}>Issuer Address</Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          border: '1px solid var(--gray3)',
          height: '2000px',
          width: '100%',
        }}
      ></Box>
    </Box>
  )
}
