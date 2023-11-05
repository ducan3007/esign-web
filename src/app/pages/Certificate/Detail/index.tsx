import { baseApi } from '@esign-web/libs/utils'
import { Box, Typography } from '@mui/material'
import { SET_CERT_DETAIL, SET_CERT_DETAIL_2 } from 'libs/redux/certificate/src/lib/constants'
import { selectors as certSelector } from '@esign-web/redux/certificate'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import DefaultUser from 'src/assets/default_user.svg'
import moment from 'moment'
import Cert from 'src/assets/cert.svg'

export const CertificateDetailPage = (props: any) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const certDetail = useSelector(certSelector.getCertDetail2)
  const [searchParams] = useSearchParams()
  const documentId = searchParams.get('id')
  const [enableUpdate, setEnableUpdate] = useState(false)

  useEffect(() => {
    ;(async () => {
      let res = await baseApi.get(`/cert/info/${documentId}?brief=true`)
      let certs = res.data
      dispatch({ type: SET_CERT_DETAIL_2, payload: certs })
    })()

    return () => {
      dispatch({
        type: SET_CERT_DETAIL_2,
        payload: null,
      })
    }
  }, [])

  const [show, setShow] = useState(true)

  return (
    <Box sx={{ overflowY: 'auto', height: '85vh', flex: 1, width: '100%' }}>
      <Box sx={{ height: '600px', width: '100%', display: 'flex' }}>
        <Box sx={{ flex: 0.7, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <img
            style={{
              borderRadius: '12px',
              backgroundColor: 'var(--ac)',
              objectFit: 'contain',
              padding: '20px',
              maxWidth: '100%',
              maxHeight: '500px',
              // width: '700px',
            }}
            src={certDetail?.thumbnail}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box sx={{ marginTop: '22px' }}>
              <Typography sx={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--dark2)' }}> {certDetail?.name}</Typography>
            </Box>
            <Typography sx={{ fontSize: '1.3rem', fontWeight: '300', color: 'var(--dark2)' }}>
              {moment(certDetail?.created_at).format('L')} - {moment(certDetail?.created_at).format('hh:mm A')}
            </Typography>
            <Box sx={{ marginTop: '50px', display: 'flex', alignItems: 'center', gap: '75px' }}>
              <Typography sx={{ fontSize: '2rem', color: 'var(--dark2)' }}>SHA2 hash</Typography>
              <Typography sx={{ fontSize: '1.6rem', color: 'var(--dark2)' }}>{certDetail?.hash256}</Typography>
            </Box>
            <Box sx={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '18px' }}>
              <Typography sx={{ fontSize: '2rem', color: 'var(--dark2)' }}>Transaction hash</Typography>
              <Typography sx={{ fontSize: '1.6rem', color: 'var(--dark2)' }}>{certDetail?.tx_hash || 'N/A'}</Typography>
            </Box>
            <Box sx={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '40px' }}>
              <Typography sx={{ fontSize: '2rem', color: 'var(--dark2)' }}>Issuer address</Typography>
              <Typography sx={{ fontSize: '1.6rem', color: 'var(--dark2)' }}>{certDetail?.issuer_address || 'N/A'}</Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          backgroundColor: 'var(--white)',
          display: 'flex',
          alignItems: 'center',
          borderRadius: '12px',
          justifyContent: 'center',
          gap: '0.6rem',
          width: 'fit-content',
          marginLeft: '10px',
          marginBottom: '10px',
          padding: '8px 20px',
        }}
      >
        <img src={Cert} alt="metamask" width="41px" height="41px" />
        <Typography
          sx={{
            color: '#095C9E',
            fontWeight: 'bold',
            fontSize: '2.4rem',
          }}
        >
          Certificants
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))',
          gridGap: '26px',
          overflowY: 'auto',
          padding: '15px 25px 15px 25px',
        }}
      >
        {certDetail?.cert_template_certificant.map((item: any) => {
          console.log('item', item)
          return (
            <Box
              key={item.id}
              onClick={() => {
                navigate(`/certificate/sign?id=${item.id}`)
              }}
              sx={{
                width: '100%',
                display: show ? 'flex' : 'none',
                border: '1px solid var(--gray33)',
                height: '300px',
                flexDirection: 'column',
                position: 'relative',
                borderRadius: '12px',
                cursor: 'pointer',
                padding: '7px',
                ':hover': {
                  backgroundColor: 'var(--ac)',
                },
                transition: 'all 0.2s ease-in-out',
                animation: '0.4s ease 0s 1 normal forwards running krSvVP',
              }}
            >
              <Box sx={{ display: 'flex' }}>
                <Box>
                  <img src={DefaultUser} width={130}></img>
                </Box>
                <Box sx={{ flex: 1, marginLeft: '20px' }}>
                  <Box sx={{ display: 'flex', gap: '15px', alignContent: 'center', alignItems: 'center' }}>
                    <Typography sx={{ color: 'var(--blue3)', fontSize: '1.4rem', fontWeight: 'bold' }}>First name</Typography>
                    <Typography sx={{ flex: 1, fontSize: '1.4rem', color: 'var(--dark2)' }}>{item.first_name}</Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: '17px', alignContent: 'center', alignItems: 'center', marginTop: '10px' }}>
                    <Typography sx={{ color: 'var(--blue3)', fontSize: '1.4rem', fontWeight: 'bold', whiteSpace: 'nowrap' }}>Last name</Typography>
                    <Typography sx={{ flex: 1, color: 'var(--dark2)', fontSize: '1.4rem', whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                      {item.last_name}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: '50px', alignContent: 'center', alignItems: 'center', marginTop: '10px' }}>
                    <Typography sx={{ color: 'var(--blue3)', fontSize: '1.4rem', fontWeight: 'bold' }}>Email</Typography>
                    <Typography sx={{ fontSize: '1.4rem', color: 'var(--dark2)', flex: 1 }}>{item.certificant_email}</Typography>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: '60px', alignContent: 'center', alignItems: 'center', margin: '10px 0px 10px 10px' }}>
                <Typography sx={{ color: 'var(--blue3)', fontSize: '1.6rem', fontWeight: 'bold' }}>Begins On</Typography>
                <Typography sx={{ fontSize: '1.8rem', color: 'var(--dark2)' }}>{moment(item.issued_date).format('L')}</Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: '55px', alignContent: 'center', alignItems: 'center', margin: '0px 0px 10px 10px' }}>
                <Typography sx={{ color: 'var(--blue3)', fontSize: '1.6rem', fontWeight: 'bold' }}>Expires On</Typography>
                <Typography sx={{ fontSize: '1.8rem', color: 'var(--dark2)' }}>{moment(item.expired_date).format('L')}</Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: '90px', alignContent: 'center', alignItems: 'center', margin: '10px 0px 10px 10px' }}>
                <Typography sx={{ color: 'var(--blue3)', fontSize: '1.6rem', fontWeight: 'bold' }}>Status</Typography>

                {item.status === 'ISSUED' && new Date(item.expired_date).getTime() > new Date().getTime() && (
                  <Typography
                    sx={{
                      fontSize: '1.8rem',
                      color: 'var(--green16)',
                      fontWeight: 'bold',
                      padding: '5px 10px',
                      backgroundColor: 'var(--green15)',
                      borderRadius: '5px',
                    }}
                  >
                    Valid
                  </Typography>
                )}
                {item.status === 'REVOKED' && (
                  <Typography
                    sx={{
                      fontSize: '1.8rem',
                      color: 'var(--red)',
                      fontWeight: 'bold',
                      padding: '5px 10px',
                      backgroundColor: 'var(--red111)',
                      borderRadius: '5px',
                    }}
                  >
                    Revoked
                  </Typography>
                )}
                {item.status !== 'REVOKED' && new Date(item.expired_date).getTime() < new Date().getTime() && (
                  <Typography
                    sx={{
                      fontSize: '1.8rem',
                      color: 'var(--yellow111)',
                      fontWeight: 'bold',
                      padding: '5px 10px',
                      backgroundColor: 'var(--yellow8)',
                      borderRadius: '5px',
                    }}
                  >
                    Expired
                  </Typography>
                )}
              </Box>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}
