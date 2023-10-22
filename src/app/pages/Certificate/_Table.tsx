import { selectors } from '@esign-web/redux/certificate'
import { selectors as AuthSelector } from '@esign-web/redux/auth'

import { Box, Skeleton, Typography } from '@mui/material'
import { GET_CERTIFICATE_ALL } from 'libs/redux/certificate/src/lib/constants'
import { useEffect, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CardMembershipOutlinedIcon from '@mui/icons-material/CardMembershipOutlined'
import Cert from 'src/assets/cert.svg'
import { useNavigate } from 'react-router-dom'

export const CertificateTable = (props: any) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [isPending, startTransition] = useTransition()
  const certificate = useSelector(selectors.getCertificates) || {}
  const total = useSelector(selectors.getTotal)
  const loadingDocuments = useSelector(selectors.getLoadingCert)
  const isSidebarOpen = useSelector(AuthSelector.getSidebarState)
  const [show, setShow] = useState(true)

  const [page, setPage] = useState(1)

  useEffect(() => {
    dispatch({
      type: GET_CERTIFICATE_ALL,
      payload: { limit: 100, offset: 0 },
    })
  }, [])

  useEffect(() => {
    startTransition(() => {
      if (isSidebarOpen) {
        setShow(false)
        setTimeout(() => {
          setShow(true)
        }, 300)
      } else {
        setShow(false)
        setTimeout(() => {
          setShow(true)
        }, 300)
      }
    })
  }, [isSidebarOpen])

  console.log('certificate', certificate)

  return (
    <Box sx={{ width: '100%', height: '85vh', paddingBottom: '10px', position: 'relative', overflowX: 'auto', overflowY: 'auto' }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gridGap: '16px',
          overflowY: 'auto',
        }}
      >
        {!loadingDocuments &&
          Object.keys(certificate).map((key: any) => {
            return (
              <Box
                onClick={() => {
                  navigate(`/certificate/detail?id=${certificate[key].id}`)
                }}
                sx={{
                  width: '100%',
                  display: show ? 'flex' : 'none',
                  border: '1px solid var(--gray3)',
                  boxShadow: 'rgba(0, 0, 0, 0.06) 0px -9px 9px',


                  height: '270px',
                  // display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  backgroundColor: 'var(--ac)',
                  padding: '7px',
                  ':hover': {
                    backgroundColor: 'var(--lightaa)',
                  },
                  transition: 'all 0.2s ease-in-out',
                  animation: '0.4s ease 0s 1 normal forwards running krSvVP',
                }}
              >
                <img
                  src={certificate[key].thumbnail}
                  alt=""
                  style={{
                    width: '100%',
                    height: '225px',
                    borderRadius: '4px',
                    objectFit: 'cover',
                  }}
                />
                <Typography
                  sx={{
                    color: 'var(--dark2)',
                    fontSize: '1.34rem',
                    padding: '10px 10px 0px 8px',
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    letterSpacing: '1px',
                  }}
                >
                  {certificate[key].name}
                </Typography>
                <Box
                  sx={{
                    position: 'absolute',
                    right: 0,
                    top:0,
                    display: 'flex',
                    alignItems: 'center',
                    alignContent: 'center',
                    gap: '2px',
                    backgroundColor: 'var(--lightaa)',
                    padding: '2px 5px',
                    borderRadius: '0 4px 0px 5px',
                  }}
                >
                  <Typography
                    sx={{
                      color: '#095C9E',
                      fontWeight: 'bold',
                      fontSize: '1.8rem',
                    }}
                  >
                    0
                  </Typography>
                  <img src={Cert} alt="metamask" width="29px" height="29px" />
                </Box>
              </Box>
            )
          })}
        {loadingDocuments &&
          Array.from({ length: 28 }, (_, i) => {
            return (
              <Box
                sx={{
                  width: '100%',
                  height: '270px',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  backgroundColor: 'var(--ac)',
                  padding: '5px',
                  ':hover': {
                    backgroundColor: 'var(--lightaa)',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                <Skeleton sx={{ transform: 'scale(1.0)' }} animation="wave" width={'100%'} height={270} />
              </Box>
            )
          })}
      </Box>
    </Box>
  )
}
