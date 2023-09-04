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
import IconSVG, { CheckBoxIcon, CheckIcon } from 'src/app/components/Icon'
import { useSelector } from 'react-redux'
import { selectors } from '@esign-web/redux/document'
import { TypeMapping } from '.'

type CheckboxSignatureType = {
  signatureDataRefs: any
  signature_id: string
  pageNumber: number
}

export const SignatureCheckboxType = (props: CheckboxSignatureType) => {
  return (
    <div
      id={`${props.signature_id}_checkbox`}
      style={{
        width: '100%',
        height: '100%', 
      }}
    >
      <CheckIcon color="#494C4D" width="100%" height="100%" />
    </div>
  )
}
