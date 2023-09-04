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
import IconSVG from 'src/app/components/Icon'
import { useSelector } from 'react-redux'
import { selectors } from '@esign-web/redux/document'
import { TypeMapping } from '.'

export type ImageSignatureProps = {
  signatureDataRefs: any
  signature_id: string
  pageNumber: number
  data: any
}

export const SignatureImageType = (props: ImageSignatureProps) => {
  const { signature_id, signatureDataRefs, pageNumber } = props
  const url = signatureDataRefs.current[`page_${pageNumber}`][signature_id].signature_data.url
  console.log('url', url)
  if (!signatureDataRefs.current[`page_${pageNumber}`][signature_id].signature_data.url) {
    return (
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '5px',
        }}
      >
        <IconSVG type="signature" width="60px" />
        <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>Your signature</span>
      </Box>
    )
  }

  return <img src={url} alt="" style={{ width: '100%', height: '100%' }} />
}
