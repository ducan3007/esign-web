import { rgba } from '@esign-web/libs/utils'
import { selectors } from '@esign-web/redux/auth'
import { actions, selectors as selectorsCertificate } from '@esign-web/redux/certificate'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Avatar, Box, Menu } from '@mui/material'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

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
  // setSelectedSigner: (signer: Signers) => void
}

export const ToolbarSignerDropDown = (props: any) => {


  return (
    <Box
      sx={{
        width: '100%',
        height: '48px',
        position: 'relative',
        backgroundColor: `${rgba(props.selectedSigner.color, 0.7)}`,
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
          backgroundColor: `var(--blue3)`,
        }}
      >
        {props.selectedSigner.firstName.toUpperCase().charAt(0)}
      </Avatar>
      <Box sx={{ display: 'flex', flexDirection: 'column', marginRight: '14px', width: props.widthHeight.minWidth, padding: '0 7px' }}>
        <Box sx={{ flex: 1, height: '50%' }}>
          <span style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--blue3)' }}>
            {`${props.selectedSigner.firstName} ${props.selectedSigner.lastName}`}
          </span>
        </Box>
        <Box sx={{ flex: 1.5, height: '50%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {`${props.selectedSigner.email}`}
        </Box>
      </Box>
    </Box>
  )
}
