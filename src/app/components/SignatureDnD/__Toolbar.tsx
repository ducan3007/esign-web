import { Box, Button, IconButton, PopoverPaper, TextareaAutosize, Typography } from '@mui/material'
import React, { useState, useRef, useEffect, useLayoutEffect, memo, MutableRefObject } from 'react'
import { ResizableBox } from 'react-resizable'
import { ResizableItem } from '../Resizable'
import { PDF_SCALING_RATIO, UserType, rgba } from '@esign-web/libs/utils'
import { Signers, signersProps } from 'src/app/pages/Document/SigningPage/__RenderSigner'
import TextFieldIcon from 'src/assets/textfield.svg'
import Signature from 'src/assets/signature.svg'
import DateField from 'src/assets/date.svg'
import CheckBox from 'src/assets/checkbox.svg'
import IconSVG from 'src/app/components/Icon'
import { useDispatch, useSelector } from 'react-redux'
import { actions, selectors } from '@esign-web/redux/document'
import { actions as sigActions, selectors as sigSelectors } from '@esign-web/redux/signatures'
import { SignatureNoneType } from './__None'
import { SignatureTextAreaType } from './__Text'
import { SignatureImageType } from './__Signature'
import { SignatureCheckboxType } from './__Checkbox'
import { DateTextAreaType } from './__DateField'
import { ToolbarSignerDropDown } from './__Toolbar.Signer.Dropdown'
import DrawIcon from '@mui/icons-material/Draw'
import CopyAllIcon from '@mui/icons-material/CopyAll'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import AlertDialog from '../Dialog'
import { MUIMenu } from '../Menu'
import { SIGNATURE_SET } from 'libs/redux/document/src/lib/constants'

type props = {
  type: string
  id: string
  pageNumber: number
  signer2: {
    [key: string]: Signers
  }
  isMySignature: boolean
  selectedSigner: Signers
  signatureDataRefs: any
  copySignature: (id: string, pageNumber: number, sigenr_id: string) => void

  can_copy: boolean
  can_delete: boolean
}

export const FontSizeToolbar = [
  // { pt: `${Math.floor(6 * PDF_SCALING_RATIO)}`, pixel: `${6 * PDF_SCALING_RATIO}px` },
  {
    pt: `${Math.floor(12 * PDF_SCALING_RATIO.value)}`,
    pixel: `${12 * PDF_SCALING_RATIO.value}px`,
    lineHeight: `${Math.floor(12 * PDF_SCALING_RATIO.value) * 1.2}px`,
  },
  {
    pt: `${Math.floor(13 * PDF_SCALING_RATIO.value)}`,
    pixel: `${13 * PDF_SCALING_RATIO.value}px`,
    lineHeight: `${Math.floor(13 * PDF_SCALING_RATIO.value) * 1.2}px`,
  },
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
    pt: `${Math.floor(22 * PDF_SCALING_RATIO.value)}`,
    pixel: `${22 * PDF_SCALING_RATIO.value}px`,
    lineHeight: `${Math.floor(22 * PDF_SCALING_RATIO.value) * 1.2}px`,
  },
]
export const FontFamily = [
  { fontFamily: 'Plus Jakarta Sans', value: 'font_plus_jakarta_sans' },
  { fontFamily: 'Dancing Script', value: 'font_dancing_script' },
  { fontFamily: 'Time New Roman', value: 'font_times_new_roman' },
  { fontFamily: 'Satisfy', value: 'font_satisfy' },
  { fontFamily: 'Ephesis', value: 'font_ephesis' },
  { fontFamily: 'Charmonman', value: 'font_charmonman' },
  { fontFamily: 'Sofia', value: 'font_sofia' },
]

export const BaseToolbar = (props: props) => {
  const dispatch = useDispatch()
  const signatureDataRef = props.signatureDataRefs.current[`page_${props.pageNumber}`][props.id]

  console.log('>> can_copy', props.can_copy)
  console.log('>> can_delete', props.can_delete)

  const [fontState, setFontState] = useState({
    fontFamily: signatureDataRef.signature_data.fontFamily,
    fontSize: signatureDataRef.signature_data.fontSize,
  })

  const top = {
    signature: -100,
    textField: -110,
    checkbox: -100,
    dateField: -100,
  }

  const widthHeight = {
    signature: {
      minWidth: '200px',
      minHeight: '75px',
      height: '89px',
    },
    textField: {
      minWidth: props.isMySignature ? '350px' : '200px',
      minHeight: '100px',
    },
    checkbox: {
      minWidth: '250px',
      minHeight: '100px',
    },
    dateField: {
      minWidth: '250px',
      minHeight: '90px',
    },
  }

  const BaseOptions = {
    copy: (
      <IconButton
        onClick={() => {
          props.copySignature(props.id, props.pageNumber, props.selectedSigner.id)
        }}
      >
        <CopyAllIcon
          sx={{
            fontSize: '2.5rem',
            color: 'var(--dark2)',
          }}
        />
      </IconButton>
    ),
    delete: (
      <>
        {props.isMySignature && (
          <AlertDialog
            title="Are you sure you want to delete this signature?"
            content=""
            callBack={() => {
              dispatch(actions.removeSignature({ id: props.id, pageNumber: props.pageNumber, signer_id: props.selectedSigner.id }))
            }}
          >
            <IconButton>
              <DeleteOutlineIcon
                sx={{
                  fontSize: '2.5rem',
                  color: 'var(--red1)',
                }}
              ></DeleteOutlineIcon>
            </IconButton>
          </AlertDialog>
        )}
        {!props.isMySignature && (
          <IconButton
            onClick={() => {
              dispatch(actions.removeSignature({ id: props.id, pageNumber: props.pageNumber, signer_id: props.selectedSigner.id }))
            }}
          >
            <DeleteOutlineIcon
              sx={{
                fontSize: '2.5rem',
                color: 'var(--red1)',
              }}
            />
          </IconButton>
        )}
      </>
    ),
  }

  /* ---------------------------------- For TextField ------------------------------------ */

  // const [fontStyle, setFontStyle] = useState(FontStyle[0])
  // const [fontSize, setFontSize] = useState(FontSize[3])

  const ToolbarContent = {
    signature: () => {
      if (props.isMySignature) {
        return (
          <IconButton
            onClick={() => {
              dispatch(sigActions.toggleModal({}))
            }}
            disableRipple
            sx={{ ':hover': { backgroundColor: 'var(--light-gray)' } }}
          >
            <DrawIcon sx={{ fontSize: '2.5rem', color: 'var(--dark2)' }} />
          </IconButton>
        )
      }
      return <></>
    },
    textField: () => {
      if (props.isMySignature) {
        return (
          <Box
            sx={{
              display: 'flex',
              height: '100%',
              alignItems: 'center',
              marginRight: '5px',
            }}
          >
            <MUIMenu
              sx1={{
                width: '140px',
                border: '1px solid var(--gray11)',
                padding: 0,
                paddingLeft: '5px',
                display: 'flex',
              }}
              sx2={{
                '& .MuiPaper-root': {
                  marginTop: '4px',
                  boxShadow: '0px 0px 6px rgba(0, 0, 0, 0.4)',
                  borderRadius: '4px',
                },
              }}
              content1={
                <span
                  className={fontState.fontFamily.value}
                  style={{
                    fontSize: '1.4rem',
                    fontWeight: 'bold',
                    letterSpacing: '1px',
                    textAlign: 'center',
                  }}
                >
                  {fontState.fontFamily.fontFamily}
                </span>
              }
              content2={({ handleClose }) => {
                return FontFamily.map((item, index) => {
                  return (
                    <Box
                      sx={{
                        width: '180px',
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
                        // setFontStyle(item)
                        console.log('??????????????????????????? ', signatureDataRef, item)
                        setFontState({
                          ...fontState,
                          fontFamily: item,
                        })
                        dispatch({
                          type: SIGNATURE_SET,
                          payload: {
                            ...signatureDataRef,
                            signature_data: {
                              ...signatureDataRef.signature_data,
                              fontFamily: item,
                              fontSize: fontState.fontSize,
                            },
                          },
                        })

                        const textAera = document.getElementById(`${props.id}_text`)
                        if (textAera) {
                          setTimeout(function () {
                            textAera.focus()
                            textAera.className = item.value
                          }, 100)
                        }
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
                        <span
                          className={item.value}
                          style={{
                            fontSize: '1.6rem',
                            fontWeight: 'bold',
                            color: 'var(--dark)',
                          }}
                        >
                          {item.fontFamily}
                        </span>
                      </Box>
                    </Box>
                  )
                })
              }}
            />
            {/* ------------------------ Font Size ---------------------------- */}
            <Box
              sx={{
                display: 'flex',
                border: '1px solid var(--gray11)',
              }}
            >
              <MUIMenu
                sx1={{
                  width: '46px',
                  // height: '35px',
                  padding: 0,
                  paddingRight: '3px',
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
                        fontSize: '1.3rem',
                        fontWeight: 'bold',
                        letterSpacing: '0.2rem',
                      }}
                    >
                      {fontState.fontSize.pt}pt
                    </span>
                  </>
                }
                content2={({ handleClose }) => {
                  return FontSizeToolbar.map((item, index) => {
                    return (
                      <Box
                        sx={{
                          width: '65px',
                          height: '40px',
                          backgroundColor: 'white',
                          alignItems: 'center',
                          color: 'var(--dark)',
                          marginBottom: '0px',
                          padding: '4px',
                        }}
                        key={index}
                        onClick={() => {
                          setFontState({
                            ...fontState,
                            fontSize: item,
                          })
                          console.log('??????????????????????????? ', signatureDataRef, item)
                          dispatch({
                            type: SIGNATURE_SET,
                            payload: {
                              ...signatureDataRef,
                              signature_data: {
                                ...signatureDataRef.signature_data,
                                fontSize: item,
                                fontFamily: fontState.fontFamily,
                              },
                            },
                          })

                          const textAera = document.getElementById(`${props.id}_text`)
                          if (textAera) {
                            setTimeout(function () {
                              textAera.focus()
                              textAera.style.fontSize = item.pixel
                              textAera.style.lineHeight = item.lineHeight
                            }, 100)
                          }

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
                              backgroundColor: 'var(--gray11)',
                            },
                          }}
                        >
                          <span
                            style={{
                              fontSize: '1.4rem',
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
              />
              <Box
                sx={{
                  display: 'flex',
                  alignContent: 'center',
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingRight: '3px',
                  span: {
                    cursor: 'pointer',
                    userSelect: 'none',
                    fontSize: '1.1rem',
                    color: 'var(--dark2)',
                    ':hover': {
                      backgroundColor: 'var(--gray11)',
                    },
                  },
                }}
              >
                <Box sx={{ display: 'flex', height: '100%', flexDirection: 'column', alignContent: 'center', textAlign: 'center' }}>
                  <span style={{ marginTop: '10px' }}>&#9650; </span>
                  <span style={{}}>&#9660; </span>
                </Box>
              </Box>
            </Box>
          </Box>
        )
      }
    },
  }

  return (
    <Box
      sx={{
        width: 'fit-content',
        // height: 'fit-content',
        ...widthHeight[props.type],
        position: 'absolute',
        border: '1px solid var(--gray3)',
        backgroundColor: 'var(--white)',
        borderRadius: '4px',
        // boxShadow: '0px 0px 6px rgba(0, 0, 0, 0.3)',
        top: top[props.type],
        left: 0,
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* Signers */}
      <Box
        sx={{
          // flex: 1,
          width: '100%',
          borderBottom: '1px solid var(--gray3)',
        }}
      >
        <ToolbarSignerDropDown
          widthHeight={widthHeight[props.type]}
          id={props.id}
          pageNumber={props.pageNumber}
          selectedSigner={props.selectedSigner}
        />
      </Box>

      {/* Options */}

      <Box
        sx={{
          flex: 1,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '0px',
        }}
      >
        {ToolbarContent[props.type] && ToolbarContent[props.type]()}
        {props.can_copy !== false && BaseOptions.copy}
        {props.can_delete !== false && BaseOptions.delete}
      </Box>
    </Box>
  )
}

const SignatureToolbar = (props: props) => {}
