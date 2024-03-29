import { Typography } from '@mui/material'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { useState } from 'react'
import MButton from '../Button'

export default function AlertDialog(props: any) {
  const { children, callBack } = props
  const [open, setOpen] = useState(false)

  const handleClickOpen = () => {
    if (props.disabled) return
    setOpen(true)
  }

  const handleClose = (event: any, reason: any) => {
    if (reason !== 'backdropClick') {
      setOpen(false)
    }
  }

  const noAction = () => {
    setOpen(false)
  }

  const yesAction = () => {
    setOpen(false)
    if (callBack) {
      console.log('callback')
      callBack()
    }
  }

  return (
    <div style={props.styles} className={props.className}>
      <div
        onClick={handleClickOpen}
        style={{
          cursor: props.disabled ? 'not-allowed' : 'pointer',
        }}
      >
        {children}
      </div>

      <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
        <DialogTitle>
          <Typography
            sx={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: 'var(--dark2)',
            }}
          >
            {props.title}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography
            sx={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: 'var(--dark2)',
            }}
          >
            {props.content}
          </Typography>
        </DialogContent>
        <DialogActions>
          <MButton
            onClick={props.noAction || noAction}
            sx={{
              backgroundColor: 'var(--orange)',
            }}
          >
            <span style={{ color: 'var(--white)' }}>{props.no || 'No'}</span>
          </MButton>
          <MButton
            onClick={props.yesAction === 'close' ? noAction : yesAction}
            autoFocus
            sx={{
              backgroundColor: 'var(--dark5)',
            }}
          >
            <span style={{ color: 'var(--white)' }}>{props.yes || 'Yes'}</span>
          </MButton>
        </DialogActions>
      </Dialog>
    </div>
  )
}
