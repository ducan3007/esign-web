import { Box, Typography } from '@mui/material'
import MButton from 'src/app/components/Button'

import MetamaskIcon from 'src/assets/metamask.svg'
import Coinbase from 'src/assets/coinbase.svg'
import Walletconnect from 'src/assets/walletconnect.svg'
import SuccessIcon from 'src/assets/success.svg'

const WalletPage = () => {
  return (
    <Box>
      <Typography
        sx={{
          fontSize: '2.4rem',
          fontWeight: 'bold',
          letterSpacing: '1px',
          color: 'var(--dark)',
        }}
      >
        Connected Wallets
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            display: 'flex',
          }}
        >
          <img src={Coinbase} alt="metamask" width="29px" height="29px" />
        </Box>
      </Box>
    </Box>
  )
}

export default WalletPage
