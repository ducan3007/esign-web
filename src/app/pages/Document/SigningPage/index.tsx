import { DndContext } from '@dnd-kit/core'
import { PDF_SCALING_RATIO, Toast, baseApi, html2Canvas, rgba } from '@esign-web/libs/utils'
import { selectors as authSelectors } from '@esign-web/redux/auth'
import { actions, selectors as documentSelectors, selectors } from '@esign-web/redux/document'
import { Avatar, Box, Divider, Drawer, Skeleton, Typography } from '@mui/material'
import { DOCUMENT_SET_DETAIL, SET_SIGNER_STATUS } from 'libs/redux/document/src/lib/constants'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import MButton from 'src/app/components/Button'
import { NotFoundPage } from '../../404NotFound'
import { RenderLeftSideComplete } from './__LeftSide'
import RenderPDF from './__PDF'
import RenderPDFSkeleton from './__PDFSkeleton'
import { RenderSignature } from './__Signature'
import RenderSigners from './__Signer'
import './styles.scss'

export const DocumentSignningPage = () => {
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  const authState = useSelector(authSelectors.getAuthState)
  const documentId = searchParams.get('id')

  const documentFromStore = useSelector(selectors.getDoucmentFromStore(documentId))
  const documentDetail = useSelector(selectors.getDocumentDetail)

  /*  For PDF Skeleton Loading */
  const [isPDFLoaded, setIsPDFLoaded] = useState(false)

  /* For selected Signer */
  const [selectedSignerId, setSelectedSignerId] = useState<any>('')

  if (!documentId) return <NotFoundPage />

  useEffect(() => {
    ;(async () => {
      try {
        const [res1, res2] = await Promise.all([
          baseApi.get(`/document/info/${documentId}`),
          baseApi.get(`/document/signer?document_id=${documentId}`),
        ])
        if (res1.data.status === 'ON_DRAFT') {
          const draftRes = await baseApi.get(`/document/draft/${documentId}`)
          const { signers, signatures } = draftRes.data
          if (signers) {
            dispatch(actions.updateAllSigners(signers))
            dispatch(actions.updateAllSigners2(signers))
          }
          if (signatures) {
            dispatch(actions.updateAllSignatures(signatures))
          }
        }

        if (res1.data.status === 'SIGNED' || res1.data.status === 'COMPLETED') {
          console.log('>> res.data SIGNED', res1.data)
          let signers = {
            [`${authState.data?.id}`]: {},
          }
          let signatures = {}

          for (let document_signer of res1.data.document_signer) {
            let dataSigner = JSON.parse(document_signer.meta_data)
            if (document_signer.is_signed) {
              dataSigner['is_signed'] = true
            }

            delete dataSigner.message

            signers[document_signer.user_id] = dataSigner

            if (authState.data?.is_registered) {
              signers[authState.data?.id]['firstName'] = authState.data?.first_name
              signers[authState.data?.id]['lastName'] = authState.data?.last_name
            }

            for (let signature of document_signer.signature) {
              let dataSignature = JSON.parse(signature.meta_data)

              dataSignature.can_move = false
              dataSignature.can_select = false

              let pageNumber = dataSignature.pageNumber
              if (!signatures[`page_${pageNumber}`]) {
                signatures[`page_${pageNumber}`] = {}
              }
              signatures[`page_${pageNumber}`][dataSignature.id] = dataSignature
            }
          }

          console.log('SIGNED, signers', signers)
          console.log('SIGNED, signatures', signatures)

          dispatch(actions.updateAllSigners(signers))
          dispatch(actions.updateAllSigners2(signers))
          dispatch(actions.updateAllSignatures(signatures))
        }

        if (res1.data.status === 'READY_TO_SIGN') {
          let signers = {
            [`${authState.data?.id}`]: {},
          }
          let signatures = {}

          for (let document_signer of res1.data.document_signer) {
            let dataSigner = JSON.parse(document_signer.meta_data)
            delete dataSigner.message

            if (document_signer.is_signed) {
              dataSigner['is_signed'] = true
            }

            signers[document_signer.user_id] = Object.assign(dataSigner, { document_signer_id: document_signer.id })

            if (authState.data?.is_registered) {
              signers[authState.data?.id]['firstName'] = authState.data?.first_name
              signers[authState.data?.id]['lastName'] = authState.data?.last_name
            }

            for (let signature of document_signer.signature) {
              let data_signature = JSON.parse(signature.meta_data)

              if (data_signature.user.id !== authState.data?.id) {
                data_signature.can_delete = false
                data_signature.can_copy = false
                data_signature.can_move = false
                data_signature.can_select = false
              }

              if (document_signer.is_signed) {
                data_signature.is_signed = true
                data_signature.can_delete = false
                data_signature.can_copy = false
                data_signature.can_move = false
                data_signature.can_select = false
              }

              let pageNumber = data_signature.pageNumber
              if (!signatures[`page_${pageNumber}`]) {
                signatures[`page_${pageNumber}`] = {}
              }
              signatures[`page_${pageNumber}`][data_signature.id] = data_signature
            }
          }

          console.log('READY_TO_SIGN, signers', signers)
          console.log('READY_TO_SIGN, signatures', signatures)

          dispatch(actions.updateAllSigners(signers))
          dispatch(actions.updateAllSigners2(signers))
          dispatch(actions.updateAllSignatures(signatures))
        }

        if (res2.data) {
          dispatch({
            type: SET_SIGNER_STATUS,
            payload: res2.data,
          })
        }
        dispatch({
          type: DOCUMENT_SET_DETAIL,
          payload: res1.data,
        })
      } catch (error) {
        console.log('>> error', error)
      }
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
  const { selectedSignerId, setSelectedSignerId, documentId } = props
  const dispatch = useDispatch()
  const signers = useSelector(selectors.getSigners)
  const signer2 = useSelector(selectors.getSigners2)
  const authState = useSelector(authSelectors.getAuthState)
  const signatures = useSelector(documentSelectors.getSignatures)
  const signersStatus = useSelector(selectors.getSignStatus)

  const [messages, setMessages] = useState<any>(`Hi,\n\nPlease review and sign the document.\n\nThank you!`)
  const [openDrawer, setOpenDrawer] = useState(false)

  const isOnlyMeSigner = useMemo(() => {
    return Object.keys(signer2).length === 1 && Object.keys(signer2)[0] === authState.data?.id
  }, [signer2])

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

  const isReadyToSignAndNoSignatureData = useMemo(() => {
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

    return noSignatureData
  }, [signer2, signatures])

  console.log('>isReadyToSignAndNoSignatureData', isReadyToSignAndNoSignatureData)

  console.log('XXXXXXXXXXXXXXX', props.documentDetail)
  console.log('XXXXXXXXXXXXXXX 2', signer2)

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
      dispatch(actions.updateAllSigners({}))
      dispatch({ type: SET_SIGNER_STATUS, payload: false })
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

  /* __________________________________ HANDLE SAVE __________________________________*/
  const handleSave = async () => {
    if (isDisabled) return
    if (Object.keys(signer2).length === 0 || (Object.keys(signer2).length === 1 && isOnlyMeSigner)) {
      await saveDocumentByOwner()
      await signDocument()
    } else if ((Object.keys(signer2).length === 1 && !isOnlyMeSigner) || Object.keys(signer2).length > 1) {
      setOpenDrawer(true)
    }
  }

  const handleSaveAndSendEmail = async () => {
    try {
      const payload = await preparePayload2()
      console.log('>> payload', payload)
      const res = await baseApi.post(`/document/owner/save/${documentId}`, payload)
    } catch (error) {
      console.log('>>sign error', error)
    }
  }

  const handleSignBySignee = async () => {
    try {
      await signDocument()
    } catch (error) {}
  }

  /* __________________________________ Save Document By Owner __________________________________ */
  const saveDocumentByOwner = async () => {
    const payload = await preparePayload()
    console.log('>> payload to save', payload)
    const res = await baseApi.post(`/document/owner/save/${documentId}`, payload)
  }

  /* __________________________________ User Sign the Document __________________________________ */
  const signDocument = async () => {
    try {
      const payload = await preparePayload(authState.data?.id)
      console.log('>> payload to sign', payload)
      await baseApi.post(`/document/single-sign/${documentId}`, payload)
      Toast({
        type: 'success',
        message: 'Document signed successfully',
      })
      // window.location.reload()
    } catch (error) {
      console.log('>>sign error', error)
    }
  }

  async function preparePayload(bySigner_id?: string) {
    const payload: any = {
      id: props.documentId,
      signers: [],
      PDF_SCALING_RATIO: PDF_SCALING_RATIO.value,
    }

    for (let key in signer2) {
      const signer = signer2[key]
      if (bySigner_id) {
        if (signer.id === bySigner_id) {
          payload.signers.push({
            id: signer.id,
            email: signer.email,
            firstName: signer.firstName,
            lastName: signer.lastName,
            fields: signer.fields,
            color: signer.color,
            message: messages,
            meta_data: JSON.stringify({
              id: signer.id,
              email: signer.email,
              firstName: signer.firstName,
              lastName: signer.lastName,
              fields: signer.fields,
              color: signer.color,
              message: messages,
            }),
            signatures: await prepareSignatures(signer.id),
          })
        }
      } else {
        payload.signers.push({
          id: signer.id,
          email: signer.email,
          firstName: signer.firstName,
          lastName: signer.lastName,
          fields: signer.fields,
          color: signer.color,
          message: messages,
          meta_data: JSON.stringify({
            id: signer.id,
            email: signer.email,
            firstName: signer.firstName,
            lastName: signer.lastName,
            fields: signer.fields,
            color: signer.color,
            message: messages,
          }),
          signatures: await prepareSignatures(signer.id),
        })
      }
    }

  

    return payload
  }

  async function prepareSignatures(signerId: string) {
    let res: any = []
    let isMe = signerId === authState.data?.id

    for (let key in signatures) {
      for (let key2 in signatures[key]) {
        let sig = signatures[key][key2]

        if (sig.user.id === signerId) {
          let isSigned = Object.keys(sig.signature_data).length > 0

          delete sig['can_move']
          delete sig['can_move']
          delete sig['is_hidden']
          delete sig['can_select']
          delete sig['can_delete']
          delete sig['can_copy']

          if (isMe) {
            if (sig.type === 'textField') {
              if (!sig.signature_data.data) {
                continue
              } else {
                sig['is_signed'] = true
              }
            }

            if (sig.type === 'signature') {
              if (isSigned) {
                sig['is_signed'] = true
              } else {
                continue
              }
            }

            if (sig.type === 'checkbox') {
              sig['is_signed'] = true
              sig.signature_data['url'] = await html2Canvas(`${sig.id}_checkbox`, sig)
              sig.signature_data['isBase64'] = true
              sig.signature_data['format'] = 'png'
            }

            if (sig.type === 'dateField') {
              sig['is_signed'] = true
            }
          }

          res.push({
            ...sig,
            meta_data: JSON.stringify(sig),
          })
        }
      }
    }
    //   if (Object.keys(signatures[key]).length > 0) {
    //     Object.keys(signatures[key]).forEach(async function (key2) {
    //       let sig = signatures[key][key2]

    //       if (sig.user.id === signerId) {
    //         let isSigned = Object.keys(sig.signature_data).length > 0

    //         delete sig['can_move']
    //         delete sig['can_move']
    //         delete sig['is_hidden']
    //         delete sig['can_select']
    //         delete sig['can_delete']
    //         delete sig['can_copy']

    //         if (isMe) {
    //           if (sig.type === 'textField') {
    //             if (!sig.signature_data.data) {
    //               return
    //             } else {
    //               sig['is_signed'] = true
    //             }
    //           }

    //           if (sig.type === 'signature') {
    //             if (isSigned) {
    //               sig['is_signed'] = true
    //             } else {
    //               return
    //             }
    //           }

    //           if (sig.type === 'checkbox') {
    //             sig['is_signed'] = true
    //             sig.signature_data['url'] = await html2Canvas(`${sig.id}_checkbox`, sig)
    //             sig.signature_data['isBase64'] = true
    //           }

    //           if (sig.type === 'dateField') {
    //             sig['is_signed'] = true
    //           }
    //         }

    //         res.push({
    //           ...sig,
    //           meta_data: JSON.stringify(sig),
    //         })

    //       }
    //     })
    //   }
    // })
    return res
  }

  /* __________________________________ preparePayload2 __________________________________ */
  async function preparePayload2() {
    const payload: any = {
      id: props.documentId,
      signers: [],
      PDF_SCALING_RATIO: PDF_SCALING_RATIO.value,
    }
    try {
      const { data } = await baseApi.post(
        `/user/soft-create`,
        Object.keys(signer2).map((key) => ({ email: signer2[key].email }))
      )

      Object.keys(signer2).forEach((key) => {
        const signer = signer2[key]
        payload.signers.push({
          id: data[`${signer.email}`]['id'],
          email: signer.email,
          firstName: signer.firstName,
          lastName: signer.lastName,
          fields: signer.fields,
          color: signer.color,
          message: messages,
          meta_data: JSON.stringify({
            id: data[`${signer.email}`]['id'],
            email: signer.email,
            firstName: signer.firstName,
            lastName: signer.lastName,
            fields: signer.fields,
            color: signer.color,
            message: messages,
          }),
          signatures: prepareSignatures2(signer.id, data),
        })
      })

      return payload
    } catch (error) {
      console.log('>> sortCreate error', error)
    }
  }

  function prepareSignatures2(signerId: string, data: any) {
    let res: any = []
    let isMe = signerId === authState.data?.id

    for (let key in signatures) {
      for (let key2 in signatures[key]) {
        let sig = signatures[key][key2]
        if (sig.user.id === signerId) {
          let isSigned = Object.keys(sig.signature_data).length > 0

          delete sig['can_move']
          delete sig['can_move']
          delete sig['is_hidden']
          delete sig['can_select']
          delete sig['can_delete']
          delete sig['can_copy']

          if (isMe) {
            if (sig.type === 'textField') {
              if (sig.signature_data.data === '') {
                continue
              } else {
                sig['is_signed'] = true
              }
            }

            if (isSigned && sig.type === 'signature') {
              sig['is_signed'] = true
            }
            if (['dateField', 'checkbox'].includes(sig.type)) {
              sig['is_signed'] = true
            }
          }

          sig = {
            ...sig,
            user: {
              ...sig.user,
              id: data[`${sig.user.email}`]['id'],
            },
          }
          res.push({
            ...sig,
            meta_data: JSON.stringify(sig),
          })
        }
      }
    }

    // Object.keys(signatures).forEach((key) => {
    //   if (Object.keys(signatures[key]).length > 0) {
    //     Object.keys(signatures[key]).forEach((key2) => {
    //       let sig = signatures[key][key2]
    //       if (sig.user.id === signerId) {
    //         let isSigned = Object.keys(sig.signature_data).length > 0

    //         delete sig['can_move']
    //         delete sig['can_move']
    //         delete sig['is_hidden']
    //         delete sig['can_select']
    //         delete sig['can_delete']
    //         delete sig['can_copy']

    //         if (isMe) {
    //           if (sig.type === 'textField') {
    //             if (sig.signature_data.data === '') {
    //               return
    //             } else {
    //               sig['is_signed'] = true
    //             }
    //           }

    //           if (isSigned && sig.type === 'signature') {
    //             sig['is_signed'] = true
    //           }
    //           if (['dateField', 'checkbox'].includes(sig.type)) {
    //             sig['is_signed'] = true
    //           }
    //         }

    //         sig = {
    //           ...sig,
    //           user: {
    //             ...sig.user,
    //             id: data[`${sig.user.email}`]['id'],
    //           },
    //         }
    //         res.push({
    //           ...sig,
    //           meta_data: JSON.stringify(sig),
    //         })
    //       }
    //     })
    //   }
    // })
    return res
  }

  /* ______________________________________________________________________________________________________ */

  /* __________________________________________________ Skeleton ____________________________________________ */
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

  if (signersStatus?.is_signed) {
    return <RenderLeftSideComplete />
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
      <RenderSigners
        selectedSigner={signer2[selectedSignerId] || {}}
        setSelectedSignerId={setSelectedSignerId}
        document_status={props?.documentDetail?.status}
      />

      <>
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
      </>

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
      <Box sx={{ flex: 1 }}>
        <Box>
          <Typography>Author </Typography>
          <Typography></Typography>
        </Box>
        <Typography>Size: </Typography>
        <Typography>Created on: </Typography>
        <Typography>Updated on: </Typography>
      </Box>

      {/* --------------------------------------------- ONLY ME SIGNER ---------------------------------------------- */}

      {props?.documentDetail?.status !== 'READY_TO_SIGN' && (
        <Box sx={{ cursor: isDisabled ? 'not-allowed' : 'pointer' }}>
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
      )}

      {/* -------------------------------------------- SIGNEE FINISH AND SIGN [Orange Color] ---------------------------------------- */}

      {props?.documentDetail?.status === 'READY_TO_SIGN' && (
        <Box sx={{ cursor: isReadyToSignAndNoSignatureData ? 'not-allowed' : 'pointer' }}>
          <Divider sx={{ marginBottom: '13px' }} />
          <MButton
            onClick={handleSignBySignee}
            sx={{
              width: '100%',
              borderRadius: '5px',
              backgroundColor: isReadyToSignAndNoSignatureData ? '#DDDDDD' : 'var(--orange)',
              transition: 'all 0.4s ease-in-out',
              padding: '9px',
            }}
            disabled={isReadyToSignAndNoSignatureData}
          >
            <Typography
              sx={{
                color: 'var(--white)',
                fontWeight: 'bold',
                letterSpacing: '0.1rem',
                fontSize: '1.5rem',
              }}
            >
              {'Finish & Sign'}
            </Typography>
          </MButton>
        </Box>
      )}

      {/* <Divider sx={{ marginBottom: '20px', borderColor: 'var(--orange1)', borderWidth: '1px' }} /> */}

      {/* ----------------------------------------------------- CONTAINER DRAWER ------------------------------------------------- */}

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
            <Box sx={{ padding: '16px 24px 8px', }} >
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

            <Box sx={{ padding: '16px 24px 8px', }} >
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
            {/* --------------------------------------------- SEND EMAIL INVITE ---------------------------------------------- */}
            <MButton
              onClick={handleSaveAndSendEmail}
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
