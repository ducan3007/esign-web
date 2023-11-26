import { rgba } from '@esign-web/libs/utils'
import { selectors } from '@esign-web/redux/auth'
import { actions, selectors as selectorsDocument } from '@esign-web/redux/document'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Avatar, Box, Menu } from '@mui/material'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FontFamily, FontSizeToolbar } from './__Toolbar'
import moment from 'moment'
import { FontSize } from './__TextOption'

export type Signers = {
  id: string
  color: string
  firstName: string
  lastName: string
  email: string
  setEnableEdit?: any
  signers?: any
  me?: string | undefined
  fields: any
  selectedSignerId?: string
}

type props = {
  id: string
  pageNumber: number
  selectedSigner: Signers
  widthHeight: {
    minWidth: string
    minHeight: string
  }
  isDisableAddSigner: boolean
  // setSelectedSigner: (signer: Signers) => void
}

export const ToolbarSignerDropDown = (props: props) => {
  const dispatch = useDispatch()
  const signers = useSelector(selectorsDocument.getSigners)
  const signers2 = useSelector(selectorsDocument.getSigners2)
  const signatures = useSelector(selectorsDocument.getSignatures)
  const authState = useSelector(selectors.getAuthState)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const isMe = props.selectedSigner.email === authState.data?.email
  const hasFieldAdded = props.selectedSigner.fields > 0

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (props.isDisableAddSigner) return
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  console.log('>>>>> signers2', signers2)

  return (
    <>
      {/* -------------------------- Render Selected Signer ----------------------------------------- */}
      <Box
        onClick={handleClick}
        sx={{
          width: '100%',
          height: '48px',
          position: 'relative',
          backgroundColor: `${rgba(props.selectedSigner.color, 0.4)}`,
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          padding: '2px 0px',
        }}
      >
        <Avatar
          sx={{
            color: 'var(--white)',
            fontSize: '2.1rem',
            fontWeight: 'bold',
            alignSelf: 'center',
            marginLeft: '5px',
            backgroundColor: `${props.selectedSigner.color}`,
          }}
        >
          {props.selectedSigner.firstName.toUpperCase().charAt(0)}
        </Avatar>
        <Box sx={{ display: 'flex', flexDirection: 'column', marginRight: '14px', width: props.widthHeight.minWidth, padding: '0 7px' }}>
          <Box sx={{ flex: 1, height: '50%' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--dark3)' }}>
              {hasFieldAdded && <>{props.selectedSigner.fields} Fields added</>}
              {!hasFieldAdded && 'Signee'}
            </span>
          </Box>
          <Box sx={{ flex: 1.5, height: '50%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            <span style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--blue3)' }}>
              {`${props.selectedSigner.firstName} ${props.selectedSigner.lastName}`}
            </span>

            {isMe && <span style={{ fontWeight: 'bold', color: 'var(--orange)' }}> (Me)</span>}
            {!isMe && ` (${props.selectedSigner.email})`}
          </Box>
        </Box>
        {!props.isDisableAddSigner && (
          <ExpandMoreIcon
            sx={{
              position: 'absolute',
              right: '3px',
              fontSize: '2.5rem',
              color: 'var(--dark2)',
            }}
          />
        )}
      </Box>

      {/* ------------------------------------- Render Menu Dropdown ------------------------------------ */}
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        sx={{
          '& .MuiPaper-root': {
            marginTop: '5px',
            padding: '0px 4px 0px 4px',
            width: '319px',
            maxHeight: `${window.innerHeight - 400}px`,
            boxShadow: '0px 0px 6px rgba(0, 0, 0, 0.4)',
            '& .MuiMenuItem-root': {
              padding: '0',
            },
            '& .MuiList-root': {
              '& .MuiBox-root:last-child': {
                marginBottom: '0px',
              },
            },
          },
        }}
      >
        {/* ------------------------------------------ Mapping ---------------------------------------------- */}

        {Object.keys(signers2).map((key, index) => {
          const signer = signers2[key]
          const isMe = signer.email === authState.data?.email
          const hasFieldAdded = signer.fields > 0
          return (
            <Box
              key={key}
              onClick={(e) => {
                e.stopPropagation()
                if (props.isDisableAddSigner) return
                const signer_id = signatures[`page_${props.pageNumber}`][props.id].user.id

                if (signer_id && signer_id !== signer.id) {
                  /* 1: Update signatures */
                  const newSignatures = {
                    ...signatures[`page_${props.pageNumber}`][props.id],
                    signature_data: {},
                    user: signer,
                  }

                  if (signatures[`page_${props.pageNumber}`][props.id].type === 'textField') {
                    newSignatures['signature_data'] = {
                      fontSize: FontSizeToolbar(1),
                      fontFamily: FontFamily[0],
                    }
                  }
                  
                  if (signatures[`page_${props.pageNumber}`][props.id].type === 'dateField') {
                    newSignatures['signature_data'] = {
                      data: moment().format('DD/MM/YYYY'),
                      fontSize: FontSize(1),
                      fontFamily: FontFamily[0],
                    }
                  }

                  dispatch(actions.setSignature(newSignatures))

                  const signersCopy = Object.assign({}, signers)
                  signersCopy[signer.id] = {
                    ...signer,
                    fields: signer.fields + 1,
                  }
                  if (signersCopy[props.selectedSigner.id]) {
                    signersCopy[props.selectedSigner.id] = {
                      ...signersCopy[props.selectedSigner.id],
                      fields: signersCopy[props.selectedSigner.id].fields - 1,
                    }
                  }
                  dispatch(actions.updateAllSigners2(signersCopy))
                  dispatch(actions.updateAllSigners(signersCopy))
                }
                handleClose()
              }}
              sx={{
                marginBottom: '13px',
                width: '100%',
                height: '52px',
                position: 'relative',
                border: `1px solid ${signer.color}`,
                borderRadius: '8px',
                backgroundColor: signer.id === props.selectedSigner.id ? `${rgba(signer.color, 0.5)}` : `${rgba(signer.color, 0.1)}`,
                display: 'flex',
                alignItems: 'center',
                // padding: '2px 0px',
                cursor: 'pointer',
                ':hover': {
                  backgroundColor: `${rgba(signer.color, 0.5)}`,
                },
                transition: '0.2s ease-in-out',
              }}
            >
              <Avatar
                sx={{
                  color: 'var(--white)',
                  fontSize: '2.1rem',
                  fontWeight: 'bold',
                  alignSelf: 'center',
                  marginLeft: '5px',
                  backgroundColor: `${signer.color}`,
                }}
              >
                {signer.firstName.toUpperCase().charAt(0)}
              </Avatar>
              <Box sx={{ display: 'flex', flexDirection: 'column', padding: '0 7px', width: '288px' }}>
                <Box sx={{ flex: 1, height: '50%' }}>
                  <span style={{ fontSize: '1rem' }}>
                    {hasFieldAdded && <>{signer.fields} Fields added</>}
                    {!hasFieldAdded && 'Signee'}
                  </span>
                </Box>
                <Box sx={{ flex: 1.5, height: '50%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  <span style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--blue3)' }}>{`${signer.firstName} ${signer.lastName}`}</span>
                  {isMe && <span style={{ fontWeight: 'bold', color: 'var(--orange)' }}> (Me)</span>}
                  {!isMe && ` (${signer.email})`}
                </Box>
              </Box>
            </Box>
          )
        })}
      </Menu>
    </>
  )
}
