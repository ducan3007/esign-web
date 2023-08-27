import { selectors as documentSelectors } from '@esign-web/redux/document'
import { actions, selectors } from '@esign-web/redux/signatures'
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material'
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
  const isOpen = useSelector(selectors.getModalState)

  /* 
     If signature is Canvas or Image, we don't need this data
     Signature data only needed for Text Signature
  */
  const signatureData = siganture[`page_${selectedSignature.pageNumber}`]?.[selectedSignature.id] || {}

  const [options, setOptions] = useState<Options>(Options.draw)
  const [disableSaveSignature, setDisableSaveSignature] = useState<boolean>(true)
  const [enableSaveSignature, setSaveSignature] = useState<boolean>(false)

  const signatureBoardRef = useRef<HTMLDivElement>(null)
  const signatureDataRef = useRef<{ type: SignatureContent; data: any; callback?: any }>({ type: SignatureContent.canvas, data: {} })

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

  const handleSaveSignature = () => {
    if (!signatureDataRef.current) return

    if (enableSaveSignature) {
      // Save to DB
    } else {
      // Save to redux
    }
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
          borderRadius: '15px',
          boxShadow: 'none',
        },
        '& .MuiBackdrop-root': { backgroundColor: 'rgba(0, 0, 0, 0.3)' },
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
          border: '1px solid var(--red)',
          display: 'flex',
          padding: '0px 0px 0px 0px',
          gap: '30px',
        }}
      >
        {/* ------------- Options, [Draw, Type, Upload, Your Signatures] */}
        <Box
          sx={{
            width: '120px',
            border: '1px solid var(--orange)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box
            className="activesig"
            id="draw_sig"
            onClick={() => handleOptions('draw_sig', Options.draw)}
            sx={{ border: '1px solid var(--blue1)', cursor: 'pointer', '&:hover': { backgroundColor: 'var(--light-gray)' } }}
          >
            <Typography sx={{ fontSize: '1.6rem', padding: '10px 10px 10px 10px' }}>Draw</Typography>
          </Box>

          <Box
            id="type_sig"
            onClick={() => handleOptions('type_sig', Options.type)}
            sx={{ border: '1px solid var(--blue1)', cursor: 'pointer', '&:hover': { backgroundColor: 'var(--light-gray)' } }}
          >
            <Typography sx={{ fontSize: '1.6rem', padding: '10px 10px 10px 10px' }}>Type</Typography>
          </Box>

          <Box
            id="upload_sig"
            onClick={() => handleOptions('upload_sig', Options.upload)}
            sx={{ border: '1px solid var(--blue1)', cursor: 'pointer', '&:hover': { backgroundColor: 'var(--light-gray)' } }}
          >
            <Typography sx={{ fontSize: '1.6rem', padding: '10px 10px 10px 10px' }}>Upload</Typography>
          </Box>

          <Box
            id="my_sig"
            onClick={() => handleOptions('my_sig', Options.mySignatures)}
            sx={{ border: '1px solid var(--blue1)', cursor: 'pointer', '&:hover': { backgroundColor: 'var(--light-gray)' } }}
          >
            <Typography sx={{ fontSize: '1.6rem', padding: '10px 10px 10px 10px' }}>Signatures</Typography>
          </Box>
        </Box>

        <Box
          ref={signatureBoardRef}
          sx={{
            flex: 1,
            border: '1px solid var(--blue1)',
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

      <DialogActions>
        <MButton
          onClick={(e) => {
            e.stopPropagation()
            handleClose()
          }}
        >
          Close
        </MButton>
        <MButton
          sx={{
            '&:disabled': {
              backgroundColor: 'var(--gray3)',
            },
          }}
          disabled={disableSaveSignature}
          onClick={(e) => {
            if (signatureDataRef.current && signatureDataRef.current.type === SignatureContent.canvas) {
              if (signatureDataRef.current.callback) {
                console.log('>>>>>>>> SAVEEE', signatureDataRef.current)
                let base64 = signatureDataRef.current.callback()
                signatureDataRef.current.data.data = base64
              }
            }

            if (signatureDataRef.current && signatureDataRef.current.type === SignatureContent.text) {
              if (signatureDataRef.current.callback) {
                let { width, height } = signatureDataRef.current.callback()
                signatureDataRef.current.data.width = width
                signatureDataRef.current.data.height = height
              }
            }

            console.log('>>>>>>>> SAVEEE', signatureDataRef.current)
          }}
        >
          Save
        </MButton>
      </DialogActions>
    </Dialog>
  )
}

export default memo(SignatureEditModal, (prevProps, nextProps) => {
  if (prevProps.selectedSignature.id === nextProps.selectedSignature.id) return true
  if (prevProps.selectedSignature.pageNumber === nextProps.selectedSignature.pageNumber) return true
  return false
})

export const MySignatures = (props) => {
  const [searchBy, setSearchBy] = useState('Name')

  const Item = () => {
    return (
      <Box
        sx={{
          width: '100%',
          height: '150px',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          border: '1px solid var(--blue1)',
        }}
      ></Box>
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
            border: '1px solid var(--blue1)',
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
        {Array(13)
          .fill(0)
          .map((item, index) => {
            return <Item key={index} />
          })}
      </Box>
    </Box>
  )
}
