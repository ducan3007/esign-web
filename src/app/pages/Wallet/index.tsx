import WalletOutlinedIcon from '@mui/icons-material/WalletOutlined'

import { selectors as authSelectors } from '@esign-web/redux/auth'
import { selectors as walletSelectors } from '@esign-web/redux/wallet'
import { Box, Checkbox, Dialog, FormControlLabel, FormGroup, Typography } from '@mui/material'
import { ethers } from 'ethers'
import { useSelector } from 'react-redux'
import Coinbase from 'src/assets/coinbase.svg'
import { useEffect, useState } from 'react'
import MButton from 'src/app/components/Button'
import EthIcon from 'src/assets/eth.svg'
import { baseApi } from '@esign-web/libs/utils'

const WalletPage = () => {
  const contractState = useSelector(walletSelectors.getWalletState)
  const authState = useSelector(authSelectors.getAuthState)
  const [provider, setProvider] = useState()
  const [address, setAddress] = useState<
    {
      address: ''
      balance: ''
    }[]
  >([])

  useEffect(() => {
    ;(async () => {
      try {
        if (window.ethereum && contractState.contract.address && authState.data?.email) {
          const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545')
          const web3Provider = new ethers.providers.Web3Provider(window.ethereum as any)

          const network = await web3Provider.getNetwork()
          console.log('network', network)
          const signer = web3Provider.getSigner()

          const contract = new ethers.Contract(contractState.contract.address, contractState.contract.abi, signer)

          const signerAddresses = await contract.getSignerAddresses(authState.data?.email)

          console.log('signerAddresses', signerAddresses)
          let a: any = []

          for (let i = 0; i < signerAddresses.length; i++) {
            const balance = await provider.getBalance(signerAddresses[i])
            a.push({
              address: signerAddresses[i],
              balance: ethers.utils.formatEther(balance),
            })
          }
          setAddress(a)

          // const signer = await provider.getSigner()
          // const contract = new ethers.Contract(DATA.address, DATA.abi, signer)
          // console.log('contract', contract)
          // const signerAddresses = await contract.getSignerAddresses(authState.data?.email)
          // console.log('signerAddresses', signerAddresses)
        }
      } catch (error) {
        console.log('Contracterror', error)
      }
    })()
  }, [contractState])

  const [openModal, setOpenModal] = useState(false)
  const [addressList, setAddressList] = useState<
    {
      checked: boolean
      address: string
    }[]
  >([])

  useEffect(() => {
    ;(async () => {
      try {
        if (window.ethereum) {
          const address: any = await window.ethereum.request({ method: 'eth_requestAccounts' })
          console.log('address', address)

          if (address && address.length > 0) {
            setAddressList(
              address.map((item: any) => ({
                checked: true,
                address: item,
              }))
            )
          }
        }
      } catch (error) {}
    })()
  }, [])

  console.log('addressList', addressList)

  return (
    <Box>
      <Box sx={{ display: 'flex', marginBottom: '20px', alignItems: 'center' }}>
        <MButton
          onClick={() => {
            setOpenModal(true)
          }}
          sx={{ marginTop: '20px', marginLeft: '20px', backgroundColor: 'var(--orange1)' }}
        >
          <Typography sx={{ fontSize: '1.3rem', fontWeight: 'bold', letterSpacing: '1px', color: 'var(--white)' }}>UPDATE</Typography>
        </MButton>
      </Box>

      <Box sx={{ display: 'flex', width: '1000px', marginLeft: '20px', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: '1rem', justifyContent: 'space-between', borderBottom: '1px solid var(--gray3)' }}>
          <Typography sx={{ fontSize: '2.1rem', fontWeight: 'bold', color: 'var(--blue3)' }}>Address</Typography>
          <Typography sx={{ fontSize: '2.1rem', fontWeight: 'bold', color: 'var(--blue3)' }}>Balance</Typography>
        </Box>
        {address.map((item: any, index: number) => {
          return (
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: '1rem', justifyContent: 'space-between', marginTop: '20px' }}>
              <Typography sx={{ fontSize: '2rem' }}>{item.address}</Typography>
              <Typography sx={{ fontSize: '2.2rem', fontWeight: 'bold', color: 'var(--dark2)' }}>
                {Math.round(parseFloat(item.balance) * 100000) / 100000} &nbsp; ETH
              </Typography>
            </Box>
          )
        })}
      </Box>

      <Dialog
        disableEscapeKeyDown
        open={openModal}
        onClose={(event, reason) => {
          if (reason === 'backdropClick') {
            setOpenModal(false)
          }
        }}
        sx={{
          '& .MuiDialog-paper': {
            width: 550,
            height: 556,
            position: 'absolute',
            top: '100px',
            maxWidth: 'none',
            maxHeight: 'none',
            borderRadius: '15px',
            boxShadow: 'none',
          },
          '& .MuiBackdrop-root': { backgroundColor: 'rgba(0, 0, 0, 0.4)' },
        }}
      >
        <Typography
          sx={{
            fontSize: '2.4rem',
            color: 'var(--dark2)',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '20px',
            marginTop: '20px',
          }}
        >
          Update signing address
        </Typography>
        <Box
          sx={{
            height: '400px',
            overflowY: 'scroll',
          }}
        >
          <FormGroup>
            {addressList?.map((item: any, index: number) => {
              return (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                      onChange={(event: any) => {
                        setAddressList(
                          (addressList as any).map((item: any, index: number) => {
                            if (event.target.value === item.address) {
                              return {
                                ...item,
                                checked: event.target.checked,
                              }
                            }
                            return item
                          })
                        )
                      }}
                      value={item.address}
                      disableRipple
                      sx={{
                        paddingLeft: '20px',
                        '& .MuiSvgIcon-root': {
                          width: '30px',
                          height: '30px',
                        },
                      }}
                      size="medium"
                      defaultChecked
                    />
                  }
                  label={
                    <Typography
                      sx={{
                        fontSize: '1.6rem',
                        color: 'var(--blue3)',
                        fontWeight: 'bold',
                      }}
                    >
                      {item.address}
                    </Typography>
                  }
                />
              )
            })}
          </FormGroup>
        </Box>
        <MButton
          onClick={async () => {
            try {
              const addresse = (addressList as any).filter((item: any) => item.checked).map((item: any) => item.address)
              await baseApi.post('/contract/signing-address', { signer_email: authState.data?.email, address: addresse })
              console.log('addresse', addresse)
              window.location.reload()
            } catch (error) {}
          }}
          sx={{
            width: '70px',
            position: 'absolute',
            bottom: '20px',
            right: '20px',
            backgroundColor: 'var(--orange1)',
          }}
        >
          <Typography
            sx={{
              fontSize: '1.6rem',
              fontWeight: 'bold',
              color: 'var(--white)',
            }}
          >
            Save
          </Typography>
        </MButton>
      </Dialog>
    </Box>
  )
}

export default WalletPage
