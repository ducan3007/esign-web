import { selectors as authSelectors } from '@esign-web/redux/auth'
import { selectors } from '@esign-web/redux/certificate'
import { Avatar, Box, Divider, Drawer, Typography } from '@mui/material'
import { CLEAR_ALL_CERTIFICANTS, SET_CERT_DETAIL } from 'libs/redux/certificate/src/lib/constants'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import RenderPDFSkeleton from '../../Document/SigningPage/__PDFSkeleton'
import { useSearchParams } from 'react-router-dom'
import { NotFoundPage } from '../../404NotFound'
import { DndContext } from '@dnd-kit/core'
import { PDF_SCALING_RATIO, baseApi, html2Canvas, rgba } from '@esign-web/libs/utils'
import './styles.scss'
import RenderPDF from './_PDF'
import { RenderSignature } from './_Signature'
import RenderSigners from './_Signer'
import MButton from 'src/app/components/Button'
import moment from 'moment'

export const CertificateSignPage = (props: any) => {
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  const documentId = searchParams.get('id')
  const authState = useSelector(authSelectors.getAuthState)
  const documentDetail = useSelector(selectors.getCertDetail)

  /*  For PDF Skeleton Loading */
  const [isPDFLoaded, setIsPDFLoaded] = useState(false)

  /* For selected Signer */
  const [selectedSignerId, setSelectedSignerId] = useState<any>()

  if (!documentId) return <NotFoundPage />

  useEffect(() => {
    ;(async () => {
      let res = await baseApi.get(`/cert/info/${documentId}`)
      let certs = res.data
      dispatch({ type: SET_CERT_DETAIL, payload: certs })
    })()

    return () => {
      dispatch({ type: CLEAR_ALL_CERTIFICANTS, payload: null })
      dispatch({ type: SET_CERT_DETAIL, payload: null })
    }
  }, [])

  console.log('>certDetail', documentDetail)

  return (
    <DndContext>
      <Box id="signing-container" sx={{ flex: 1, width: '100%', overflow: 'hidden' }}>
        <Box></Box>
        <Box sx={{ display: 'flex' }}>
          <RenderLeftSide
            documentId={documentId}
            documentDetail={documentDetail}
            selectedSignerId={selectedSignerId}
            setSelectedSignerId={setSelectedSignerId}
          />

          <Box sx={{ flex: 1, position: 'relative' }}>
            <RenderPDF documentId={documentId} setIsPDFLoaded={setIsPDFLoaded} />
            {(!isPDFLoaded || !documentDetail) && <RenderPDFSkeleton />}
          </Box>
        </Box>
      </Box>
    </DndContext>
  )
}

const RenderLeftSide = (props: any) => {
  const { selectedSignerId, setSelectedSignerId, documentId } = props
  const dispatch = useDispatch()
  const signer2 = useSelector(selectors.getSigners2)
  const authState = useSelector(authSelectors.getAuthState)
  const signatures = useSelector(selectors.getSignatures)
  const isDisabled = Object.keys(signer2).length === 0

  const [messages, setMessages] = useState<any>(
    `Dear ${signer2[selectedSignerId]?.firstName || ''},\n\nCongratulations! You have been awarded a certificate!`
  )
  const [openDrawer, setOpenDrawer] = useState(false)

  const handleSaveCertificate = async () => {
    await signCert()
  }
  const signCert = async () => {
    const payload = await preparePayload()
    console.log('CERT payload', payload)
  }

  async function preparePayload() {
    const cert_holder = signer2[Object.keys(signer2)[0]]
    const payload: any = {
      certificant_email: cert_holder.email,
      first_name: cert_holder.firstName,
      last_name: cert_holder.lastName,
      issued_date: cert_holder.issuedOn,
      expired_date: cert_holder.expiredOn,
      meta_data: JSON.stringify(cert_holder),
      scale_ratio: PDF_SCALING_RATIO.value,
      signatures: [],
    }
    for (let key in signatures) {
      for (let key2 in signatures[key]) {
        let sig = signatures[key][key2]

        delete sig['can_move']
        delete sig['can_move']
        delete sig['is_hidden']
        delete sig['can_select']
        delete sig['can_delete']
        delete sig['can_copy']

        if (sig.type === 'checkbox') {
          sig.signature_data['url'] = await html2Canvas(`${sig.id}_checkbox`, sig)
          sig.signature_data['isBase64'] = true
          sig.signature_data['format'] = 'png'
        }
        payload.signatures.push({
          ...sig,
          meta_data: JSON.stringify(sig),
        })
      }
    }
    return payload
  }

  return (
    <Box
      sx={{
        width: '350px',
        padding: '1rem 1rem 1rem 1rem',
        height: 'calc(100vh - 9rem)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <RenderSigners selectedSigner={signer2[selectedSignerId] || {}} setSelectedSignerId={setSelectedSignerId} />

      <Box>
        <Typography sx={{ fontSize: '1.7rem', fontWeight: 'bold', color: 'var(--dark)' }}>Signatures</Typography>
      </Box>

      <RenderSignature selectedSigner={signer2[selectedSignerId] || {}} />
      <Box sx={{ flex: 1, border: '1px solid red' }}></Box>

      <Box sx={{ cursor: isDisabled ? 'not-allowed' : 'pointer' }}>
        <Divider sx={{ marginBottom: '13px' }} />
        <MButton
          onClick={() => {
            setOpenDrawer(true)
            setMessages(`Dear ${signer2[selectedSignerId]?.firstName || ''},\n\nCongratulations! You have been awarded a certificate!`)
          }}
          sx={{
            width: '100%',
            borderRadius: '5px',
            backgroundColor: isDisabled ? '#DDDDDD' : 'var(--orange)',
            transition: 'all 0.4s ease-in-out',
            padding: '9px',
          }}
          disabled={isDisabled}
        >
          <Typography sx={{ color: 'var(--white)', fontWeight: 'bold', letterSpacing: '0.1rem', fontSize: '1.5rem' }}>{'Review & Sign'}</Typography>
        </MButton>
      </Box>

      <Drawer anchor="left" open={openDrawer} sx={{ '& .MuiBackdrop-root': { backgroundColor: 'rgba(0,0,0,0.2)' } }}>
        <Box
          sx={{
            width: '600px',
            height: '100vh',
            backgroundColor: 'var(--white)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box sx={{ flex: 1, width: '100%' }}>
            <Box sx={{ padding: '16px 24px 8px' }}>
              <Typography
                sx={{
                  color: 'var(--dark2)',
                  fontWeight: 'bold',
                  letterSpacing: '0.1rem',
                  fontSize: '1.8rem',
                  marginBottom: '10px',
                }}
              >
                Certifcate Holder
              </Typography>
              <Box
                sx={{
                  maxHeight: '45vh',
                  overflowY: 'auto',
                  width: '100%',
                  marginTop: '22px',
                  '&::-webkit-scrollbar': { width: '5px' },
                  '&::-webkit-scrollbar-track': { background: 'transparent', marginBottom: '5px' },
                  '&::-webkit-scrollbar-thumb': { background: 'var(--color-gray1)', borderRadius: '10px', border: '1px solid var(--white)' },
                }}
              >
                {Object.keys(signer2).map((key) => {
                  const signer = signer2[key]
                  // if (signer.id === authState.data?.id) return null
                  return (
                    <Box
                      key={key}
                      sx={{
                        marginBottom: '13px',
                        width: '100%',
                        position: 'relative',
                        backgroundColor: `${rgba(signer.color, 0.3)}`,
                        borderRadius: '15px',
                        display: 'flex',
                        gap: '12px',
                        flexDirection: 'column',
                        padding: '12px',
                        cursor: 'pointer',
                        ':hover': {
                          backgroundColor: `${rgba(signer.color, 0.5)}`,
                        },
                        transition: '0.2s ease-in-out',
                      }}
                    >
                      <Box sx={{ display: 'flex', gap: '55px', alignContent: 'center', alignItems: 'center' }}>
                        <Typography sx={{ color: 'var(--blue3)', fontSize: '1.8rem' }}>First Name</Typography>
                        <Typography
                          sx={{
                            fontSize: '1.8rem',
                            color: 'var(--dark2)',
                          }}
                        >
                          {signer.firstName}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', gap: '57px', alignContent: 'center', alignItems: 'center' }}>
                        <Typography sx={{ color: 'var(--blue3)', fontSize: '1.8rem' }}>Last Name</Typography>
                        <Typography sx={{ fontSize: '1.8rem', color: 'var(--dark2)' }}>{signer.lastName}</Typography>
                      </Box>

                      <Box sx={{ display: 'flex', gap: '103px', alignContent: 'center', alignItems: 'center' }}>
                        <Typography sx={{ color: 'var(--blue3)', fontSize: '1.8rem' }}>Email</Typography>
                        <Typography sx={{ fontSize: '1.8rem', color: 'var(--dark2)' }}>{signer.email}</Typography>
                      </Box>

                      <Box sx={{ display: 'flex', gap: '60px', alignContent: 'center', alignItems: 'center' }}>
                        <Typography sx={{ color: 'var(--blue3)', fontSize: '1.8rem' }}>Begins On</Typography>
                        <Typography sx={{ fontSize: '1.8rem', color: 'var(--dark2)' }}>{moment(signer.startDate).format('L')}</Typography>
                      </Box>

                      <Box sx={{ display: 'flex', gap: '55px', alignContent: 'center', alignItems: 'center' }}>
                        <Typography sx={{ color: 'var(--blue3)', fontSize: '1.8rem' }}>Expires On</Typography>
                        <Typography sx={{ fontSize: '1.8rem', color: 'var(--dark2)' }}>{moment(signer.expiredOn).format('L')}</Typography>
                      </Box>
                    </Box>
                  )
                })}
              </Box>
            </Box>
            <Divider />
            <Box sx={{ padding: '16px 24px 8px' }}>
              <Typography sx={{ color: 'var(--dark2)', fontWeight: 'bold', letterSpacing: '0.1rem', fontSize: '1.8rem', marginBottom: '10px' }}>
                Issuer
              </Typography>
              <Box
                sx={{
                  marginBottom: '13px',
                  width: '100%',
                  height: '52px',
                  position: 'relative',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '2px 0px',
                  cursor: 'pointer',
                  transition: '0.2s ease-in-out',
                }}
              >
                <Avatar
                  sx={{
                    color: 'var(--white)',
                    fontSize: '2.1rem',
                    fontWeight: 'bold',
                    alignSelf: 'center',
                    marginLeft: '5px',
                    backgroundColor: `rgb(15,192,197)`,
                  }}
                >
                  {authState.data?.first_name.toUpperCase().charAt(0)}
                </Avatar>
                <Box sx={{ display: 'flex', flexDirection: 'column', padding: '0 12px', width: '288px' }}>
                  <Box sx={{ flex: 1.5, height: '50%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    <span style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--orange)' }}>
                      {`${authState.data?.first_name} ${authState.data?.last_name}`}
                    </span>
                  </Box>
                  <Box sx={{ flex: 1, height: '50%' }}>
                    <span style={{ fontSize: '1.3rem', opacity: 0.8 }}>{authState.data?.email}</span>
                  </Box>
                </Box>
              </Box>
              <Box>
                <Typography
                  sx={{
                    color: 'var(--dark2)',
                    fontWeight: 'bold',
                    letterSpacing: '0.1rem',
                    fontSize: '1.6rem',
                    marginBottom: '10px',
                  }}
                >
                  Message (Optional):
                </Typography>
                <textarea
                  value={messages}
                  onChange={(e) => {
                    setMessages(e.target.value)
                  }}
                  className="font_plus_jakarta_sans"
                  autoFocus
                  spellCheck="false"
                  wrap="off"
                  tabIndex={-1}
                  style={{
                    padding: '2px',
                    width: '100%',
                    height: '250px',
                    backgroundColor: 'transparent',
                    color: 'var(--dark)',
                    resize: 'none',
                    outline: 'none',
                    fontSize: '1.6rem',
                    margin: '0px',
                    whiteSpace: 'nowrap',
                    letterSpacing: '0px',
                    scrollbarWidth: 'none',
                    overflow: 'auto',
                    border: '1px solid var(--gray3)',
                    // fontFamily: fontFamily.fontFamily
                  }}
                  placeholder="Type something here..."
                ></textarea>
              </Box>
            </Box>
          </Box>

          <Divider />

          <Box
            sx={{
              width: '100%',
              padding: '12px',
              marginBottom: '5px',
              display: 'flex',
              gap: '20px',
              paddingLeft: '20px',
            }}
          >
            <MButton
              onClick={handleSaveCertificate}
              sx={{ width: '200px', backgroundColor: 'var(--blue3)', borderRadius: '5px', textAlign: 'center' }}
            >
              <Typography sx={{ color: 'var(--white)', fontWeight: 'bold', letterSpacing: '0.1rem', fontSize: '1.4rem' }}>
                {'Finish & Sign'}
              </Typography>
            </MButton>

            <MButton
              onClick={() => {
                setOpenDrawer(false)
              }}
              sx={{
                width: '200px',
                backgroundColor: 'white',
                borderRadius: '5px',
                border: '3px solid var(--blue3)',
                textAlign: 'center',
                padding: '2px 12px',
              }}
            >
              <Typography
                sx={{
                  color: 'var(--blue3)',
                  fontWeight: 'bold',
                  letterSpacing: '0.1rem',
                  fontSize: '1.5rem',
                }}
              >
                {'Back'}
              </Typography>
            </MButton>
          </Box>
        </Box>
      </Drawer>
    </Box>
  )
}
