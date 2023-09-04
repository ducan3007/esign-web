import { selectors as documentSelectors } from '@esign-web/redux/document'
import { actions, selectors } from '@esign-web/redux/signatures'
import { actions as authActions } from '@esign-web/redux/auth'
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, Skeleton, Typography } from '@mui/material'
import { MutableRefObject, memo, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import MButton from '../Button'
import { useOnDraw } from '../Canvas/Hook'
import { IconSignature } from '../Icons/pdf'
import { MUIMenu } from '../Menu'
import { MInputBase } from '../TextInput'
import { SignatureType } from './__SignatureType'
import './style.scss'
import { Signature, SignatureContent } from 'libs/redux/signatures/src/lib/reducers'
import { SignatureCanvas } from './__SignatureCanvas'
import { AutoSave } from 'src/app/pages/Document/SigningPage/__RenderSignerAdd'
import { SignatureUpload } from './__SignatureUpload'
import { BACKDROP_OFF, TOOGLE_BACKDROP } from 'libs/redux/auth/src/lib/constants'
import { Toast } from '../Toast'
import { baseApi, getFontSize, getFontSizeWithScale, getFormatFromBase64 } from '@esign-web/libs/utils'
import { SIGNATURES_UPDATE_DATA, SIGNATURE_SET } from 'libs/redux/document/src/lib/constants'

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

  const siganture = useSelector(documentSelectors.getSignatures)
  const isSignatureAutoSave = useSelector(selectors.getAutoSave)
  const isOpen = useSelector(selectors.getModalState)

  console.log('isSignatureAutoSave', isSignatureAutoSave)

  /* 
     If signature is Canvas or Image, we don't need this data
     Signature data only needed for Text Signature
  */
  const signatureData = siganture[`page_${selectedSignature.pageNumber}`]?.[selectedSignature.id] || {}

  const [options, setOptions] = useState<Options>(Options.draw)
  const [disableSaveSignature, setDisableSaveSignature] = useState<boolean>(true)
  const [enableSaveSignature, setSaveSignature] = useState<boolean>(false)

  const signatureBoardRef = useRef<HTMLDivElement>(null)
  const signatureDataRef = useRef<{ type: SignatureContent; data: any; callback?: any; callback2?: any }>({ type: SignatureContent.canvas, data: {} })

  // useEffect(() => {
  //   /* Don't mutate redux state directly */
  //   signatureDataRef.current = JSON.parse(JSON.stringify(signatureData))
  // }, [signatureData])

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

  /* ---------------------------------------- SAVE SIGNATURE --------------------------- */
  const handleSave = async (e) => {
    try {
      /* --------------------------------- Canvas ---------------------------------------- */
      if (signatureDataRef.current && signatureDataRef.current.type === SignatureContent.canvas) {
        if (signatureDataRef.current.callback && signatureDataRef.current.callback2) {
          console.log('>>>>>>>> SAVEEE', signatureDataRef.current)
          let base64 = await signatureDataRef.current.callback()

          const { width, height } = signatureDataRef.current.callback2()

          console.log('>>>>>>> base64', base64)

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
            console.log('>>>>>>>> res', res)
            reduxPayload.signature_data['signature_id'] = res['id']
            reduxPayload.signature_data.url = res.url
          }
          console.log('>>>>>>>> reduxPayload', reduxPayload)

          dispatch({
            type: SIGNATURE_SET,
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

        console.log('>>>>>>>> SAVEEE', signatureDataRef.current)

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
        console.log('>>>>>>>> PAYLOAD', payload)
        dispatch({ type: TOOGLE_BACKDROP })

        const response = await baseApi.post('/signature/create/text', payload)

        console.log('>>>>>>>> base64', response.data)

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
        }
        console.log('>>>>>>>> reduxPayload', reduxPayload)

        dispatch({
          type: SIGNATURE_SET,
          payload: reduxPayload,
        })

        dispatch({ type: BACKDROP_OFF })
      }

      /* --------------------------------- Image ---------------------------------------- */
      if (signatureDataRef.current && signatureDataRef.current.type === SignatureContent.image) {
        let { src, width, height } = signatureDataRef.current.data

        console.log('>>>>>>>> SAVEEE', signatureDataRef.current)

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
        }

        dispatch({
          type: SIGNATURE_SET,
          payload: reduxPayload,
        })

        dispatch({ type: BACKDROP_OFF })
      }

      /* --------------------------------- My Signature ---------------------------------------- */
      if (signatureDataRef.current && signatureDataRef.current.type === SignatureContent.mySignature) {
        let { id, url, width, height } = signatureDataRef.current.data
        console.log('>>>>>>>> SAVEEE', signatureDataRef.current)
        dispatch({
          type: SIGNATURE_SET,
          payload: {
            ...signatureData,
            width: width + 0.001,
            height: height + 0.001,
            signature_data: {
              signature_id: id,
              url: url,
              format: getFormatFromBase64(url),
            },
          },
        })
        dispatch({ type: BACKDROP_OFF })
      }

      handleClose()
    } catch (error) {
      console.log('>>>>> error', error)
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

  // console.log('>>>>> signatureData', signatureData)
  console.log('>>>>> selectedSignature', selectedSignature)

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
      <DialogContent
        sx={{
          display: 'flex',
          padding: '0px 0px 0px 0px',
          gap: '10px',
        }}
      >
        {/* ------------- Options, [Draw, Type, Upload, Your Signatures] */}
        <Box
          sx={{
            width: '130px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
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
            <SignatureCanvas
              signatureDataRef={signatureDataRef}
              containerRef={signatureBoardRef}
              disableSaveSignature={disableSaveSignature}
              setDisableSaveSignature={setDisableSaveSignature}
            />
          )}
          {options === Options.type && (
            <SignatureType
              signatureDataRef={signatureDataRef}
              containerRef={signatureBoardRef}
              disableSaveSignature={disableSaveSignature}
              setDisableSaveSignature={setDisableSaveSignature}
            />
          )}
          {options === Options.upload && (
            <SignatureUpload
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

      <DialogActions
        sx={{
          marginRight: '10px',
        }}
      >
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

type props1 = {
  signatureDataRef: MutableRefObject<{ type: string; data: any; callback?: any; callback2?: any }>
  containerRef: any
  disableSaveSignature: boolean
  setDisableSaveSignature: (disable: boolean) => void
}

export const MySignatures = (props: props1) => {
  const { signatureDataRef, disableSaveSignature, setDisableSaveSignature } = props
  const [searchBy, setSearchBy] = useState('Name')
  const [selected, setSelected] = useState<any>(null)
  const [signatures, setSignatures] = useState<any>([])

  useEffect(() => {
    ;(async () => {
      const res = await baseApi.get('/signature/template')
      console.log('>>>>> res', res)
      setSignatures(res.data)
    })()

    signatureDataRef.current = {
      type: SignatureContent.mySignature,
      data: {},
    }
  }, [])

  const getData = async () => {}

  const ItemSkeleton = () => {
    return <Skeleton sx={{ transform: 'scale(1.0)' }} animation="wave" width={'100%'} height={150} />
  }

  const Item = ({ item }) => {
    return (
      <Box
        onClick={() => {
          setSelected(item)
          signatureDataRef.current.data = {
            id: item.id,
            url: item.url,
            width: item.width,
            height: item.height,
          }
          setDisableSaveSignature(false)
        }}
        sx={{
          width: '100%',
          height: '150px',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          border: selected?.id === item.id ? '2px solid var(--orange2)' : '2px solid var(--gray3)',
          borderRadius: '5px',
          cursor: 'pointer',
          padding: '5px',
          '&:hover': {
            border: '3px solid var(--orange2)',
          },
        }}
      >
        <img
          src={item.url}
          alt=""
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
        />
      </Box>
    )
  }
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      {/* ------------------------------------ Options ---------------------------------------- */}
      <Box sx={{ height: '50px', padding: '1rem', position: 'relative' }}>
        <MInputBase
          sx={{
            fontSize: '1.7rem',
            width: '450px',
            // paddingLeft: '20px',
            '& .MuiInputBase-input': {
              paddingLeft: '105px',
            },
          }}
          placeholder="Search..."
        />

        {/* ----------------------------- Search by ------------------------------- */}
        <MUIMenu
          sx1={{
            width: '100px',
            height: '35px',
            position: 'absolute',
            backgroundColor: 'var(--light-blue3)',
            left: '1rem',
            top: '1rem',
            borderRadius: '0px',
            // border: '1px solid var(--blue1)',
            display: 'flex',
            justifyContent: 'space-between',
            padding: '5px',
            paddingRight: '0px',
          }}
          content1={
            <>
              <span
                style={{
                  color: 'var(--dark2)',
                  fontWeight: 'bold',
                  fontSize: '1.7rem',
                }}
              >
                {searchBy}
              </span>
              <ExpandMoreIcon
                sx={{
                  right: '3px',
                  fontSize: '2.5rem',
                  color: 'var(--dark2)',
                }}
              />
            </>
          }
          content2={({ handleClose }) => {
            return ['Name', 'Tag', 'Id'].map((item, index) => {
              return (
                <Box
                  sx={{
                    width: '100px',
                    backgroundColor: 'white',
                    color: 'var(--dark2)',
                    height: '35px',
                    padding: '4px',
                    '&:hover': {
                      backgroundColor: 'var(--blue1)',
                      '& span': {
                        color: 'white',
                      },
                    },
                    marginBottom: '0px',
                  }}
                  key={index}
                  onClick={() => {
                    setSearchBy(item)
                    handleClose()
                  }}
                >
                  <span style={{ fontSize: '1.6rem' }}>{item}</span>
                </Box>
              )
            })
          }}
        />
      </Box>

      {/* ---------------------------- Signature Grid ---------------------------------- */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gridGap: '1rem',
          padding: '1rem',
          overflowY: 'auto',
        }}
      >
        {signatures.map((item, index) => {
          return <Item key={index} item={item} />
        })}
        {signatures.length === 0 &&
          Array.from(Array(12).keys()).map((item, index) => {
            return <ItemSkeleton key={index} />
          })}
      </Box>
    </Box>
  )
}
