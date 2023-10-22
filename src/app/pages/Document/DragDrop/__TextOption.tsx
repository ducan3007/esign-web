import { PDF_SCALING_RATIO } from '@esign-web/libs/utils'
import { selectors as authSelector } from '@esign-web/redux/auth'
import { Box, InputBase } from '@mui/material'
import { MutableRefObject, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { AutoSave } from 'src/app/pages/Document/SigningPage/__SignerAdd'
import { MUIMenu } from '../../../components/Menu'
import './style.scss'

export const FontSize = [
  {
    pt: `${Math.floor(14 * PDF_SCALING_RATIO.value)}`,
    pixel: `${14 * PDF_SCALING_RATIO.value}px`,
    lineHeight: `${Math.floor(14 * PDF_SCALING_RATIO.value) * 1.2}px`,
  },
  {
    pt: `${Math.floor(16 * PDF_SCALING_RATIO.value)}`,
    pixel: `${16 * PDF_SCALING_RATIO.value}px`,
    lineHeight: `${Math.floor(16 * PDF_SCALING_RATIO.value) * 1.2}px`,
  },
  {
    pt: `${Math.floor(18 * PDF_SCALING_RATIO.value)}`,
    pixel: `${18 * PDF_SCALING_RATIO.value}px`,
    lineHeight: `${Math.floor(18 * PDF_SCALING_RATIO.value) * 1.2}px`,
  },
  {
    pt: `${Math.floor(20 * PDF_SCALING_RATIO.value)}`,
    pixel: `${20 * PDF_SCALING_RATIO.value}px`,
    lineHeight: `${Math.floor(20 * PDF_SCALING_RATIO.value) * 1.2}px`,
  },
  {
    pt: `${Math.floor(24 * PDF_SCALING_RATIO.value)}`,
    pixel: `${24 * PDF_SCALING_RATIO.value}px`,
    lineHeight: `${Math.floor(24 * PDF_SCALING_RATIO.value) * 1.2}px`,
  },
  {
    pt: `${Math.floor(28 * PDF_SCALING_RATIO.value)}`,
    pixel: `${28 * PDF_SCALING_RATIO.value}px`,
    lineHeight: `${Math.floor(28 * PDF_SCALING_RATIO.value) * 1.2}px`,
  },
  {
    pt: `${Math.floor(34 * PDF_SCALING_RATIO.value)}`,
    pixel: `${34 * PDF_SCALING_RATIO.value}px`,
    lineHeight: `${Math.floor(34 * PDF_SCALING_RATIO.value) * 1.2}px`,
  },
  {
    pt: `${Math.floor(37 * PDF_SCALING_RATIO.value)}`,
    pixel: `${37 * PDF_SCALING_RATIO.value}px`,
    lineHeight: `${Math.floor(37 * PDF_SCALING_RATIO.value) * 1.2}px`,
  },
]
// prettier-ignore
export const FontStyle = [
  { fontFamily: 'Plus Jakarta Sans',  value: 'font_plus_jakarta_sans' },
  { fontFamily: 'Dancing Script',     value: 'font_dancing_script' },
  { fontFamily: 'Time New Roman',     value: 'font_times_new_roman' },
  { fontFamily: 'Satisfy',            value: 'font_satisfy' },
  { fontFamily: 'Ephesis',            value: 'font_ephesis' },
  { fontFamily: 'Charmonman',         value: 'font_charmonman' },
  { fontFamily: 'Sofia',              value: 'font_sofia' },
]

// prettier-ignore
export const Color = [
  { color: 'black',       value: '#080808' },
  { color: 'red',         value: '#d9392e' },
  { color: 'orange',      value: '#f05d13' },
  { color: 'green',       value: '#129939' },
  { color: 'yellow',      value: '#ebd217' },
  { color: 'lightblue',   value: '#1ddbbf' },
  { color: 'blue',        value: '#1f6eed' },
  { color: 'purple',      value: '#9117e8' },
  { color: 'pink',        value: '#db0bb5' },

]

type props = {
  signatureDataRef: MutableRefObject<{ type: string; data: any; callback?: any }>
  setDisableSaveSignature: any
  disableSaveSignature: boolean
  containerRef: any
}

export const TextSignatureOption = (props: props) => {
  const { signatureDataRef, setDisableSaveSignature, disableSaveSignature } = props

  const inputRef = useRef<any>(null)
  const authState = useSelector(authSelector.getAuthState)

  const [fontStyle, setFontStyle] = useState(FontStyle[0])
  const [fontSize, setFontSize] = useState(FontSize[3])
  const [color, setColor] = useState(Color[0])
  const [text, setText] = useState('')
  const textRef = useRef<any>(null)

  useEffect(() => {
    signatureDataRef.current = {
      type: 'text',
      data: {
        fontStyle: fontStyle,
        fontSize: fontSize,
        color: color,
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


  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        // flexDirection: 'column',
        position: 'relative',
        // paddingRight: '5px',
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
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/*  ------------------- Font style ---------------------------- */}
          <MUIMenu
            sx1={{
              width: '200px',
              border: '1px solid var(--gray3)',
              padding: 0,
              paddingLeft: '5px',
              borderRadius: '0px',
              marginLeft: '5px',
              display: 'flex',
              justifyContent: 'flex-start',
            }}
            sx2={{
              '& .MuiPaper-root': {
                marginTop: '4px',
                boxShadow: '0px 0px 6px rgba(0, 0, 0, 0.4)',
              },
            }}
            content1={
              <span
                className={fontStyle.value}
                style={{
                  fontSize: '1.8rem',
                  fontWeight: 'bold',
                  letterSpacing: '0.2rem',
                  marginRight: '5px',
                }}
              >
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
                      signatureDataRef.current = {
                        ...signatureDataRef.current,
                        data: {
                          ...signatureDataRef.current.data,
                          fontStyle: item,
                        },
                      }
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
              borderLeft: 'none',
              alignItems: 'center',
            }}
          >
            <MUIMenu
              sx1={{
                width: '60px',
                height: '35px',
                padding: 0,
                borderLeft: 'none',
              }}
              sx2={{
                '& .MuiPaper-root': {
                  marginTop: '12px',
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
                        signatureDataRef.current = {
                          ...signatureDataRef.current,
                          data: {
                            ...signatureDataRef.current.data,
                            fontSize: item,
                          },
                        }
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

          <MUIMenu
            sx1={{
              width: '60px',
              border: '1px solid var(--gray3)',
              borderLeft: 'none',
            }}
            sx2={{
              '& .MuiPaper-root': {
                marginTop: '7px',
                boxShadow: '0px 0px 6px rgba(0, 0, 0, 0.4)',
                borderRadius: '6px',
              },
            }}
            content1={
              <>
                <div
                  style={{
                    backgroundColor: color.value,
                    width: '25px',
                    height: '25px',
                    borderRadius: '50%',
                  }}
                ></div>
              </>
            }
            content2={({ handleClose }) => {
              return Color.map((item, index) => {
                return (
                  <Box
                    sx={{
                      width: '60px',
                      height: '35px',
                      backgroundColor: 'white',
                      alignItems: 'center',
                      color: 'var(--dark)',
                      marginBottom: '0px',
                      padding: '4px',
                    }}
                    key={index}
                    onClick={() => {
                      inputRef.current.focus()
                      signatureDataRef.current = {
                        ...signatureDataRef.current,
                        data: {
                          ...signatureDataRef.current.data,
                          color: item,
                        },
                      }
                      setColor(item)
                      handleClose()
                    }}
                  >
                    <Box
                      sx={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        borderRadius: '5px',
                        padding: '4px 0px',
                        '&:hover': {
                          backgroundColor: 'var(--light-gray)',
                        },
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: item.value,
                          width: '25px',
                          height: '25px',
                          borderRadius: '50%',
                        }}
                      ></div>
                    </Box>
                  </Box>
                )
              })
            }}
          ></MUIMenu>

          {/* ---------------------- Bold -------------------------- */}
        </Box>

        {authState.data?.is_registered && <AutoSave />}
      </Box>

      {/* --------------------------- Mock Element ------------------ */}
      <pre
        ref={textRef}
        style={{
          height: 'fit-content',
          whiteSpace: 'pre',
          width: 'fit-content',
          position: 'absolute',
          fontSize: fontSize.pixel,
          fontFamily: fontStyle.fontFamily,
          // opacity: 0,
          letterSpacing: '1px',
          margin: 0,
          padding: 0,
          top: '100px',
        }}
      >
        {text}
      </pre>

      {/* -------------------  Text Board  -------------------- */}

      <Box
        sx={{
          // width: '100%',
          height: '90%',
          marginRight: '5px',
          marginLeft: '5px',
          marginTop: '5px',
          border: '1px solid var(--gray3)',
          borderRadius: '7px',
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
            color: color.value,
          }}
        ></InputBase>
      </Box>
    </Box>
  )
}
