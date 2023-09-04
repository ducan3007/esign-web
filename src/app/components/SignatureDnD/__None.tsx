import { Box, Button, TextareaAutosize, Typography } from '@mui/material'
import React, { useState, useRef, useEffect, useLayoutEffect, memo } from 'react'
import { ResizableBox } from 'react-resizable'
import { ResizableItem } from '../Resizable'
import { UserType, rgba } from '@esign-web/libs/utils'
import { Signers, signersProps } from 'src/app/pages/Document/SigningPage/__RenderSigner'
import TextFieldIcon from 'src/assets/textfield.svg'
import Signature from 'src/assets/signature.svg'
import DateField from 'src/assets/date.svg'
import CheckBox from 'src/assets/checkbox.svg'
import IconSVG, { CheckIcon } from 'src/app/components/Icon'
import { useSelector } from 'react-redux'
import { selectors } from '@esign-web/redux/document'
import { TypeMapping } from '.'

type SignatureNoneType = {
  id: string
  type: string
  signer: Signers
}

export const SignatureNoneType = (props: SignatureNoneType) => {
  let Icon = <></>

  switch (props.type) {
    case 'signature':
      Icon = <IconSVG type="signature" width="35px" />
      break
    case 'dateField':
      Icon = <IconSVG type="date" width="30px" />
      break
    case 'checkbox':
      Icon = <CheckIcon color="#494C4D" width="30px" height="30px" />
      break
    case 'textField':
      Icon = <IconSVG type="textField" width="30px" />
  }

  console.log('icon', props.type, Icon)

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        backgroundColor: `${rgba(props.signer.color, 0.2)}`,
        display: 'flex',
        // flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '15px',
        paddingLeft: '5px',
        paddingRight: '5px',
      }}
    >
      {Icon}
      <Typography sx={{ fontSize: '1.5rem', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {props.signer.email}
      </Typography>
    </Box>
  )
}
