import { baseApi, getFontSize, getFormatFromBase64, getFormatFromURL } from '@esign-web/libs/utils'
import { selectors as certSelector } from '@esign-web/redux/certificate'
import { actions, selectors } from '@esign-web/redux/signatures'
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material'
import { BACKDROP_OFF, TOOGLE_BACKDROP } from 'libs/redux/auth/src/lib/constants'
import { CERT_SIGNATURE_SET } from 'libs/redux/certificate/src/lib/constants'
import { SignatureContent } from 'libs/redux/signatures/src/lib/reducers'
import { memo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import MButton from 'src/app/components/Button'
import { Toast } from 'src/app/components/Toast'
import { IconSignature } from '../../../components/Icons/pdf'
import { CanvasSignatureOption } from '../../Document/DragDrop/__CanvasOption'
import { MySignatures } from '../../Document/DragDrop/__SignatureModal'
import { UploadSignatureOption } from '../../Document/DragDrop/__SignatureUpload'
import { TextSignatureOption } from '../../Document/DragDrop/__TextOption'

type props = {
  selectedSignature: {
    id: string
    pageNumber: number
  }
}
export enum Options {
  draw = 'draw',
  type = 'type',
  upload = 'upload',
  mySignatures = 'mySignatures',
}

const SignatureEditModal = (props: props) => {
  const { selectedSignature } = props
  const dispatch = useDispatch()
  
  const signature = useSelector(certSelector.getSignatures)
  const isSignatureAutoSave = useSelector(selectors.getAutoSave)
  const isOpen = useSelector(selectors.getModalState)
  const signatureData = signature[`page_${selectedSignature.pageNumber}`]?.[selectedSignature.id] || {}

  const [options, setOptions] = useState<Options>(Options.draw)
  const [disableSaveSignature, setDisableSaveSignature] = useState<boolean>(true)
  const signatureBoardRef = useRef<HTMLDivElement>(null)
  const signatureDataRef = useRef<{ type: SignatureContent; data: any; callback?: any; callback2?: any }>({ type: SignatureContent.canvas, data: {} })

  const handleClose = () => {
    setOptions(Options.draw)
    const options = document.querySelectorAll('.activesig')
    options.forEach((option) => {
      option.classList.remove('activesig')
    })
    dispatch(actions.toggleModal({}))
  }

  const handleOptions = (id: string, option: Options) => {
    setDisableSaveSignature(true)
    const options = document.querySelectorAll('.activesig')
    options.forEach((option) => {
      option.classList.remove('activesig')
    })
    const selectedOption = document.getElementById(id)
    selectedOption?.classList.add('activesig')
    setOptions(option)
  }

  const handleSaveSignature = async ({ format, base64, width, height }) => {
    if (!signatureDataRef.current) return

    // Save to DB
    const res = await baseApi.post('/signature/template', {
      format: format,
      base64: base64,
      width: width,
      height: height,
    })
    return res.data
  }

  const handleSave = async (e) => {
    try {
      /* --------------------------------- Canvas ---------------------------------------- */
      if (signatureDataRef.current && signatureDataRef.current.type === SignatureContent.canvas) {
        if (signatureDataRef.current.callback && signatureDataRef.current.callback2) {
          let base64 = await signatureDataRef.current.callback()
          const { width, height } = signatureDataRef.current.callback2()
          dispatch({ type: TOOGLE_BACKDROP })
          await new Promise((resolve) => setTimeout(resolve, 300))
          const reduxPayload = {
            ...signatureData,
            width: width + 0.001,
            height: height + 0.001,
            signature_data: {
              url: base64,
              format: getFormatFromBase64(base64),
            },
          }
          if (isSignatureAutoSave) {
            const res = await handleSaveSignature({
              format: getFormatFromBase64(base64),
              base64: base64,
              width: width,
              height: height,
            })
            reduxPayload.signature_data.url = res.url
            reduxPayload.signature_data['isBase64'] = false
            reduxPayload.signature_data['signature_id'] = res['id']
          } else {
            reduxPayload.signature_data['isBase64'] = true
          }
          dispatch({
            type: CERT_SIGNATURE_SET,
            payload: reduxPayload,
          })

          dispatch({ type: BACKDROP_OFF })
        }
      }
      /* --------------------------------- Text ---------------------------------------- */
      if (signatureDataRef.current && signatureDataRef.current.type === SignatureContent.text) {
        if (signatureDataRef.current.callback) {
          let { width, height } = signatureDataRef.current.callback()
          signatureDataRef.current.data.width = width
          signatureDataRef.current.data.height = height
        }
        const payload = {
          type: signatureDataRef.current.type,
          text: signatureDataRef.current.data.data,
          fontSize: getFontSize(signatureDataRef.current?.data.fontSize.pixel),
          fontFamily: signatureDataRef.current?.data.fontStyle.value,
          color: signatureDataRef.current?.data.color.value,
          letterSpacing: 1,
          width: signatureDataRef.current?.data.width,
          height: signatureDataRef.current?.data.height,
        }
        dispatch({ type: TOOGLE_BACKDROP })
        const response = await baseApi.post('/signature/create/text', payload)
        const reduxPayload = {
          ...signatureData,
          height: payload.height,
          width: payload.width,
          signature_data: {
            ...payload,
            url: response.data,
            format: getFormatFromBase64(response.data),
          },
        }

        if (isSignatureAutoSave) {
          const res = await handleSaveSignature({
            format: getFormatFromBase64(response.data),
            base64: response.data,
            width: signatureDataRef.current?.data.width,
            height: signatureDataRef.current?.data.height,
          })
          reduxPayload.signature_data['signature_id'] = res['id']
          reduxPayload.signature_data.url = res.url
          reduxPayload.signature_data['isBase64'] = false
        } else {
          reduxPayload.signature_data['isBase64'] = true
        }
        dispatch({
          type: CERT_SIGNATURE_SET,
          payload: reduxPayload,
        })

        dispatch({ type: BACKDROP_OFF })
      }

      /* --------------------------------- Image ---------------------------------------- */
      if (signatureDataRef.current && signatureDataRef.current.type === SignatureContent.image) {
        let { src, width, height } = signatureDataRef.current.data
        dispatch({ type: TOOGLE_BACKDROP })
        await new Promise((resolve) => setTimeout(resolve, 300))
        const reduxPayload = {
          ...signatureData,
          width: width + 0.001,
          height: height + 0.001,
          signature_data: {
            format: getFormatFromBase64(src),
            url: src,
          },
        }
        if (isSignatureAutoSave) {
          const res = await handleSaveSignature({
            format: getFormatFromBase64(src),
            base64: src,
            width: width + 0.001,
            height: height + 0.001,
          })
          reduxPayload.signature_data['signature_id'] = res['id']
          reduxPayload.signature_data.url = res.url
          reduxPayload.signature_data['isBase64'] = false
        } else {
          reduxPayload.signature_data['isBase64'] = true
        }
        dispatch({
          type: CERT_SIGNATURE_SET,
          payload: reduxPayload,
        })

        dispatch({ type: BACKDROP_OFF })
      }

      /* --------------------------------- My Signature ---------------------------------------- */
      if (signatureDataRef.current && signatureDataRef.current.type === SignatureContent.mySignature) {
        let { id, url, width, height } = signatureDataRef.current.data
        dispatch({
          type: CERT_SIGNATURE_SET,
          payload: {
            ...signatureData,
            width: width + 0.001,
            height: height + 0.001,
            signature_data: {
              signature_id: id,
              url: url,
              format: getFormatFromURL(url),
            },
          },
        })
        dispatch({ type: BACKDROP_OFF })
      }

      handleClose()
    } catch (error) {
      dispatch({ type: BACKDROP_OFF })
      Toast({
        message: (
          <div style={{ paddingLeft: '10px' }}>
            <div>File type is not supported</div> <div>Please upload PDF file.</div>
          </div>
        ),
        type: 'error',
      })
    }
  }

  return (
    <Dialog
      disableEscapeKeyDown
      disableEnforceFocus
      open={isOpen}
      // onCanPlay={handleClose}
      sx={{
        '& .MuiDialog-paper': {
          width: 1100,
          height: 700,
          maxWidth: 'none',
          maxHeight: 'none',
          borderRadius: '16px',
          boxShadow: 'none',
        },
        '& .MuiBackdrop-root': { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
      }}
    >
      {/* -----------------------------------------   Dialog Title  --------------------------------------------------- */}

      <DialogTitle sx={{ padding: '0px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <IconSignature width={64} height={62} style={{ marginBottom: '15px' }} />
        <Typography sx={{ fontSize: '2.7rem', padding: 0 }}>Signatures</Typography>
      </DialogTitle>

      {/* -----------------------------------------   Dialog Content  --------------------------------------------------- */}
      <DialogContent sx={{ display: 'flex', padding: '0px 0px 0px 0px', gap: '10px' }}>
        {/* ------------- Options, [Draw, Type, Upload, Your Signatures] */}
        <Box sx={{ width: '130px', display: 'flex', flexDirection: 'column' }}>
          <Box
            className="activesig"
            id="draw_sig"
            onClick={() => handleOptions('draw_sig', Options.draw)}
            sx={{
              cursor: 'pointer',
              '&:hover': { backgroundColor: 'var(--light-gray)', borderRadius: '2px' },
            }}
          >
            <Typography sx={{ fontSize: '1.6rem', padding: '10px 10px 10px 10px' }}>Draw</Typography>
          </Box>

          <Box
            id="type_sig"
            onClick={() => handleOptions('type_sig', Options.type)}
            sx={{
              backgroundColor: 'var(--light-gray-darker)',
              cursor: 'pointer',
              '&:hover': { backgroundColor: 'var(--light-gray)', borderRadius: '2px' },
            }}
          >
            <Typography sx={{ fontSize: '1.6rem', padding: '10px 10px 10px 10px' }}>Type</Typography>
          </Box>

          <Box
            id="upload_sig"
            onClick={() => handleOptions('upload_sig', Options.upload)}
            sx={{
              cursor: 'pointer',
              '&:hover': { backgroundColor: 'var(--light-gray)', borderRadius: '2px' },
            }}
          >
            <Typography sx={{ fontSize: '1.6rem', padding: '10px 10px 10px 10px' }}>Upload</Typography>
          </Box>

          <Box
            id="my_sig"
            onClick={() => handleOptions('my_sig', Options.mySignatures)}
            sx={{
              cursor: 'pointer',
              '&:hover': { backgroundColor: 'var(--light-gray)', borderRadius: '2px' },
            }}
          >
            <Typography sx={{ fontSize: '1.6rem', padding: '10px 10px 10px 10px' }}>Signatures</Typography>
          </Box>
        </Box>

        <Box
          ref={signatureBoardRef}
          sx={{
            flex: 1,
            borderRadius: '5px',
            overflow: 'hidden',
          }}
        >
          {options === Options.draw && (
            <CanvasSignatureOption
              signatureDataRef={signatureDataRef}
              containerRef={signatureBoardRef}
              disableSaveSignature={disableSaveSignature}
              setDisableSaveSignature={setDisableSaveSignature}
            />
          )}
          {options === Options.type && (
            <TextSignatureOption
              signatureDataRef={signatureDataRef}
              containerRef={signatureBoardRef}
              disableSaveSignature={disableSaveSignature}
              setDisableSaveSignature={setDisableSaveSignature}
            />
          )}
          {options === Options.upload && (
            <UploadSignatureOption
              signatureDataRef={signatureDataRef}
              containerRef={signatureBoardRef}
              disableSaveSignature={disableSaveSignature}
              setDisableSaveSignature={setDisableSaveSignature}
            />
          )}
          {options === Options.mySignatures && (
            <MySignatures
              signatureDataRef={signatureDataRef}
              containerRef={signatureBoardRef}
              disableSaveSignature={disableSaveSignature}
              setDisableSaveSignature={setDisableSaveSignature}
            />
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ marginRight: '10px' }}>
        <MButton
          sx={{
            backgroundColor: 'var(--dark5)',
          }}
          onClick={(e) => {
            e.stopPropagation()
            handleClose()
          }}
        >
          <span style={{ color: 'var(--white)', fontWeight: 'bold' }}>Cancel</span>
        </MButton>
        <MButton
          sx={{
            '&:disabled': {
              backgroundColor: 'var(--gray3)',
            },
            backgroundColor: 'var(--orange)',
            paddingLeft: '20px',
            paddingRight: '20px',
          }}
          disabled={disableSaveSignature}
          onClick={handleSave}
        >
          <span style={{ color: 'var(--white)', fontWeight: 'bold' }}>Save</span>
        </MButton>
      </DialogActions>
    </Dialog>
  )
}

export default memo(SignatureEditModal, (prevProps, nextProps) => {
  if (prevProps.selectedSignature.id !== nextProps.selectedSignature.id) return false
  if (prevProps.selectedSignature.pageNumber !== nextProps.selectedSignature.pageNumber) return false
  return true
})
