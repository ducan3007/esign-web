import { Logout, PersonAdd, Settings } from '@mui/icons-material'
import {
  Avatar,
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from '@mui/material'
import * as _ from 'lodash'
import { useEffect, useRef, useState } from 'react'
import { headerTitles } from 'src/app/routes'
import { DefaultHeader } from './__DefaultHeader'
import { useDispatch, useSelector } from 'react-redux'
import { selectors } from '@esign-web/redux/auth'
import { selectors as selectorsDocument } from '@esign-web/redux/document'
import MButton from 'src/app/components/Button'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import WalletIcon from '@mui/icons-material/Wallet'
import ClassIcon from '@mui/icons-material/Class'
import { Toast, baseApi } from '@esign-web/libs/utils'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ENABLE_SAVE_DRAFT } from 'libs/redux/document/src/lib/constants'
import MetamaskIcon from 'src/assets/metamask.svg'
import Coinbase from 'src/assets/coinbase.svg'
import Walletconnect from 'src/assets/walletconnect.svg'
import SuccessIcon from 'src/assets/success.svg'
import CheckCircleTwoToneIcon from '@mui/icons-material/CheckCircleTwoTone'
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import FileSaver from 'file-saver'
import { SET_CONTRACT_ABI, WALLET_SET_CONNECTED } from 'libs/redux/wallet/src/lib/constants'
import { SET_WALLET_ADDRESS } from 'libs/redux/auth/src/lib/constants'

export const DashboardHeader = () => {
  const localtion = window.location.pathname
  const authState = useSelector(selectors.getAuthState)
  const isSaveDraftEnabled = useSelector(selectorsDocument.getDraftEnabled)
  const documentDetail = useSelector(selectorsDocument.getDocumentDetail) || ({} as any)
  const signatures = useSelector(selectorsDocument.getSignatures)
  const signers2 = useSelector(selectorsDocument.getSigners2)
  const dashBoardObject = _.find(headerTitles, (o) => o.to === localtion)
  const [isDownloading, setDownloading] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const documentId = searchParams.get('id')

  const [isSaved, setSaveDraft] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null)
  const open2 = Boolean(anchorEl2)

  useEffect(() => {
    ;(async () => {
      try {
        if (window.ethereum) {
          let request = await window.ethereum.request({ method: 'eth_requestAccounts' })
          dispatch({
            type: SET_WALLET_ADDRESS,
            payload: {
              provider: 'metamask',
              address: request,
            },
          })
        }
      } catch (error) {}
    })()
  }, [])

  useEffect(() => {
    ;(async () => {
      try {
        const abi = await baseApi.get('/contract/abi/')
        console.log('>> abi', abi.data)
        dispatch({
          type: SET_CONTRACT_ABI,
          payload: abi.data,
        })
      } catch (error) {}
    })()
  }, [])

  const handleSaveDraft = async () => {
    if (documentDetail.status === 'NEW' || documentDetail.status === 'ON_DRAFT') {
      try {
        const payload = {
          signatures: signatures,
          signers: signers2,
        }
        console.log('>> payload', payload)
        await baseApi.post('/document/save-draft', {
          id: documentId,
          data: payload,
        })
        dispatch({
          type: ENABLE_SAVE_DRAFT,
          payload: true,
        })
        Toast({ message: 'Documnent Saved !', type: 'success' })
      } catch (error) {}
    }
  }

  console.log('anchorEl2', anchorEl2)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const [openWalletModal, setOpenWalletModal] = useState(false)
  const connected = authState.isConnected

  const handleClick2 = async (event: React.MouseEvent<HTMLElement>) => {
    try {
      if (!connected) {
        return setOpenWalletModal(true)
      }

      if (connected) {
        const _event = event.currentTarget
        setAnchorEl2(_event)
      }
    } catch (error) {
      console.log('>>>>> error', error)
    }
  }

  const handleOpen = async (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl2(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleClose2 = () => {
    setAnchorEl2(null)
  }

  const handleSignout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    localStorage.removeItem('userType')
    window.location.href = '/login'
  }

  const downloadDocument = async () => {
    if (isDownloading) return
    let url = process.env.NX_SERVER_URL + '/file/save/' + documentDetail.id
    let fileName = `${documentDetail.name}.pdf`
    setDownloading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    })
      .then((response) => {
        response.blob().then((blob) => {
          FileSaver.saveAs(blob, fileName)
          setDownloading(false)
        })
      })
      .catch((err) => {
        console.log('err', err)
      })
  }

  const DocumentStatus = {
    ON_DRAFT: (
      <Box
        sx={{
          display: 'flex',
        }}
      >
        <MButton
          onClick={handleSaveDraft}
          sx={{
            padding: '9px 12px',
            borderRadius: '12px 0px 0px 12px',
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
              fontSize: '24px',
              color: isSaveDraftEnabled ? 'var(--green12)' : 'var(--dark)',
            }}
          />
          <Typography
            sx={{
              fontSize: '1.8rem',
              color: isSaveDraftEnabled ? 'var(--green12)' : 'var(--dark)',
              letterSpacing: '1px',
              fontWeight: 'bold',
            }}
          >
            Save Draft
          </Typography>
        </MButton>
        <MButton
          onClick={downloadDocument}
          sx={{
            display: 'flex',
            alignItems: 'center',
            textAlign: 'center',
            borderRadius: '0px 12px 12px 0px',
            backgroundColor: 'var(--white)',
            border: '1px solid var(--gray3)',
            borderLeftWidth: '0px',
            padding: '5px 12px',
            cursor: isDownloading ? 'not-allowed' : 'pointer',
          }}
        >
          {!isDownloading && (
            <FileDownloadOutlinedIcon
              sx={{
                fontSize: '31px',
                color: 'var(--dark)',
              }}
            />
          )}
          {isDownloading && (
            <CircularProgress
              size={31}
              sx={{
                color: 'var(--blue3)',
              }}
            />
          )}
        </MButton>
      </Box>
    ),
    NEW: (
      <Box
        sx={{
          display: 'flex',
        }}
      >
        <MButton
          onClick={handleSaveDraft}
          sx={{
            padding: '9px 12px',
            borderRadius: '12px 0px 0px 12px',
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
              fontSize: '24px',
              color: isSaveDraftEnabled ? 'var(--green12)' : 'var(--dark)',
            }}
          />
          <Typography
            sx={{
              fontSize: '1.8rem',
              color: isSaveDraftEnabled ? 'var(--green12)' : 'var(--dark)',
              letterSpacing: '1px',
              fontWeight: 'bold',
            }}
          >
            Save Draft
          </Typography>
        </MButton>
        <MButton
          onClick={downloadDocument}
          sx={{
            display: 'flex',
            alignItems: 'center',
            textAlign: 'center',
            borderRadius: '0px 12px 12px 0px',
            backgroundColor: 'var(--white)',
            border: '1px solid var(--gray3)',
            borderLeftWidth: '0px',
            padding: '5px 12px',
            cursor: isDownloading ? 'not-allowed' : 'pointer',
          }}
        >
          {!isDownloading && (
            <FileDownloadOutlinedIcon
              sx={{
                fontSize: '31px',
                color: 'var(--dark)',
              }}
            />
          )}
          {isDownloading && (
            <CircularProgress
              size={31}
              sx={{
                color: 'var(--blue3)',
              }}
            />
          )}
        </MButton>
      </Box>
    ),
    READY_TO_SIGN: (
      <Box
        sx={{
          display: 'flex',
        }}
      >
        <MButton
          onClick={handleSaveDraft}
          sx={{
            padding: '10px 12px',
            borderRadius: '12px 0px 0px 12px',
            backgroundColor: 'var(--green14)',
            border: '1px solid var(--green12)',
            display: 'flex',
            gap: '12px',
            '&:hover': {
              opacity: '1 !important',
            },
          }}
        >
          <CheckCircleTwoToneIcon
            sx={{
              fontSize: '28px',
              color: 'var( --green12)',
            }}
          />
          <Typography
            sx={{
              fontSize: '1.9rem',
              color: 'var(--green12)',
              letterSpacing: '1px',
              fontWeight: 'bold',
            }}
          >
            Ready to Sign
          </Typography>
        </MButton>
        <MButton
          onClick={downloadDocument}
          sx={{
            display: 'flex',
            alignItems: 'center',
            textAlign: 'center',
            borderRadius: '0px 12px 12px 0px',
            backgroundColor: 'var(--white)',
            border: '1px solid var(--gray3)',
            borderLeftWidth: '0px',
            padding: '5px 12px',
            cursor: isDownloading ? 'not-allowed' : 'pointer',
          }}
        >
          {!isDownloading && (
            <FileDownloadOutlinedIcon
              sx={{
                fontSize: '31px',
                color: 'var(--dark)',
              }}
            />
          )}
          {isDownloading && (
            <CircularProgress
              size={31}
              sx={{
                color: 'var(--blue3)',
              }}
            />
          )}
        </MButton>
      </Box>
    ),
    SIGNED: (
      <Box
        sx={{
          display: 'flex',
        }}
      >
        <MButton
          onClick={handleSaveDraft}
          sx={{
            padding: '10px 12px',
            borderRadius: '12px 0px 0px 12px',
            backgroundColor: 'var(--green14)',
            border: '1px solid var(--green12)',
            display: 'flex',
            gap: '12px',
            '&:hover': {
              opacity: '1 !important',
            },
          }}
        >
          <CheckCircleTwoToneIcon
            sx={{
              fontSize: '28px',
              color: 'var( --green12)',
            }}
          />
          <Typography
            sx={{
              fontSize: '1.9rem',
              color: 'var(--green12)',
              letterSpacing: '1px',
              fontWeight: 'bold',
            }}
          >
            Completed
          </Typography>
        </MButton>
        <MButton
          onClick={downloadDocument}
          sx={{
            display: 'flex',
            alignItems: 'center',
            textAlign: 'center',
            borderRadius: '0px 12px 12px 0px',
            backgroundColor: 'var(--white)',
            border: '1px solid var(--gray3)',
            borderLeftWidth: '0px',
            padding: '5px 12px',
            cursor: isDownloading ? 'not-allowed' : 'pointer',
          }}
        >
          {!isDownloading && (
            <FileDownloadOutlinedIcon
              sx={{
                fontSize: '31px',
                color: 'var(--dark)',
              }}
            />
          )}
          {isDownloading && (
            <CircularProgress
              size={31}
              sx={{
                color: 'var(--blue3)',
              }}
            />
          )}
        </MButton>
      </Box>
    ),
    COMPLETED: (
      <Box
        sx={{
          display: 'flex',
        }}
      >
        <MButton
          onClick={handleSaveDraft}
          sx={{
            padding: '10px 12px',
            borderRadius: '12px 0px 0px 12px',
            backgroundColor: 'var(--green14)',
            border: '1px solid var(--green12)',
            display: 'flex',
            gap: '12px',
            '&:hover': {
              opacity: '1 !important',
            },
          }}
        >
          <CheckCircleTwoToneIcon
            sx={{
              fontSize: '28px',
              color: 'var( --green12)',
            }}
          />
          <Typography
            sx={{
              fontSize: '1.9rem',
              color: 'var(--green12)',
              letterSpacing: '1px',
              fontWeight: 'bold',
            }}
          >
            Completed
          </Typography>
        </MButton>
        <MButton
          onClick={downloadDocument}
          sx={{
            display: 'flex',
            alignItems: 'center',
            textAlign: 'center',
            borderRadius: '0px 12px 12px 0px',
            backgroundColor: 'var(--white)',
            border: '1px solid var(--gray3)',
            borderLeftWidth: '0px',
            padding: '5px 12px',
            cursor: isDownloading ? 'not-allowed' : 'pointer',
          }}
        >
          {!isDownloading && (
            <FileDownloadOutlinedIcon
              sx={{
                fontSize: '31px',
                color: 'var(--dark)',
              }}
            />
          )}
          {isDownloading && (
            <CircularProgress
              size={31}
              sx={{
                color: 'var(--blue3)',
              }}
            />
          )}
        </MButton>
      </Box>
    ),
  }

  const Profile = {
    profile: (
      <Box
        key={1}
        sx={{
          padding: '10px 16px',
          display: 'flex',
          borderRadius: '12px',
          alignItems: 'center',
          gap: '14px',
          cursor: 'pointer',
          ':hover': {
            backgroundColor: 'var(--sx1)',
          },
          transition: 'background 0.3s ease 0s',
        }}
      >
        <PersonOutlinedIcon
          sx={{
            fontSize: '28px',
            color: 'var(--dark)',
            fontWeight: 'bold',
          }}
        />
        <Typography
          sx={{
            fontSize: '1.65rem',
            color: 'var(--dark)',
            fontWeight: 'bold',
          }}
        >
          Profile
        </Typography>
      </Box>
    ),
    setting: (
      <Box
        key={2}
        sx={{
          padding: '10px 16px',
          display: 'flex',
          borderRadius: '12px',
          alignItems: 'center',
          gap: '14px',
          cursor: 'pointer',
          ':hover': {
            backgroundColor: 'var(--sx1)',
          },
          transition: 'background 0.3s ease 0s',
        }}
      >
        <SettingsOutlinedIcon
          sx={{
            fontSize: '28px',
            color: 'var(--dark)',
            fontWeight: 'bold',
          }}
        />
        <Typography
          sx={{
            fontSize: '1.65rem',
            color: 'var(--dark)',
            fontWeight: 'bold',
          }}
        >
          Settings
        </Typography>
      </Box>
    ),
    logout: (
      <Box
        key={3}
        onClick={handleSignout}
        sx={{
          padding: '10px 16px',
          display: 'flex',
          borderRadius: '12px',
          alignItems: 'center',
          gap: '14px',
          cursor: 'pointer',
          ':hover': {
            backgroundColor: 'var(--sx1)',
          },
          transition: 'background 0.3s ease 0s',
        }}
      >
        <LogoutOutlinedIcon
          sx={{
            fontSize: '28px',
            color: 'var(--dark)',
            fontWeight: 'bold',
          }}
        />
        <Typography
          sx={{
            fontSize: '1.65rem',
            color: 'var(--dark)',
            fontWeight: 'bold',
          }}
        >
          Sign out
        </Typography>
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
        {localtion === '/document/sign' && DocumentStatus[`${documentDetail.status}`]}

        {/* _____________________________________________________ Connect Wallet _____________________________________________________ */}

        {authState.data?.is_registered && (
          <Box sx={{ display: 'flex', marginRight: '35px' }}>
            <MButton
              // disabled
              onClick={handleClick2}
              sx={{
                width: 'max-content',
                borderRadius: '12px 0px 0px 12px',
                backgroundColor: 'var(--white)',
                border: '1px solid var(--gray3)',
                padding: connected ? '10px 35px' : '8px 16px',
                display: 'flex',
                gap: connected ? '10px' : '14px',
              }}
            >
              {connected && (
                <>
                  <img src={MetamaskIcon} alt="metamask" width="26px" height="26px" />
                  <Typography
                    sx={{
                      fontSize: '1.8rem',
                      fontWeight: 'bold',
                      letterSpacing: '2px',
                      color: 'black',
                    }}
                  >
                    METAMASK
                  </Typography>
                </>
              )}
              {!connected && (
                <>
                  <WalletIcon sx={{ fontSize: '29px', color: 'var(--dark)' }} />

                  <Typography sx={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--dark)' }}>Connect Wallet</Typography>
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
                padding: '5px 12px',
              }}
            >
              <AccountCircleOutlinedIcon
                sx={{
                  fontSize: '31px',
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
                  width: '275px',
                  height: 'fit-content',
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', padding: '15px 9px', gap: '14px' }}>
                {Object.keys(Profile).map((key) => {
                  return Profile[key]
                })}
              </Box>
            </Menu>
          </Box>
        )}
        {/* __________________________________________________________________________________________________________ */}
        {!authState.data?.is_registered && (
          <MButton
            onClick={() => {
              window.location.href = '/login'
            }}
            sx={{
              display: 'flex',
              marginLeft: '10px',
              marginRight: '30px',
              alignItems: 'center',
              textAlign: 'center',
              borderRadius: '12px 12px 12px 12px',
              backgroundColor: 'var(--white)',
              border: '1px solid var(--gray3)',
              padding: '8px 15px',
              gap: '15px',
            }}
          >
            <AccountCircleOutlinedIcon
              sx={{
                fontSize: '31px',
                color: 'var(--dark)',
              }}
            />
            <Typography
              sx={{
                fontSize: '1.8rem',
                fontWeight: 'bold',
                color: 'var(--dark)',
              }}
            >
              Get Started
            </Typography>
          </MButton>
        )}
      </Box>

      <Dialog
        onClose={() => {
          setOpenWalletModal(false)
        }}
        open={openWalletModal}
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
          '& .MuiBackdrop-root': { backgroundColor: 'rgba(0, 0, 0, 0.7)' },
        }}
      >
        <DialogContent sx={{ overflow: 'hidden' }}>
          <Typography
            sx={{
              fontSize: '2.4rem',
              color: 'var(--dark2)',
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: '20px',
            }}
          >
            Connect your wallet
          </Typography>
          <Box sx={{ textAlign: 'center' }}>
            <span style={{ fontSize: '1.6rem', color: 'var(--dark2)', marginTop: '10px' }}>
              If you don't have a wallet, you can follow the instructions to install one.
            </span>{' '}
            <a
              href="https://metamask.io/download.html"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: '1.6rem',
                color: 'var(--blue3)',
                fontWeight: 'bold',
                textDecoration: 'none',
              }}
            >
              Learn more
            </a>
          </Box>
          <Divider sx={{ marginTop: '20px', marginBottom: '10px' }} />
          <Box sx={{ marginTop: '10px' }}>
            <Box
              onClick={async () => {
                try {
                  if (window.ethereum) {
                    let request = await window.ethereum.request({ method: 'eth_requestAccounts' })
                    dispatch({
                      type: SET_WALLET_ADDRESS,
                      payload: {
                        provider: 'metamask',
                        connected: true,
                        address: request,
                      },
                    })

                    await new Promise((resolve) => {
                      setOpenWalletModal(false)
                      resolve(true)
                    })
                  }
                } catch (error: any) {
                  console.log('>>>>> error', error)
                  if (error.code === -32002) {
                    console.log('Already prompted')
                  }
                }
              }}
              key={1}
              sx={{
                padding: '10px 24px',
                display: 'flex',
                borderRadius: '12px',
                alignItems: 'center',
                gap: '14px',
                cursor: 'pointer',
                marginBottom: '10px',
                ':hover': {
                  backgroundColor: 'var(--sx1)',
                },
              }}
            >
              <img src={MetamaskIcon} alt="metamask" width="29px" height="29px" />
              <Typography sx={{ fontSize: '1.6rem', color: 'var(--dark)', fontWeight: 'bold' }}>MetaMask</Typography>
            </Box>
            {/* ____________________________________ Coin Base ________________________________ */}
            <Box
              key={2}
              sx={{
                padding: '10px 24px',
                display: 'flex',
                borderRadius: '12px',
                alignItems: 'center',
                gap: '14px',
                cursor: 'pointer',
                marginBottom: '10px',
                ':hover': {
                  backgroundColor: 'var(--sx1)',
                },
              }}
            >
              <img src={Coinbase} alt="metamask" width="29px" height="29px" />
              <Typography sx={{ fontSize: '1.6rem', color: 'var(--dark)', fontWeight: 'bold', letterSpacing: '1px' }}>Coinbase Wallet</Typography>
            </Box>
            {/* ______________________________________Wallet Connect _________________________ */}
            <Box
              key={3}
              sx={{
                padding: '1px 16px',
                display: 'flex',
                borderRadius: '12px',
                alignItems: 'center',
                gap: '5px',
                cursor: 'pointer',
                marginBottom: '10px',
                ':hover': {
                  backgroundColor: 'var(--sx1)',
                },
              }}
            >
              <img src={Walletconnect} alt="metamask" width="48px" height="48px" />
              <Typography sx={{ fontSize: '1.6rem', color: 'var(--dark)', fontWeight: 'bold', letterSpacing: '1px' }}>WalletConnect</Typography>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  )
}

const Walletslist = {
  connected: (
    <Box
      key={1}
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
      key={2}
      sx={{
        padding: '10px 24px',
        display: 'flex',
        borderRadius: '12px',
        alignItems: 'center',
        gap: '12px',
        border: '1px solid var(--gray3)',
        cursor: 'not-allowed',
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
      key={3}
      sx={{
        padding: '1px 16px',
        display: 'flex',
        borderRadius: '12px',
        alignItems: 'center',
        gap: '3px',
        border: '1px solid var(--gray3)',
        cursor: 'not-allowed',
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
