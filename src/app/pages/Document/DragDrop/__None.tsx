import { rgba } from '@esign-web/libs/utils'
import { Box, Typography } from '@mui/material'
import IconSVG, { CheckIcon } from 'src/app/components/Icon'
import { Signers } from 'src/app/pages/Document/SigningPage/__Signer'

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
