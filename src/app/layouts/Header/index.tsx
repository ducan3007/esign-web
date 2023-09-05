import { Logout, PersonAdd, Settings } from '@mui/icons-material'
import { Avatar, Box, Divider, IconButton, ListItemIcon, Menu, MenuItem, Tooltip, Typography } from '@mui/material'
import * as _ from 'lodash'
import { useRef, useState } from 'react'
import { headerTitles } from 'src/app/routes'
import { DefaultHeader } from './__DefaultHeader'
import { useDispatch, useSelector } from 'react-redux'
import { selectors } from '@esign-web/redux/auth'
import { selectors as selectorsDocument } from '@esign-web/redux/document'
import MButton from 'src/app/components/Button'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import WalletIcon from '@mui/icons-material/Wallet'
import ClassIcon from '@mui/icons-material/Class'
import { baseApi } from '@esign-web/libs/utils'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ENABLE_SAVE_DRAFT } from 'libs/redux/document/src/lib/constants'
import MetamaskIcon from 'src/assets/metamask.svg'
import Coinbase from 'src/assets/coinbase.svg'
import Walletconnect from 'src/assets/walletconnect.svg'
import SuccessIcon from 'src/assets/success.svg'

export const DashboardHeader = () => {
  const localtion = window.location.pathname
  const authState = useSelector(selectors.getAuthState)
  const isSaveDraftEnabled = useSelector(selectorsDocument.getDraftEnabled)
  const dashBoardObject = _.find(headerTitles, (o) => o.to === localtion)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const documentId = searchParams.get('id')

  const [isSaved, setSaveDraft] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null)
  const open2 = Boolean(anchorEl2)
  const [accounts, setAccounts] = useState<string[]>([])

  const handleSaveDraft = async () => {
    try {
      await baseApi.post('/document/save-draft', {
        id: documentId,
        data: {},
      })
      dispatch({
        type: ENABLE_SAVE_DRAFT,
        payload: true,
      })
    } catch (error) {}
  }

  console.log('anchorEl2', anchorEl2)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClick2 = async (event: React.MouseEvent<HTMLElement>) => {
    try {
      const _event = event.currentTarget
      if (window.ethereum) {
        let request = await window.ethereum.request({ method: 'eth_requestAccounts' })
        console.log('>>>>> accounts', request)

        setAccounts(request as any)
        setConnected(true)
        if (connected) {
          setAnchorEl2(_event)
        }
      }
    } catch (error) {
      setConnected(false)
      setAccounts([])
      console.log('>>>>> error', error)
    }
  }

  console.log('>>>>> accounts State', accounts)

  const handleOpen = async (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl2(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleClose2 = () => {
    setAnchorEl2(null)
  }
  console.log('>>>>> dashBoardObject', localtion)

  const [connected, setConnected] = useState(false)

  const Walletslist = {
    connected: (
      <Box
        sx={{
          padding: '10px 24px',
          display: 'flex',
          borderRadius: '12px',
          alignItems: 'center',
          backgroundColor: 'var(--green14)',
          gap: '12px',
        }}
      >
        <img src={MetamaskIcon} alt="metamask" width="29px" height="29px" />
        <Typography sx={{ fontSize: '1.4rem', color: 'var(--dark)' }}>
          You're connected to <b>MetaMask</b>
        </Typography>
      </Box>
    ),
    coinbase: (
      <Box
        sx={{
          padding: '10px 24px',
          display: 'flex',
          borderRadius: '12px',
          alignItems: 'center',
          gap: '12px',
          border: '1px solid var(--gray3)',
          cursor: 'pointer',
          ':hover': {
            opacity: '0.8 !important',
          },
        }}
      >
        <img src={Coinbase} alt="metamask" width="29px" height="29px" />
        <Typography sx={{ fontSize: '1.6rem', color: 'var(--dark)', fontWeight: 'bold', letterSpacing: '1px' }}>Coinbase Wallet</Typography>
      </Box>
    ),
    walletconnect: (
      <Box
        sx={{
          padding: '1px 16px',
          display: 'flex',
          borderRadius: '12px',
          alignItems: 'center',
          gap: '3px',
          border: '1px solid var(--gray3)',
          cursor: 'pointer',
          ':hover': {
            opacity: '0.8 !important',
          },
        }}
      >
        <img src={Walletconnect} alt="metamask" width="48px" height="48px" />
        <Typography sx={{ fontSize: '1.6rem', color: 'var(--dark)', fontWeight: 'bold', letterSpacing: '1px' }}>WalletConnect</Typography>
      </Box>
    ),
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        height: '8.75rem',
        justifyContent: 'flex-end',
        borderBottom: '1px solid var(--border-gray)',
      }}
    >
      {/* Avatar */}
      <DefaultHeader title={dashBoardObject?.name} to={dashBoardObject?.to} />

      <Box
        sx={{
          width: 'fit-content',
          paddingRight: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        {localtion === '/document/sign' && (
          <MButton
            onClick={handleSaveDraft}
            sx={{
              padding: '10px 12px',
              borderRadius: '12px',
              backgroundColor: isSaveDraftEnabled ? 'var(--green11)' : 'var(--white)',
              border: isSaveDraftEnabled ? '1px solid var(--green11)' : '1px solid var(--gray3)',
              display: 'flex',
              gap: '12px',
              '&:hover': {
                opacity: '1 !important',
              },
            }}
          >
            <ClassIcon
              sx={{
                fontSize: '28px',
                color: isSaveDraftEnabled ? 'var(--green12)' : 'var(--dark)',
              }}
            />
            <Typography
              sx={{
                fontSize: '1.9rem',
                color: isSaveDraftEnabled ? 'var(--green12)' : 'var(--dark)',
                letterSpacing: '1px',
                fontWeight: 'bold',
              }}
            >
              Save Draft
            </Typography>
          </MButton>
        )}
        <Box
          sx={{
            display: 'flex',
            marginRight: '35px',
          }}
        >
          <MButton
            onClick={handleClick2}
            sx={{
              width: 'max-content',
              borderRadius: '12px 0px 0px 12px',
              backgroundColor: 'var(--white)',
              border: '1px solid var(--gray3)',
              padding: connected ? '7px 48px' : '7px 16px',
              display: 'flex',
              gap: '15px',
            }}
          >
            {connected && (
              <>
                <img src={MetamaskIcon} alt="metamask" width="29px" height="29px" />
                <Typography
                  sx={{
                    fontSize: '1.9rem',
                    fontWeight: 'bold',
                    color: 'black',
                  }}
                >
                  MetaMask
                </Typography>
              </>
            )}
            {!connected && (
              <>
                <WalletIcon
                  sx={{
                    fontSize: '33px',
                    color: 'var(--dark)',
                  }}
                />

                <Typography
                  sx={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color: 'var(--dark)',
                  }}
                >
                  Connect wallet
                </Typography>
              </>
            )}
          </MButton>
          <MButton
            onClick={handleClick}
            sx={{
              display: 'flex',
              alignItems: 'center',
              textAlign: 'center',
              borderRadius: '0px 12px 12px 0px',
              backgroundColor: 'var(--white)',
              border: '1px solid var(--gray3)',
              borderLeftWidth: '0px',
              padding: '7px 12px',
            }}
          >
            <AccountCircleOutlinedIcon
              sx={{
                fontSize: '33px',
                color: 'var(--dark)',
              }}
            />
          </MButton>
          {/* ---------------------------------------------- wallet ------------------------------------------ */}
          <Menu
            anchorEl={anchorEl2}
            id="account-menu"
            open={open2}
            onClose={handleClose2}
            onClick={handleClose2}
            sx={{
              '& .MuiPaper-root': {
                minWidth: '350px',
                minHeight: '200px',
                marginTop: '10px',
                boxShadow: 'var(--shadow99)',
                // border: '1px solid var(--color-gray1)',
                borderRadius: '12px',
                padding: '20px 0px',
              },
            }}
            transformOrigin={{ horizontal: 'center', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', padding: '0px 20px', gap: '10px' }}>
              {Object.keys(Walletslist).map((key) => {
                return Walletslist[key]
              })}
            </Box>
          </Menu>

          {/* ----------------- login ---------------- */}
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            sx={{
              '& .MuiPaper-root': {
                marginTop: '10px',
                boxShadow: 'var(--shadow99)',
                borderRadius: '12px',
                width: '300px',
                height: '500px',
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box></Box>
            </Box>
          </Menu>
        </Box>
      </Box>
    </Box>
  )
}
