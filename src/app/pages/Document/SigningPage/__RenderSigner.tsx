import { PDF_SCALING_RATIO, axiosInstance, baseApi, getFontSizeWithScale, getFormatFromBase64, rgba } from '@esign-web/libs/utils'
import { selectors as authSelectors } from '@esign-web/redux/auth'
import { actions, selectors } from '@esign-web/redux/document'
import ControlPointRoundedIcon from '@mui/icons-material/ControlPointRounded'
import DeleteOutlineSharpIcon from '@mui/icons-material/DeleteOutlineSharp'
import EditSharpIcon from '@mui/icons-material/EditSharp'
import MailOutlineSharpIcon from '@mui/icons-material/MailOutlineSharp'
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded'
import WarningRoundedIcon from '@mui/icons-material/WarningRounded'
import { Avatar, Box, Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material'
import { useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import MButton from 'src/app/components/Button'
import AlertDialog from 'src/app/components/Dialog'
import { IconSignature } from 'src/app/components/Icons/pdf'
import { RenderSignerAdd } from './__RenderSignerAdd'
import { SignerDropDown } from './__RenderSignerDropDown'
import { RenderSignerEdit } from './__RenderSignerEdit'
import html2canvas from 'html2canvas'
import { useSearchParams } from 'react-router-dom'

export type signersProps = {
  id?: string
  name?: string
  email?: string
  avatar?: string
  firstName?: string
  lastName?: string
  color?: string
  signers?: any
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
}

function RenderSigners(props: any) {
  const [searchParams] = useSearchParams()

  const documentId = searchParams.get('id')
  const { setSelectedSignerId, selectedSigner } = props

  const dispatch = useDispatch()
  const signers = useSelector(selectors.getSigners)
  const signers2 = useSelector(selectors.getSigners2)
  const authState = useSelector(authSelectors.getAuthState)
  const signatures = useSelector(selectors.getSignatures)

  console.log('LPK RenderSigners 1', signers)
  /* ----------------------------- Component State ------------------------------- */

  const [open, setOpen] = useState(false)

  /* ------------------------- Const State --------------------------------------- */
  const signersNumber = Object.keys(signers2).length
  const isImNotSigner = useMemo(() => { for (let key in signers2) { if (authState.data?.email === signers2[key].email) { return false } } return true }, [signers2]) // prettier-ignore
  const isImNotSigner2 = useMemo(() => { for (let key in signers) { if (authState.data?.email === signers[key].email) { return false } } return true }, [signers]) // prettier-ignore
  const isOnlyMeSigner = signersNumber === 1 && !isImNotSigner
  const isMoreThanOneSigners = signersNumber >= 1

  console.log({
    signersNumber,
    isImNotSigner,
    isOnlyMeSigner,
    isMoreThanOneSigners,
  })

  /*--------------------------------- Event Handlers ------------------------ */
  const Events = {
    handleOpen: () => setOpen(true),
    handleClose: (event: any, reason: any) => {
      if (reason !== 'backdropClick') {
        setOpen(false)
      }
    },
    addMeToSigner: () => {
      if (!authState.data) return

      const data = {
        id: authState.data?.id,
        firstName: authState.data?.first_name,
        lastName: authState.data?.last_name,
        email: authState.data?.email,
        color: 'rgb(15,192,197)',
        fields: 0,
      }
      const newSigners = {
        [authState.data?.id]: data,
        ...signers,
      }
      dispatch(actions.updateAllSigners(newSigners))
    },
  }

  /* 
    Save signer and update signatures
  */
  const handleSaveSigners = () => {
    let isSelectedSignerDeleted = true

    dispatch(actions.updateAllSigners2(signers))

    if (Object.keys(signers).length === 0) {
      /* All signers deleted */
      setSelectedSignerId('')
    } else {
      /* Update selected Signer when he is deleted */
      for (let key in signers) {
        if (key === selectedSigner.id) {
          isSelectedSignerDeleted = false
          break
        }
      }

      if (isSelectedSignerDeleted) {
        /* Select 1st element */
        setSelectedSignerId(signers[Object.keys(signers)[0]].id)
      }
    }

    /* 
      Remove signature when signer is deleted
    */

    const deletedSigner: any = {}

    for (let key in signers2) {
      if (!signers[key]) {
        deletedSigner[key] = signers2[key]
      }
    }

    const signatureCopy = Object.assign({}, signatures)

    for (let page in signatureCopy) {
      for (let key in signatureCopy[page]) {
        if (signatureCopy[page][key]) {
          const signature = signatureCopy[page][key]
          if (deletedSigner[signature.user.id]) {
            delete signatureCopy[page][key]
          }
        }
      }
    }
    dispatch(actions.updateAllSignatures(signatureCopy))

    setOpen(false)
  }

  console.log('signers', signers)

  /* ------------------------------------------- JSX Elements -------------------------------------------- */

  const RenderAddButton = (
    <>
      {!isMoreThanOneSigners && (
        <Box
          sx={{
            display: 'flex',
            gap: '10px',
          }}
        >
          <WarningRoundedIcon
            sx={{
              color: 'var(--error)',
              fontSize: '2.4rem',
              fontWeight: 'bold',
            }}
          />
          <Typography
            sx={{
              color: 'var(--error)',
              fontSize: '1.7rem',
              fontWeight: 'bold',
              // letterSpacing: '0.2rem',
              marginBottom: '5px',
            }}
          >
            Please add at least one signee!
          </Typography>
        </Box>
      )}
      <MButton
        disableRipple
        onClick={Events.handleOpen}
        // prettier-ignore
        sx={{ 
          width: '100%', 
          backgroundColor: 'var(--orange1)', borderRadius: '7px', padding:'7px 12px', border: '2px solid var(--orange)', color: 'var(--orange)', '&:hover': { backgroundColor: 'var(--orange)', '& p': { color: 'var(--white)' } }, transition: 'all 0.4s ease-in-out',  }}
      >
        <Typography
          // prettier-ignore
          sx={{ color: 'var(--white)', fontSize: '1.6rem', fontWeight: 'bold', letterSpacing: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', }}
        >
          {/* <PersonAddAltRoundedIcon sx={{ fontSize: '2.4rem', fontWeight: 'bold', marginRight: '1rem' }} /> */}
          Invite Signee
        </Typography>
      </MButton>
    </>
  )

  let component = RenderAddButton

  console.log('99999999 selectedSigner', selectedSigner)

  /* ----------------------------------------- Drop Down Signer Options --------------------------------- */
  if ((!isOnlyMeSigner || isImNotSigner) && isMoreThanOneSigners && selectedSigner.id) {
    component = (
      <SignerDropDown
        selectedSigner={selectedSigner}
        setSelectedSignerId={setSelectedSignerId}
        signersNumber={signersNumber}
        handleOpen={Events.handleOpen}
      />
    )
  }

  const getCanvasFromSignature = async () => {
    let ids: any = []

    console.log('SAVE ', signatures)

    Object.keys(signatures).map((page) => {
      Object.keys(signatures[page]).map((key) => {
        ids.push({
          key: key,
          type: signatures[page][key].type,
          page: signatures[page][key].pageNumber,
        })
      })
    })

    for (let i = 0; i < ids.length; i++) {
      const id = ids[i].key
      const type = ids[i].type
      const page = ids[i].page

      if (type === 'textField') {
        const signature = signatures[`page_${page}`][id]

        if (!signature.signature_data) continue

        // const api = await baseApi.post('/file/upload/template', {
        //   data: {
        //     width: signature.width,
        //     height: signature.height,
        //     top: (signature.top + 2) / PDF_SCALING_RATIO,
        //     left: (signature.left + 2) / PDF_SCALING_RATIO,
        //     data: signature.signature_data.data,
        //     fontFamily: signature?.fontFamily?.value,
        //     fontSize: '18px',
        //     lineHeight: 16,
        //     color: '#000000',
        //   },
        //   type: 'text',
        // })
        // const base64 = api.data.base64

        if (!signature?.fontSize?.pixel) continue

        console.log('asdfdasfsdf', signature?.fontSize?.pixel.split('px')[0])
        console.log('asdfdasfsdf', signature?.fontSize?.pixel.split('px')[0])
        console.log('asdfdasfsdf', getFontSizeWithScale(signature?.fontSize?.pixel))

        // const fontSize = Math.round(parseFloat(signature?.fontSize?.pixel.split('px')[0]) / PDF_SCALING_RATIO)
        const fontSize = getFontSizeWithScale(signature?.fontSize?.pixel)

        const api2 = await baseApi.post('/file/embed/text', {
          data: {
            width: signature.width,
            height: signature.height,
            top: signature.top / PDF_SCALING_RATIO.value - 2,
            left: signature.left / PDF_SCALING_RATIO.value + 2,
            data: signature.signature_data.data,
            page: signature.pageNumber,
            fontSize: fontSize,
            lineHeight: fontSize * 1.2,
            fontFamily: signature?.fontFamily?.value,
            color: '#000000',
          },
          type: 'text',
          document_id: documentId,
        })

        console.log('localhost:8080/ipfs/' + api2.data.cid)

        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (!ctx) continue

        ctx.font = '13.5pt "Plus Jakarta Sans"'
        ctx.textBaseline = 'top'
        // ctx.letterSpacing = "10px";

        let lineHeight = 28.8
        let width = signature.width
        let height = signature.height
        let x = 0
        let y = 0
        let text = signature.signature_data.data
        let line = ''

        for (let i = 0; i < text.length; i++) {
          let testLine = line + text[i] // add the current character to the test line
          let testWidth = ctx.measureText(testLine).width // measure the width of the test line
          if (testWidth > width && i > 0) {
            // if the test line is wider than the canvas width
            ctx.fillText(line, x, y) // draw the current line on the canvas
            line = text[i] // move to the next line
            y += lineHeight // move the y position down
          } else {
            // if the test line is not wider than the canvas width
            line = testLine // update the current line with the test line
          }
        }
        ctx.fillText(line, x, y) // draw the last line on the canvas

        const base64_2 = canvas.toDataURL('image/png')

        if (ref1.current) {
          ref1.current.src = base64_2
          ref1.current.style.width = signature.width + 'px'
          ref1.current.style.height = signature.height + 'px'
        }

        // let element = document.getElementById(`${id}_text`)
        // console.log('getCanvasFromSignature element', element)
        // if (element) {
        //   const canvas = await html2canvas(element, {
        //     allowTaint: true,
        //     backgroundColor: 'transparent',
        //   })

        //   const base64 = canvas.toDataURL('image/png')
        //   console.log('getCanvasFromSignature canvas', base64)
        // }
      }
      if (type === 'checkbox') {
        let sig = signatures[`page_${page}`][id]

        const svg = document.getElementById(`${id}_checkbox`)

        console.log('checkbox svg', svg)

        if (!svg) continue

        svg.setAttribute('width', `${sig.width}px`)
        svg.setAttribute('height', `${sig.height}px`)

        var svgString = new XMLSerializer().serializeToString(svg)

        // Encode the string into base64 format
        var base64Data = window.btoa(svgString)

        // Create a data URL for the image source
        var dataUrl = 'data:image/svg+xml;base64,' + base64Data

        const canvas = await html2canvas(svg, {
          allowTaint: true,
          backgroundColor: 'transparent',
        })

        svg.setAttribute('width', `100%`)
        svg.setAttribute('height', `100%`)

        console.log('checkbox dataUrl', dataUrl)

        console.log('canvas dataUrl', canvas.toDataURL('image/png'))

        const payload = {
          data: {
            top: sig.top / PDF_SCALING_RATIO.value,
            left: sig.left / PDF_SCALING_RATIO.value,
            width: sig.width / PDF_SCALING_RATIO.value,
            height: sig.height / PDF_SCALING_RATIO.value,
            base64: canvas.toDataURL('image/png'),
            page: sig.pageNumber,
          },
          document_id: documentId,
          format: getFormatFromBase64(canvas.toDataURL('image/png')),
          type: 'base64',
        }
        const response = await baseApi.post('/file/embed/image', payload)

        console.log('localhost:8080/ipfs/' + response.data.cid)

        console.log('checkbox payload', payload)

        ref2.current.src = canvas.toDataURL('image/png')
      }
    }

    console.log('getCanvasFromSignature', ids)
  }
  const [temp, setTemp] = useState<any>(null)
  const ref1 = useRef<any>(null)
  const ref2 = useRef<any>(null)

  return (
    <Box
      sx={{
        width: '100%',
        marginBottom: '25px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ----------------------------------------- Signers -------------------------------------------------- */}

      <>{component}</>

      <MButton onClick={getCanvasFromSignature}>GET CANVAS</MButton>

      <img ref={ref1} src={temp} alt="" />
      <img ref={ref2} src={temp} alt="" />

      {/* ----------------------------------------- Dialog --------------------------------------------------- */}

      <Dialog
        disableEscapeKeyDown
        open={open}
        onClose={Events.handleClose}
        // prettier-ignore
        sx={{ '& .MuiDialog-paper': { width: 1200, height: 950, maxWidth: 'none', maxHeight: 'none', borderRadius: '15px', boxShadow: 'none', }, '& .MuiBackdrop-root': { backgroundColor: 'rgba(0, 0, 0, 0.3)', }, }}
      >
        {/* -----------------------------------------   Dialog Title  --------------------------------------------------- */}

        <DialogTitle sx={{ padding: '10px 60px 15px 80px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          <IconSignature width={64} height={62} style={{ marginBottom: '15px' }} />
          <Typography sx={{ fontSize: '2.7rem', padding: 0 }}>Signees</Typography>
        </DialogTitle>

        <DialogContent sx={{ overflow: 'hidden' }}>
          {/* ----------------------------------------- Dialog  Content --------------------------------------------------- */}

          <Box sx={{ maxWidth: '950px', height: '100%', margin: '0 auto', position: 'relative', display: 'flex', flexDirection: 'column' }}>
            <RenderSignerAdd signers={signers} />
            <Box sx={{ padding: '0px 0px 15px 0px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px' }}>
              <Typography
                sx={{ ':hover': { cursor: 'pointer', color: 'var(--orange)' } }}
                color={'var(--blue3)'}
                variant="h5"
                fontWeight={600}
                fontStyle={'normal'}
              >
                Search by Email
              </Typography>
              {isImNotSigner2 && (
                <Box
                  onClick={Events.addMeToSigner}
                  sx={{ display: 'flex', alignItems: 'center', gap: '4px', ':hover': { '*': { cursor: 'pointer', color: 'var(--orange)' } } }}
                >
                  <ControlPointRoundedIcon sx={{ fontSize: '2.4rem', color: 'var(--blue3)', fontWeight: 'bold' }} />
                  <Typography
                    sx={{ textDecoration: 'underline', fontWeight: 'bold', textDecorationThickness: '2px' }}
                    color={'var(--blue3)'}
                    variant="h5"
                  >
                    I want to sign
                  </Typography>
                </Box>
              )}
            </Box>
            {/* <Box
              sx={{
                width: '100%',
                height: '200px',
                border: '1px solid var(--color-gray1)',
              }}
            ></Box> */}
            <Box
              sx={{
                width: '100%',
                maxHeight: '700px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto',
                // border: '1px solid var(--color-gray1)',
                '&::-webkit-scrollbar': { width: '5px' },
                '&::-webkit-scrollbar-track': { background: 'transparent', marginBottom: '5px' },
                '&::-webkit-scrollbar-thumb': { background: 'var(--color-gray1)', borderRadius: '10px', border: '1px solid var(--white)' },
              }}
            >
              {/* -------------------------------------------- Mapping ----------------------------------------------------- */}
              {Object.keys(signers).map((key) => {
                const signer = signers[key]

                return (
                  <RenderSignerItem
                    key={key}
                    signers={signers}
                    id={signer.id}
                    color={signer.color}
                    firstName={signer.firstName}
                    lastName={signer.lastName}
                    email={signer.email}
                    me={authState.data?.email}
                    fields={signer.fields}
                  />
                )
              })}

              {/* Add signer BOX */}
            </Box>
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '10px' }}>
              <MButton autoFocus onClick={handleSaveSigners} sx={{ backgroundColor: 'var(--orange)' }}>
                <span style={{ color: 'var(--white)', fontWeight: 'bold' }}> Save </span>
              </MButton>
              <MButton
                onClick={() => {
                  dispatch(actions.updateAllSigners(signers2))
                  setOpen(false)
                }}
                sx={{ backgroundColor: 'var(--dark5)' }}
              >
                <span style={{ color: 'var(--white)', fontWeight: 'bold' }}> Cancel</span>
              </MButton>
            </Box>
          </Box>
        </DialogContent>

        {/* ----------------------------------------- Buttons --------------------------------------------------- */}
      </Dialog>

      {/* Select List */}
      <Box></Box>
    </Box>
  )
}

export type Signers = {
  id: string
  color: string
  firstName: string
  lastName: string
  email: string
  setEnableEdit?: any
  signers?: any
  me?: string | undefined
  fields: number
  selectedSignerId?: string
}

export const RenderSignerItem = (props: Signers) => {
  const dispatch = useDispatch()
  const [enableEdit, setEnableEdit] = useState(false)
  const { id, color, firstName, lastName, email, signers } = props

  if (enableEdit) {
    return (
      <RenderSignerEdit
        id={id}
        color={color}
        signers={signers}
        firstName={firstName}
        email={email}
        lastName={lastName}
        setEnableEdit={setEnableEdit}
      />
    )
  }

  console.log('>> RenderSigner props', props)

  return (
    <Box
      sx={{
        width: 'calc(100% - 3px)',
        height: 'fit-content',
        border: `1px solid ${rgba(color, 0.4)}`,
        borderRadius: '10px',
        backgroundColor: rgba(color, 0.1),
        // borderLeft: `5px solid ${color}`,
        display: 'flex',
        alignItems: 'center',
        padding: '10px 15px',
        marginBottom: '10px',
        marginLeft: 'auto',
        marginRight: 'auto',
        '&:hover': {
          backgroundColor: rgba(color, 0.3),
        },
        transition: 'all 0.2s ease-in-out',
      }}
    >
      <Box sx={{ width: 400, display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Avatar sx={{ color: 'var(--white)', fontSize: '2.1rem', fontWeight: 'bold', backgroundColor: color }}>{firstName.toUpperCase()[0]}</Avatar>
        <span style={{ fontSize: '1.7rem', paddingRight: '5px', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{firstName + ' ' + lastName}</span>
        <Box sx={{ whiteSpace: 'nowrap', marginRight: '5px' }}>
          {props.me === email && <span style={{ color: 'var(--orange)', fontWeight: 'bold', fontSize: '1.7rem' }}>(I'm signing)</span>}
        </Box>
      </Box>

      <Box sx={{ display: 'flex' }}>
        <Box sx={{ width: 425, display: 'flex', alignItems: 'center', gap: '15px' }}>
          <MailOutlineSharpIcon sx={{ fontSize: '2.4rem', color: 'var(--dark3)' }} />
          <span style={{ fontSize: '1.7rem', textOverflow: 'ellipsis' }}>{email}</span>
        </Box>
        <Box>
          {props.me !== email && (
            <IconButton
              onClick={() => {
                setEnableEdit(!enableEdit)
              }}
            >
              <EditSharpIcon sx={{ fontSize: '2.4rem', color: 'var(--blue3)' }} />
            </IconButton>
          )}
          {props.me === email && (
            <Box
              sx={{
                width: '39px',
                height: '15px',
                display: 'inline-block',
              }}
            ></Box>
          )}
          <IconButton>
            <AlertDialog
              title="Are you sure you want to delete this signer?"
              content="All signatures from this signer will be removed from the document!"
              callBack={() => {
                dispatch(actions.removeSigner({ id }))
              }}
            >
              <DeleteOutlineSharpIcon sx={{ color: 'var(--error)', fontSize: '2.4rem' }} />
            </AlertDialog>
          </IconButton>
        </Box>
      </Box>
    </Box>
  )
}

export default RenderSigners
