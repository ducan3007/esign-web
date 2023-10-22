import { PDF_SCALING_RATIO } from '@esign-web/libs/utils'
import { actions } from '@esign-web/redux/certificate'
import { actions as sigActions } from '@esign-web/redux/signatures'
import CopyAllIcon from '@mui/icons-material/CopyAll'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import DrawIcon from '@mui/icons-material/Draw'
import { Box, IconButton } from '@mui/material'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Signers } from 'src/app/pages/Document/SigningPage/__Signer'
import AlertDialog from '../../../components/Dialog'
import { MUIMenu } from '../../../components/Menu'
import { CERT_SIGNATURE_SET, SIGNATURE_REMOVE } from 'libs/redux/certificate/src/lib/constants'
import { FontFamily, FontSizeToolbar } from '../../Document/DragDrop/__Toolbar'
import { ToolbarSignerDropDown } from './_Toolbar.dropdown'

type props = {
  type: string
  id: string
  pageNumber: number
  signer2: {
    [key: string]: Signers
  }
  selectedSigner: Signers
  signatureDataRefs: any
  copySignature: (id: string, pageNumber: number, sigenr_id: string) => void

  can_copy: boolean
  can_delete: boolean
}

export const BaseToolbar = (props: props) => {
  const dispatch = useDispatch()
  const signatureDataRef = props.signatureDataRefs.current[`page_${props.pageNumber}`][props.id]
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
      minWidth: '350px' ,
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
      <AlertDialog
        title="Are you sure you want to delete this signature?"
        content=""
        callBack={() => {
          dispatch({
            type: SIGNATURE_REMOVE,
            payload: {
              id: props.id,
              pageNumber: props.pageNumber,
              signer_id: props.selectedSigner.id,
            },
          })
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
    ),
  }

  const ToolbarContent = {
    signature: () => {
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
    },
    textField: () => {
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
                        type: CERT_SIGNATURE_SET,
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
                        dispatch({
                          type: CERT_SIGNATURE_SET,
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
    },
  }

  return (
    <Box
      sx={{
        width: 'fit-content',
        ...widthHeight[props.type],
        position: 'absolute',
        border: '1px solid var(--gray3)',
        backgroundColor: 'var(--white)',
        borderRadius: '4px',
        top: top[props.type],
        left: 0,
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseDown={(e) => e.stopPropagation()}
    >
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
