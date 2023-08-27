import { Menu, SxProps } from '@mui/material'
import { useState } from 'react'
import MButton from '../Button'

type props = {
  sx1: SxProps
  sx2?: SxProps
  content1: any
  content2: (props: any) => any
}

export const MUIMenu = (props: props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <MButton
        onClick={handleClick}
        sx={{
          width: '100px',
          height: '50px',
          backgroundColor: 'var(--light-blue3)',
          borderRadius: '0px',
          ...props.sx1,
        }}
      >
        {props.content1}
      </MButton>
      <Menu
        sx={{
          '& .MuiPaper-root': {
            marginTop: '0px',
            boxShadow: '0px 0px 6px rgba(0, 0, 0, 0.4)',
            borderRadius: '0px',
          },
          ...props.sx2,
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
      >
        {props.content2({ handleClose })}
      </Menu>
    </>
  )
}
