import AccountBoxRoundedIcon from '@mui/icons-material/AccountBoxRounded'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import { Avatar, Box, IconButton, Menu, MenuItem, Typography } from '@mui/material'
import { useState } from 'react'
import { MTooltip } from 'src/app/components/Tooltip'
import { Signers } from './__RenderSigner'
import { rgba } from '@esign-web/libs/utils'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { selectors } from '@esign-web/redux/auth'
import { useDispatch, useSelector } from 'react-redux'
import { actions, selectors as selectorsDocument } from '@esign-web/redux/document'

type props = {
  signersNumber: number
  selectedSigner: Signers
  setSelectedSignerId: (signer_id: string) => void
  handleOpen: () => void
  isDisableAddSigner: boolean
}

export const SignerDropDown = (props: props) => {
  const authState = useSelector(selectors.getAuthState)
  const signers2 = useSelector(selectorsDocument.getSigners)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  console.log('LPK signers2', signers2)

  const isMe = props.selectedSigner.email === authState.data?.email
  const hasFieldAdded = props.selectedSigner.fields > 0

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  console.log('>> selected signer', props.selectedSigner)

  return (
    <>
      <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <AccountBoxRoundedIcon sx={{ fontSize: '3rem', color: 'var(--orange)' }} />
          <Typography
            sx={{
              fontSize: '1.7rem',
              fontWeight: 'bold',
              color: 'var(--orange)',
            }}
          >
            {props.signersNumber} Signers
          </Typography>
        </Box>
        {!props.isDisableAddSigner && (
          <MTooltip title={'Manage Signers'}>
            <IconButton onClick={props.handleOpen} sx={{ padding: '2px' }}>
              <AddRoundedIcon sx={{ fontSize: '3rem', color: 'var(--blue3)' }} />
            </IconButton>
          </MTooltip>
        )}
      </Box>

      {/* -------------------------- Render Selected Signer ----------------------------------------- */}
      <Box
        onClick={handleClick}
        sx={{
          marginTop: '10px',
          width: '100%',
          height: '52px',
          position: 'relative',
          border: `1px solid ${props.selectedSigner.color}`,
          backgroundColor: `${rgba(props.selectedSigner.color, 0.1)}`,
          boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.4)',
          borderRadius: '10px',
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
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '274px', padding: '0 7px' }}>
          <Box sx={{ flex: 1, height: '50%' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--dark3)' }}>
              {hasFieldAdded && <>{props.selectedSigner.fields} Fields added</>}
              {!hasFieldAdded && 'Signee'}
            </span>
          </Box>
          <Box sx={{ flex: 1.5, height: '50%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            <span style={{ fontSize: '1.6rem', fontWeight: 'bold', color: 'var(--blue3)' }}>
              {`${props.selectedSigner.firstName} ${props.selectedSigner.lastName}`}
            </span>

            {isMe && <span style={{ fontWeight: 'bold', color: 'var(--orange)' }}> (Me)</span>}
            {!isMe && ` (${props.selectedSigner.email})`}
          </Box>
        </Box>
        <ExpandMoreIcon
          sx={{
            position: 'absolute',
            right: '3px',
            fontSize: '2.5rem',
            color: 'var(--dark2)',
          }}
        />
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
            width: '328px',
            maxHeight: `${window.innerHeight - 400}px`,
            borderRadius: '5px',
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
              onClick={() => {
                if (props.isDisableAddSigner) {
                  return
                }
                props.setSelectedSignerId(signer.id)
                handleClose()
              }}
              sx={{
                marginBottom: '13px',
                width: '100%',
                height: '52px',
                position: 'relative',
                border: `1px solid ${signer.color}`,
                backgroundColor: signer.id === props.selectedSigner.id ? `${rgba(signer.color, 0.5)}` : `${rgba(signer.color, 0.1)}`,
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                padding: '2px 0px',
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
                  <span style={{ fontSize: '1.1rem' }}>
                    {hasFieldAdded && <>{signer.fields} Fields added</>}
                    {!hasFieldAdded && 'Signee'}
                  </span>
                </Box>
                <Box sx={{ flex: 1.5, height: '50%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  <span style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--blue3)' }}>{`${signer.firstName} ${signer.lastName}`}</span>
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
