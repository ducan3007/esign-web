import { memo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { actions, selectors } from '@esign-web/redux/signatures'
import { Toast, baseApi, getFontSize, getFormatFromBase64 } from '@esign-web/libs/utils'
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material'
import { IconSignature } from 'src/app/components/Icons/pdf'
import { SignatureContent } from 'libs/redux/signatures/src/lib/reducers'
import { CanvasSignatureOption } from '../Document/DragDrop/__CanvasOption'
import { TextSignatureOption } from '../Document/DragDrop/__TextOption'
import { UploadSignatureOption } from '../Document/DragDrop/__SignatureUpload'
import MButton from 'src/app/components/Button'
import { BACKDROP_OFF, TOOGLE_BACKDROP } from 'libs/redux/auth/src/lib/constants'

export enum Options {
  draw = 'draw',
  type = 'type',
  upload = 'upload',
  mySignatures = 'mySignatures',
}

const SignatureEditModal = (props: any) => {
  const dispatch = useDispatch()
  const isOpen = useSelector(selectors.getModalState)

  const [options, setOptions] = useState<Options>(Options.draw)
  const [disableSaveSignature, setDisableSaveSignature] = useState<boolean>(true)

  const signatureDataRef = useRef<{ type: SignatureContent; data: any; callback?: any; callback2?: any }>({ type: SignatureContent.canvas, data: {} })
  const signatureBoardRef = useRef<HTMLDivElement>(null)

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
    // Save to DB
    const res = await baseApi.post('/signature/template', {
      format: format,
      base64: base64,
      width: width,
      height: height,
    })
    return res.data
  }

  const handleSave = async () => {
    try {
      /* --------------------------------- Canvas ---------------------------------------- */
      if (signatureDataRef.current && signatureDataRef.current.type === SignatureContent.canvas) {
        if (signatureDataRef.current.callback && signatureDataRef.current.callback2) {
          let base64 = await signatureDataRef.current.callback()
          let { width, height } = signatureDataRef.current.callback2()
          dispatch({ type: TOOGLE_BACKDROP })
          await new Promise((resolve) => setTimeout(resolve, 300))
          const res = await handleSaveSignature({
            format: getFormatFromBase64(base64),
            base64: base64,
            width: width,
            height: height,
          })
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
        await handleSaveSignature({
          format: getFormatFromBase64(response.data),
          base64: response.data,
          width: signatureDataRef.current?.data.width,
          height: signatureDataRef.current?.data.height,
        })
      }

      /* --------------------------------- Image ---------------------------------------- */
      if (signatureDataRef.current && signatureDataRef.current.type === SignatureContent.image) {
        let { src, width, height } = signatureDataRef.current.data
        dispatch({ type: TOOGLE_BACKDROP })
        await new Promise((resolve) => setTimeout(resolve, 300))
        await handleSaveSignature({
          format: getFormatFromBase64(src),
          base64: src,
          width: width + 0.001,
          height: height + 0.001,
        })
      }

      dispatch({ type: BACKDROP_OFF })
      handleClose()
      window.location.reload()
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
        {/* __________________________________ Options, [Draw, Type, Upload, Your Signatures] ____________________________ */}
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
        </Box>

        <Box ref={signatureBoardRef} sx={{ flex: 1, borderRadius: '5px', overflow: 'hidden' }}>
          {options === Options.draw && (
            <CanvasSignatureOption
              hideAutoSave
              signatureDataRef={signatureDataRef}
              containerRef={signatureBoardRef}
              disableSaveSignature={disableSaveSignature}
              setDisableSaveSignature={setDisableSaveSignature}
            />
          )}
          {options === Options.type && (
            <TextSignatureOption
              hideAutoSave
              signatureDataRef={signatureDataRef}
              containerRef={signatureBoardRef}
              disableSaveSignature={disableSaveSignature}
              setDisableSaveSignature={setDisableSaveSignature}
            />
          )}
          {options === Options.upload && (
            <UploadSignatureOption
              hideAutoSave
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

export default SignatureEditModal
