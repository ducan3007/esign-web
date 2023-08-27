import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined'
import { Box } from '@mui/material'
import { MutableRefObject, useEffect, useRef, useState } from 'react'
import { AutoSave } from 'src/app/pages/Document/SigningPage/__RenderSignerAdd'
import MButton from '../Button'
import './style.scss'

type props = {
  signatureDataRef: MutableRefObject<{ type: string; data: any; callback?: any }>
  setDisableSaveSignature: any
  disableSaveSignature: boolean
  containerRef: any
}

export const SignatureUpload = (props: props) => {
  const { signatureDataRef, setDisableSaveSignature, disableSaveSignature } = props

  const inputRef = useRef<any>()
  const [previewImage, setPreviewImage] = useState<any>()
  const [size, setSize] = useState<any>({})

  useEffect(() => {
    if (signatureDataRef.current) {
      signatureDataRef.current = {
        type: 'upload',
        data: previewImage,
      }
    }
  }, [])

  useEffect(() => {
    if (props.containerRef.current) {
      setSize({
        width: props.containerRef.current.offsetWidth,
        height: props.containerRef.current.offsetHeight,
      })
    }
  }, [props.containerRef.current])

  const onChangeFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      let file = e.target.files[0]
      // let reader = new FileReader()
      // reader.readAsDataURL(file)
      // reader.onload = () => {
      //   setPreviewImage(reader.result)
      // }
      // create object url
      let url = URL.createObjectURL(file)
      setPreviewImage(url)
      setDisableSaveSignature(false)
    }
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
      {/*  ------------------------------- Options CRUD ----------------------------  */}

      <Box
        sx={{
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <MButton
          sx={{
            backgroundColor: 'var(--orange)',
            padding: '8px 8px',
          }}
          onClick={(e) => {
            if (inputRef.current) {
              inputRef.current.click()
            }
          }}
        >
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              letterSpacing: '0.5px',
              fontSize: '1.7rem',
              color: 'var(--white)',
              fontWeight: 'bold',
              gap: '10px',
            }}
          >
            <CloudUploadOutlinedIcon
              sx={{
                fontSize: '2.5rem',
              }}
            />
            Upload a file
          </span>
        </MButton>
        <AutoSave />
      </Box>

      {/* --------------------------------- Upload File ------------------------------ */}

      <Box
        sx={{
          flex: 1,
          height: '100%',
          border: '1px solid red',
        }}
      >
        {size.width && size.height && (
          <img
            src={previewImage}
            width={size.width - 100}
            height={size.height - 100}
            style={{
              display: 'block',
              margin: 'auto',
              marginTop: '25px',
              objectFit: 'fill',
            }}
          />
        )}

        <input
          type="file"
          hidden
          onClick={(e) => {
            e.stopPropagation()
          }}
          onChange={onChangeFile}
          accept="image/*"
          ref={inputRef}
        />
      </Box>
    </Box>
  )
}
