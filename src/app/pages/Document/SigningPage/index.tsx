import { DndContext } from '@dnd-kit/core'
import { baseApi, rgba } from '@esign-web/libs/utils'
import { selectors as authSelectors } from '@esign-web/redux/auth'
import { actions, selectors as documentSelectors, selectors } from '@esign-web/redux/document'
import { Avatar, Box, Divider, Drawer, Skeleton, Typography } from '@mui/material'
import { DOCUMENT_SET_DETAIL } from 'libs/redux/document/src/lib/constants'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import MButton from 'src/app/components/Button'
import { NotFoundPage } from '../../404NotFound'
import RenderPDF from './__RenderPDF'
import RenderPDFSkeleton from './__RenderPDFSkeleton'
import { RenderSignature } from './__RenderSignature'
import RenderSigners from './__RenderSigner'
import _ from 'lodash'
import './styles.scss'

export const DocumentSignningPage = () => {
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()

  const documentId = searchParams.get('id')

  const documentFromStore = useSelector(selectors.getDoucmentFromStore(documentId))
  const documentDetail = useSelector(selectors.getDocumentDetail)

  /*  For PDF Skeleton Loading */
  const [isPDFLoaded, setIsPDFLoaded] = useState(false)

  /* For selected Signer */
  const [selectedSignerId, setSelectedSignerId] = useState<any>('')

  /* Copy of previous signers before update  */
  // const [signerPrev, setSignerPrev] = useState<signersProps>({})

  if (!documentId) return <NotFoundPage />

  console.log('documentFromStore', documentFromStore)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await baseApi.get(`/document/info/${documentId}`)
        dispatch({
          type: DOCUMENT_SET_DETAIL,
          payload: res.data,
        })
      } catch (error) {}
    })()

    return () => {
      dispatch(actions.clearAllSigners({}))
      dispatch({
        type: DOCUMENT_SET_DETAIL,
        payload: null,
      })
    }
  }, [])

  /* TODO: check if there is any unsaved work */
  // useUnSavedChangesWarning({ condition: true })

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
  const { selectedSignerId, setSelectedSignerId } = props
  const dispatch = useDispatch()
  const signers = useSelector(selectors.getSigners)
  const signer2 = useSelector(selectors.getSigners2)
  const authState = useSelector(authSelectors.getAuthState)
  const signatures = useSelector(documentSelectors.getSignatures)

  const [messages, setMessages] = useState<any>(`Hi,\n\nPlease review and sign the document.\n\nThank you!`)
  const [openDrawer, setOpenDrawer] = useState(false)

  const isOnlyMeSigner = useMemo(() => {
    return Object.keys(signer2).length === 1 && Object.keys(signer2)[0] === authState.data?.id
  }, [signer2])

  const reviewAndSign = (Object.keys(signer2).length === 1 && !isOnlyMeSigner) || Object.keys(signer2).length > 1
  const finishAndSign = (Object.keys(signer2).length === 1 && isOnlyMeSigner) || Object.keys(signer2).length === 1

  const isOnlyMeSignerAndNoSignature = useMemo(() => {
    let noSignature = true
    Object.keys(signatures).forEach((key) => {
      if (Object.keys(signatures[key]).length > 0) {
        Object.keys(signatures[key]).forEach((key2) => {
          if (signatures[key][key2].user.id === authState.data?.id && signatures[key][key2].type === 'signature') {
            noSignature = false
          }
        })
      }
    })

    return Object.keys(signer2).length === 1 && noSignature && isOnlyMeSigner
  }, [signer2, signatures])

  const isOnlyMeSignerAndNoSignatureData = useMemo(() => {
    let noSignatureData = true
    Object.keys(signatures).forEach((key) => {
      if (Object.keys(signatures[key]).length > 0) {
        Object.keys(signatures[key]).forEach((key2) => {
          if (
            signatures[key][key2].user.id === authState.data?.id &&
            signatures[key][key2].signature_data &&
            signatures[key][key2].signature_data.url
          ) {
            noSignatureData = false
          }
        })
      }
    })

    return Object.keys(signer2).length === 1 && noSignatureData && isOnlyMeSigner
  }, [signer2, signatures])

  console.log('>> isOnlyMeSignerAndNoSignature', isOnlyMeSignerAndNoSignature)

  /* Effect: Initiate values for state */
  useEffect(() => {
    const payload = {
      id: authState.data?.id,
      firstName: authState.data?.first_name,
      lastName: authState.data?.last_name,
      email: authState.data?.email,
      color: 'rgb(15,192,197)',
      fields: 0,
    }
    if (Object.keys(signers).length === 0) {
      dispatch(actions.setSigners(payload))
      dispatch(actions.setSigner2(payload))
      setSelectedSignerId(payload.id)
    }
    return () => {
      console.log('11 cleanup')
      dispatch(actions.updateAllSigners({}))
    }
  }, [])

  // useEffect(() => {
  //   dispatch(actions.updateAllSigners2(signers))
  // }, [signers])

  /* Effect: Update signerPrev when signers change */

  console.log('123 authState', authState)
  console.log('123 signers', signers)
  console.log('123 selectedSignerId', selectedSignerId)

  const isDisabled = Object.keys(signer2).length === 0 || isOnlyMeSignerAndNoSignature || isOnlyMeSignerAndNoSignatureData

  const handleSave = () => {
    if (isDisabled) return
    if (Object.keys(signer2).length === 0 || (Object.keys(signer2).length === 1 && isOnlyMeSigner)) {
      console.log('>>> handleSave document and sign')

      console.log('>>> signer2', signer2)
      console.log('>>> signatures', signatures)
    } else if ((Object.keys(signer2).length === 1 && !isOnlyMeSigner) || Object.keys(signer2).length > 1) {
      console.log('>>> handlSave document Reivew and send')

      console.log('>>> signer2', signer2)
      console.log('>>> signatures', signatures)
      console.log('>>> messages', messages)

      const payload: any = {
        id: props.documentId,
        signers: [],
      }

      Object.keys(signer2).forEach((key) => {
        const signer = signer2[key]
        payload.signers.push({
          id: signer.id,
          email: signer.email,
          firstName: signer.firstName,
          lastName: signer.lastName,
          fields: signer.fields,
          color: signer.color,
          message: messages,
          metadata: JSON.stringify({
            id: signer.id,
            email: signer.email,
            firstName: signer.firstName,
            lastName: signer.lastName,
            fields: signer.fields,
            color: signer.color,
            message: messages,
          }),
          singatures: getSignaturesBySignerId(signer.id),
        })
      })

      Object.keys(signatures).forEach((key) => {})

      console.log('>>> payload', payload)

      setOpenDrawer(true)
    }
  }

  function getSignaturesBySignerId(signerId: string) {
    let res: any = []
    let isOtherSigner = signerId !== authState.data?.id
    Object.keys(signatures).forEach((key) => {
      if (Object.keys(signatures[key]).length > 0) {
        Object.keys(signatures[key]).forEach((key2) => {
          if (signatures[key][key2].user.id === signerId) {
            res.push({
              canDrag: signatures[key][key2].type === 'signature' && isOtherSigner ? false : true,
              ...signatures[key][key2],
            })
          }
        })
      }
    })
    return res
  }
  /*------------------- Skeleton */
  if (!props.documentDetail) {
    return (
      <Box
        sx={{
          width: '350px',
          padding: '1rem 1rem 1rem 1rem',
          height: 'calc(100vh - 9rem)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ width: '100%' }}>
          <Skeleton sx={{ transform: 'scale(1.0)', marginBottom: '60px', marginTop: '10px' }} animation="wave" width={'100%'} height={40} />
          <Skeleton sx={{ transform: 'scale(1.0)', marginBottom: '10px', borderRadius: '5px' }} animation="wave" width={'100%'} height={40} />
          <Skeleton sx={{ transform: 'scale(1.0)', marginBottom: '10px', borderRadius: '5px' }} animation="wave" width={'100%'} height={40} />
          <Skeleton sx={{ transform: 'scale(1.0)', marginBottom: '10px', borderRadius: '5px' }} animation="wave" width={'100%'} height={40} />
          <Skeleton sx={{ transform: 'scale(1.0)', marginBottom: '10px', borderRadius: '5px' }} animation="wave" width={'100%'} height={40} />
        </Box>
        <Skeleton sx={{ transform: 'scale(1.0)', marginBottom: '10px', borderRadius: '5px' }} animation="wave" width={'100%'} height={40} />
      </Box>
    )
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
        <Typography
          sx={{
            fontSize: '1.7rem',
            fontWeight: 'bold',
            color: 'var(--dark)',
          }}
        >
          Signatures
        </Typography>
      </Box>
      {/* <Divider sx={{ marginBottom: '20px', borderColor: 'var(--orange1)', borderWidth: '1px' }} /> */}
      <RenderSignature selectedSigner={signer2[selectedSignerId] || {}} />

      <Typography
        sx={{
          fontSize: '1.7rem',
          fontWeight: 'bold',
          color: 'var(--dark)',
        }}
      >
        Details
      </Typography>

      {/* --------------------------- Detail Content --------------------------- */}
      <Box
        sx={{
          flex: 1,
        }}
      ></Box>

      <Box
        sx={{
          cursor: isDisabled ? 'not-allowed' : 'pointer',
        }}
      >
        <Divider sx={{ marginBottom: '13px' }} />
        <MButton
          onClick={handleSave}
          sx={{
            width: '100%',
            backgroundColor: isDisabled ? '#DDDDDD' : 'var(--blue3)',
            borderRadius: '5px',

            // '&:hover': { backgroundColor: 'var(--orange)', '& p': { color: 'var(--white)' } },
            transition: 'all 0.4s ease-in-out',
            padding: '9px',
          }}
          disabled={isDisabled}
        >
          <Typography
            sx={{
              color: 'var(--white)',
              fontWeight: 'bold',
              letterSpacing: '0.1rem',
              fontSize: '1.5rem',
            }}
          >
            {Object.keys(signer2).length === 1 && isOnlyMeSigner && 'Finish & Sign'}
            {Object.keys(signer2).length === 0 && 'Finish & Sign'}
            {Object.keys(signer2).length === 1 && !isOnlyMeSigner && 'Review & Send'}
            {Object.keys(signer2).length > 1 && 'Review & Send'}
          </Typography>
        </MButton>
      </Box>

      {/* <Divider sx={{ marginBottom: '20px', borderColor: 'var(--orange1)', borderWidth: '1px' }} /> */}

      <Drawer
        anchor="left"
        open={openDrawer}
        sx={{
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0,0,0,0.2)',
          },
        }}
      >
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
            <Box
              sx={{
                padding: '16px 24px 8px',
              }}
            >
              <Typography
                sx={{
                  color: 'var(--dark)',
                  fontWeight: 'bold',
                  letterSpacing: '0.1rem',
                  fontSize: '1.6rem',
                  marginBottom: '10px',
                }}
              >
                Signees
              </Typography>
              <Box
                sx={{
                  maxHeight: '45vh',
                  overflowY: 'auto',
                  width: '100%',
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
                        height: '52px',
                        position: 'relative',
                        border: `1px solid ${signer.color}`,
                        backgroundColor: `${rgba(signer.color, 0.1)}`,
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '2px 0px',
                        cursor: 'pointer',
                        ':hover': {
                          backgroundColor: `${rgba(signer.color, 0.5)}`,
                        },
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
                          backgroundColor: `${signer.color}`,
                        }}
                      >
                        {signer.firstName.toUpperCase().charAt(0)}
                      </Avatar>
                      <Box sx={{ display: 'flex', flexDirection: 'column', padding: '0 12px', width: '288px' }}>
                        <Box sx={{ flex: 1.5, height: '50%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          <span
                            style={{
                              fontSize: '1.4rem',
                              fontWeight: 'bold',
                              color: 'var(--blue3)',
                            }}
                          >
                            {`${signer.firstName} ${signer.lastName}`}
                          </span>
                        </Box>
                        <Box sx={{ flex: 1, height: '50%' }}>
                          <span style={{ fontSize: '1.3rem', opacity: 0.8 }}>{signer.email}</span>
                        </Box>
                      </Box>
                    </Box>
                  )
                })}
              </Box>
            </Box>
            <Divider />
            <Box
              sx={{
                padding: '16px 24px 8px',
              }}
            >
              <Typography
                sx={{
                  color: 'var(--dark)',
                  fontWeight: 'bold',
                  letterSpacing: '0.1rem',
                  fontSize: '1.6rem',
                  marginBottom: '10px',
                }}
              >
                From:
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
                    <span
                      style={{
                        fontSize: '1.4rem',
                        fontWeight: 'bold',
                        color: 'var(--orange)',
                      }}
                    >
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
                    color: 'var(--dark)',
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
              onClick={handleSave}
              sx={{
                width: '200px',
                backgroundColor: 'var(--blue3)',
                borderRadius: '5px',
                textAlign: 'center',
              }}
            >
              <Typography
                sx={{
                  color: 'var(--white)',
                  fontWeight: 'bold',
                  letterSpacing: '0.1rem',
                  fontSize: '1.4rem',
                }}
              >
                {'Finish & Send'}
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
