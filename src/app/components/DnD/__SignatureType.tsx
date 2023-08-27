import { actions, selectors } from '@esign-web/redux/signatures'
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, InputBase, Typography } from '@mui/material'
import { MutableRefObject, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import MButton from '../Button'
import { useOnDraw } from '../Canvas/Hook'
import { IconSignature } from '../Icons/pdf'
import { MUIMenu } from '../Menu'
import { MInputBase } from '../TextInput'
import './style.scss'
import { Signature } from 'libs/redux/signatures/src/lib/reducers'
import { Options } from './__SignatureModal'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { AutoSave } from 'src/app/pages/Document/SigningPage/__RenderSignerAdd'

export const FontSize = [
  { pt: '12', pixel: '16px' },
  { pt: '14', pixel: '19px' },
  { pt: '18', pixel: '24px' },
  { pt: '24', pixel: '32px' },
  { pt: '36', pixel: '48px' },
  { pt: '48', pixel: '64px' },
  { pt: '60', pixel: '80px' },
  { pt: '72', pixel: '96px' },
]
export const FontStyle = [
  { fontFamily: 'Time New Roman', value: 'font_times_new_roman' },
  { fontFamily: 'Dancing Script', value: 'font_dancing_script' },
  { fontFamily: 'Satisfy', value: 'font_satisfy' },
  { fontFamily: 'Ephesis', value: 'font_ephesis' },
  { fontFamily: 'Charmonman', value: 'font_charmonman' },
  { fontFamily: 'Sofia', value: 'font_sofia' },
]

type props = {
  signatureDataRef: MutableRefObject<{ type: string; data: any; callback?: any }>
  setDisableSaveSignature: any
  disableSaveSignature: boolean
  containerRef: any
}

export const SignatureType = (props: props) => {
  const { signatureDataRef, setDisableSaveSignature, disableSaveSignature } = props

  const inputRef = useRef<any>(null)

  const [fontStyle, setFontStyle] = useState(FontStyle[0])
  const [fontSize, setFontSize] = useState(FontSize[3])
  const [text, setText] = useState('')

  console.log('>>> fontStyle', fontStyle)
  console.log('>>> signatureDataRef', signatureDataRef.current)

  // useEffect(() => {
  //   if (signature_data) {
  //     if (!signature_data.type) {
  //       signature_data.type = 'text'
  //       signature_data.data = {}
  //       signature_data.data['fontStyle'] = fontStyle
  //       signature_data.data['fontSize'] = fontSize
  //       signature_data.data['data'] = ''
  //     } else if (signature_data.type === 'text') {
  //       setFontStyle(signature_data.data['fontStyle'] || FontStyle[0])
  //       setFontSize(signature_data.data['fontSize'] || FontSize[3])
  //       setText(signature_data.data['data'] || '')
  //     }
  //   }
  // }, [])

  // console.log('>>> text', text)

  const textRef = useRef<any>(null)
  console.log('>>>> text Ref', textRef)

  useEffect(() => {
    signatureDataRef.current = {
      type: 'text',
      data: {
        fontStyle: fontStyle,
        fontSize: fontSize,
        data: text,
      },
      callback: getSignaturePreSize,
    }
  }, [])

  const getSignaturePreSize = () => {
    const { width, height } = textRef.current.getBoundingClientRect()
    return {
      width: width,
      height: height,
    }
  }

  // useEffect(() => {
  //   if (textRef.current) {
  //     // size of element
  //     signatureDataRef.current = {
  //       type: 'text',
  //       data: {
  //         fontStyle: fontStyle,
  //         fontSize: fontSize,
  //         data: text,
  //         size: {
  //           width: width,
  //           height: height,
  //         },
  //       },
  //     }
  //   }
  // }, [text])

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
      onClick={() => {
        inputRef.current.focus()
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
        {/*  ------------------- Font style ---------------------------- */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <MUIMenu
            sx1={{
              width: '200px',
              // height: '45px',
              // border: '1px solid var(--blue1)',
              border: '1px solid var(--gray3)',
              padding: 0,
              paddingLeft: '5px',
              display: 'flex',
              justifyContent: 'flex-start',
            }}
            sx2={{
              '& .MuiPaper-root': {
                marginTop: '4px',
                boxShadow: '0px 0px 6px rgba(0, 0, 0, 0.4)',
                borderRadius: '4px',
              },
            }}
            content1={
              <span className={fontStyle.value} style={{ fontSize: '2rem', fontWeight: 'bold', letterSpacing: '0.2rem' }}>
                {fontStyle.fontFamily}
              </span>
            }
            content2={({ handleClose }) => {
              return FontStyle.map((item, index) => {
                return (
                  <Box
                    sx={{
                      width: '200px',
                      backgroundColor: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      color: 'var(--dark)',
                      height: '50px',
                      marginBottom: '0px',
                      padding: '4px',
                    }}
                    key={index}
                    onClick={() => {
                      inputRef.current.focus()
                      setFontStyle(item)
                      handleClose()
                    }}
                  >
                    <Box
                      sx={{
                        width: '100%',
                        borderRadius: '5px',
                        padding: '10px 10px',
                        '&:hover': {
                          backgroundColor: 'var(--light-gray)',
                        },
                      }}
                    >
                      <span className={item.value} style={{ fontSize: '1.9rem', fontWeight: 'bold', color: 'var(--dark)' }}>
                        {item.fontFamily}
                      </span>
                    </Box>
                  </Box>
                )
              })
            }}
          />

          {/*  --------------------- Font Size ---------------------------- */}

          <Box
            sx={{
              display: 'flex',
              border: '1px solid var(--gray3)',
            }}
          >
            <MUIMenu
              sx1={{
                width: '60px',
                // height: '35px',
                padding: 0,
              }}
              sx2={{
                '& .MuiPaper-root': {
                  marginTop: '2px',
                  boxShadow: '0px 0px 6px rgba(0, 0, 0, 0.4)',
                  borderRadius: '6px',
                },
              }}
              content1={
                <>
                  <span
                    style={{
                      fontSize: '1.8rem',
                      fontWeight: 'bold',
                      letterSpacing: '0.2rem',
                    }}
                  >
                    {fontSize.pt}pt
                  </span>
                </>
              }
              content2={({ handleClose }) => {
                return FontSize.map((item, index) => {
                  return (
                    <Box
                      sx={{
                        width: '75px',
                        height: '40px',
                        backgroundColor: 'white',
                        alignItems: 'center',
                        color: 'var(--dark)',
                        marginBottom: '0px',
                        padding: '4px',
                      }}
                      key={index}
                      onClick={() => {
                        inputRef.current.focus()
                        setFontSize(item)
                        handleClose()
                      }}
                    >
                      <Box
                        sx={{
                          width: '100%',
                          textAlign: 'center',
                          borderRadius: '5px',
                          padding: '4px 0px',
                          '&:hover': {
                            backgroundColor: 'var(--light-gray)',
                          },
                        }}
                      >
                        <span
                          style={{
                            fontSize: '1.8rem',
                            fontWeight: 'bold',
                            color: 'var(--dark)',
                          }}
                        >
                          {item.pt}
                        </span>
                      </Box>
                    </Box>
                  )
                })
              }}
            ></MUIMenu>
            <Box
              sx={{
                display: 'flex',
                alignContent: 'center',
                justifyContent: 'center',
                alignItems: 'center',
                span: {
                  cursor: 'pointer',
                  userSelect: 'none',
                  fontSize: '1.4rem',
                  ':hover': {
                    backgroundColor: 'var(--light-gray)',
                  },
                },
              }}
            >
              <Box sx={{ display: 'flex', height: '100%', flexDirection: 'column', alignContent: 'center', textAlign: 'center' }}>
                <span style={{ flex: 1, paddingTop: '5px' }}>&#9650; </span>
                <span style={{ flex: 1, paddingBottom: '5px' }}>&#9660; </span>
              </Box>
            </Box>
          </Box>

          {/*  --------------------- Color ---------------------------- */}

          {/* ---------------------- Bold -------------------------- */}
        </Box>

        <AutoSave />
      </Box>

      {/* --------------------------- Mock Element ------------------ */}
      <Box
        ref={textRef}
        sx={{
          height: 'fit-content',
          whiteSpace: 'nowrap',
          width: 'fit-content',
          position: 'absolute',
          fontSize: fontSize.pixel,
          fontFamily: fontStyle.fontFamily,
          // opacity: 0,
          top: '-10px',
          letterSpacing: '1px',
          // display: 'none',
        }}
      >
        {text.trim()}
      </Box>

      {/* -------------------  Text Board  -------------------- */}

      <Box
        sx={{
          flex: 1,
          backgroundColor: 'var(--canvas)',
          width: '100%',
          height: '100%',
          border: '1px solid var(--blue1)',
          '& .MuiInputBase-root': {
            justifyContent: 'center',
          },
        }}
      >
        <InputBase
          inputRef={inputRef}
          value={text}
          className={fontStyle.value}
          autoFocus
          spellCheck={false}
          onChange={(e) => {
            setText(e.target.value)
            signatureDataRef.current = {
              ...signatureDataRef.current,
              data: {
                ...signatureDataRef.current.data,
                data: e.target.value,
              },
            }
            if (e.target.value.trim() === '') {
              setDisableSaveSignature(true)
            } else if (e.target.value !== '' && disableSaveSignature) {
              console.log('>>> setDisableSaveSignature')
              setDisableSaveSignature(false)
            }
          }}
          sx={{
            '& .MuiInputBase-input': {
              textAlign: 'center',
              fontSize: fontSize.pixel,
              letterSpacing: '1px',
              lineHeight: '2.2rem',
              width: '92%',
              border: 'none',
              borderBottom: '1px solid var(--gray4)',
              paddingBottom: '10px',
            },
            '& .MuiInputBase-input:focus': {
              border: 'none',
              borderBottom: '1px solid var(--gray4)',
              paddingBottom: '10px',
            },
            width: '100%',
            border: 'none',
            position: 'absolute',
            bottom: '42%',
          }}
        ></InputBase>
      </Box>
    </Box>
  )
}
