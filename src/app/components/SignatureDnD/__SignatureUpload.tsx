import { selectors as authSelector } from '@esign-web/redux/auth'
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined'
import { Box } from '@mui/material'
import { MutableRefObject, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { AutoSave } from 'src/app/pages/Document/SigningPage/__RenderSignerAdd'
import MButton from '../Button'
import { Toast } from '../Toast'
import './style.scss'

type props = {
  signatureDataRef: MutableRefObject<{ type: string; data: any; callback?: any }>
  setDisableSaveSignature: any
  disableSaveSignature: boolean
  containerRef: any
}

export const SignatureUpload = (props: props) => {
  const { signatureDataRef, setDisableSaveSignature, disableSaveSignature } = props
  const authState = useSelector(authSelector.getAuthState)

  const inputRef = useRef<any>()
  const dataRef = useRef<any>({
    type: '',
    url: '',
    width: 0,
    height: 0,
  })
  const [previewImage, setPreviewImage] = useState<{
    type: string
    src: any
  }>()
  const [size, setSize] = useState<any>({})

  useEffect(() => {
    signatureDataRef.current = {
      type: 'image',
      data: {
        src: '',
        type: '',
      },
    }
  }, [])

  useEffect(() => {
    if (props.containerRef.current) {
      // dataRef.current.width = props.containerRef.current.offsetWidth - 300
      // dataRef.current.height = props.containerRef.current.offsetHeight - 300
      signatureDataRef.current.data.width = props.containerRef.current.offsetWidth - 300
      signatureDataRef.current.data.height = props.containerRef.current.offsetHeight - 300
      setSize({
        width: props.containerRef.current.offsetWidth,
        height: props.containerRef.current.offsetHeight,
      })
    }
  }, [props.containerRef.current])

  const onChangeFile = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      let file = e.target.files[0]

      if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
        Toast({ type: 'error', message: 'File type is not supported. Please upload PNG or JPEG file.' })
        return
      }

      // limit file size to 2MB

      if (file.size > 2 * 1024 * 1024) {
        Toast({ type: 'error', message: 'File size is too big. Please upload file less than 2MB.' })
        return
      }

      let base64Code = await fileTobase64(file)

      console.log(base64Code)

      signatureDataRef.current.data.src = base64Code

      setPreviewImage({
        type: file.type,
        src: base64Code,
      })

      setDisableSaveSignature(false)

      // // let reader = new FileReader()
      // // reader.readAsDataURL(file)
      // // reader.onload = () => {
      // //   setPreviewImage(reader.result)
      // // }
      // // create object url
      // let url = URL.createObjectURL(file)
      // setPreviewImage(url)
      // setDisableSaveSignature(false)
    }
  }

  // const getPreview = () => {
  //   return dataRef.current
  // }

  const fileTobase64 = async (file) => {
    return new Promise((resolve, reject) => {
      let reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        resolve(reader.result)
      }
      reader.onerror = (error) => {
        reject(error)
      }
    })
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
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
        {authState.data?.is_registerd && <AutoSave />}
      </Box>

      {/* --------------------------------- Upload File ------------------------------ */}

      {size.width && size.height && (
        <img
          src={previewImage?.src}
          width={size.width - 20}
          height={size.height - 60}
          style={{
            display: 'block',
            objectFit: 'contain',
            marginLeft: '5px',
            // border: '1px solid var(--gray3)',
            // borderRadius: '8px',
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
  )
}
